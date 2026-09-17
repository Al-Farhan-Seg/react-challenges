import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Tailwind CSS v4 runs as a Vite plugin. There is no tailwind.config.js and
// no postcss.config.js: the plugin finds the classes used in this workspace
// and compiles only those into the CSS bundle during `npm run build`.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Cloudflare Pages serves this folder as plain static files.
    outDir: 'dist',
  },
  server: {
    port: 5050
  }
})
