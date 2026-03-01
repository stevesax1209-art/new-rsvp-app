import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // In development, proxy /api/rsvp to Firebase emulator (port 5001)
      // Adjust the target URL to match your Firebase project ID and region
      '/api': {
        target: 'http://127.0.0.1:5001/rsvp/us-central1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
