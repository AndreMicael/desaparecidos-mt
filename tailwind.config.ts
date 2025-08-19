import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",     
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Cor personalizada para substituir yellow
        custom: {
          DEFAULT: "#877a4e",
          50: "#fefdf9",
          100: "#fdfbf2",
          200: "#f9f4e0",
          300: "#f2e9c5",
          400: "#e8d9a3",
          500: "#d9c77d",
          600: "#c7b25f",
          700: "#877a4e",
          800: "#6b6140",
          900: "#5a5035",
          950: "#3a3221",
        },
        // Sobrescrevendo as cores yellow padrão
        yellow: {
          50: "#fefdf9",
          100: "#fdfbf2",
          200: "#f9f4e0",
          300: "#f2e9c5",
          400: "#e8d9a3",
          500: "#d9c77d",
          600: "#c7b25f",
          700: "#877a4e",
          800: "#6b6140",
          900: "#5a5035",
          950: "#3a3221",
          DEFAULT: "#877a4e",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};

export default config;
