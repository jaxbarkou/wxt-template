import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  modules: ["@wxt-dev/module-react"],
  manifest: () => {
    const isTest = import.meta.env.WXT_TESTNETS;
    const KEY = import.meta.env.WXT_PUBLIC_KEY;
    const CLIENT_ID = import.meta.env.WXT_CLIENT_ID;
    return {
      name: "Yomo",
      description: "AI-powered project research and analysis tool",
      version: "1.0.0",
      icons: {
        "16": "icon/16x16.png",
        "32": "icon/32x32.png",
        "48": "icon/48x48.png",
        "96": "icon/96x96.png",
        "128": "icon/128x128.png",
      },
      // 配置插件图标，不设置popup，让点击时打开侧边栏
      action: {
        default_icon: {
          "16": "icon/16x16.png",
          "32": "icon/32x32.png",
          "48": "icon/48x48.png",
          "96": "icon/96x96.png",
          "128": "icon/128x128.png",
        },
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
      oauth2: {
        client_id: CLIENT_ID, // 替换为新的 Client ID
        scopes: ["openid", "email", "profile"],
      },
      host_permissions: [
        "<all_urls>",
        "https://*/*", // 允许访问HTTPS网站
        "http://localhost:*", // 允许访问localhost
        "https://www.googleapis.com/*",
        "https://oauth2.googleapis.com/*",
        "https://accounts.google.com/*",
        "https://*.googleusercontent.com/*",
      ],
      ...(isTest
        ? {
            key: KEY,
          }
        : {}),
    };
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
