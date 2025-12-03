import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Use root path for local development, subpath for GitHub Pages
  const base = mode === 'production' ? '/homeruncoach/' : '/'
  
  return {
    plugins: [react()],
    base,
  }
})

