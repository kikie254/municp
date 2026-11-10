import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Institutional color palette
        navy: {
          DEFAULT: '#0A2540',
          50: '#E6EBF2',
          100: '#CCD7E5',
          200: '#99AFCB',
          300: '#6687B1',
          400: '#335F97',
          500: '#0A2540',
          600: '#081E33',
          700: '#061626',
          800: '#040F1A',
          900: '#02070D',
        },
        accent: {
          DEFAULT: '#2E7D32',
          50: '#E8F5E9',
          100: '#C8E6C9',
          200: '#A5D6A7',
          300: '#81C784',
          400: '#66BB6A',
          500: '#2E7D32',
          600: '#266029',
          700: '#1E4620',
          800: '#162D17',
          900: '#0E1F0F',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config
