/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./extension/**/*.{ts,tsx,html}",
    "./src/**/*.{ts,tsx,html}",
    "./**/*.{ts,tsx,html}", // 根据实际路径调整
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)", // 或者 'hsl(var(--primary))' / 'oklch(var(--primary))'
        primaryForeground: "var(--primary-foreground)",
      },
      fontFamily: {
        sans: ["arboria-book"], // 默认字体
        // "brand-medium": ["montserrat-medium"],
        // "brand-regular": ["montserrat-regular"],
        "brand-regular": ["arboria-book"],
        "brand-medium": ["arboria-medium"],
        // serif: ['Merriweather', 'ui-serif', 'Georgia'],
        // mono: ['Fira Code', 'ui-monospace', 'SFMono-Regular'],
      },
    },
  },
  plugins: [],
};
