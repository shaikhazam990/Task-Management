/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Cabinet Grotesk', 'sans-serif'],
        body: ['Instrument Sans', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },
      colors: {
        // Dark theme
        void: '#080810',
        surface: '#0d0d1a',
        elevated: '#12121f',
        border: '#1e1e30',
        muted: '#2a2a40',
        // Accent
        iris: {
          50: '#f0efff',
          100: '#e4e2ff',
          200: '#ccc8ff',
          300: '#a9a3ff',
          400: '#8075ff',
          500: '#6246ff',
          600: '#5534f5',
          700: '#4a27e1',
          800: '#3d21b8',
          900: '#341f91',
        },
        // Status colors
        todo: '#64748b',
        progress: '#f59e0b',
        done: '#10b981',
        // Priority
        p1: '#ef4444',
        p2: '#f97316',
        p3: '#eab308',
        p4: '#64748b',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-right': 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'shimmer': 'shimmer 1.5s infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideInRight: { from: { opacity: 0, transform: 'translateX(16px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
        scaleIn: { from: { opacity: 0, transform: 'scale(0.95)' }, to: { opacity: 1, transform: 'scale(1)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        pulseGlow: { '0%, 100%': { boxShadow: '0 0 0 0 rgba(98, 70, 255, 0)' }, '50%': { boxShadow: '0 0 20px 4px rgba(98, 70, 255, 0.3)' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'glow': '0 0 30px rgba(98, 70, 255, 0.15)',
        'glow-sm': '0 0 12px rgba(98, 70, 255, 0.12)',
        'card': '0 1px 3px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.3)',
        'modal': '0 24px 80px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
};
