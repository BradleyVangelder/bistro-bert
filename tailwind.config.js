/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Luxury Restaurant Color Palette
        'pure-white': '#FFFFFF',
        'off-white': '#FFFEF9',
        'ivory': '#FFFFF0',
        'light-gray': '#F8F8F8',
        'medium-gray': '#E5E5E5',
        'warm-gray': '#D4D4D4',
        'charcoal-gray': '#666666',
        'dark-gray': '#4A4A4A',
        'rich-black': '#000000',
        'footer-black': '#262626',
        // Luxury Accent Colors
        'gold-accent': '#D4AF37',
        'burgundy': '#800020',
        'deep-burgundy': '#6B1A1A',
        'champagne': '#F7E7CE',
        'bronze': '#CD7F32',
        'platinum': '#E5E4E2',
        'warm-beige': '#F5F5DC',
      },
      fontFamily: {
        'suisse': ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        'serif': ['Playfair Display', 'Georgia', 'Times New Roman', 'serif'],
        'elegant': ['Cormorant Garamond', 'Georgia', 'serif'],
        'luxury': ['Montserrat', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
}