/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', "system-ui", "sans-serif"],
        mono: ['"Space Mono"', "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
