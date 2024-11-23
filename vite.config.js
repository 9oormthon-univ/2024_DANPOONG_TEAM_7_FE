// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
 plugins: [
   react(),
   VitePWA({
     registerType: 'autoUpdate',
     manifest: {
       name: 'Soenter',
       short_name: 'Soenter',
       start_url: '/',
       display: 'standalone',
       background_color: '#ffffff',
       theme_color: '#000000',
       icons: [
         {
           src: '/icon-192x192.png',
           sizes: '192x192',
           type: 'image/png',
           purpose: 'any maskable'
         },
         {
           src: '/icon-512x512.png',
           sizes: '512x512',
           type: 'image/png',
           purpose: 'any maskable'
         }
       ]
     },
     workbox: {
       maximumFileSizeToCacheInBytes: 3000000,
       cleanupOutdatedCaches: true,
       globPatterns: [
         '**/*.{js,css,html,ico,png,svg,json}'
       ],
       navigateFallback: '/index.html',
       skipWaiting: true,
       clientsClaim: true,
       navigateFallbackDenylist: [/^\/api\//],
       runtimeCaching: []
     },
     devOptions: {
       enabled: false
     }
   })
 ],
 build: {
   rollupOptions: {
     external: ['lottie-web'],
     output: {
       globals: {
         'lottie-web': 'lottie'
       }
     }
   }
 },
 optimizeDeps: {
   exclude: ['lottie-web']
 }
})