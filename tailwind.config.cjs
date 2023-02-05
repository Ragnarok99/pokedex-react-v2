/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#ff4e52",
        "custom-gray-50": "#f7f8fc",
        "custom-gray-100": "#f0f1f6",
      },
      fontFamily: {
        lato: ["Lato"],
      },
    },
  },
  plugins: [],
};
