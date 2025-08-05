import { useState, useEffect, useCallback, useMemo } from "react";
import { ProjectsQueryType } from "@/modal";
import { getProjectsLookup } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import { useBloomFilter } from "@/hooks/useBloomFilter";
import { PageProps } from "../types";

const Home: React.FC<PageProps> = ({ mode }) => {
  const [projectsData, setProjectsData] = useState(null);
  const [twitterHandle, setTwitterHandle] = useState<string | null>(null);
  const [lastDetected, setLastDetected] = useState<string | null>(null);
  const [baseBloomFilter, setBaseBloomFilter] = useState<boolean>(false);
  const { testBloomFilter, fetchBloomFilter } = useBloomFilter();
  const [tabUrl, setTabUrl] = useState<string>();
  const [proType, setProType] = useState<ProjectsQueryType>(
    ProjectsQueryType.ticker
  );
  const [queryValue, setQueryValue] = useState<string>("");
  const [domainProjectsData, setDomainProjectsData] = useState(null);
  const [domainBloomFilter, setDomainBloomFilter] = useState<boolean>(false);

  const fetchData = useCallback(
    async (type: ProjectsQueryType, value: string) => {
      try {
        const params = {
          type: type,
          value: value,
        };

        const response = await getProjectsLookup(params);
        if (response.code === 200) {
          console.log("Fetched projects data:", response);
          return response.data;
        }
      } catch (error) {
        console.error("Error fetching wallets:", error);
      }
    },
    []
  );

  const fetchBaseData = useCallback(async () => {
    if (queryValue === "") {
      console.warn("查询内容不能为空");
      return;
    }
    const isMatch = testBloomFilter(queryValue, proType);
    setBaseBloomFilter(isMatch);
    if (isMatch) {
      const data = await fetchData(proType, queryValue);
      setProjectsData(data);
    }
  }, [proType, queryValue, fetchData]);

  // 获取当前检测到的Twitter handle
  const fetchTwitterData = useCallback(() => {
    chrome.runtime.sendMessage(
      {
        type: "GET_CURRENT_DATA",
      },
      (response) => {
        if (response && response.success && response.data) {
          setTwitterHandle(response.data.currentTwitterHandle);
          setLastDetected(response.data.lastDetected);
        }
      }
    );
  }, []);

  useEffect(() => {
    fetchTwitterData(); // 初始获取Twitter数据
  }, [fetchTwitterData]);

  useEffect(() => {
    fetchBloomFilter();
  }, [fetchBloomFilter]);

  // 监听来自background的数据更新通知
  useEffect(() => {
    const handleStorageUpdate = (message: any) => {
      if (message.type === "STORAGE_UPDATED" && message.data) {
        setTwitterHandle(message.data.currentTwitterHandle);
        setLastDetected(message.data.lastDetected);
      }
    };

    // 监听来自background的消息
    chrome.runtime.onMessage.addListener(handleStorageUpdate);

    return () => {
      chrome.runtime.onMessage.removeListener(handleStorageUpdate);
    };
  }, []);

  const openPopup = () => {
    try {
      // 先打开popup
      if (chrome.action && typeof chrome.action.openPopup === "function") {
        chrome.action.openPopup();
      }
      chrome.sidePanel.setOptions({
        enabled: false,
      });
    } catch (error) {
      console.log("API不可用，使用备用方案");
      alert("请点击扩展图标打开弹窗");
    }
  };

  const openSidepanel = () => {
    window.close();
    chrome.sidePanel.setOptions({
      enabled: true
    });
    try {
      // 获取当前活动标签页
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && tabs[0].id) {
          // 使用当前标签页ID打开侧边栏
          chrome.sidePanel.open({ tabId: tabs[0].id }, () => {
            console.log('侧边栏已打开');
          });
        } else {
          alert('无法获取当前标签页信息');
        }
      });
    } catch (error) {
      console.log('API调用失败，使用备用方案');
      alert('请手动打开侧边栏：右键扩展图标 → 显示侧边栏');
    }
  };

  const getActiveTabUrl = async (): Promise<string | null> => {
    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tabs[0] && tabs[0].url) {
        return tabs[0].url;
      }
      return null;
    } catch (error) {
      console.error("获取当前标签页URL失败:", error);
      return null;
    }
  };

  useEffect(() => {
    const updateUrl = async () => {
      const url = await getActiveTabUrl();
      if (url) {
        setTabUrl(url);
        const domain = getDomain(url);
        if (domain) {
          const isMatch = testBloomFilter(domain, ProjectsQueryType.domain);
          setDomainBloomFilter(isMatch);
          if (isMatch) {
            const data = await fetchData(ProjectsQueryType.domain, domain);
            setDomainProjectsData(data);
          }
        }
      }
    };

    updateUrl();
  }, []);

  const getDomain = (rawUrl: string) => {
    try {
      const url = new URL(rawUrl);
      return url.hostname;
    } catch (error) {
      console.error("解析URL失败:", error);
      return null;
    }
  };

  return (
    <div className={`w-full ${mode === 'popup' ? 'p-4' : 'p-2'}`}>
      {/* 模式切换按钮 */}
      {mode === 'sidepanel' && (
        <button 
          className="px-4 py-2 mb-4 text-white bg-blue-600 rounded hover:bg-blue-700"
          onClick={openPopup}
        >
          Open Popup
        </button>
      )}
      
      {mode === 'popup' && (
        <button 
          className="px-4 py-2 mb-4 text-white bg-green-600 rounded hover:bg-green-700"
          onClick={openSidepanel}
        >
          Open Sidepanel
        </button>
      )}

      {/* 显示检测到的Twitter handle */}
      {twitterHandle && (
        <div className="p-4 mb-4 border border-blue-200 rounded card bg-blue-50">
          <h3 className="mb-2 text-lg font-semibold">检测到的Twitter用户</h3>
          <p className="font-mono text-blue-600">@{twitterHandle}</p>
          <p className="mt-1 text-sm text-gray-500">
            最后检测:{" "}
            {lastDetected ? new Date(lastDetected).toLocaleString() : "未知"}
          </p>
        </div>
      )}

      {/* 查询表单 */}
      <div className="mb-4 space-y-2">
        <div className="flex space-x-2">
          <Select value={proType} onValueChange={(value) => setProType(value as ProjectsQueryType)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ProjectsQueryType.ticker}>Ticker</SelectItem>
              <SelectItem value={ProjectsQueryType.twitter}>Twitter</SelectItem>
              <SelectItem value={ProjectsQueryType.domain}>Domain</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="输入查询内容"
            value={queryValue}
            onChange={(e) => setQueryValue(e.target.value)}
            className="flex-1"
          />
          <Button onClick={fetchBaseData}>查询</Button>
        </div>
      </div>

      {/* 查询结果 */}
      {projectsData && (
        <div className="mb-4">
          <h3 className="mb-2 text-lg font-semibold">查询结果</h3>
          <pre className="p-4 overflow-auto text-sm text-left text-white bg-gray-900 rounded max-h-60">
            {JSON.stringify(projectsData, null, 2)}
          </pre>
        </div>
      )}

      {/* 当前页面域名信息 */}
      {tabUrl && (
        <div className="mb-4">
          <h3 className="mb-2 text-lg font-semibold">当前页面</h3>
          <p className="text-sm text-gray-600">URL: {tabUrl}</p>
          <p className="text-sm text-gray-600">域名: {getDomain(tabUrl)}</p>
          {domainBloomFilter !== null && (
            <p className={`text-sm ${domainBloomFilter ? 'text-green-600' : 'text-red-600'}`}>
              域名状态: {domainBloomFilter ? '在白名单中' : '不在白名单中'}
            </p>
          )}
        </div>
      )}

      {/* 域名查询结果 */}
      {domainProjectsData && (
        <div className="mb-4">
          <h3 className="mb-2 text-lg font-semibold">域名查询结果</h3>
          <pre className="p-4 overflow-auto text-sm text-left text-white bg-gray-900 rounded max-h-60">
            {JSON.stringify(domainProjectsData, null, 2)}
          </pre>
        </div>
      )}

      {/* 导航链接 */}
      <div className="flex space-x-4">
        <Link to="/" className="text-blue-600 hover:text-blue-800">Home</Link>
        <Link to="/user" className="text-blue-600 hover:text-blue-800">User</Link>
      </div>
    </div>
  );
};

export default Home; 