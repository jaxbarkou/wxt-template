import ReactDOM from "react-dom/client";
import App from "./App";
import "@/assets/style/globals.css";

export default defineContentScript({
  matches: ["*://*/*"],
  cssInjectionMode: "ui",
  async main(ctx: any) {
    const keyword = "BTC";

    const walkAndReplaceTextNodes = (node: Node) => {
      if (
        node.nodeType === Node.TEXT_NODE &&
        node.nodeValue &&
        node.nodeValue.includes(keyword)
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
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        for (const child of Array.from(node.childNodes)) {
          walkAndReplaceTextNodes(child);
        }
      }
    };

    walkAndReplaceTextNodes(document.body);

    const ui = await createShadowRootUi(ctx, {
      name: "hover-ui",
      position: "overlay",
      anchor: "body",
      append: "first",
      onMount: (container, shadowRoot, shadowHost) => {
        const wrapper = document.createElement("div");
        const rect = shadowHost.getBoundingClientRect(); // ✅ 获取目标关键词的位置
        const x = rect.left + window.scrollX;
        const y = rect.bottom + window.scrollY + 6; // 可微调偏移
        console.log("hover-ui mounted at:", x, y, rect);
        wrapper.classList.add("fixed", "w-[200px]", "h-[200px]", "z-100000");
        wrapper.style.left = `${x}px`;
        wrapper.style.top = `${y}px`;
        container.append(wrapper);
        const root = ReactDOM.createRoot(wrapper);
        root.render(<App />);
        return { root, wrapper };
      },
      onRemove: (elements) => {
        elements?.root?.unmount();
        elements?.wrapper?.remove();
      },
    });

    document.querySelectorAll(".wxt-hover-word").forEach((el) => {
      el.addEventListener("mouseenter", async (e) => {
        const target = e.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();
        let currentPosition: { x: number; y: number } | null = {
          x: rect.left + window.scrollX,
          y: rect.bottom + window.scrollY + 6,
        };
        (window as any).__tooltipPosition__ = currentPosition;
        ui.mount();
      });

      el.addEventListener("mouseleave", () => {
        setTimeout(() => {
          ui.remove();
        }, 300);
      });
    });
  },
});
