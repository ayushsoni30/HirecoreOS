/**
 * File: client/tailwind.config.js
 * Description: TailwindCSS configuration defining the typography, dark/light theme colors,
 *              and content source paths for HireCore OS.
 */

import plugin from 'tailwindcss/plugin';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      borderRadius: {
        none: '0px',
        sm: '0px',
        DEFAULT: '0px',
        md: '0px',
        lg: '0px',
        xl: '0px',
        '2xl': '0px',
        '3xl': '0px',
        full: '0px',
      },
      colors: {
        background: {
          dark: '#141312',
          light: '#FBF9F5',
        },
        text: {
          dark: '#ECE8E1',
          light: '#1C1917',
        },
        accent: '#9A3412', // Terracotta Accent
        primary: '#854F2B', // Warm Ochre
        secondary: '#D97706', // Academic Gold / Warm Amber
        cyanAccent: '#1E293B', // Academic Navy
        success: '#15803D',
        warning: '#B45309',
        error: '#B91C1C',
        paper: {
          50: '#FBF9F5',
          100: '#F4F1EA',
          200: '#E5E0D8',
          300: '#D5CEC3',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#383430',
          800: '#25221F',
          900: '#1D1B19',
          950: '#141312',
        },
        navy: {
          950: '#141312',
          900: '#1D1B19',
          850: '#25221F',
          800: '#332F2B',
          700: '#443F3A',
          600: '#57534E',
          500: '#78716C',
          400: '#A8A29E',
          200: '#E5E0D8',
          100: '#E5E0D8',
          50: '#FBF9F5',
        }
      },
      fontFamily: {
        serif: ['"Libertinus Serif"', '"EB Garamond"', 'Georgia', 'serif'],
        sans: ['"Libertinus Serif"', '"EB Garamond"', 'Georgia', 'serif'],
        display: ['"Libertinus Serif"', '"EB Garamond"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'glow-primary': 'none',
        'glow-secondary': 'none',
        'glass-dark': 'none',
        'glass-light': 'none',
        'academic': '2px 2px 0px 0px rgba(0, 0, 0, 0.1)',
        'academic-dark': '2px 2px 0px 0px rgba(255, 255, 255, 0.05)',
      }
    },
  },
  plugins: [
    typography,
    plugin(function({ addVariant }) {
      addVariant('light', '.light &');
    })
  ],
}
