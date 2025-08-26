import ReactDOM from "react-dom/client";
import FloatingButton from "./FloatingButton.tsx";

const floatingSelection = async (ctx: any) => {
  // 检测当前页面类型
  let text = "";
  let x = -9999;
  let y = -9999;
  let rect: DOMRect | undefined = undefined;
  let lastMouseDownTarget: EventTarget | null = null;
  let shadowHost: HTMLElement | undefined;
  let currentRoot: ReactDOM.Root | undefined;
  let currentWrapper: HTMLElement | undefined;

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
      wrapper.style.position = "fixed";
      wrapper.style.zIndex = "999999";
      wrapper.style.pointerEvents = "none";
      
      if (rect) {
        x = rect.right;
        y = rect.bottom;
        wrapper.style.left = `${x}px`;
        wrapper.style.top = `${y}px`;
        wrapper.style.pointerEvents = "auto";
      }
      
      container.append(wrapper);
      currentWrapper = wrapper;
      
      const root = ReactDOM.createRoot(wrapper);
      currentRoot = root;
      
      if (text && rect) {
        root.render(<FloatingButton text={text} position={{ x, y }} />);
      }
      
      return { root, wrapper };
    },
    onRemove: (elements) => {
      currentRoot?.unmount();
      currentWrapper?.remove();
      currentRoot = undefined;
      currentWrapper = undefined;
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

    if (rect && currentRoot && currentWrapper) {
      x = rect.right;
      y = rect.bottom;
      currentWrapper.style.left = `${x}px`;
      currentWrapper.style.top = `${y}px`;
      currentWrapper.style.pointerEvents = "auto";
      currentRoot.render(<FloatingButton text={text} position={{ x, y }} />);
    } else {
      // 创建 Shadow UI
      mount();
    }
  });
};

export default floatingSelection;
