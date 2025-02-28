import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/", // Ensure correct base path
  plugins: [react(), tailwindcss()],
  server: {
    historyApiFallback: true, // Fix for Vercel route refresh issue
  },
});
