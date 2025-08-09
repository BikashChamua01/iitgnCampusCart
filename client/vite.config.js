import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

// Polyfill for __dirname in ES module environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode (dev/prod)
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    server: {
      proxy: {
        // Use VITE_API_URL from .env files, fallback to localhost
        "/api": env.VITE_API_URL || "http://localhost:5000",
      },
    },
    define: {
      // Makes API URL available globally as __API_URL__
      __API_URL__: JSON.stringify(env.VITE_API_URL || "http://localhost:5000"),
    },
    variants: {
      extend: {
        display: ["focus-group"],
      },
    },
  };
});
