import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // In dev, forward /api calls to `wrangler dev` (npm run dev at the repo root).
    proxy: {
      '/api': 'http://127.0.0.1:8787',
    },
  },
})
