import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/DAC-202-codes/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  define: {
    'global': 'window',
  }
})