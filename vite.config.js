import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { refreshIlloPlugin } from './plugins/refreshIllo.js'
import { mcpChatPlugin }     from './plugins/mcpChatPlugin.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load .env.local so ANTHROPIC_API_KEY is available to the plugin
  const env = loadEnv(mode, process.cwd(), '')
  if (env.ANTHROPIC_API_KEY) process.env.ANTHROPIC_API_KEY = env.ANTHROPIC_API_KEY
  if (env.TOMTOM_API_KEY)    process.env.TOMTOM_API_KEY    = env.TOMTOM_API_KEY

  return {
    plugins: [
      react(),
      // Dev-only: AI illustration refresh endpoint
      mode !== 'production' && refreshIlloPlugin(),
      // Dev-only: MCP chat endpoint (POST /api/mcp-chat)
      mode !== 'production' && mcpChatPlugin(),
    ].filter(Boolean),
    // Use the GitHub Pages sub-path only for production builds.
    // Dev server runs at localhost:5173/ without the prefix.
    base: mode === 'production' ? '/ux-library-docs/' : '/',
    optimizeDeps: {
      include: ['@tomtom-international/web-sdk-maps'],
    },
  }
})
