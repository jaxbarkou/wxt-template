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
    // 创建主菜单
    chrome.contextMenus.create({
      id: "wxt-extension-menu",
      title: "WXT Extension",
      contexts: ["all"]
    });

    // 创建子菜单项
    chrome.contextMenus.create({
      id: "open-options",
      parentId: "wxt-extension-menu",
      title: "打开设置",
      contexts: ["all"]
    });

    chrome.contextMenus.create({
      id: "open-sidepanel",
      parentId: "wxt-extension-menu",
      title: "打开侧边栏",
      contexts: ["all"]
    });

    chrome.contextMenus.create({
      id: "separator-1",
      parentId: "wxt-extension-menu",
      type: "separator",
      contexts: ["all"]
    });

    chrome.contextMenus.create({
      id: "about-extension",
      parentId: "wxt-extension-menu",
      title: "关于扩展",
      contexts: ["all"]
    });
  };

  // 处理右键菜单点击事件
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    switch (info.menuItemId) {
      case "open-options":
        // 打开选项页面
        chrome.runtime.openOptionsPage();
        break;
        
      case "open-sidepanel":
        // 打开侧边栏
        if (tab?.id) {
          chrome.sidePanel.open({ tabId: tab.id });
        }
        break;
        
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
