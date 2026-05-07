/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
        purple: {
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
        },
        pink: {
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
        },
      },
      boxShadow: {
        'cyan': '0 0 20px rgba(34, 211, 238, 0.5)',
        'purple': '0 0 20px rgba(168, 85, 247, 0.5)',
        'pink': '0 0 20px rgba(236, 72, 153, 0.5)',
      },
    },
  },
  plugins: [],
}
