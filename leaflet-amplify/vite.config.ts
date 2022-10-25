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
    target: 'esnext',
    commonjsOptions: {
      ignoreDynamicRequires: true
    }
  },
  server: {
    host: true,
    port: 8080,
  }
})
