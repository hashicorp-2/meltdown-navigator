module.exports = {
  presets: [require('nativewind/preset')],
  content: [
    './App.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        sky: '#7E9CCB',
        sage: '#A8D8B9',
        rose: '#E8B4B8',
        sand: '#F4D3C4',
        deep: '#1F2933',
        ink: '#111827',
        surface: '#F7F9FC',
        'surface-alt': '#EEF4F6',
        muted: 'rgba(17, 24, 39, 0.55)',
        success: '#58B083',
        warning: '#F0B45B',
        danger: '#FF6B6B',
      },
      borderRadius: {
        sm: 12,
        md: 18,
        lg: 28,
        pill: 999,
      },
    },
  },
  plugins: [],
};
