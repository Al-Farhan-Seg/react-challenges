import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/react-practice/07-movie-search/',
  plugins: [react(), tailwindcss()],
})
