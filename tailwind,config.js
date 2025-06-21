/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}", // Updated for App Router
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ['var(--font-inter)'], // Use CSS variable from layout
        },
        animation: {
          'fade-in': 'fade-in 0.5s ease-out forwards',
        },
        keyframes: {
          'fade-in': {
            'from': { opacity: '0', transform: 'translateY(10px)' },
            'to': { opacity: '1', transform: 'translateY(0)' },
          },
        },
      },
    },
    plugins: [],
  }
  