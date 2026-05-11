import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { refreshIlloPlugin } from './plugins/refreshIllo.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load .env.local so ANTHROPIC_API_KEY is available to the plugin
  const env = loadEnv(mode, process.cwd(), '')
  if (env.ANTHROPIC_API_KEY) process.env.ANTHROPIC_API_KEY = env.ANTHROPIC_API_KEY

  return {
    plugins: [
      react(),
      // Dev-only: AI illustration refresh endpoint
      mode !== 'production' && refreshIlloPlugin(),
    ].filter(Boolean),
    // Use the GitHub Pages sub-path only for production builds.
    // Dev server runs at localhost:5173/ without the prefix.
    base: mode === 'production' ? '/ux-library-docs/' : '/',
    optimizeDeps: {
      include: ['@tomtom-international/web-sdk-maps'],
    },
  }
})
