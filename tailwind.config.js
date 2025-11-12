/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        neutral: {
          950: '#0a0a0a',
          900: '#171717',
          800: '#262626'
        },
        lime: {
          300: '#bef264',
          400: '#a3e635'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(90deg, #84cc16, #a3e635)'
      }
    }
  },
  plugins: []
}
