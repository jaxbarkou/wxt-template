import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  modules: ["@wxt-dev/module-react"],
  manifest: {
     // 同时配置popup和sidepanel
     action: {
      default_popup: "popup.html",
    },
    side_panel: {
      default_path: "sidepanel.html", // Points to your side panel HTML
    },
    permissions: [
      "sidePanel", // Required permission for side panels
      "storage",
      "tabs",
    ],
    host_permissions: ["<all_urls>"]
  },
  vite: () => ({
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"), // or "./src" if using src directory
      },
    },
  }),
});
