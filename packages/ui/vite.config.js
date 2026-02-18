import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import process from "process";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",

        manifest: {
          id: "/",
          name: "openlogo",
          short_name: "openlogo",
          start_url: "/",
          display: "standalone",
          background_color: "#ffffff",
          theme_color: "#0f172a",
          icons: [
            {
              src: "/pwa/icons/android-launchericon-192-192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "/pwa/icons/android-launchericon-512-512.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
          screenshots: [
            {
              src: "/pwa/screenshots/mobile_screenshot.png",
              sizes: "390x844",
              type: "image/png",
              form_factor: "narrow",
            },
            {
              src: "/pwa/screenshots/desktop_screenshot.png",
              sizes: "1366x768",
              type: "image/png",
              form_factor: "wide",
            },
          ],
        },

        workbox: {
          globPatterns: [],

          runtimeCaching: [
            {
              urlPattern: ({ url }) => url.pathname.startsWith("/api/"),
              handler: "NetworkOnly",
            },

            {
              urlPattern: ({ request }) => request.mode === "navigate",
              handler: "NetworkFirst",
            },

            {
              urlPattern: ({ request }) => request.destination === "style",
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "style-cache",
              },
            },

            {
              urlPattern: ({ request }) => request.destination === "image",
              handler: "CacheFirst",
              options: {
                cacheName: "image-cache",
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
              },
            },
          ],
        },
      }),
    ],
    server: {
      host: true,
      port: 8080,
      allowedHosts: [".openlogo.fyi"],
    },
    define: {
      "process.env.API_BASE_URL":
        JSON.stringify(env.API_BASE_URL) || process.env.API_BASE_URL,
    },
  };
});
