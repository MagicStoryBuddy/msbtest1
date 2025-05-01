/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-nunito)'],
        nunito: ['var(--font-nunito)'],
        baloo: ['var(--font-baloo)'],
        poppins: ['var(--font-poppins)'],
        rounded: ['var(--font-varela-round)'],
      },
    },
  },
  plugins: [],
} 