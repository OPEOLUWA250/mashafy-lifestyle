/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fff5f0",
          100: "#ffe8d9",
          200: "#ffd4b8",
          300: "#ff9b6d",
          400: "#ff7d3d",
          500: "#FF5B00",
          600: "#e64d00",
          700: "#cc3a00",
          800: "#8a2600",
          900: "#661d00",
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
