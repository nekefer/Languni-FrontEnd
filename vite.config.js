import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {tanstackRouter} from '@tanstack/router-plugin/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [tanstackRouter(), react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('posthog'))                         return 'vendor-analytics';
          if (id.includes('lucide-react'))                    return 'vendor-icons';
          if (id.includes('i18next') || id.includes('react-i18next')) return 'vendor-i18n';
          if (id.includes('@tanstack/react-router'))          return 'vendor-router';
          if (id.includes('react-helmet-async'))              return 'vendor-seo';
          if (id.includes('axios') || id.includes('zustand') || id.includes('sonner')) return 'vendor-ui';
          if (id.includes('react-window'))                    return 'vendor-misc';
          if (id.includes('react-dom') || id.includes('/react/')) return 'vendor-react';
        },
      },
    },
  },
})
