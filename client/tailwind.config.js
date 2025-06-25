/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // ✅ very important
  theme: {
    extend: {
      colors: {
        purple: {
          DEFAULT: "#6a0dad",
          hover: "#5a099a",
          soft: "#b491c8",
        },
        "purple-border": "#d8cce4",
        text: {
          light: "#f4f4f4",
        },
      },
    },
  },
  plugins: [],
};
