import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Served from GitHub Pages at /meghalaya-mun/
export default defineConfig({
  base: '/meghalaya-mun/',
  plugins: [react(), tailwindcss()],
})
