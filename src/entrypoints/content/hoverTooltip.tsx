import ReactDOM from "react-dom/client";
import HoverModel from "./HoverModel";

const hoverTooltip = async (ctx: any) => {
  // 改进的关键词替换功能
  const processedNodes = new WeakSet(); // 用于跟踪已处理的节点

  // 遍历并替换文本节点中的关键词
  // 使用正则表达式匹配 $SYMBOL 格式的关键词，并替换
  // 为每个匹配的关键词创建一个高亮元素 弹窗
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

        if (!(window as any).__WXT_UI_MOUNTED__) {
          ui.mount();
          (window as any).__WXT_UI_MOUNTED__ = true; // 标记已挂载
        }
        // ui.mount();
      });

      element.addEventListener("mouseleave", () => {
        isHoveringKeyword = false;
        (window as any).__WXT_UI_MOUNTED__ = false; // 重置挂载状态
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
        wrapper.classList.add("fixed", "w-[200px]", "h-[200px]", "z-[999999]");
        wrapper.style.left = `${x}px`;
        wrapper.style.top = `${y}px`;
        container.append(wrapper);
        const root = ReactDOM.createRoot(wrapper);
        root.render(<HoverModel symbol={symbol} />); // 传递代币符号给App组件
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
};
export default hoverTooltip;
