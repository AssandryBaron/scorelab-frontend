import { defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
  
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  server: {
    proxy: {
      // Cuando en tu código de React hagas una petición a '/api/...'
      // Vite la redirigirá automáticamente a tu Spring Boot
      '/api': {
        target: 'http://localhost:8080', 
        changeOrigin: true,
        // Esto quita el prefijo '/api' antes de enviarlo al back 
        // (Quítalo si tus rutas de Spring Boot ya empiezan con /api)
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
