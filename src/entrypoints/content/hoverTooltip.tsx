import ReactDOM from "react-dom/client";
import HoverModel from "./HoverModel";

const hoverTooltip = async (ctx: any) => {
  // 改进的关键词替换功能
  const processedNodes = new WeakSet(); // 用于跟踪已处理的节点

  const hardEnablePointerEvents = (el: HTMLElement) => {
    el.style.setProperty("pointer-events", "auto", "important"); // [修改-v1]
    // el.style.setProperty("cursor", "pointer", "important"); // [修改-v1]
    // el.style.setProperty("display", "inline-block", "important"); // [修改-v1]
    // el.style.setProperty("position", "relative", "important"); // [修改-v1]
    // el.style.setProperty("z-index", "2147483647", "important"); // [修改-v1]
  };

  const ensurePointerEventsStyleOnce = () => {
    if (document.getElementById("wxt-pe-fix")) return;
    const style = document.createElement("style");
    style.id = "wxt-pe-fix";
    style.textContent = `
      .wxt-hover-word{
        pointer-events:auto !important;
    }`;
    document.head.appendChild(style);
  };

  ensurePointerEventsStyleOnce();

  // 重置OKX弹窗
  // const OKX_ROOT_ID = "okx-dapp-injector-react-root";
  // const replaceOkxInjectorWithEmpty = () => {
  //   const oldEl = document.getElementById(OKX_ROOT_ID);
  //   if (oldEl && oldEl.parentNode) {
  //     const tag = oldEl.tagName.toLowerCase() || "div";
  //     const empty = document.createElement(tag);
  //     empty.id = OKX_ROOT_ID; // 保留相同 id
  //     // 可选：也可清理样式/属性，这里只保留 id，确保“空元素”
  //     oldEl.replaceWith(empty);
  //   }
  // };
  // replaceOkxInjectorWithEmpty();

  // =========================
  // [修改] —— 全局单例标记与存储
  // 只要页面里有这个对象，就说明已经有一个 tooltip 在管理中
  // =========================
  const g = window as any;
  if (!g.__WXT_TOOLTIP_SINGLETON__) {
    g.__WXT_TOOLTIP_SINGLETON__ = {
      mounted: false, // 是否已挂载一个 tooltip
      elements: null as null | { root: any; wrapper: HTMLDivElement },
      position: null as null | { x: number; y: number },
      symbol: null as null | string,
    };
  }

  // 遍历并替换文本节点中的关键词
  const walkAndReplaceTextNodes = (node: Node) => {
    // 避免重复处理
    if (processedNodes.has(node)) return;

    // =========================
    // [修改] —— 跳过不应处理的节点类型，避免在<script>等标签里替换
    // =========================
    if (
      node.nodeType === Node.ELEMENT_NODE &&
      node instanceof HTMLElement &&
      ["SCRIPT", "STYLE", "NOSCRIPT", "IFRAME"].includes(node.tagName)
    ) {
      return;
    }

    if (
      node.nodeType === Node.TEXT_NODE &&
      node.nodeValue &&
      !node.parentElement?.classList.contains("wxt-hover-word")
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

      if (hasMatch) {
        const parent = node.parentNode;
        if (!parent) return;

        const temp = document.createElement("span");
        temp.innerHTML = replacedText;

        parent.replaceChild(temp, node);
        processedNodes.add(temp);

        temp.querySelectorAll(".wxt-hover-word").forEach((el) => {
          hardEnablePointerEvents(el as HTMLElement); // [修改-v1]
        });
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
  if (!g.__tooltipEventsInitialized__) {
    g.__tooltipEventsInitialized__ = true;

    g.__tooltipMouseEnter = () => {
      isHoveringTooltip = true;
      if (hideTimeout) {
        clearTimeout(hideTimeout);
        hideTimeout = null;
      }
    };

    g.__tooltipMouseLeave = () => {
      isHoveringTooltip = false;
      startHideTimer();
    };
  }

  // 统一隐藏逻辑
  function startHideTimer() {
    if (hideTimeout) clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      if (!isHoveringTooltip && !isHoveringKeyword) {
        // =========================
        // [修改] —— 使用单例的 remove 流程
        // 只要隐藏，就把 mounted 置为 false，并清理 elements
        // =========================
        handleHide();
      }
    }, 300);
  }

  function handleHide() {
    ui.remove();
    if (g.__WXT_TOOLTIP_SINGLETON__.elements) {
      g.__WXT_TOOLTIP_SINGLETON__.elements.root?.unmount?.();
      g.__WXT_TOOLTIP_SINGLETON__.elements.wrapper?.remove?.();
    }
    g.__WXT_TOOLTIP_SINGLETON__.elements = null;
    g.__WXT_TOOLTIP_SINGLETON__.mounted = false;
    g.__WXT_TOOLTIP_SINGLETON__.position = null;
    g.__WXT_TOOLTIP_SINGLETON__.symbol = null;
  }

  // =========================
  // [修改] —— 专用函数：复用已存在的 tooltip，更新位置与内容
  // 而不是重复 mount 第二个
  // =========================
  function ensureSingleTooltipAndUpdate(
    position: { x: number; y: number },
    symbol: string | null
  ) {
    const S = g.__WXT_TOOLTIP_SINGLETON__;

    // 如果已经 mounted，则复用现有 wrapper + root
    if (S.mounted && S.elements) {
      const { wrapper, root } = S.elements;
      wrapper.style.left = `${position.x}px`;
      wrapper.style.top = `${position.y}px`;

      if (symbol !== S.symbol) {
        root.render(
          <HoverModel
            symbol={symbol || undefined}
            onClose={() => {
              handleHide();
            }}
          />
        );
        S.symbol = symbol;
      }
      S.position = position;
      return; // 不再重复 mount
    }

    // 如果还没 mounted，则触发 mount，一次且仅一次
    g.__tooltipPosition__ = position; // 兼容原 onMount 读取
    g.__tooltipSymbol__ = symbol;
    ui.mount();
    // ui.mount() 后会在 onMount 里把 elements 写入单例并置为 mounted=true
  }

  // 主监听逻辑
  const addHoverListeners = (element: Element) => {
    if (
      element.classList.contains("wxt-hover-word") &&
      !element.hasAttribute("data-wxt-listener-added")
    ) {
      element.setAttribute("data-wxt-listener-added", "true");

      hardEnablePointerEvents(element as HTMLElement);

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

        // =========================
        // [修改] —— 不再直接 ui.mount() 第二个实例
        // 改为调用 ensureSingleTooltipAndUpdate 复用/更新
        // =========================
        if (hideTimeout) clearTimeout(hideTimeout);
        ensureSingleTooltipAndUpdate(currentPosition, symbol);
        isHoveringKeyword = true;
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
        // wrapper.classList.add("fixed", "w-[200px]", "h-[200px]", "z-[999999]");
        wrapper.style.left = `${x}px`;
        wrapper.style.top = `${y}px`;

        container.append(wrapper);
        const root = ReactDOM.createRoot(wrapper);
        root.render(<HoverModel symbol={symbol} onClose={handleHide} />);

        // =========================
        // [修改] —— 把生成的 elements 写入单例，并标记 mounted
        // =========================
        const S = (window as any).__WXT_TOOLTIP_SINGLETON__;
        S.elements = { root, wrapper };
        S.mounted = true;
        S.position = position;
        S.symbol = symbol;

        return { root, wrapper };
      }
      return null;
    },
    onRemove: (elements) => {
      elements?.root?.unmount?.();
      elements?.wrapper?.remove?.();

      // =========================
      // [修改] —— onRemove 同步清理单例状态
      // =========================
      const S = (window as any).__WXT_TOOLTIP_SINGLETON__;
      if (S) {
        S.elements = null;
        S.mounted = false;
        S.position = null;
        S.symbol = null;
      }
    },
  });

  // 初始处理
  try {
    walkAndReplaceTextNodes(document.body);
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
            walkAndReplaceTextNodes(node);
            (node as Element)
              .querySelectorAll?.(".wxt-hover-word")
              .forEach(addHoverListeners);
          } else if (node.nodeType === Node.TEXT_NODE) {
            walkAndReplaceTextNodes(node);
          }
          // clean OKX
          // if (node.nodeType === Node.ELEMENT_NODE) {
          //   const el = node as Element;
          //   if (el.id === OKX_ROOT_ID) {
          //     replaceOkxInjectorWithEmpty(); // [修改-v2]
          //   } else if (el.querySelector) {
          //     const found = el.querySelector(`#${OKX_ROOT_ID}`);
          //     if (found) replaceOkxInjectorWithEmpty(); // [修改-v2]
          //   }
          // }
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
