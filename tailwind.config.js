/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        "custom-orange": "#DE8C73",
        "custom-blue": "#6FB0B6",
        "custom-gray": "#EBEDEC"
      }
    },
  },
  plugins: [],
}
