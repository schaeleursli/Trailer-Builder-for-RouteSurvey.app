export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'surface': '#ffffff',
        'surface-100': '#f3f4f6',
        'surface-400': '#9ca3af',
        'primary-600': '#2E5FEC',
        'primary-700': '#1d4ed8',
        'danger-500': '#ef4444',
      },
      borderRadius: {
        'card': '0.5rem',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'cardHover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}