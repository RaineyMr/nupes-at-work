/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Nupes at Work Brand Colors
        crimson: '#9D2235',
        cream: '#F5E1C8',
        'on-crimson': '#FDF7F0',
        'on-cream': '#1F2933',
        ink: '#111827',
        charcoal: '#4B5563',
        steel: '#9CA3AF',
        fog: '#E5E7EB',
        paper: '#F9FAFB',
        gold: '#CFAF5A',
        success: '#059669',
        warning: '#D97706',
        error: '#B91C1C',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Playfair Display', 'Cormorant Garamond', 'serif'],
      },
      spacing: {
        '2.5': '10px',
        '4.5': '18px',
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
      },
      boxShadow: {
        'card': '0 8px 20px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
