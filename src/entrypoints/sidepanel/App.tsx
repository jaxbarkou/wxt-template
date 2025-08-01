import { useState, useEffect, useCallback, use } from "react";
import "./App.css";
import "@/assets/style/globals.css";
import { ProjectsQueryType } from "@/modal";
import { getProjectsLookup } from "@/utils/api";
import { useBloomFilter } from "@/hooks/useBloomFilter";
import { useRootStore } from "@/store";

const App: React.FC = () => {
  const [projectsData, setProjectsData] = useState(null);
  const [twitterHandle, setTwitterHandle] = useState<string | null>(null);
  const [lastDetected, setLastDetected] = useState<string | null>(null);
  const bloomFilterData = useRootStore((state) => state.bloomFilterData);

  const { fetchBloomFilter, testBloomFilter } = useBloomFilter();

  const fetchData = useCallback(async (twitterHandle: string) => {
    try {
      const params = {
        type: ProjectsQueryType.twitter,
        value: twitterHandle,
      };
      const response = await getProjectsLookup(params);
      if (response.code === 200) {
        console.log("Fetched projects data:", response);
        setProjectsData(response.data);
      }
    } catch (error) {
      console.error("Error fetching wallets:", error);
    }
  }, []);

  // 获取当前检测到的Twitter handle
  const fetchTwitterData = useCallback(() => {
    chrome.runtime.sendMessage(
      {
        type: "GET_CURRENT_DATA",
      },
      (response) => {
        if (response && response.success && response.data) {
          setTwitterHandle(response.data.currentTwitterHandle);
          fetchData(response.data.currentTwitterHandle);
          setLastDetected(response.data.lastDetected);
        }
      }
    );
  }, []);

  useEffect(() => {
    fetchTwitterData(); // 初始获取Twitter数据
  }, [fetchTwitterData]);

  // 监听来自background的数据更新通知
  useEffect(() => {
    const handleStorageUpdate = (message: any) => {
      if (message.type === "STORAGE_UPDATED" && message.data) {
        setTwitterHandle(message.data.currentTwitterHandle);
        fetchData(message.data.currentTwitterHandle);
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

  useEffect(() => {
    fetchBloomFilter();
  }, [fetchBloomFilter]);

  useEffect(() => {
    console.log("Bloom Filter Data Updated:", bloomFilterData);
    if (bloomFilterData) {
      let res1 = testBloomFilter("exampleItem", ProjectsQueryType.ticker);
      let res2 = testBloomFilter("BTC", ProjectsQueryType.ticker);
      console.log("Test Bloom Filter Results:", res1, res2);
    }
  }, [bloomFilterData]);

  return (
    <>
      <div className="w-full">
        <button className="px-4 py-2 text-white" onClick={openPopup}>
          Open Popup
        </button>

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

        <pre className="flex justify-start p-4 overflow-auto text-sm text-left text-white bg-gray-900 w-full h-[300px] overflow-y-auto">
          {JSON.stringify(projectsData, null, 2)}
        </pre>
      </div>
    </>
  );
};

export default App;
