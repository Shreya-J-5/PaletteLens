/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        cursive: ['Caveat', 'cursive'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      colors: {
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          900: '#4c1d95',
        },
        studio: {
          bg: '#0C0D0E',
          card: '#16171B',
          hover: '#1E2026',
          border: '#262830',
          muted: '#9CA3AF'
        }
      }
    },
  },
  plugins: [],
}
