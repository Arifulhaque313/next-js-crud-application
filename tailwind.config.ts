import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",  
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",     
  ],
  
  // Customize Tailwind's default theme here
  theme: {
    extend: {
      // Add custom colors
      colors: {
        background: "var(--background)",  
        foreground: "var(--foreground)",
      },
      
      // Define custom animations and keyframes
      keyframes: {
        gradient: {
          '0%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0% 50%' },
        },
      },
      
      animation: {
        'gradient-border': 'gradient 3s ease infinite',
      },
    },
  },
  
  plugins: [],
} satisfies Config;
