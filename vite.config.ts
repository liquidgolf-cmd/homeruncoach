import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  // Determine base path based on environment
  // - Vercel: use root path '/' (set VITE_BASE_PATH=/ in vercel.json)
  // - GitHub Pages: use '/homeruncoach/' (set VITE_BASE_PATH=/homeruncoach/ in workflow)
  // - Local dev: use root path '/'
  // - Can be overridden with VITE_BASE_PATH env variable
  const isDev = command === 'serve'
  const envBasePath = process.env.VITE_BASE_PATH
  
  let base = '/'
  if (envBasePath) {
    base = envBasePath
  } else if (!isDev) {
    // Default production build for GitHub Pages
    base = '/homeruncoach/'
  }
  
  return {
    plugins: [react()],
    base,
  }
})

