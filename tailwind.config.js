/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Defines a custom color palette based on your logo for consistent branding.
      colors: {
        'brand-primary': {
          DEFAULT: '#0D47A1', // A deep, professional blue from your logo
          light: '#1E88E5',   // A lighter shade for hover effects
          dark: '#0D47A1',
        },
        'brand-secondary': {
          DEFAULT: '#FDB813', // A vibrant gold/yellow from your logo
          light: '#FFCA28',
          dark: '#F9A825',
        },
        'brand-dark': '#212121',   // For primary text
        'brand-light': '#F5F5F5',  // For page backgrounds
        'brand-accent': '#FFC107',
      },
      // Sets 'Inter' as the default font for a clean, modern look.
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
