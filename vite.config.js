import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// vercel.json and .htaccess are in the public folder
// Vite automatically copies all files from public/ to dist/ during build
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['heic2any', 'browser-image-compression'],
  },
})
