import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => ({
  base:
    mode === 'vercel'
      ? '/'
      : '/dev-challenges/01-simple-coffee-listing/',
  plugins: [react(), tailwindcss()],
}))