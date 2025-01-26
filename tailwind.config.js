/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Match all React files
    "./public/index.html",        // Optionally include your public HTML file
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
