import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves this repo from /portfolio/, not the domain root.
  // Vercel/Netlify serve from the root — if you deploy there instead,
  // comment this line back out (or delete it).
  base: '/portfolio/',
})
