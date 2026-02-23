/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2D5A27',
          light: '#4A7C44',
          dark: '#1E3D1A',
        },
        secondary: '#3B82F6',
        accent: '#D4A574',
        background: '#F8F6F1',
        surface: '#FFFFFF',
      },
      fontFamily: {
        heading: ['Nunito', 'sans-serif'],
        body: ['Open Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
