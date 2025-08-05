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

const Home: React.FC = () => {
  const [projectsData, setProjectsData] = useState(null);
  const [twitterHandle, setTwitterHandle] = useState<string | null>(null);
  const [lastDetected, setLastDetected] = useState<string | null>(null);
  const [baseBloomFilter, setBaseBloomFilter] = useState<boolean>(false);
  const { testBloomFilter, fetchBloomFilter } = useBloomFilter();
  const [tabUrl, setTabUrl] = useState<string>();
  const [selectText, setSelectText] = useState("");
  const [proType, setProType] = useState<ProjectsQueryType>(
    ProjectsQueryType.ticker
  );
  const [queryValue, setQueryValue] = useState<string>("");
  const [domainProjectsData, setDomainProjectsData] = useState(null);
  const [selectedProjectsData, setSelectedProjectsData] = useState(null);
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
          // fetchData(response.data.currentTwitterHandle);
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
        // fetchData(message.data.currentTwitterHandle);
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

  const getActiveTabUrl = async (): Promise<string | null> => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]?.url) {
      return tabs[0].url;
    }
    return null;
  };

  useEffect(() => {
    getActiveTabUrl().then((url) => {
      if (url) {
        setTabUrl(url); // 更新状态
      }
    });
  }, []);

  useEffect(() => {
    const updateUrl = async () => {
      const url = await getActiveTabUrl();
      if (url) {
        setTabUrl(url);
      }
    };

    chrome.tabs.onActivated.addListener(updateUrl);
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (tab.active && changeInfo.url) {
        setTabUrl(changeInfo.url);
      }
    });

    return () => {
      chrome.tabs.onActivated.removeListener(updateUrl);
      chrome.tabs.onUpdated.removeListener(() => {});
    };
  }, []);

  const getDomain = (rawUrl: string) => {
    try {
      const url = new URL(rawUrl);
      return url.hostname; // 返回不带协议的主机名
    } catch (e) {
      return rawUrl;
    }
  };

  const domainUrl = useMemo(() => {
    if (tabUrl) {
      return getDomain(tabUrl);
    }
    return "";
  }, [tabUrl]);

  const fetchDomainData = useCallback(async () => {
    if (!domainUrl) {
      console.warn("当前 Tab URL 为空，无法查询 domain");
      return;
    }
    const data = await fetchData(ProjectsQueryType.domain, domainUrl);
    setDomainProjectsData(data);
  }, [domainUrl, fetchData]);

  useEffect(() => {
    if (domainUrl) {
      fetchDomainData();
    }
  }, [domainUrl, fetchDomainData, testBloomFilter]);

  useEffect(() => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === "SEND_SELECTED_TEXT") {
        setSelectText(message.payload);
      }
    });
  }, []);

  const splitText = (input: string): string[] => {
    return input
      .split(/\s+/) // 以一个或多个空格分割
      .filter(Boolean) // 去掉空字符串（防止多空格）
      .map((word) => word.replace(/\$/g, "")); // 删除每个词中的 `$`
  };

  // selectText
  useEffect(() => {
    if (selectText) {
      let arr = splitText(selectText);
      console.log("选中的文本分割结果:", arr);
      if (arr.length > 0) {
        const match = arr.find((word) =>
          testBloomFilter(word, ProjectsQueryType.ticker)
        );
        console.log("匹配的代币:", match);
        if (match) {
          fetchSelectedData(match);
        } else {
          console.warn("没有匹配的代币");
        }
      }
    }
  }, [selectText]);

  const fetchSelectedData = useCallback(
    async (match: string) => {
      try {
        const data = await fetchData(ProjectsQueryType.ticker, match);
        setSelectedProjectsData(data);
      } catch (error) {
        console.error("Error fetching selected data:", error);
      }
    },
    [domainUrl, fetchData]
  );

  return (
    <>
      <div className="p-6">
        <div>
          <Link to="/">跳转到 Home</Link>
          <Link className="ml-5" to="/user">
            跳转到 User
          </Link>
        </div>
        <button className="px-4 py-2 text-white" onClick={openPopup}>
          Open Popup
        </button>

        <Button className="ml-2 text-white hover:text-white" variant="outline">
          test shadcn Button
        </Button>
        <h3 className="mt-4 text-lg font-semibold">test Twitter handle</h3>
        {!twitterHandle && <>未检测到Twitter用户</>}
        {/* 显示检测到的Twitter handle */}
        {twitterHandle && (
          <div className="p-4 mt-4 border border-blue-200 rounded card bg-blue-50">
            <h3 className="mb-2 text-lg font-semibold">检测到的Twitter用户</h3>
            <p className="font-mono text-blue-600">@{twitterHandle}</p>
            <p className="mt-1 text-sm text-gray-500">
              最后检测:{" "}
              {lastDetected ? new Date(lastDetected).toLocaleString() : "未知"}
            </p>
          </div>
        )}
        <h3 className="mt-4 text-lg font-semibold">基础请求</h3>
        <div className="mt-4">
          <div className="flex items-center">
            <span className="mr-2">base:</span>
            <Select
              value={proType}
              onValueChange={(value) => {
                setProType(value as ProjectsQueryType);
              }}
              defaultValue="all"
            >
              <SelectTrigger
                size={"sm"}
                className="text-white w-[88px] !h-6 rounded-[20px] border-[0.5px] border-solid border-[#adadad80] text-[10px] px-2 py-1 mr-2 bg-none"
              >
                <SelectValue placeholder="type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ProjectsQueryType.ticker}>
                  {ProjectsQueryType.ticker}
                </SelectItem>
                <SelectItem value={ProjectsQueryType.domain}>
                  {ProjectsQueryType.domain}
                </SelectItem>
                <SelectItem value={ProjectsQueryType.name}>
                  {ProjectsQueryType.name}
                </SelectItem>
                <SelectItem value={ProjectsQueryType.twitter}>
                  {ProjectsQueryType.twitter}
                </SelectItem>
              </SelectContent>
            </Select>
            <Input
              className="w-[100px] h-6 text-xs"
              placeholder="输入查询内容"
              onChange={(e) => setQueryValue(e.target.value)}
              value={queryValue}
            />
            <Button
              className="h-6 ml-2 text-xs text-white hover:text-white"
              variant="outline"
              onClick={fetchBaseData}
            >
              查询
            </Button>
          </div>
        </div>
        <h4 className="mt-4 text-sm font-semibold">
          Bloom-filter {baseBloomFilter.toString()}
        </h4>
        <pre className="mt-3 flex justify-start p-4 overflow-auto text-sm text-left text-white bg-gray-900 h-[100px]">
          {JSON.stringify(projectsData, null, 2)}
        </pre>
        <h3 className="mt-4 text-lg font-semibold">domain</h3>
        <p>
          当前 Tab URL: {tabUrl} --- {domainUrl}
        </p>
        <pre className="mt-3 flex justify-start p-4 overflow-auto text-sm text-left text-white bg-gray-900 h-[100px]">
          {JSON.stringify(domainProjectsData, null, 2)}
        </pre>
        <h3 className="mt-4 text-lg font-semibold">页面选中内容</h3>
        <p>来自页面的内容：{selectText}</p>
        <pre className="mt-3 flex justify-start p-4 overflow-auto text-sm text-left text-white bg-gray-900 h-[100px]">
          {JSON.stringify(selectedProjectsData, null, 2)}
        </pre>
      </div>
    </>
  );
};

export default Home;
