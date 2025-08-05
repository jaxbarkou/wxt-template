import ReactDOM from "react-dom/client";
import FloatingButton from "./FloatingButton";
import "@/assets/style/globals.css";

export default defineContentScript({
  matches: ["*://*/*"],
  cssInjectionMode: "ui",
  async main(ctx: any) {
    // 检测当前页面类型
    let text = "";
    let x = -9999;
    let y = -9999;
    let rect: DOMRect | undefined = undefined;
    let lastMouseDownTarget: EventTarget | null = null;
    let shadowHost: HTMLElement | undefined;

    document.addEventListener("mousedown", (e) => {
      lastMouseDownTarget = e.target;
    });

    const { mount, remove } = await createShadowRootUi(ctx, {
      name: "hover-ui",
      position: "overlay",
      anchor: "html",
      append: "first",
      onMount: (container, shadowRoot, host) => {
        shadowHost = host;
        const wrapper = document.createElement("div");
        if (rect) {
          x = rect.right;
          y = rect.bottom;
          wrapper.style.left = `${x}px`;
          wrapper.style.top = `${y}px`;
          container.append(wrapper);
          const root = ReactDOM.createRoot(wrapper);
          root.render(<FloatingButton text={text} position={{ x, y }} />); // 传递选中文本和位置信息给FloatingButton组件
          return { root, wrapper };
        }
        return null;
      },
      onRemove: (elements) => {
        elements?.root?.unmount();
        elements?.wrapper?.remove();
        shadowHost = undefined;
      },
    });

    document.addEventListener("mouseup", async () => {
      const selection = window.getSelection();
      text = selection?.toString().trim() || "";
      const clickedInsideShadow = shadowHost?.contains(
        lastMouseDownTarget as Node
      );
      if (!text) {
        if (!clickedInsideShadow) {
          remove();
        }
        return;
      }

      const range = selection?.getRangeAt(0);
      rect = range?.getBoundingClientRect();

      // 创建 Shadow UI
      mount();
    });
  },
});
