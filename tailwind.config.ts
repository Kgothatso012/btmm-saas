import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          deep: '#0A0A0F',
          surface: '#12121A',
          elevated: '#1A1A25',
        },
        border: '#2A2A3A',
        accent: {
          cyan: '#00D4FF',
          'cyan-dim': '#00D4FF20',
        },
        bull: '#00FF88',
          bear: '#FF3366',
        warn: '#FFAA00',
        amber: '#F59E0B',
        muted: '#8A8A9A',
      },
      fontFamily: {
        sans: ['Sora', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
