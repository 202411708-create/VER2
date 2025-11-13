/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        muji: {
          charcoal: '#4A4A4A',
          beige: '#F5F5F0',
          brown: '#8B7355',
          lightbeige: '#C9B8A8',
        },
        activity: {
          sleep: '#4A5568',
          study: '#4299E1',
          meal: '#F6AD55',
          sns: '#ED64A6',
          game: '#9F7AEA',
          exercise: '#48BB78',
          other: '#A0AEC0',
        }
      },
      fontFamily: {
        sans: ['Noto Sans KR', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'body': '16px',
        'body-lg': '18px',
        'heading': '24px',
        'heading-lg': '32px',
        'emphasis': '20px',
      },
      minWidth: {
        'touch': '44px',
      },
      minHeight: {
        'touch': '44px',
      }
    },
  },
  plugins: [],
}
