import "@/assets/style/globals.css";
import "./floating.css";
import { createRoot } from "react-dom/client";
import FloatingContainer from "./FloatingContainer";
import hoverTooltip from "./hoverTooltip";
import floatingSelection from "./floatingSelection";

export default defineContentScript({
  matches: ["*://*/*"],
  cssInjectionMode: "ui",
  async main(ctx: any) {
    hoverTooltip(ctx);
    // 添加浮窗功能
    addFloatingLogo();
    // 添加文本选择浮动按钮功能
    floatingSelection(ctx);
    // 添加页面消息监听器
    addPageMessageListener();
  },
});

// 添加浮窗Logo
const addFloatingLogo = () => {
  // 检查是否已经存在浮窗
  if (document.getElementById("wxt-floating-container")) {
    console.log("WXT 浮窗已存在");
    return;
  }

  // 创建浮窗容器
  const floatingContainer = document.createElement("div");
  floatingContainer.id = "wxt-floating-container";

  // 添加到页面
  document.body.appendChild(floatingContainer);

  // 渲染React组件
  const root = createRoot(floatingContainer);
  root.render(<FloatingContainer />);
};

// 添加页面消息监听器
const addPageMessageListener = () => {
  // 监听来自页面的消息
  window.addEventListener("message", (event) => {
    // 安全检查：只处理来自同源页面的消息
    if (event.source !== window) return;
    
    // 只处理特定类型的消息
    if (event.data && event.data.type === "OPEN_SIDEPANEL") {
      console.log("收到页面消息: 打开侧边栏");
      
      // 转发消息给扩展的后台脚本
      chrome.runtime.sendMessage({ type: "OPEN_SIDEPANEL" }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("发送消息失败:", chrome.runtime.lastError);
          // 向页面发送错误响应
          window.postMessage({
            type: "SIDEPANEL_RESPONSE",
            success: false,
            error: chrome.runtime.lastError.message
          }, "*");
        } else {
          console.log("侧边栏响应:", response);
          // 向页面发送成功响应
          window.postMessage({
            type: "SIDEPANEL_RESPONSE",
            success: true,
            data: response
          }, "*");
        }
      });
    }
    
  });
  
};
