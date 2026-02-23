/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "neutral-200": "var(--neutral-200)",
        "neutral-50": "var(--neutral-50)",
        "neutral-500": "var(--neutral-500)",
        "neutral-900": "var(--neutral-900)",
        "neutral-950": "var(--neutral-950)",
      },
      fontFamily: {
        "input-14": "var(--input-14-font-family)",
      },
      boxShadow: {
        "button-shadow": "var(--button-shadow)",
      },
    },
  },
  plugins: [],
};
