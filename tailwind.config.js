/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f8f5ff",
          100: "#f0ebff",
          200: "#e1d7ff",
          300: "#d2c3ff",
          400: "#c3afff",
          500: "#a082ff",
          600: "#8c69ff",
          700: "#8c69ff",
          800: "#7850e6",
          900: "#5c3dd6",
        },
        accent: "#FEE4BA",
        light: "#FFFFFF",
        dark: "#1a1a1a",
      },
      fontFamily: {
        sans: ["Poppins", "system-ui", "sans-serif"],
      },
      fontWeight: {
        thin: "100",
      },
      spacing: {
        128: "32rem",
      },
    },
  },
  plugins: [],
};
