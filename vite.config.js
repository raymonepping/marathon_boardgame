import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Set base to '/' for local dev, or '/marathon_boardgame/' for GitHub Pages
  base: process.env.GITHUB_ACTIONS ? '/marathon_boardgame/' : '/',
  assetsInclude: ['**/*.json'],
  resolve: {
    alias: {
      '@': '/src',
      '@config': '/config'
    }
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom']
        }
      }
    }
  }
})

// Made with Bob
