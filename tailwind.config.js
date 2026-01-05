/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'cyber-black': '#020617',
        'cyber-gray': '#1e293b',
        'neon-cyan': '#06b6d4',
        'neon-purple': '#8b5cf6',
        'web3-dark': '#0B0E14',
        'web3-purple': '#A020F0',
        'web3-cyan': '#00D9FF',
      },
      animation: {
        'blob': 'blob 7s infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'radial-glow': 'radialGlow 4s ease-in-out infinite',
      },
      keyframes: {
        blob: {
          '0%, 100%': {
            'transform': 'translate(0, 0) scale(1)',
          },
          '33%': {
            'transform': 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            'transform': 'translate(-20px, 20px) scale(0.9)',
          },
        },
        fadeIn: {
          '0%': {
            'opacity': '0',
          },
          '100%': {
            'opacity': '1',
          },
        },
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
      backgroundImage: {
        'grid-pattern': `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238b5cf6' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      },
    },
  },
  plugins: [],
};
