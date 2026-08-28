    /** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#2F4156',
        skyblue: '#C8D9E6',
        beige: '#F5EFEB',
        azalea: '#F7C9D4',
        palepink: '#FFE1E6',
      },
      fontFamily: {
        heading: ['K2D', 'sans-serif'],
        body: ['IBM Plex Sans Thai', 'sans-serif'],
      }
    },
  },
  plugins: [],
}