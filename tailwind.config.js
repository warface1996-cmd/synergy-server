
export default {
  darkMode: 'class',
  content: ['./index.html','./src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: { light: '#eaf2ff', dark: '#0f1320', accent: '#5a6ee1' }
      },
      boxShadow: {
        neo: '8px 8px 16px #cfd3df, -8px -8px 16px #ffffff',
        neodark: '8px 8px 16px #0b0e18, -8px -8px 16px #1e2438',
        insetlight: 'inset 10px 10px 20px #cfd3df, inset -10px -10px 20px #ffffff',
        insetdark: 'inset 10px 10px 20px #0b0e18, inset -10px -10px 20px #1e2438'
      }
    }
  },
  plugins: []
}
