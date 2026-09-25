import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Served from GitHub Pages at https://meghalayamun.in/
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
})
