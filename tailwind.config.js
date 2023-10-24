/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "verde-principal-700": "#198754",
        "verde-principal-600": "#19a061",
        "verde-principal-500": "#25c279",
        "verde-principal-400": "#4ddb98",
        "verde-principal-300": "#88edbd",
        "verde-principal-200": "#bcf6d9",
        "verde-principal-50": "#f0fdf6",
      },
      spacing: {
        128: "32rem",
      },
      fontFamily: {
        cineFontFamily: ["'Raleway', sans-serif"],
      },
      screens: {
        1024: { raw: "(max-width: 1024px)" },
        900: { raw: "(max-width: 900px)" },
        768: { raw: "(max-width: 768px)" },
        640: { raw: "(max-width: 640px)" },
        580: { raw: "(max-width: 580px)" },
        550: { raw: "(max-width: 550px)" },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
