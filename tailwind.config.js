/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'lime': {
          300: '#bef264',
          400: '#a3e635',
        },
        'slate': {
          50: '#f8fafc',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        'emerald': {
          300: '#6ee7b7',
          500: '#10b981',
        },
      },
    },
  },
  plugins: [],
}

