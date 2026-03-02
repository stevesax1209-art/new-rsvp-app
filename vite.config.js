import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/new-rsvp-app/',
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5001/rsvp-72da3/us-central1',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  }
})
