import React, { useState, useEffect } from "react";
import "@/assets/style/globals.css";

const App = () => {
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
      🔥 BTC 当前价格：$66,000（示例）
    </div>
  );
};

export default App;
