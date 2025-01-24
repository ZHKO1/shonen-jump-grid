import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        focusBorderBreathe: {
          '0%, 100%': { backgroundColor: 'red' },
          '50%': { backgroundColor: 'white' },
        },
      },
      animation: {
        breathe: 'focusBorderBreathe 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
