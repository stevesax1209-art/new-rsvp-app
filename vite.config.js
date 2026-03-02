import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/new-rsvp-app/',
  server: {
    proxy: {
      // In development, proxy /api/rsvp to Firebase emulator (port 5001)
      // Adjust the target URL to match your Firebase project ID and region
      '/api': {
        target: 'http://localhost:5173/new-rsvp-app/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
