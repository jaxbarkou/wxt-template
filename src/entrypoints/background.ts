export default defineBackground(() => {
  chrome.runtime.onInstalled.addListener(() => {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  });

  // 监听来自content script和sidepanel的消息
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // 添加打开侧边栏的消息处理
    if (message.type === "OPEN_SIDEPANEL") {
      if (sender.tab?.id) {
        chrome.sidePanel.open({ tabId: sender.tab.id });
        sendResponse({ success: true, message: "侧边栏已打开" });
      } else {
        sendResponse({ success: false, message: "无法获取标签页ID" });
      }
      return true;
    }

    if (message.type === "FETCH_PROJECTS_DATA") {
      fetch(message.url)
        .then((res) => res.json())
        .then((data) => sendResponse({ success: true, data }))
        .catch((err) => sendResponse({ success: false, error: err.message }));

      // 👇 重要：return true 表示异步响应
      return true;
    }

    // 默认响应
    sendResponse({ success: true, received: message.type });
  });
});
