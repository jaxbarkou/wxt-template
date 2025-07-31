import { useState } from "react";
import reactLogo from "@/assets/react.svg";
import wxtLogo from "/wxt.svg";
import "@/assets/style/globals.css";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
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
  return (
    <>
      <div>
        <a href="https://wxt.dev" target="_blank">
          <img src={wxtLogo} className="logo" alt="WXT logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>WXT + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the WXT and React logos to learn more
      </p>
      <button className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
        Hello Tailwind
      </button>
      <button onClick={openSidepanel}>Open Sidepanel</button>
    </>
  );
}

export default App;
