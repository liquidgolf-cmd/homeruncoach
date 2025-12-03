import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // For GitHub Pages deployment, use repository name as base
  // For local dev (vite dev), use root path
  // For local preview (vite preview), use the same base as production
  const isDev = command === 'serve'
  const base = isDev ? '/' : '/homeruncoach/'
  
  return {
    plugins: [react()],
    base,
  }
})

