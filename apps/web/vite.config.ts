import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimización de chunks
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks - librerías grandes separadas
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'i18n': ['i18next', 'react-i18next'],
          'ui': ['lucide-react', 'clsx', 'tailwind-merge'],
        },
      },
    },
    // Reducir tamaño de chunks
    chunkSizeWarningLimit: 500,
    // Minificación con esbuild (más rápido)
    minify: 'esbuild',
    // Optimización de assets
    assetsInlineLimit: 4096, // Inline assets < 4kb como base64
    // Source maps solo en desarrollo
    sourcemap: false,
  },
  // Optimización del servidor de desarrollo
  server: {
    port: 5173,
    host: true,
    proxy: {
      // Permite usar el fallback default del frontend: `VITE_API_URL || '/api'`
      // sin configurar CORS en dev.
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  // Pre-bundling de dependencias
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'i18next', 'react-i18next'],
  },
})
