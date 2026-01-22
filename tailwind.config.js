export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        classicBlue: "#003366",
        classicGold: "#38733F",
        classicBurgundy: "#800020",
        classicCream: "#F5F5DC",
        brand: {
          green: "#38733F", // exact green from logo
        },
      },
      fontFamily: {
        classic: ['system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
