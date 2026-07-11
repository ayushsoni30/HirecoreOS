/**
 * File: client/tailwind.config.js
 * Description: TailwindCSS configuration defining the typography, dark/light theme colors,
 *              and content source paths for CareerLaunch.
 */

import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          dark: '#0F172A',
          light: '#F8FAFC',
        },
        text: {
          dark: '#F8FAFC',
          light: '#0F172A',
        },
        accent: '#2563EB', // Primary: Professional Blue
        primary: '#2563EB',
        secondary: '#7C3AED', // Secondary: Elegant Purple
        cyanAccent: '#06B6D4', // Accent: Cyan
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        navy: {
          950: '#0F172A', // Dark Theme Background
          900: '#1E293B', // Dark Theme Surface/Card
          850: '#243247', // Dark Theme Hover/Inner Card
          800: '#334155', // Dark Theme Border
          700: '#475569', 
          600: '#475569', 
          500: '#64748B', // Light Theme Secondary Text
          400: '#CBD5E1', // Dark Theme Secondary Text
          100: '#E2E8F0', // Light Theme Border
          50: '#F8FAFC'  // Light Theme Background
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [
    plugin(function({ addVariant }) {
      addVariant('light', '.light &');
    })
  ],
}
