/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'web3-dark': '#0B0E14',
        'web3-purple': '#A020F0',
        'web3-cyan': '#00D9FF',
      },
      animation: {
        'radial-glow': 'radialGlow 4s ease-in-out infinite',
      },
      keyframes: {
        radialGlow: {
          '0%': {
            'box-shadow': '0 0 20px 5px rgba(0, 217, 255, 0.3)',
          },
          '50%': {
            'box-shadow': '0 0 40px 15px rgba(160, 32, 240, 0.2)',
          },
          '100%': {
            'box-shadow': '0 0 20px 5px rgba(0, 217, 255, 0.3)',
          },
        },
      },
    },
  },
  plugins: [],
};
