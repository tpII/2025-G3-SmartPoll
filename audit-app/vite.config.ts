import path from 'path'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");


  const API_URL = env.VITE_API_URL || 'http://localhost:8080'
  const QR_API_URL = env.VITE_QR_API_URL || 'http://localhost:3001'
  
  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/qr-api': {
          target: QR_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/qr-api/, '/api'),
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
