import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // Use the GitHub Pages sub-path only for production builds.
  // Dev server runs at localhost:5173/ without the prefix.
  base: mode === 'production' ? '/ux-library-docs/' : '/',
  optimizeDeps: {
    include: ['@tomtom-international/web-sdk-maps'],
  },
}))
