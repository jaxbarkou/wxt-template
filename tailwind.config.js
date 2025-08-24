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
      fontFamily: {
        sans: ["montserrat-regular"], // 默认字体
        "brand-medium": ["montserrat-medium"],
        "brand-regular": ["montserrat-regular"],
        // serif: ['Merriweather', 'ui-serif', 'Georgia'],
        // mono: ['Fira Code', 'ui-monospace', 'SFMono-Regular'],
      },
    },
  },
  plugins: [],
};
