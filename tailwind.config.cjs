/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts,md}', './public/index.html'],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            h1: { fontFamily: "'Newsreader', serif" },
            h2: { fontFamily: "'Newsreader', serif" },
            h3: { fontFamily: "'Neuton', serif" },
            p: { fontFamily: "'Red Hat Text', sans-serif" },
            li: { fontFamily: "'Red Hat Text', sans-serif" },
            img: { maxWidth: '100%', height: 'auto' },
          },
        },
      },
    },
    colors: {
      ...colors,
      primary: '#8C98FF',
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
  ],
}
