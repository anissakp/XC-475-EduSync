import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5173,
    strictPort: true, // Vite will throw an error if the port is already in use
  },
  plugins: [react()],
})
