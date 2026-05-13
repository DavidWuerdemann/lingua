import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // 'prompt' = show our own toast instead of auto-swapping the SW
      registerType: 'prompt',

      manifest: {
        id:               '/',
        name:             'Lingua',
        short_name:       'Lingua',
        description:      'Learn to speak, not just study.',
        start_url:        '/',
        scope:            '/',
        display:          'standalone',
        display_override: ['window-controls-overlay', 'standalone'],
        orientation:      'any',
        theme_color:      '#0F1B2D',
        background_color: '#0F1B2D',
        lang:             'en',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },

      workbox: {
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          // Google Fonts — cache-first, 1 year
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler:    'CacheFirst',
            options: {
              cacheName:  'google-fonts-css',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler:    'CacheFirst',
            options: {
              cacheName:  'google-fonts-files',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          // /api/* — network first so AI calls always hit the server
          {
            urlPattern: /^\/api\/.*/i,
            handler:    'NetworkOnly',
          },
        ],
      },
    }),
  ],
})
