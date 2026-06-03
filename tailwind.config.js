/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#F0F4F9',
          100: '#D9E2EF',
          200: '#B3C5DF',
          300: '#7B98BF',
          400: '#4A6E9E',
          500: '#2A4F7E',
          600: '#1A3D6B',
          700: '#0F2A4A',
          800: '#0A1F38',
          900: '#061425',
        },
        accent: {
          400: '#6B9DC9',
          500: '#4A85B8',
          600: '#356BA0',
        },
        neutral: {
          50:  '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
        success: '#16A34A',
        warning: '#D97706',
        danger:  '#DC2626',
        info:    '#0284C7',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'xs':   ['0.75rem',  { lineHeight: '1rem' }],
        'sm':   ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem',     { lineHeight: '1.5rem' }],
        'lg':   ['1.125rem', { lineHeight: '1.75rem' }],
        'xl':   ['1.25rem',  { lineHeight: '1.75rem' }],
        '2xl':  ['1.5rem',   { lineHeight: '2rem' }],
        '3xl':  ['1.875rem', { lineHeight: '2.25rem' }],
      },
      boxShadow: {
        'card':       '0 1px 3px 0 rgba(15, 42, 74, 0.08)',
        'card-hover': '0 4px 12px 0 rgba(15, 42, 74, 0.12)',
        'dropdown':   '0 10px 25px -5px rgba(15, 42, 74, 0.15)',
      },
      borderRadius: {
        'card': '0.5rem',
        'btn':  '0.375rem',
      },
    },
  },
  plugins: [],
};
