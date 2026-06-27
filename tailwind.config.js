/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#000000",
        card: "#0A0A0A",
        line: "#161616",
        paper: "#FFFFFF",
        muted: "#707070",
      }
    },
  },
  plugins: [],
}
