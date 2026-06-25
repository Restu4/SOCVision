/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        soc: {
          900: '#0a0e1a',
          800: '#111827',
          700: '#1f2937',
          600: '#374151',
          500: '#4b5563',
          400: '#6b7280',
          300: '#9ca3af',
          200: '#d1d5db',
          100: '#e5e7eb',
          50: '#f9fafb',
        },
        danger: {
          DEFAULT: '#ef4444',
          light: '#fca5a5',
        },
        warning: {
          DEFAULT: '#f59e0b',
          light: '#fde68a',
        },
        success: {
          DEFAULT: '#10b981',
          light: '#6ee7b7',
        },
        info: {
          DEFAULT: '#3b82f6',
          light: '#93c5fd',
        },
      },
    },
  },
  plugins: [],
};
