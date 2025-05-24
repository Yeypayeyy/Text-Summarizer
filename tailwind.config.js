/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // Ini memberitahu Tailwind untuk memindai semua file HTML dan JSX/TSX di folder src
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}