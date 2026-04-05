import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
  ],
  build: {
    sourcemap: false, // disables source map reading
  },
  server: {
    host: '0.0.0.0',
    port: 5174, // Or any other port you're using
  },
})
