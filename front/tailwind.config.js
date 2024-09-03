/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        layoutcolor: "#69574F",
        admincolor: "#DB6942",
        submitcolor: "#ADBFE3",
        cancelcolor: "#E3ADAD",
        inputcolor: "#EBE8E6",
        footercolor: "#9D9D9D",
        bgcolor: "#EFEBE9",
      },
    },
  },
  plugins: [],
};
