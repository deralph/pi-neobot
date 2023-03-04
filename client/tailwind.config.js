/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
            colors: {
        'verdigrisL': 'hsla(183, 53%, 82%, 25%)',
        'verdigrisLM': 'hsla(183, 53%, 82%, 95%)',
        'verdigris': 'hsla(183, 73%, 42%, 1)',
        'moonstone': 'hsla(185, 89%, 37%, 1)',
        'cerulean': 'hsla(195, 86%, 27%, 1)',
        'ceruleanD': 'hsla(195, 86%, 18%, 1)',
'dark-green': 'hsla(180, 100%, 7%, 1)',
'dark-greenL': 'hsla(180, 100%, 17%, 1)',
'pi-color': 'hsla(276, 50%, 32%, 1)',
'pi-color-D': 'hsla(265, 48%, 28%, 1)',
'off-white':'rgb(239 239 239 / 57%)'
},
boxShadow:{
  'sideShadow': '3px, 0px, 30px , 6px, rgb(0,0, 0 / 80%)',
},
fontFamily:{
  'head': ['header'],
},

animation: {
  'slide': 'slide .7s cubic-bezier(0.4, 0, 0.2, 1);',
},

keyframes: {
 slide: {
    '0%' : { left:"-500px" },
    '100%': { left: "0px" },
  }
},
    },
  },
  plugins: [],
  darkMode: 'class',
}