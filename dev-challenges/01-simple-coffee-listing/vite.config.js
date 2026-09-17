import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/dev-challenges/01-simple-coffee-listing',
  plugins: [react(), tailwindcss()],
})
