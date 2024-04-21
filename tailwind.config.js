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
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.3 } // Adjusted minimum opacity
        },
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
        blink: 'blink 2s ease-in-out infinite',
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
        'custom1': '#F2E4B5',
        'custom2': '#D7E1BF',
        'custom3': '#F1E4B7',
        "custom-orange": "#DE8C73",
        "custom-blue": "#6FB0B6",
        "custom-gray": "#EBEDEC",
        "custom-black": "#1E1E26",
        "custom-gray2": "#D5D2DD",
        "custom-blue2": "#A2D9D1",
        "custom-yellow": "#FBE6B7",
        "customStart": 'rgba(162, 217, 209, 1)',
        "customEnd": 'rgba(110, 176, 182, 1)',
        "custom-gray2": "rgba(235, 237, 236, 1)",
        "customColor1": 'rgba(121, 197, 186, 1)',
        "customColor2": 'rgba(251, 207, 142, 1)',
      },
      backgroundImage: {
        // 'gradient-custom': 'linear-gradient(to right, rgba(251, 207, 142, 1), rgba(121, 197, 186, 1))',
        'gradient-custom': "linear-gradient(242.65deg, #79C5BA 1.46%, #FBCF8E 100%)",
        'gradient-custom2': "linear-gradient(180deg, #A2D9D1 0%, #6FB0B6 100%)",
        'gradient-custom3': "linear-gradient(224.22deg, #DE8C73 -2.1%, #F7E2B3 104.65%)",

      },
    },
  },
  plugins: [],
}
