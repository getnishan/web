/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#84BC54', // Kept as requested
          variant: '#6DA540', // Slightly darker for hover
          light: '#E6F3DC', // Light background tint
        },
        secondary: {
          DEFAULT: '#0F172A', // Deep Navy (Premium/Trust)
          variant: '#1E293B',
          foreground: '#FFFFFF',
        },
        accent: {
          orange: '#F97316', // Vitality/Call to action
          blue: '#3B82F6', // Tech blue
        },
        neutral: {
          black: '#020617',
          dark: '#334155',
          gray: '#64748B',
          light: '#F8FAFC',
          white: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      },
      borderRadius: {
        'card': '20px',
        'pill': '9999px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}
