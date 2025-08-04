import React, { useState, useEffect } from "react";
import "@/assets/style/globals.css";

interface AppProps {
  symbol?: string;
}

const App: React.FC<AppProps> = ({ symbol }) => {
  const [position, setPosition] = useState({ x: -9999, y: -9999 });
  const [isInWhitelist, setIsInWhitelist] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cacheStatus, setCacheStatus] = useState<any>(null);

  useEffect(() => {
    const currentPosition = (window as any).__tooltipPosition__ || {
      x: -9999,
      y: -9999,
    };
    setPosition(currentPosition);
  }, []);

  // 检查代币是否在白名单中
  const checkBloomFilter = () => {
    if (symbol) {
      setIsLoading(true);
      chrome.runtime.sendMessage(
        {
          type: "TEST_BLOOM_FILTER",
          data: { symbol, type: "ticker" },
        },
        (response) => {
          setIsLoading(false);
          if (response?.success) {
            setIsInWhitelist(response.result);
          } else {
            console.error("Bloom Filter 测试失败:", response);
            setIsInWhitelist(false);
          }
        }
      );
    }
  };

  // 获取缓存状态
  const getCacheStatus = () => {
    chrome.runtime.sendMessage(
      {
        type: "GET_CACHE_STATUS",
      },
      (response) => {
        if (response?.success) {
          setCacheStatus(response.status);
        }
      }
    );
  };

  // 刷新 Bloom Filter 数据
  const refreshBloomFilter = () => {
    chrome.runtime.sendMessage(
      {
        type: "REFRESH_BLOOM_FILTER",
      },
      (response) => {
        if (response?.success) {
          console.log("Bloom Filter 数据已刷新");
          checkBloomFilter(); // 重新检查
          getCacheStatus(); // 更新缓存状态
        }
      }
    );
  };

  useEffect(() => {
    checkBloomFilter();
    getCacheStatus();
  }, [symbol]);

  // 获取白名单状态显示文本
  const getWhitelistStatusText = () => {
    if (isLoading) return "检查中...";
    if (isInWhitelist === null) return "未知";
    return isInWhitelist ? "✅ 在白名单中" : "❌ 不在白名单中";
  };

  // 获取白名单状态样式
  const getWhitelistStatusStyle = () => {
    if (isLoading) return "text-yellow-400";
    if (isInWhitelist === null) return "text-gray-400";
    return isInWhitelist ? "text-green-400" : "text-red-400";
  };

  // 鼠标事件处理
  const handleMouseEnter = () => {
    // 通知父组件鼠标进入
    if ((window as any).__tooltipMouseEnter) {
      (window as any).__tooltipMouseEnter();
    }
  };

  const handleMouseLeave = () => {
    // 通知父组件鼠标离开
    if ((window as any).__tooltipMouseLeave) {
      (window as any).__tooltipMouseLeave();
    }
  };

  return (
    <>
      {isInWhitelist && (
        <div
          style={{ left: `${position.x}px`, top: `${position.y}px` }}
          className="px-3 py-2 text-sm text-white bg-black rounded shadow w-[200px] h-[200px] fixed z-100000"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {symbol ? (
            <div>
              <div className="mb-2 text-lg font-bold">${symbol}</div>
              <div className="space-y-1 text-sm">
                <p className={`${getWhitelistStatusStyle()}`}>
                  白名单状态: {getWhitelistStatusText()}
                </p>
                <p>当前价格：$66,000（示例）</p>
                <p>24h变化：+5.2%</p>
                <p>市值：$1.2T</p>

                {/* 缓存状态信息 */}
                {cacheStatus && (
                  <div className="pt-2 mt-2 border-t border-gray-600">
                    <p className="text-xs text-gray-400">
                      缓存: {cacheStatus.hasCache ? "有" : "无"} | 有效:{" "}
                      {cacheStatus.isValid ? "是" : "否"} | 年龄:{" "}
                      {Math.round(cacheStatus.age / 1000)}s
                    </p>
                  </div>
                )}

                {/* 操作按钮 */}
                <div className="pt-2 mt-2 space-x-1 border-t border-gray-600">
                  <button
                    onClick={checkBloomFilter}
                    disabled={isLoading}
                    className="px-2 py-1 text-xs bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-600"
                  >
                    {isLoading ? "检查中..." : "重新检查"}
                  </button>
                  <button
                    onClick={refreshBloomFilter}
                    className="px-2 py-1 text-xs bg-green-600 rounded hover:bg-green-700"
                  >
                    刷新数据
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>🔥 BTC 当前价格：$66,000（示例）</div>
          )}
        </div>
      )}
      {!isInWhitelist && <></>}
    </>
  );
};

export default App;
