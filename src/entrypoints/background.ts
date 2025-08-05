// import {
//   fetchBloomFilterWithCache,
//   testBloomFilter,
//   getCurrentCache,
//   getCacheStatus,
// } from "@/utils/bloomFilterCache";

export default defineBackground(() => {
  // 在内存中存储数据
  let currentData: any = {
    currentTwitterHandle: null,
    lastDetected: null,
  };

  // 初始化 Bloom Filter 数据
  // const initializeBloomFilter = async () => {
  //   try {
  //     console.log("开始初始化 Bloom Filter...");
  //     await fetchBloomFilterWithCache();
  //     console.log("Bloom Filter 数据初始化完成");
  //   } catch (error) {
  //     console.error("Bloom Filter 数据初始化失败:", error);
  //   }
  // };

  // 启动时初始化
  // initializeBloomFilter();

  chrome.runtime.onInstalled.addListener(() => {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  });

  // 监听来自content script和sidepanel的消息
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    
    // if (message.type === 'GET_BLOOM_FILTER_DATA') {
    //   getCurrentCache().then(cache => {
    //     sendResponse({ 
    //       success: true, 
    //       data: cache?.data || {} 
    //     });
    //   });
    //   return true; // 保持消息通道开放
    // }

    // if (message.type === "TEST_BLOOM_FILTER") {
    //   const { symbol, type } = message.data;
    //   testBloomFilter(symbol, type).then((result) => {
    //     sendResponse({ success: true, result });
    //   });
    //   return true; // 保持消息通道开放
    // }

    // if (message.type === "REFRESH_BLOOM_FILTER") {
    //   fetchBloomFilterWithCache().then(() => {
    //     getCurrentCache().then((cache) => {
    //       sendResponse({ success: true, data: cache?.data || {} });
    //     });
    //   });
    //   return true; // 保持消息通道开放
    // }

    // 添加 GET_CACHE_STATUS 消息处理器
    // if (message.type === "GET_CACHE_STATUS") {
    //   getCacheStatus().then((status) => {
    //     sendResponse({ success: true, status });
    //   });
    //   return true; // 保持消息通道开放
    // }

    if (message.type === "PAGE_DATA") {
      console.log("处理页面数据:", message.data);
      sendResponse({ success: true, received: message.type });
    }

    if (message.type === "TWITTER_HANDLE") {
      console.log("检测到Twitter handle:", message.data);
      currentData.currentTwitterHandle = message.data;
      currentData.lastDetected = new Date().toISOString();

      // 通知所有相关组件数据已更新
      chrome.runtime.sendMessage({
        type: "STORAGE_UPDATED",
        data: currentData,
      });

      sendResponse({ success: true, received: message.type });
    }

    if (message.type === "GET_CURRENT_DATA") {
      console.log("返回当前数据:", currentData);
      sendResponse({
        success: true,
        data: currentData,
      });
    }

    // 默认响应
    sendResponse({ success: true, received: message.type });
  });
});
