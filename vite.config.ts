import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.png",
        "favicon-16x16.png",
        "apple-touch-icon-180x180.png",
        "apple-touch-icon-167x167.png",
        "apple-touch-icon-152x152.png",
        "placeholder.svg",
        "robots.txt",
      ],
      manifest: {
        id: "/",
        name: "טיימר אליאס",
        short_name: "טיימר אליאס",
        description: "טיימר דיגיטלי למשחק אליאס",
        theme_color: "#e63946",
        background_color: "#e63946",
        display: "standalone",
        scope: "/",
        start_url: "/",
        orientation: "portrait",
        lang: "he",
        dir: "rtl",
        icons: [
          { src: "/pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "/pwa-512x512.png", sizes: "512x512", type: "image/png" },
          {
            src: "/pwa-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
