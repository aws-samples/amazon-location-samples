import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      './runtimeConfig': './runtimeConfig.browser',
    },
  },
  define: {
    'window.global': {}
  },
  build: {
    target: 'esnext'
  },
  server: {
    host: true,
    port: 8080,
  },
})