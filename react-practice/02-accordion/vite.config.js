import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// `base` must match this challenge's folder path. The whole repository is
// deployed as one site, so this app is served from a subfolder rather than
// from the root. Without it, the built asset URLs would 404.
export default defineConfig({
  base: '/react-practice/02-accordion/',
  plugins: [react(), tailwindcss()],
})
