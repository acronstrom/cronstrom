import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    define: {
      // Make env vars available for HTML replacement
      'import.meta.env.VITE_UMAMI_WEBSITE_ID': JSON.stringify(env.VITE_UMAMI_WEBSITE_ID || ''),
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://localhost:5001',
          changeOrigin: true
        },
        '/uploads': {
          target: 'http://localhost:5001',
          changeOrigin: true
        }
      }
    }
  }
})
