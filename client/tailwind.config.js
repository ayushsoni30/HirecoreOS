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
          dark: '#080B16',
          light: '#F8FAFC',
        },
        text: {
          dark: '#F8FAFC',
          light: '#0A0F29',
        },
        accent: '#3B82F6', // Primary Accent: Electric Blue
        primary: '#3B82F6',
        secondary: '#8B5CF6', // Secondary Accent: Vivid Purple
        cyanAccent: '#06B6D4', // Accent: Neon Cyan
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        navy: {
          950: '#080B16', // Deep Cosmic Navy Background
          900: '#0F1322', // Sleek Navy Surface/Card
          850: '#151B30', // Surface Hover / Selected States
          800: '#1E2540', // Borders & Separators
          700: '#2E3A5E', // Muted Text/Muted Borders
          600: '#475569', 
          500: '#64748B', // Light Theme Secondary Text
          400: '#94A3B8', // Dark Theme Secondary Text
          100: '#E2E8F0', // Light Theme Border
          50: '#F8FAFC'  // Light Theme Background
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Outfit"', 'sans-serif'],
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(59, 130, 246, 0.15)',
        'glow-secondary': '0 0 20px rgba(139, 92, 246, 0.15)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-light': '0 8px 32px 0 rgba(31, 38, 135, 0.08)',
      }
    },
  },
  plugins: [
    plugin(function({ addVariant }) {
      addVariant('light', '.light &');
    })
  ],
}
