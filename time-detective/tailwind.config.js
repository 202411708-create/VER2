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
          // MUJI 핵심 색상 시스템
          dark: '#111111',
          mid: '#333333',
          light: '#6B6B6B',
          bg: '#FAFAF7',
          beige: '#F5F0EB',

          // 기존 색상 유지 (호환성)
          charcoal: '#4A4A4A',
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
        sans: ['Pretendard', 'Noto Sans KR', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'body': ['16px', { lineHeight: '1.75' }],
        'body-sm': ['14px', { lineHeight: '1.7' }],
        'body-lg': ['18px', { lineHeight: '1.75' }],
        'heading': ['24px', { lineHeight: '1.6' }],
        'heading-lg': ['32px', { lineHeight: '1.5' }],
        'emphasis': ['20px', { lineHeight: '1.6' }],
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
      },
      spacing: {
        '12': '12px',
        '16': '16px',
        '24': '24px',
        '32': '32px',
        '48': '48px',
      },
      minWidth: {
        'touch': '44px',
      },
      minHeight: {
        'touch': '44px',
      },
      borderWidth: {
        '1': '1px',
      },
      boxShadow: {
        'muji': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'muji-hover': '0 2px 4px 0 rgba(0, 0, 0, 0.08)',
        'none': 'none',
      },
    },
  },
  plugins: [],
}
