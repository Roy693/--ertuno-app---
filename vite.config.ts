import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          framer: ['framer-motion'],
          lucide: ['lucide-react'],
        },
      },
    },
  },
  server: {
    port: 3000,
    host: true,
    allowedHosts: ['3000-ivm8bvzlotn46kj7hcy56-6532622b.e2b.dev'],
  },
  preview: {
    port: 3000,
    host: true,
  },
})