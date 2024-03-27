/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        wiggle1: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        wiggle2: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        wiggle3: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        wiggle4: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        wiggle1: 'wiggle1 2s ease-in-out infinite',
        wiggle2: 'wiggle2 2.5s ease-in-out infinite',
        wiggle3: 'wiggle3 3s ease-in-out infinite',
        wiggle4: 'wiggle4 3.5s ease-in-out infinite',
      },

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
        "custom-blue2": "#A2D9D1",
        "custom-yellow": "#FBE6B7",
        "customStart": 'rgba(162, 217, 209, 1)',
        "customEnd": 'rgba(110, 176, 182, 1)',
        
      },
    },
  },
  plugins: [],
}
