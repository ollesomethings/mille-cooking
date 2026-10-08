const { theme } = require("../core/src/styles");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "../core/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      ...theme.extend,
    },
  },
  plugins: [],
};
