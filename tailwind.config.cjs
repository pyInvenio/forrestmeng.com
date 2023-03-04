/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}', './public/index.html'],
  theme: {
    extend: {},
    colors: {
      ...colors,
      primary: '#8C98FF',
    },
  },
  plugins: [],
}
