import "@/assets/style/globals.css";
// import floatingSelection from "./floatingSelection";
import hoverTooltip from "./hoverTooltip";
import overlayCon from "./overlayCon";

export default defineContentScript({
  matches: ["*://*/*"],
  cssInjectionMode: "ui",
  async main(ctx: any) {
    // floatingSelection(ctx);
    hoverTooltip(ctx);
    overlayCon(ctx);
  },
});
