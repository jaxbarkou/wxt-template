import ReactDOM from "react-dom/client";
import App from "./App";
import "@/assets/style/globals.css";

export default defineContentScript({
  matches: ["*://*/*"],
  cssInjectionMode: "ui",
  async main(ctx: any) {
    
    const keyword = "BTC";

    // 检测当前页面类型
    const detectPageType = () => {
      const url = window.location.href;
      const hostname = window.location.hostname;
      
      console.log('检测页面类型:', { url, hostname });
      
      if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
        return 'TWITTER';
      }
      if (hostname.includes('github.com')) {
        return 'GITHUB';
      }
      if (hostname.includes('linkedin.com')) {
        return 'LINKEDIN';
      }
      return 'OTHER';
    };

    // 提取Twitter handle
    const extractTwitterHandle = () => {
      const pageType = detectPageType();
      console.log('开始提取Twitter handle，页面类型:', pageType);
      
      if (pageType === 'TWITTER') {
        // 方法1：从URL提取
        const urlMatch = window.location.pathname.match(/^\/([^\/]+)/);
        console.log('URL匹配结果:', urlMatch);
        if (urlMatch && urlMatch[1] && !urlMatch[1].startsWith('i')) {
          const handle = urlMatch[1];
          console.log('从URL提取到handle:', handle);
          return handle;
        }
        
        // 方法2：从页面元素提取
        const handleElements = document.querySelectorAll('[data-testid="UserName"] span');
        console.log('找到UserName元素数量:', handleElements.length);
        for (const element of handleElements) {
          const text = element.textContent;
          console.log('检查元素文本:', text);
          if (text && text.startsWith('@')) {
            const handle = text.substring(1);
            console.log('从元素提取到handle:', handle);
            return handle;
          }
        }
        
        // 方法3：从meta标签提取
        const metaHandle = document.querySelector('meta[property="og:title"]');
        console.log('找到meta标签:', metaHandle);
        if (metaHandle) {
          const content = metaHandle.getAttribute('content');
          console.log('meta内容:', content);
          if (content && content.includes('@')) {
            const match = content.match(/@([^\/\s]+)/);
            if (match) {
              console.log('从meta提取到handle:', match[1]);
              return match[1];
            }
          }
        }
      }
      
      console.log('未提取到Twitter handle');
      return null;
    };

    // 提取页面信息
    const extractPageInfo = () => {
      console.log('开始提取页面信息...');
      const pageType = detectPageType();
      const info = {
        url: window.location.href,
        title: document.title,
        hostname: window.location.hostname,
        pageType: pageType,
        timestamp: new Date().toISOString(),
        twitterHandle: ''
      };

      console.log('基础页面信息:', info);

      if (pageType === 'TWITTER') {
        const handle = extractTwitterHandle();
        if (handle) {
          info.twitterHandle = handle;
          console.log('发送Twitter handle到background:', handle);
          // 发送Twitter handle到background
          chrome.runtime.sendMessage({
            type: 'TWITTER_HANDLE',
            data: handle
          }, (response) => {
            console.log('Background响应:', response);
          });
        }
      }

      console.log('最终页面信息:', info);
      return info;
    };

    // 监听页面变化（SPA应用）
    const observePageChanges = () => {
      console.log('开始监听页面变化...');
      const observer = new MutationObserver(() => {
        console.log('检测到页面变化，重新提取信息...');
        const pageInfo = extractPageInfo();
        console.log('页面信息:', pageInfo);
        
        // 发送页面信息到background
        chrome.runtime.sendMessage({
          type: 'PAGE_DATA',
          data: pageInfo
        }, (response) => {
          console.log('Background响应:', response);
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    };

    // 初始检测
    console.log('开始初始检测...');
    const initialPageInfo = extractPageInfo();
    console.log('初始页面信息:', initialPageInfo);
    
    // 发送初始数据到background
    chrome.runtime.sendMessage({
      type: 'PAGE_DATA',
      data: initialPageInfo
    }, (response) => {
      console.log('初始数据发送响应:', response);
    });

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
        node.nodeValue.includes(keyword) &&
        !node.parentElement?.classList.contains('wxt-hover-word') // 避免处理已经是高亮元素的子节点
      ) {
        const parent = node.parentNode;
        if (!parent) return;

        const replacedHTML = node.nodeValue.replace(
          keyword,
          `<span class="wxt-hover-word" style="cursor:pointer; color:#3b82f6">${keyword}</span>`
        );

        const temp = document.createElement("span");
        temp.innerHTML = replacedHTML;

        parent.replaceChild(temp, node);
        processedNodes.add(temp);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        for (const child of Array.from(node.childNodes)) {
          walkAndReplaceTextNodes(child);
        }
      }
    };

    // 为元素添加事件监听器的函数
    const addHoverListeners = (element: Element) => {
      if (element.classList.contains('wxt-hover-word') && !element.hasAttribute('data-wxt-listener-added')) {
        element.setAttribute('data-wxt-listener-added', 'true');
        
        element.addEventListener("mouseenter", async (e) => {
          const target = e.currentTarget as HTMLElement;
          const rect = target.getBoundingClientRect();
          let currentPosition: { x: number; y: number } | null = {
            x: rect.left + window.scrollX,
            y: rect.bottom + window.scrollY + 6,
          };
          (window as any).__tooltipPosition__ = currentPosition;
          ui.mount();
        });

        element.addEventListener("mouseleave", () => {
          setTimeout(() => {
            ui.remove();
          }, 300);
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
        // 从全局变量获取位置信息
        const position = (window as any).__tooltipPosition__;
        if (position) {
          const x = position.x;
          const y = position.y;
          console.log("hover-ui mounted at:", x, y);
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
          root.render(<App />);
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
    walkAndReplaceTextNodes(document.body);
    
    // 为现有的高亮元素添加事件监听器
    document.querySelectorAll(".wxt-hover-word").forEach(addHoverListeners);

    // 监听DOM变化，处理动态添加的内容
    const keywordObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // 检查新添加的元素是否包含关键词
            walkAndReplaceTextNodes(node);
            // 为新添加的高亮元素添加事件监听器
            (node as Element).querySelectorAll?.(".wxt-hover-word").forEach(addHoverListeners);
          } else if (node.nodeType === Node.TEXT_NODE) {
            // 检查新添加的文本节点
            walkAndReplaceTextNodes(node);
          }
        });
      });
    });

    keywordObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  },
});
