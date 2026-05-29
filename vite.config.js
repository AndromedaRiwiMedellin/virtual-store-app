import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'orbix-icon-192.png', 'orbix-icon-512.png', 'orbix-maskable-512.png'],
      manifest: {
        name: 'OrbiX Eventos',
        short_name: 'OrbiX',
        description: 'Consulta eventos, disponibilidad y compra entradas desde OrbiX.',
        lang: 'es',
        theme_color: '#001A6E',
        background_color: '#001A6E',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/orbix-icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/orbix-icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/orbix-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        navigateFallback: '/',
        runtimeCaching: [
          {
            urlPattern: ({ url }) => (url.origin === 'https://service.andromeda.andrescortes.dev' || url.origin === self.location.origin)
              && url.pathname.includes('/events'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'orbix-events',
              expiration: {
                maxEntries: 40,
                maxAgeSeconds: 60 * 30
              },
              networkTimeoutSeconds: 6
            }
          }
        ]
      }
    })
  ],
  server: {
    port: 5173,
    strictPort: false,
    proxy: {
      '/api': {
        target: 'https://service.andromeda.andrescortes.dev',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  preview: {
    port: 4173
  }
});
