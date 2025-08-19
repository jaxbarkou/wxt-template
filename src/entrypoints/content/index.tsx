import "@/assets/style/globals.css";
import "./floating.css";
import { createRoot } from "react-dom/client";
import FloatingContainer from "./FloatingContainer";
import hoverTooltip from "./hoverTooltip";

export default defineContentScript({
  matches: ["*://*/*"],
  cssInjectionMode: "ui",
  async main(ctx: any) {
    hoverTooltip(ctx);
    // 添加浮窗功能
    addFloatingLogo();
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
