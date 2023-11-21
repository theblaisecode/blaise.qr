/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./css/**/*.css", "./js/**/*.js"],
  theme: {
    extend: {
      fontFamily: {
        CeraRoundPro: ["CeraRoundPro", "sans-serif"],
        /* Use 'custom' as the utility class, and 'YourFontName' as the defined font family */
      },
      colors: {
        dark: "#22272e",
        accent: "#35383b",
        sage: "#87ae73",
      },
    },
  },
  plugins: [],
};
