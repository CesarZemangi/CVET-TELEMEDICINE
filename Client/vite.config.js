import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src'),
    },
  },
server: {
host: true,
allowedHosts: [
'uncomical-winfred-unwealthy.ngrok-free.dev'
],
proxy: {
'/api': {
target: 'http://localhost:5000',
changeOrigin: true,
secure: false
}
}
}
})
