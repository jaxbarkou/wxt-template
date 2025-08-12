import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  modules: ["@wxt-dev/module-react"],
  manifest: {
     // 同时配置popup、sidepanel和options
     action: {
      default_popup: "popup.html",
    },
    side_panel: {
      default_path: "sidepanel.html", // Points to your side panel HTML
    },
    options_ui: {
      page: "options.html", // Points to your options page HTML
      open_in_tab: true, // 在新标签页中打开
    },
    permissions: [
      "sidePanel", // Required permission for side panels
      "storage",
      "tabs",
      "contextMenus", // 添加右键菜单权限
      "identity", // 可能需要用于身份验证
    ],
    host_permissions: [
      "<all_urls>",
      "https://*/*", // 允许访问HTTPS网站
      "http://localhost:*", // 允许访问localhost
    ]
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
