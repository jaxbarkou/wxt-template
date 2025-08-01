import React, { useState, useEffect } from "react";
import "@/assets/style/globals.css";

interface AppProps {
  symbol?: string;
}

const App: React.FC<AppProps> = ({ symbol }) => {
  const [position, setPosition] = useState({ x: -9999, y: -9999 });

  useEffect(() => {
    const currentPosition = (window as any).__tooltipPosition__ || {
      x: -9999,
      y: -9999,
    };
    setPosition(currentPosition);
  }, []);

  return (
    <div
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      className="px-3 py-2 text-sm text-white bg-black rounded shadow w-[200px] h-[200px] fixed z-100000"
    >
      {symbol ? (
        <div>
          <div className="font-bold text-lg mb-2">${symbol}</div>
          <div className="text-sm">
            {/* 这里可以添加代币的详细信息，比如价格、市值等 */}
            <p>当前价格：$66,000（示例）</p>
            <p>24h变化：+5.2%</p>
            <p>市值：$1.2T</p>
          </div>
        </div>
      ) : (
        <div>🔥 BTC 当前价格：$66,000（示例）</div>
      )}
    </div>
  );
};

export default App;
