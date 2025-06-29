/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        purple: {
          DEFAULT: "#6a0dad",
          hover: "#5a099a",
          soft: "#b491c8",
        },
        "purple-light": "#ede4f7",
        "purple-border": "#d8cce4",
        "text-dark": "#2b2b2b",
        "text-light": "#f4f4f4",
        cream: "#fdf6ee",
        "light-cream": "#f8f1e9",
      },
    },
  },
  plugins: [],
};
