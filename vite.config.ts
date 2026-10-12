import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: { exclude: ["nepali-calendar"] },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "nepali-calendar": path.resolve(
        __dirname,
        "packages/nepali-calendar/index.ts",
      ),
    },
  },
  server: {
    host: true,
    port: 5173,
    allowedHosts: [".localhost"],
  },
});
