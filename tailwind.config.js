/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./extension/**/*.{ts,tsx,html}", // 根据实际路径调整
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)", // 或者 'hsl(var(--primary))' / 'oklch(var(--primary))'
        primaryForeground: "var(--primary-foreground)",
      },
    },
  },
  plugins: [],
};
