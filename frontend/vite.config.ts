import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa';



export default defineConfig({
  plugins: [react(), 
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate', 
      devOptions: {
        enabled: true, 
      },
      manifest: {
        name: 'TaskFlow',
        description: 'A React app with PWA features',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'img/Square150x150Logo.scale-400.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'img/Square150x150Logo.scale-400.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),],
})
