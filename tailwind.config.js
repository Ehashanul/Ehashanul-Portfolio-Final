/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#000000",
        "ink-light": "#111111",
        p400: "#ffffff",
        p300: "#e5e5e5",
        p200: "#a3a3a3",
        b400: "#ffffff",
        b300: "#cccccc",
        c400: "#dddddd",
        c300: "#aaaaaa",
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        bebas: ['Bebas Neue', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      backgroundImage: {
        'grd-main': 'linear-gradient(135deg, #ffffff, #aaaaaa)',
        'grd-accent': 'linear-gradient(135deg, #cccccc, #777777)',
      },
      animation: {
        'orb-drift': 'orbDrift 12s ease-in-out infinite',
        'blink': 'blink 2.2s ease-in-out infinite',
      },
      keyframes: {
        orbDrift: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -40px) scale(1.06)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.97)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.3' },
        }
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
