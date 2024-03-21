/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        '300': '300px',
        '400': '400px',
        '500': '500px',
        '600': '600px',
      },
      colors:{
        "custom-orange": "#DE8C73",
        "custom-blue": "#6FB0B6",
        "custom-gray": "#EBEDEC",
        "custom-black": "#1E1E26",
        "custom-gray2": "#D5D2DD",
        "custom-blue2": "#A2D9D1"
        
      },
    },
  },
  plugins: [],
}
