import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves this repo from /portfolio/, not the domain root.
  // Vercel/Netlify serve from the root, so this stays commented out while
  // deployed there. Uncomment (and set to your repo name) only if you
  // switch to GitHub Pages instead.
  // base: '/portfolio/',
})
