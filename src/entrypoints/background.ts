import { API_URL } from "@/config";

export default defineBackground(() => {
  // 添加错误处理
  const handleError = (error: any, context: string) => {
    console.error(`[${context}] Error:`, error);
    // 可以在这里添加错误报告逻辑
  };

  // 设置插件点击行为 - 点击插件logo时打开侧边栏
  chrome.runtime.onInstalled.addListener(() => {
    try {
      chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
      console.log("插件已安装，侧边栏行为已设置");
    } catch (error) {
      handleError(error, "onInstalled");
    }
  });

  // 监听插件图标点击事件
  chrome.action.onClicked.addListener((tab) => {
    try {
      console.log('插件logo被点击了', tab);
      if (tab.id) {
        // 直接在这里处理，不使用异步操作
        chrome.sidePanel.setOptions({
          enabled: true,
        });
        
        // 使用 windowId 如果可用
        const openOptions: any = { tabId: tab.id };
        if (tab.windowId) {
          openOptions.windowId = tab.windowId;
        }
        
        chrome.sidePanel.open(openOptions);
        console.log("尝试打开侧边栏");
      }
    } catch (error) {
      handleError(error, "action.onClicked");
    }
  });

  // 监听来自content script和sidepanel的消息
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    try {
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
        
        console.log("Fetching project data:", payload);
        
        fetch(`${API_URL}/api/v1/project/project_data`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
          })
          .then((data) => {
            console.log("Project data received:", data);
            sendResponse({ success: true, data });
          })
          .catch((err) => {
            console.error("Fetch error:", err);
            sendResponse({ success: false, error: err.message });
          });

        // 👇 重要：return true 表示异步响应
        return true;
      }

      // 处理选中文本分析请求
      if (message.type === "ANALYZE_SELECTED_TEXT") {
        if (sender.tab?.id) {
          // 打开侧边栏
          chrome.sidePanel.setOptions({
            enabled: true,
          });
          
          const openOptions: any = { tabId: sender.tab.id };
          if (sender.tab.windowId) {
            openOptions.windowId = sender.tab.windowId;
          }
          
          chrome.sidePanel.open(openOptions);
          
          // 通知侧边栏有新的分析请求
          chrome.runtime.sendMessage({
            type: "NEW_ANALYSIS_REQUEST",
            text: message.text
          }).catch(() => {
            // 如果侧边栏还没有加载，忽略错误
          });
          
          sendResponse({ success: true, message: "分析请求已处理" });
        } else {
          sendResponse({ success: false, message: "无法获取标签页信息" });
        }
        return true;
      }

      // 默认响应
      sendResponse({ success: true, received: message.type });
    } catch (error) {
      handleError(error, "onMessage");
      sendResponse({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // 添加运行时错误监听
  chrome.runtime.onSuspend.addListener(() => {
    console.log("Extension is being suspended");
  });

  chrome.runtime.onStartup.addListener(() => {
    console.log("Extension is starting up");
  });
});
