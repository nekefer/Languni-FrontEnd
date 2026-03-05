import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {tanstackRouter} from '@tanstack/router-plugin/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [tanstackRouter(), react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-router': ['@tanstack/react-router'],
          'vendor-i18n': ['react-i18next', 'i18next', 'i18next-browser-languagedetector'],
          'vendor-ui': ['axios', 'zustand', 'sonner'],
          'vendor-icons': ['lucide-react'],
          'vendor-misc': ['react-window'],
        },
      },
    },
  },
})
