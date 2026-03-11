/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: '#6366F1',
        secondary: '#818CF8',
        positive: '#10B981',
        'app-bg': '#F5F3FF',
        'text-primary': '#1E1B4B',
        'text-secondary': '#64748B',
      },
      zIndex: {
        '20': '20',
        '30': '30',
        '40': '40',
        '50': '50',
        '60': '60',
      },
    },
  },
  plugins: [],
};
