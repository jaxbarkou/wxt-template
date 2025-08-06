import ReactDOM from "react-dom/client";
const SYMBOL_REGEX = /\$[a-zA-Z][a-zA-Z0-9]*/g;

function extractDollarSymbols(text: string): string[] {
  const matches = text.match(SYMBOL_REGEX);
  return matches ?? [];
}

function createOverlay(symbols: string[]) {
  const container = document.createElement("div");
  container.style.cssText = `
    background: #8a91ff;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    margin-bottom: 4px;
  `;
  container.textContent = `符号: ${symbols.join(" ")}`;
  return container;
}

function handleTweetElement(tweetEl: HTMLElement) {
  if (tweetEl.getAttribute("data-wxt-injected") === "true") return;

  const text = tweetEl.innerText;
  const symbols = extractDollarSymbols(text);
  if (symbols.length === 0) return;

  const overlay = createOverlay(symbols);

  tweetEl.setAttribute("data-wxt-injected", "true");
  tweetEl.insertBefore(overlay, tweetEl.firstChild);
}

function scanTweets() {
  const tweetEls = document.querySelectorAll('[data-testid="tweetText"]');
  tweetEls.forEach((el) => {
    if (el instanceof HTMLElement) {
      handleTweetElement(el);
    }
  });
}

const overlayCon = async (ctx: any) => {
  // 初始扫描
  scanTweets();

  // 监听 DOM 变化（推文懒加载）
  const observer = new MutationObserver(() => {
    scanTweets();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
};
export default overlayCon;
