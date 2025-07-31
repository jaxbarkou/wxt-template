import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  modules: ["@wxt-dev/module-react"],
  manifest: {
    side_panel: {
      default_path: "sidepanel.html", // Points to your side panel HTML
    },
    permissions: [
      "sidePanel", // Required permission for side panels
    ],
    host_permissions: ["<all_urls>"],
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
});
