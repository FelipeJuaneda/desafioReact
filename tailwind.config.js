/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      "verde-lindo": "#198754",
      spacing: {
        '128': '32rem',
      },
      screens: {
        '1024': { 'raw': '(max-width: 1024px)' },
        '550': { 'raw': '(max-width: 550px)' },
        '580': { 'raw': '(max-width: 580px)' },
      }
    },
    fontFamily:{
      "cineFontFamily": ["'Raleway', sans-serif"]
    }
    
  },
  plugins: [],
};
