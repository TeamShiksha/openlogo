import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import process from "process";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    server: {
      host: true,
      port: 8080,
      allowedHosts: [".openlogo.fyi"],
    },
    define: {
      "process.env.VITE_BASE_URL":
        env.VITE_BASE_URL || process.env.VITE_BASE_URL,
    },
  };
});
