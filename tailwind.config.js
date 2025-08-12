// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        classicBlue: "#003366",
        classicGold: "#D4AF37",
        classicBurgundy: "#800020",
        classicCream: "#F5F5DC",
      },
      fontFamily: {
        classic: ['system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
