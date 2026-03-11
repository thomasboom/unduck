import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  server: {
    proxy: {
      "/api/suggest": {
        target: "https://duckduckgo.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/suggest/, "/ac/"),
      },
    },
  },
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
    }),
  ],
});
