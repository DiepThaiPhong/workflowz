import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      // ── Color System ───────────────────────────────────────────────────────
      colors: {
        // Background colors
        'bg-primary': '#0b0f0c',
        'bg-secondary': '#121814',
        'bg-card': '#161d19',
        'bg-card-hover': '#1c2621',
        'bg-elevated': '#212c26',
        'bg-input': '#101612',

        // Primary accent (lime green)
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
          light: '#b3f244',
          glow: 'rgba(146, 230, 0, 0.25)',
        },

        // Accent colors
        teal: {
          DEFAULT: '#14b8a6',
          light: '#5eead4',
          glow: 'rgba(20, 184, 166, 0.20)',
        },
        blue: {
          DEFAULT: '#a2f518',
          glow: 'rgba(162, 245, 24, 0.20)',
        },
        orange: '#f59e0b',
        pink: '#ec4899',
        green: '#22c55e',
        red: '#ef4444',

        // Text colors
        'text-primary': '#f1f5f9',
        'text-secondary': '#94a3b8',
        'text-muted': '#64748b',
        'text-accent': '#b3f244',
        'text-on-accent': '#ffffff',

        // Surface
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

      // ── Typography ─────────────────────────────────────────────────────────
      fontFamily: {
        sans: ['Inter', 'Be Vietnam Pro', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Be Vietnam Pro', 'Inter', 'sans-serif'],
      },
      fontSize: {
        'xs':   ['0.75rem', { lineHeight: '1.6' }],    // 12px
        'sm':   ['0.8125rem', { lineHeight: '1.6' }],  // 13px
        'base': ['0.9375rem', { lineHeight: '1.6' }],  // 15px
        'md':   ['1.0625rem', { lineHeight: '1.6' }],  // 17px
        'lg':   ['1.25rem', { lineHeight: '1.4' }],    // 20px
        'xl':   ['1.5rem', { lineHeight: '1.3' }],     // 24px
        '2xl':  ['2rem', { lineHeight: '1.2' }],       // 32px
        '3xl':  ['2.5rem', { lineHeight: '1.2' }],     // 40px
        '4xl':  ['3.25rem', { lineHeight: '1.1' }],    // 52px
      },

      // ── Spacing ────────────────────────────────────────────────────────────
      spacing: {
        '4.5': '18px',
        '13': '52px',
        '15': '60px',
        '18': '72px',
        '22': '88px',
      },

      // ── Border Radius ──────────────────────────────────────────────────────
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
      },

      // ── Box Shadows ────────────────────────────────────────────────────────
      boxShadow: {
        'sm': '0 2px 8px rgba(0,0,0,0.15)',
        'md': '0 8px 24px rgba(0,0,0,0.25)',
        'lg': '0 16px 48px rgba(0,0,0,0.35)',
        'glow': '0 0 40px rgba(146, 230, 0, 0.15)',
        'glow-green': '0 0 20px rgba(146, 230, 0, 0.45)',
        'glow-sm': '0 0 10px rgba(146, 230, 0, 0.3)',
        'glass': '0 8px 32px 0 rgba(146, 230, 0, 0.08)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
      },

      // ── Border Colors ──────────────────────────────────────────────────────
      borderColor: {
        'subtle': 'rgba(148, 163, 184, 0.08)',
        'default': 'rgba(148, 163, 184, 0.12)',
        'hover': 'rgba(146, 230, 0, 0.35)',
        'focus': 'rgba(146, 230, 0, 0.6)',
      },

      // ── Animation ──────────────────────────────────────────────────────────
      animation: {
        'fade-in': 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-right': 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'none' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to:   { opacity: '1', transform: 'none' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':       { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },

      // ── Backdrop Blur ──────────────────────────────────────────────────────
      backdropBlur: {
        xs: '2px',
      },

      // ── Layout Dimensions ──────────────────────────────────────────────────
      height: {
        'nav': '64px',
      },
      width: {
        'sidebar': '280px',
        'content-max': '1280px',
      },
      maxWidth: {
        'content': '1280px',
      },

      // ── Gradients (as utilities) ───────────────────────────────────────────
      backgroundImage: {
        'grad-hero': 'linear-gradient(135deg, #92e600 0%, #a2f518 50%, #92e600 100%)',
        'grad-card': 'linear-gradient(145deg, #161d19 0%, #212c26 100%)',
        'grad-accent': 'linear-gradient(135deg, #92e600 0%, #74b800 100%)',
        'grad-warm': 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
        'grad-cool': 'linear-gradient(135deg, #92e600 0%, #a2f518 100%)',
        'grad-glass': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
      },
    },
  },
  plugins: [],
}

export default config
