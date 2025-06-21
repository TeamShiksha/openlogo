import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import process from "process";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    server: {
      host: true,
      port: 3000,
    },
    define: {
      "process.env.VITE_BASE_URL": JSON.stringify(env.VITE_BASE_URL),
    },
  };
});
