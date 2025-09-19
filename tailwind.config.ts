import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#d62828',  // основний червоний
          dark:   '#a4161a',
          light:  '#e85d75',
        },
        secondary: {
          DEFAULT: '#003049',  // глибокий синій
          dark:   '#001f2e',
          light:  '#669bbc',
        },
      },
    },
  },
  plugins: []
}

export default config