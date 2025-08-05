import ReactDOM from "react-dom/client";
import App from "./App";
import "@/assets/style/globals.css";

export default defineContentScript({
  matches: ["*://*/*"],
  cssInjectionMode: "ui",
  async main(ctx: any) {
    // 检测当前页面类型
    const detectPageType = () => {
      const url = window.location.href;
      const hostname = window.location.hostname;

      console.log("检测页面类型:bbbbbb", { url, hostname });

      if (hostname.includes("twitter.com") || hostname.includes("x.com")) {
        return "TWITTER";
      }
      if (hostname.includes("github.com")) {
        return "GITHUB";
      }
      if (hostname.includes("linkedin.com")) {
        return "LINKEDIN";
      }
      return "OTHER";
    };

    // 提取Twitter handle
    const extractTwitterHandle = () => {
      const pageType = detectPageType();
      console.log("开始提取Twitter handle，页面类型:", pageType);

      if (pageType === "TWITTER") {
        // 方法1：从URL提取
        const urlMatch = window.location.pathname.match(/^\/([^\/]+)/);
        console.log("URL匹配结果:", urlMatch);
        if (urlMatch && urlMatch[1] && !urlMatch[1].startsWith("i")) {
          const handle = urlMatch[1];
          console.log("从URL提取到handle:", handle);
          return handle;
        }

        // 方法2：从页面元素提取
        const handleElements = document.querySelectorAll(
          '[data-testid="UserName"] span'
        );
        console.log("找到UserName元素数量:", handleElements.length);
        for (const element of handleElements) {
          const text = element.textContent;
          console.log("检查元素文本:", text);
          if (text && text.startsWith("@")) {
            const handle = text.substring(1);
            console.log("从元素提取到handle:", handle);
            return handle;
          }
        }

        // 方法3：从meta标签提取
        const metaHandle = document.querySelector('meta[property="og:title"]');
        console.log("找到meta标签:", metaHandle);
        if (metaHandle) {
          const content = metaHandle.getAttribute("content");
          console.log("meta内容:", content);
          if (content && content.includes("@")) {
            const match = content.match(/@([^\/\s]+)/);
            if (match) {
              console.log("从meta提取到handle:", match[1]);
              return match[1];
            }
          }
        }
      }

      console.log("未提取到Twitter handle");
      return null;
    };

    // 提取页面信息
    const extractPageInfo = () => {
      console.log("开始提取页面信息...");
      const pageType = detectPageType();
      const info = {
        url: window.location.href,
        title: document.title,
        hostname: window.location.hostname,
        pageType: pageType,
        timestamp: new Date().toISOString(),
        twitterHandle: "",
      };

      console.log("基础页面信息:", info);

      if (pageType === "TWITTER") {
        const handle = extractTwitterHandle();
        if (handle) {
          info.twitterHandle = handle;
          console.log("提取到Twitter handle:", handle);
        }
      }

      console.log("最终页面信息:", info);
      return info;
    };

    // 监听页面变化（SPA应用）
    const observePageChanges = () => {
      console.log("开始监听页面变化...");
      let lastUrl = window.location.href;
      let lastProcessedTime = 0;
      let lastPageData: string | null = null;
      const DEBOUNCE_DELAY = 1000; // 1秒防抖

      const observer = new MutationObserver(() => {
        const currentTime = Date.now();
        const currentUrl = window.location.href;

        // 检查URL是否发生变化
        if (currentUrl !== lastUrl) {
          console.log("检测到URL变化，重新提取信息...");
          lastUrl = currentUrl;
          lastProcessedTime = currentTime;

          const pageInfo = extractPageInfo();
          console.log("页面信息:", pageInfo);

          // 检查数据是否真的发生了变化
          const { timestamp, ...pageDataForComparison } = pageInfo;
          const pageDataString = JSON.stringify(pageDataForComparison);
          if (pageDataString !== lastPageData) {
            lastPageData = pageDataString;

            // 发送页面信息到background
            chrome.runtime.sendMessage(
              {
                type: "PAGE_DATA",
                data: pageInfo,
              },
              (response) => {
                console.log("Background响应:", response);
              }
            );

            // 如果有Twitter handle，单独发送
            if (pageInfo.twitterHandle) {
              chrome.runtime.sendMessage(
                {
                  type: "TWITTER_HANDLE",
                  data: pageInfo.twitterHandle,
                },
                (response) => {
                  console.log("Twitter handle发送响应:", response);
                }
              );
            }
          }
        } else if (currentTime - lastProcessedTime > DEBOUNCE_DELAY) {
          // 只有在距离上次处理超过1秒时才处理DOM变化
          console.log("检测到DOM变化，重新提取信息...");
          lastProcessedTime = currentTime;

          const pageInfo = extractPageInfo();
          console.log("页面信息:", pageInfo);

          // 检查数据是否真的发生了变化
          const { timestamp, ...pageDataForComparison } = pageInfo;
          const pageDataString = JSON.stringify(pageDataForComparison);
          if (pageDataString !== lastPageData) {
            lastPageData = pageDataString;

            // 发送页面信息到background
            chrome.runtime.sendMessage(
              {
                type: "PAGE_DATA",
                data: pageInfo,
              },
              (response) => {
                console.log("Background响应:", response);
              }
            );

            // 如果有Twitter handle，单独发送
            if (pageInfo.twitterHandle) {
              chrome.runtime.sendMessage(
                {
                  type: "TWITTER_HANDLE",
                  data: pageInfo.twitterHandle,
                },
                (response) => {
                  console.log("Twitter handle发送响应:", response);
                }
              );
            }
          }
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    };

    // 初始检测
    console.log("开始初始检测...");
    const initialPageInfo = extractPageInfo();
    console.log("初始页面信息:", initialPageInfo);

    // 发送初始数据到background
    chrome.runtime.sendMessage(
      {
        type: "PAGE_DATA",
        data: initialPageInfo,
      },
      (response) => {
        console.log("初始数据发送响应:", response);
      }
    );

    // 如果有Twitter handle，单独发送
    if (initialPageInfo.twitterHandle) {
      chrome.runtime.sendMessage(
        {
          type: "TWITTER_HANDLE",
          data: initialPageInfo.twitterHandle,
        },
        (response) => {
          console.log("初始Twitter handle发送响应:", response);
        }
      );
    }

    // 开始监听页面变化
    observePageChanges();

    // 改进的关键词替换功能
    const processedNodes = new WeakSet(); // 用于跟踪已处理的节点

    const walkAndReplaceTextNodes = (node: Node) => {
      // 避免重复处理
      if (processedNodes.has(node)) return;

      if (
        node.nodeType === Node.TEXT_NODE &&
        node.nodeValue &&
        !node.parentElement?.classList.contains("wxt-hover-word") // 避免处理已经是高亮元素的子节点
      ) {
        const text = node.nodeValue;

        // 使用正则表达式匹配 $SYMBOL 格式
        const dollarSymbolRegex = /\$([A-Z]{2,10})/g;
        let match;
        let replacedText = text;
        let hasMatch = false;

        // 检查所有匹配项
        while ((match = dollarSymbolRegex.exec(text)) !== null) {
          const fullMatch = match[0]; // 完整的匹配，如 $BTC
          const symbol = match[1]; // 符号部分，如 BTC
          hasMatch = true;
          // 替换为高亮元素
          replacedText = replacedText.replace(
            fullMatch,
            `<span class="wxt-hover-word" data-symbol="${symbol}">${fullMatch}</span>`
          );
        }

        // 只有在有匹配项时才替换节点
        if (hasMatch) {
          const parent = node.parentNode;
          if (!parent) return;

          const temp = document.createElement("span");
          temp.innerHTML = replacedText;

          parent.replaceChild(temp, node);
          processedNodes.add(temp);
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        for (const child of Array.from(node.childNodes)) {
          walkAndReplaceTextNodes(child);
        }
      }
    };

    let isHoveringKeyword = false;
    let isHoveringTooltip = false;
    let hideTimeout: NodeJS.Timeout | null = null;

    // 只挂一次全局 tooltip 监听函数
    if (!(window as any).__tooltipEventsInitialized__) {
      (window as any).__tooltipEventsInitialized__ = true;

      (window as any).__tooltipMouseEnter = () => {
        isHoveringTooltip = true;
        if (hideTimeout) {
          clearTimeout(hideTimeout);
          hideTimeout = null;
        }
      };

      (window as any).__tooltipMouseLeave = () => {
        isHoveringTooltip = false;
        startHideTimer();
      };
    }

    // 统一隐藏逻辑
    function startHideTimer() {
      if (hideTimeout) clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => {
        if (!isHoveringTooltip && !isHoveringKeyword) {
          ui.remove();
        }
      }, 300);
    }

    // 主监听逻辑
    const addHoverListeners = (element: Element) => {
      if (
        element.classList.contains("wxt-hover-word") &&
        !element.hasAttribute("data-wxt-listener-added")
      ) {
        element.setAttribute("data-wxt-listener-added", "true");

        element.addEventListener("mouseenter", (e) => {
          const target = e.currentTarget as HTMLElement;
          const rect = target.getBoundingClientRect();
          const symbol = target.getAttribute("data-symbol");

          let currentPosition = {
            x: rect.left,
            y: rect.bottom + 6,
          };

          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;
          const tooltipWidth = 200;
          const tooltipHeight = 200;

          if (currentPosition.x + tooltipWidth > viewportWidth) {
            currentPosition.x = rect.right - tooltipWidth;
          }
          if (currentPosition.y + tooltipHeight > viewportHeight) {
            currentPosition.y = rect.top - tooltipHeight - 6;
          }

          currentPosition.x = Math.max(0, currentPosition.x);
          currentPosition.y = Math.max(0, currentPosition.y);

          (window as any).__tooltipPosition__ = currentPosition;
          (window as any).__tooltipSymbol__ = symbol;

          isHoveringKeyword = true;
          if (hideTimeout) clearTimeout(hideTimeout);

          ui.mount();
        });

        element.addEventListener("mouseleave", () => {
          isHoveringKeyword = false;
          startHideTimer();
        });
      }
    };

    const ui = await createShadowRootUi(ctx, {
      name: "hover-ui",
      position: "overlay",
      anchor: "html",
      append: "first",
      onMount: (container, shadowRoot, shadowHost) => {
        const wrapper = document.createElement("div");
        // 从全局变量获取位置信息和代币符号
        const position = (window as any).__tooltipPosition__;
        const symbol = (window as any).__tooltipSymbol__;

        if (position) {
          const x = position.x;
          const y = position.y;
          console.log("hover-ui mounted at:", x, y, "for symbol:", symbol);
          wrapper.classList.add(
            "fixed",
            "w-[200px]",
            "h-[200px]",
            "z-[999999]"
          );
          wrapper.style.left = `${x}px`;
          wrapper.style.top = `${y}px`;
          container.append(wrapper);
          const root = ReactDOM.createRoot(wrapper);
          root.render(<App symbol={symbol} />); // 传递代币符号给App组件
          return { root, wrapper };
        }
        return null;
      },
      onRemove: (elements) => {
        elements?.root?.unmount();
        elements?.wrapper?.remove();
      },
    });

    // 初始处理
    try {
      walkAndReplaceTextNodes(document.body);

      // 为现有的高亮元素添加事件监听器
      document.querySelectorAll(".wxt-hover-word").forEach(addHoverListeners);
    } catch (error) {
      console.error("初始处理时出错:", error);
    }

    // 监听DOM变化，处理动态添加的内容
    const keywordObserver = new MutationObserver((mutations) => {
      try {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // 检查新添加的元素是否包含关键词
              walkAndReplaceTextNodes(node);
              // 为新添加的高亮元素添加事件监听器
              (node as Element)
                .querySelectorAll?.(".wxt-hover-word")
                .forEach(addHoverListeners);
            } else if (node.nodeType === Node.TEXT_NODE) {
              // 检查新添加的文本节点
              walkAndReplaceTextNodes(node);
            }
          });
        });
      } catch (error) {
        console.error("处理DOM变化时出错:", error);
      }
    });

    // 延迟启动observer，避免在页面加载时造成性能问题
    setTimeout(() => {
      try {
        keywordObserver.observe(document.body, {
          childList: true,
          subtree: true,
        });
      } catch (error) {
        console.error("启动DOM观察器时出错:", error);
      }
    }, 1000);
  },
});
