export default defineBackground(() => {
  console.log("Hello background!", { id: browser.runtime.id });

  // 在内存中存储数据
  let currentData:any = {
    currentTwitterHandle: null,
    lastDetected: null
  };

  chrome.runtime.onInstalled.addListener(() => {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  });

  // 监听来自content script和sidepanel的消息
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('收到消息:', message, '来自:', sender);
    
    if (message.type === 'PAGE_DATA') {
      console.log('处理页面数据:', message.data);
      sendResponse({ success: true, received: message.type });
    }
    
    if (message.type === 'TWITTER_HANDLE') {
      console.log('检测到Twitter handle:', message.data);
      currentData.currentTwitterHandle = message.data;
      currentData.lastDetected = new Date().toISOString();
      
      // 通知所有相关组件数据已更新
      chrome.runtime.sendMessage({
        type: 'STORAGE_UPDATED',
        data: currentData
      });
      
      sendResponse({ success: true, received: message.type });
    }
    
    if (message.type === 'GET_CURRENT_DATA') {
      console.log('返回当前数据:', currentData);
      sendResponse({
        success: true,
        data: currentData
      });
    }
    
    // 默认响应
    sendResponse({ success: true, received: message.type });
  });
});
