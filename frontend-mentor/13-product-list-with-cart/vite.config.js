import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/frontend-mentor/13-product-list-with-cart/',
  plugins: [react(), tailwindcss()],
})
