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
        // Legacy next.js vars (keep for any scaffolded usage)
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // Semantic surface tokens (flip between dark/light via CSS vars)
        desktop:         'var(--color-desktop)',
        window:          'var(--color-window)',
        chrome:          'var(--color-chrome)',
        'glass-edge':    'var(--color-glass-edge)',
        'label-primary':   'var(--color-label-primary)',
        'label-secondary': 'var(--color-label-secondary)',
        accent:          'var(--color-accent)',
        // macOS system semantic colors (dark-canonical; light inversion handled by globals.css)
        'system-blue':   '#0A84FF',
        'system-red':    '#FF453A',
        'system-green':  '#30D158',
        'system-yellow': '#FFD60A',
        // Traffic lights — fixed, never change
        'traffic-red':    '#FF5F57',
        'traffic-yellow': '#FEBC2E',
        'traffic-green':  '#28C840',
      },
    },
  },
  plugins: [],
} 