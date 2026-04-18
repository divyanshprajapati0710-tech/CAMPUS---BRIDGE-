/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  "#f0f4f8",
          100: "#dce8f0",
          200: "#b8d0e3",
          300: "#8ab4cd",
          400: "#5a90b5",
          500: "#2a6496",
          600: "#1e4f7a",
          700: "#163d5e",
          800: "#1e3a5f",
          900: "#0f2333",
        },
      },
    },
  },
  plugins: [],
}
