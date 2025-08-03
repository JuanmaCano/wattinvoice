import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  optimizeDeps: {
    exclude: ["server"],
  },
  build: {
    rollupOptions: {
      external: [
        // Excluir módulos de Node.js
        "url",
        "path",
        "dotenv",
        // Excluir archivos del servidor
        /^server\//,
      ],
    },
  },
  resolve: {
    alias: {
      // Asegurarnos de que las importaciones de api/ apunten al servidor
      "@api": resolve(__dirname, "server/api"),
    },
  },
});
