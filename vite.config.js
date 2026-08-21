import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/partner/',

  plugins: [
    tailwindcss(),
  ],

  build: {
    chunkSizeWarningLimit: 29000,
  },
})
