// authPopup.ts
type CenterMode = "none" | "window" | "screen";

export async function authInPopup(
  authUrl: string,
  redirectUri: string,
  opts: { width?: number; height?: number; center?: CenterMode } = {}
): Promise<URL> {
  const width = Math.round(opts.width ?? 420);
  const height = Math.round(opts.height ?? 640);
  const center = opts.center ?? "window";

  // 计算 left/top
  let left: number | undefined;
  let top: number | undefined;

  // 取当前浏览器窗口（不需要任何额外权限）
  const base = await chrome.windows.getCurrent();

  if (
    center === "window" &&
    base.left != null &&
    base.top != null &&
    base.width &&
    base.height
  ) {
    left = Math.max(0, Math.round(base.left + (base.width - width) / 2));
    top = Math.max(0, Math.round(base.top + (base.height - height) / 2));
  }

  if (center === "screen") {
    try {
      // 需要 "system.display" 权限
      const displays = await chrome.system.display.getInfo();
      const cx = (base.left ?? 0) + (base.width ?? 0) / 2;
      const cy = (base.top ?? 0) + (base.height ?? 0) / 2;

      // 找到当前窗口中心点所在的显示器；找不到就用主屏
      let target =
        displays.find((d) => {
          const b = d.bounds;
          return (
            cx >= b.left &&
            cx <= b.left + b.width &&
            cy >= b.top &&
            cy <= b.top + b.height
          );
        }) ??
        displays.find((d) => d.isPrimary) ??
        displays[0];

      const b = target.bounds;
      left = Math.max(b.left, Math.round(b.left + (b.width - width) / 2));
      top = Math.max(b.top, Math.round(b.top + (b.height - height) / 2));
    } catch {
      // 无权限或异常时退化为“窗口居中”（或默认定位）
      if (left == null || top == null) {
        left =
          base.left != null && base.width
            ? Math.round(base.left + (base.width - width) / 2)
            : undefined;
        top =
          base.top != null && base.height
            ? Math.round(base.top + (base.height - height) / 2)
            : undefined;
      }
    }
  }

  // 打开可控尺寸 + 位置的弹窗
  const win = await chrome.windows.create({
    url: authUrl,
    type: "popup",
    width,
    height,
    left,
    top,
    focused: true,
  });

  const winId = win?.id!;
  const tabId = win?.tabs?.[0]?.id!;

  return new Promise((resolve, reject) => {
    const cleanup = () => {
      try {
        chrome.tabs.onUpdated.removeListener(onUpdated);
      } catch {}
      try {
        chrome.windows.onRemoved.removeListener(onClosed);
      } catch {}
    };
    const onClosed = (removedId: number) => {
      if (removedId === winId) {
        cleanup();
        reject(new Error("popup_closed"));
      }
    };
    const onUpdated = (_id: number, changeInfo: any) => {
      if (_id !== tabId || !changeInfo.url) return;
      if (!changeInfo.url.startsWith(redirectUri)) return;

      cleanup();
      if (winId) chrome.windows.remove(winId);
      resolve(new URL(changeInfo.url));
    };

    chrome.tabs.onUpdated.addListener(onUpdated);
    chrome.windows.onRemoved.addListener(onClosed);
  });
}
