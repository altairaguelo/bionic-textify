import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  //testing backend functionality, works!
  //if don't do this, client side uses localhost:5173 / client side port, doesnt
  //have /api route so defaulted to index.html, which grabs non json format/errors
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    }
  },
  plugins: [
    react(),
    tailwindcss()
  ],
})
