import type { Config } from "tailwindcss";
import {
  SCREEN_SIZE_XL,
  SCREEN_SIZE_LG,
  SCREEN_SIZE_MD,
  SCREEN_SIZE_SM,
  SCREEN_SIZE_XS,
} from "./validation/defaults";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    screens: {
      "screen-xl": `${SCREEN_SIZE_XL}px`,
      "screen-lg": `${SCREEN_SIZE_LG}px`,
      "screen-md": `${SCREEN_SIZE_MD}px`,
      "screen-sm": `${SCREEN_SIZE_SM}px`,
      "screen-xs": `${SCREEN_SIZE_XS}px`,
    },
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      boxShadow: {
        top: "0 -0.5px 0 1px",
      },
      backgroundImage: {
        "grad-dark":
          "linear-gradient(135deg, rgba(8,50,58,0.65), rgba(8,60,70,0) 2100px), linear-gradient(225deg, rgba(85,3,87,0.35), rgba(85,3,87,0) 1600px), linear-gradient(336deg, rgba(0,0,0,1), rgba(0,0,0,0.1) 90%)",
      },
      colors: {
        default: "hsl(var(--default))",
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
        bitcoin: "#F7931A",
        eth: "#849DFF",
        "paynes-gray": "#646E78",
        "market-teal": "#1CB3AA",
        "market-red": "#D14E85",
        "market-up": "hsl(var(--market-up))",
        "market-down": "#F23F8A",
        "carousel-focus-dark": "#5B9ACA",
        "carousel-focus": "#9EE3FA",
        "carousel-selected-dark": "#487AA1",
        "carousel-selected": "#47C2EB",
        dropdown: "hsl(var(--dropdown))",
        "menu-highlight": "hsl(var(--menu-highlight))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      width: {
        "table-xl": "1467px",
        "table-lg": "1150px",
      },
      maxWidth: {
        "table-xl": "1467px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        enter: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "slide-in-top": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-left": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        enter: "enter 200ms ease-out",
        "slide-in-top": "slide-in-top",
        "slide-in-left": "slide-in-left",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
