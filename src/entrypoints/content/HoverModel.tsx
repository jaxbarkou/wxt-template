import React, { useState, useEffect } from "react";
import "@/assets/style/globals.css";

interface AppProps {
  symbol?: string;
}

const HoverModel: React.FC<AppProps> = ({ symbol }) => {
  const [position, setPosition] = useState({ x: -9999, y: -9999 });
  // const [isLoading, setIsLoading] = useState(false);
  const [projectsData, setProjectsData] = useState(null);

  const fetchBaseData = useCallback(async () => {
    if (!symbol) return;
    try {
      let url = `http://34.142.207.10:5050/api/v1/projects/lookup?type=ticker&value=${symbol}`;
      chrome.runtime.sendMessage(
        { type: "FETCH_PROJECTS_DATA", url },
        (res) => {
          if (res.success && res.data?.code === 200) {
            setProjectsData(res.data?.data || null);
          } else {
            setProjectsData(null);
          }
        }
      );
    } catch (error) {
      console.error("Error fetching base data:", error);
    }
    // setProjectsData(data);
  }, [symbol]);

  useEffect(() => {
    const currentPosition = (window as any).__tooltipPosition__ || {
      x: -9999,
      y: -9999,
    };
    setPosition(currentPosition);
  }, [symbol]);

  useEffect(() => {
    fetchBaseData();
  }, [symbol]);

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
      <div
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
        className="px-3 py-2 text-sm text-white bg-black rounded shadow w-[200px] h-[200px] fixed z-100000"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {symbol ? (
          <div>
            <div className="mb-2 text-lg font-bold">${symbol}</div>
            <pre className="mt-3 flex justify-start p-4 overflow-auto text-sm text-left text-white bg-gray-900 h-[100px]">
              {JSON.stringify(projectsData, null, 2)}
            </pre>
          </div>
        ) : (
          <div>
            <h2>未找到代币</h2>
          </div>
        )}
      </div>
    </>
  );
};

export default HoverModel;
