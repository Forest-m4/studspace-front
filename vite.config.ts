import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return {
    // Relative asset paths: VK hosting serves the build from a nested path
    base: './',
    plugins: [react()],
    // Inline config stops Vite from picking up a PostCSS config from parent folders
    css: { postcss: { plugins: [] } },
    server: {
      proxy: {
        // The backend has no CORS, so dev requests stay on the same origin
        '/api/v1': { target: env.VITE_API_PROXY_TARGET, changeOrigin: true },
      },
    },
  }
})
