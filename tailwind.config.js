/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Professional dark mode palette
        background: '#0F1419',
        surface: '#1A1F28',
        'surface-secondary': '#242A35',
        border: '#3A414D',
        'text-primary': '#E8EAED',
        'text-secondary': '#9CA3AF',
        'text-muted': '#6B7280',
        // Minimal controlled accents
        primary: '#2563EB', // Professional blue
        secondary: '#7C3AED', // Subtle purple
        accent: '#EC4899', // Restrained pink (used sparingly)
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        // Glow effects (minimal, professional)
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
      },
      boxShadow: {
        'sm-elevation': '0 2px 8px rgba(0, 0, 0, 0.3)',
        'md-elevation': '0 4px 16px rgba(0, 0, 0, 0.4)',
        'lg-elevation': '0 12px 32px rgba(0, 0, 0, 0.5)',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#E8EAED',
            a: {
              color: '#2563EB',
              '&:hover': {
                color: '#1E40AF',
              },
            },
          },
        },
      },
    },
  },
  plugins: [],
}
