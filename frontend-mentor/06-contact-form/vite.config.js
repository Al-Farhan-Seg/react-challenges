import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/frontend-mentor/06-contact-form/',
  plugins: [react(), tailwindcss()],
})
