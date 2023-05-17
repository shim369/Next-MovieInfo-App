/** @type {import('tailwindcss').Config} */
export default {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      width: {
        '1.9/10': '19%',
        '8/10': '80%',
      },
      backgroundColor: {
        'blue-500': '#02b0f9',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}