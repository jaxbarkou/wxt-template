import "@/assets/style/globals.css";
// import floatingSelection from "./floatingSelection";
import hoverTooltip from "./hoverTooltip";

export default defineContentScript({
  matches: ["*://*/*"],
  cssInjectionMode: "ui",
  async main(ctx: any) {
    // floatingSelection(ctx);
    hoverTooltip(ctx);
  },
});
