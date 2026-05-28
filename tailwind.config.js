/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fdf9ee',
          100: '#f9f0d0',
          200: '#f2de9e',
          300: '#e8c96a',
          400: '#dfb63d',
          500: '#c9982a',
          600: '#a97820',
          700: '#86591c',
          800: '#6e471e',
          900: '#5e3c1d',
        },
        cream: '#f5f0e8',
        dark: '#1a1208',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
