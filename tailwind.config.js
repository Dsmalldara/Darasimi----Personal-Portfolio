/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#000000",
        "primary-light": "#ffffff",
        secondary: "#111111",
        "secondary-light": "#f5f5f5",
        accent: "#ffffff",
        "accent-light": "#000000",
        muted: "#c4c4c4",
        "muted-light": "#666666",
      },
      fontFamily: {
        sans: ['Inter Variable', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Instrument Serif', 'Georgia', 'serif'],
        display: ['Lilita One', 'cursive'],
      },
    },
  },
  plugins: [],
};
