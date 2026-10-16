import { defineConfig } from 'vite'
import process from 'node:process'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: { proxy: { '/api': { target: process.env.PORTFOLIO_API_PROXY || 'http://127.0.0.1:5000', changeOrigin: true } } },
  plugins: [
    react(),
    tailwindcss(),
  ],
})
