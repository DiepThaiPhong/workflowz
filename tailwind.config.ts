import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Primary: #92e600 (lime-electric green) ──────────────────────────
        primary: {
          DEFAULT: '#92e600',
          50:  '#f4fde6',
          100: '#e6f9c0',
          200: '#d0f587',
          300: '#b8ee4a',
          400: '#a2e31a',
          500: '#92e600',
          600: '#74b800',
          700: '#578a00',
          800: '#3a5c00',
          900: '#1d2e00',
        },
        // ── Dark background: #0b0f0c ────────────────────────────────────────
        surface: {
          light: '#f4fde6',
          dark:  '#0b0f0c',
        },
        dark: {
          DEFAULT: '#0b0f0c',
          50:  '#1a2119',
          100: '#131a12',
          200: '#0e150d',
          300: '#0b0f0c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Be Vietnam Pro', 'system-ui', 'sans-serif'],
        display: ['Be Vietnam Pro', 'Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':       { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: { xs: '2px' },
      boxShadow: {
        glass:        '0 8px 32px 0 rgba(146, 230, 0, 0.08)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
        'glow-green': '0 0 20px rgba(146, 230, 0, 0.45)',
        'glow-sm':    '0 0 10px rgba(146, 230, 0, 0.3)',
      },
    },
  },
  plugins: [],
}

export default config
