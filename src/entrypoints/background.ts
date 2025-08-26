import { API_URL } from "@/config";

export default defineBackground(() => {
  // 设置插件点击行为 - 点击插件logo时打开侧边栏
  chrome.runtime.onInstalled.addListener(() => {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
    console.log("插件已安装，侧边栏行为已设置");
  });

  // 监听插件图标点击事件 - 强制处理点击事件
  chrome.action.onClicked.addListener(async (tab) => {
    if (tab.id) {
      try {
        // 确保侧边栏启用
        await chrome.sidePanel.setOptions({
          enabled: true,
        });
        
        // 打开侧边栏
        await chrome.sidePanel.open({ tabId: tab.id });
        
        // 通知content script更新状态
        chrome.tabs.sendMessage(tab.id, { type: "SIDEPANEL_OPENED" }).catch(() => {
          // 如果content script不存在，忽略错误
        });
        
        console.log("侧边栏已通过插件点击打开");
      } catch (error) {
        console.error("打开侧边栏失败:", error);
      }
    }
  });

  // 监听来自content script和sidepanel的消息
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // 添加打开侧边栏的消息处理
    if (message.type === "OPEN_SIDEPANEL") {
      if (sender.tab?.id) {
        chrome.sidePanel.setOptions({
          enabled: true,
        });
        chrome.sidePanel.open({ tabId: sender.tab.id });
        sendResponse({ success: true, message: "侧边栏已打开" });
      } else {
        sendResponse({ success: false, message: "无法获取标签页ID" });
      }
      return true;
    }

    // 添加关闭侧边栏的消息处理
    if (message.type === "CLOSE_SIDEPANEL") {
      chrome.sidePanel.setOptions({
        enabled: false,
      });
      // 通知content script侧边栏已关闭
      if (sender.tab?.id) {
        chrome.tabs.sendMessage(sender.tab.id, { type: "SIDEPANEL_CLOSED" }).catch(() => {
          // 如果content script不存在，忽略错误
        });
      }
      sendResponse({ success: true, message: "侧边栏状态已更新" });
      return true;
    }

    if (message.type === "FETCH_PROJECTS_DATA") {
      const payload = {
        id: "",
        ticker: message.symbol,
        domain: "",
      };
      fetch(`${API_URL}/api/v1/project/project_data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((data) => {
          sendResponse({ success: true, data });
        })
        .catch((err) => sendResponse({ success: false, error: err.message }));

      // 👇 重要：return true 表示异步响应
      return true;
    }

    // 默认响应
    sendResponse({ success: true, received: message.type });
  });
});
