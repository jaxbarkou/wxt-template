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

    // 创建右键菜单
    createContextMenus();
  });

  // 创建右键菜单函数
  const createContextMenus = () => {
    chrome.contextMenus.create({
      id: "about-extension",
      title: "打开全页面聊天",
      contexts: ["all"]
    });
  };

  // 处理右键菜单点击事件
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    switch (info.menuItemId) {
      case "about-extension":
        // 显示关于信息
        chrome.tabs.create({
          url: chrome.runtime.getURL("options.html#/about")
        });
        break;
    }
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

    // 统一处理页面打开请求
    if (message.type === "OPEN_PAGE") {
      try {
        const { page } = message;

        switch (page) {
          case "user":
            if (sender.tab?.id) {
              chrome.sidePanel.open({ tabId: sender.tab.id });
              chrome.runtime.sendMessage({
                type: "NAVIGATE_TO_PAGE",
                page: "user"
              });
              sendResponse({ success: true, message: "用户页面已打开" });
            } else {
              sendResponse({ success: false, message: "无法获取标签页ID" });
            }
            break;

          case "about":
            if (sender.tab?.id) {
              chrome.sidePanel.open({ tabId: sender.tab.id });
              chrome.runtime.sendMessage({
                type: "NAVIGATE_TO_PAGE",
                page: "about"
              });
              sendResponse({ success: true, message: "用户页面已打开" });
            } else {
              sendResponse({ success: false, message: "无法获取标签页ID" });
            }
            sendResponse({ success: true, message: "关于页面已打开" });
            break;

          case "options":
            chrome.runtime.openOptionsPage();
            sendResponse({ success: true, message: "设置页面已打开" });
            break;

          default:
            sendResponse({ success: false, message: `未知页面类型: ${page}` });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        sendResponse({ success: false, message: `打开页面失败: ${errorMessage}` });
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
