import type { Config } from "tailwindcss"
import { fontFamily } from "tailwindcss/defaultTheme"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        heading: ["var(--font-heading)", ...fontFamily.sans],
        mono: ["var(--font-mono)", ...fontFamily.mono],
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
        "pulse-opacity": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        spotlight: {
          "0%": {
            opacity: "0",
            transform: "translate(-72%, -62%) scale(0.5)",
          },
          "100%": {
            opacity: "1",
            transform: "translate(-50%,-40%) scale(1)",
          },
        },
        shimmer: {
          from: {
            backgroundPosition: "0 0",
          },
          to: {
            backgroundPosition: "-200% 0",
          },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "text-reveal": {
          "0%": {
            transform: "translateY(100%)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-down": {
          "0%": {
            opacity: "0",
            transform: "translateY(-20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        "spin-slow": {
          "0%": {
            transform: "rotate(0deg)",
          },
          "100%": {
            transform: "rotate(360deg)",
          },
        },
        "bounce-slow": {
          "0%, 100%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-5px)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-opacity": "pulse-opacity 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        spotlight: "spotlight 2s ease .75s 1 forwards",
        shimmer: "shimmer 2s linear infinite",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "text-reveal": "text-reveal 1s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-up": "fade-up 0.5s ease-out forwards",
        "fade-down": "fade-down 0.5s ease-out forwards",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "spin-slow": "spin-slow 8s linear infinite",
        "bounce-slow": "bounce-slow 3s ease-in-out infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-pattern": "url('/hero-pattern.svg')",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        shimmer:
          "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.1) 20%, rgba(255,255,255,0.2) 40%, rgba(255,255,255,0.1) 60%, transparent 100%)",
        "mesh-1":
          "radial-gradient(at 40% 20%, hsla(28, 100%, 74%, 0.3) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189, 100%, 56%, 0.3) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355, 100%, 93%, 0.3) 0px, transparent 50%), radial-gradient(at 80% 50%, hsla(340, 100%, 76%, 0.3) 0px, transparent 50%), radial-gradient(at 0% 100%, hsla(22, 100%, 77%, 0.3) 0px, transparent 50%), radial-gradient(at 80% 100%, hsla(242, 100%, 70%, 0.3) 0px, transparent 50%), radial-gradient(at 0% 0%, hsla(343, 100%, 76%, 0.3) 0px, transparent 50%)",
        "mesh-2":
          "radial-gradient(at 51% 52%, hsla(205, 100%, 50%, 0.05) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189, 100%, 56%, 0.05) 0px, transparent 50%), radial-gradient(at 0% 95%, hsla(355, 100%, 93%, 0.05) 0px, transparent 50%), radial-gradient(at 0% 5%, hsla(340, 100%, 76%, 0.05) 0px, transparent 50%), radial-gradient(at 95% 0%, hsla(22, 100%, 77%, 0.05) 0px, transparent 50%), radial-gradient(at 80% 95%, hsla(242, 100%, 70%, 0.05) 0px, transparent 50%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config

export default config
