// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  server: {
    port: 5173,
    strictPort: true, // Vite will throw an error if the port is already in use
  },
  plugins: [react()],
})
