/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // 'class' strategy — ThemeContext adds .dark / .light to <html>
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── Background levels — driven by CSS variables ──
        level: {
          0: 'var(--color-level-0)',
          1: 'var(--color-level-1)',
          2: 'var(--color-level-2)',
          3: 'var(--color-level-3)',
          4: 'var(--color-level-4)',
          5: 'var(--color-level-5)',
        },

        // ── Accent palettes — driven by CSS variables ──
        blue: {
          50:  '#EFF6FF',
          100: '#DBEAFE',
          300: '#93C5FD',
          400: 'var(--color-blue-400)',
          500: 'var(--color-blue-500)',
          600: 'var(--color-blue-600)',
          700: 'var(--color-blue-700)',
          900: '#1E3A5F',
        },
        amber: {
          300: '#FCD34D',
          400: 'var(--color-amber-400)',
          500: 'var(--color-amber-500)',
          600: '#D97706',
        },
        green: {
          400: 'var(--color-green-400)',
          500: 'var(--color-green-500)',
          600: '#059669',
        },
        red: {
          300: '#F87171',
          400: 'var(--color-red-400)',
          500: 'var(--color-red-500)',
          600: '#DC2626',
          900: '#7F1D1D',
        },
        purple: {
          500: 'var(--color-purple-500)',
          600: '#7C3AED',
        },

        // ── Semantic text colours ──
        'text-primary':   'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted':     'var(--color-text-muted)',
        'text-faint':     'var(--color-text-faint)',

        // ── Gray scale (static — used for fine-grained overrides) ──
        gray: {
          50:  '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },

      spacing: {
        'space-1':  '4px',
        'space-2':  '8px',
        'space-3':  '12px',
        'space-4':  '16px',
        'space-5':  '24px',
        'space-6':  '32px',
        'space-7':  '48px',
        'space-8':  '64px',
        'space-9':  '96px',
        'space-10': '128px',
      },

      fontFamily: {
        sans:  ['Inter', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        mono:  ['JetBrains Mono', 'monospace'],
      },

      fontSize: {
        'display-2xl': ['72px', { lineHeight: '80px',  fontWeight: '800' }],
        'display-xl':  ['56px', { lineHeight: '64px',  fontWeight: '800' }],
        'display-lg':  ['48px', { lineHeight: '56px',  fontWeight: '700' }],
        'display-md':  ['36px', { lineHeight: '44px',  fontWeight: '700' }],
        'display-sm':  ['30px', { lineHeight: '38px',  fontWeight: '600' }],
        'text-xl':     ['20px', { lineHeight: '28px',  fontWeight: '600' }],
        'text-lg':     ['18px', { lineHeight: '26px',  fontWeight: '500' }],
        'text-md':     ['16px', { lineHeight: '24px',  fontWeight: '400' }],
        'text-sm':     ['14px', { lineHeight: '20px',  fontWeight: '400' }],
        'text-xs':     ['12px', { lineHeight: '16px',  fontWeight: '500' }],
        'mono-lg':     ['24px', { lineHeight: '28px',  fontWeight: '600', fontFamily: 'JetBrains Mono' }],
        'mono-md':     ['18px', { lineHeight: '22px',  fontWeight: '600', fontFamily: 'JetBrains Mono' }],
        'mono-sm':     ['14px', { lineHeight: '18px',  fontWeight: '400', fontFamily: 'JetBrains Mono' }],
      },

      borderRadius: {
        sm:   '4px',
        md:   '8px',
        lg:   '12px',
        xl:   '16px',
        '2xl':'24px',
        full: '9999px',
      },

      borderColor: {
        subtle:     'var(--color-border-subtle)',
        default:    'var(--color-border-default)',
        strong:     'var(--color-border-strong)',
        blue:       'rgba(59,130,246,0.4)',
        amber:      'rgba(245,158,11,0.35)',
        red:        'rgba(239,68,68,0.4)',
        'glow-blue':'rgba(59,130,246,0.6)',
      },

      boxShadow: {
        'blue-glow':      'var(--shadow-blue-glow)',
        'amber-glow':     '0 0 20px rgba(245,158,11,0.20)',
        'red-glow':       'var(--shadow-red-glow)',
        'green-glow':     '0 0 12px rgba(16,185,129,0.20)',
        'blue-glow-soft': '0 0 0 3px rgba(59,130,246,0.15)',
        'card-mockup':    'var(--shadow-card-lg)',
        'card':           'var(--shadow-card)',
      },

      animation: {
        'ping-slow':     'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        'pulse-slow':    'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-custom':  'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-custom':   'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'shimmer':       'shimmer 2s infinite',
      },

      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200px' },
          '100%': { backgroundPosition: 'calc(200px + 100%)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.5' },
        },
        ping: {
          '0%':        { transform: 'scale(1)', opacity: '1' },
          '75%, 100%': { transform: 'scale(2)', opacity: '0' },
        },
      },

      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
