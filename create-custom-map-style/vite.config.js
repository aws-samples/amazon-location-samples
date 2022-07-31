import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/** @type {import('vite').UserConfig} */
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "./runtimeConfig": "./runtimeConfig.browser" } },
  server: {
    host: true,
    port: 8080,
  },
});
