import "@/assets/style/globals.css";
import "./floating.css";
import { createRoot } from "react-dom/client";
import FloatingContainer from "./FloatingContainer";
import PasskeyContentScript from "./PasskeyContentScript";
// import floatingSelection from "./floatingSelection";
import hoverTooltip from "./hoverTooltip";
import overlayCon from "./overlayCon";

export default defineContentScript({
  matches: ["*://*/*"],
  cssInjectionMode: "ui",
  async main(ctx: any) {
    // floatingSelection(ctx);
    hoverTooltip(ctx);
    overlayCon(ctx);
    
    // 添加浮窗功能
    addFloatingLogo();
    
    // 添加Passkey测试功能
    addPasskeyTest();
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
  
  console.log("WXT 浮窗已添加到页面");
};

// 添加Passkey测试功能
const addPasskeyTest = () => {
  // 检查是否已经存在Passkey测试组件
  if (document.getElementById("wxt-passkey-test")) {
    console.log("Passkey测试组件已存在");
    return;
  }

  // 创建Passkey测试容器
  const passkeyContainer = document.createElement("div");
  passkeyContainer.id = "wxt-passkey-test";
  
  // 添加到页面
  document.body.appendChild(passkeyContainer);
  
  // 渲染React组件
  const root = createRoot(passkeyContainer);
  root.render(<PasskeyContentScript />);
  
  console.log("Passkey测试组件已添加到页面");
};
