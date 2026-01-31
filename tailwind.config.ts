import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'DM Sans', 'system-ui', 'sans-serif'],
        display: ['var(--font-fraunces)', 'Fraunces', 'Georgia', 'serif'],
      },
      colors: {
        bg: 'var(--bg)',
        'bg-warm': 'var(--bg-warm)',
        surface: 'var(--surface)',
        'surface-raised': 'var(--surface-raised)',
        txt: 'var(--text)',
        'txt-secondary': 'var(--text-secondary)',
        'txt-muted': 'var(--text-muted)',
        line: 'var(--border)',
        'line-light': 'var(--border-light)',
        accent: 'var(--accent)',
        'accent-hover': 'var(--accent-hover)',
        'accent-light': 'var(--accent-light)',
        'accent-glow': 'var(--accent-glow)',
        'accent-subtle': 'var(--accent-subtle)',
        ember: 'var(--ember)',
        sage: 'var(--sage)',
        'sage-light': 'var(--sage-light)',
        lavender: 'var(--lavender)',
        'lavender-light': 'var(--lavender-light)',
        rose: 'var(--rose)',
        'rose-light': 'var(--rose-light)',
      },
      borderRadius: {
        card: '20px',
        pill: '9999px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.03), 0 1px 2px rgba(0,0,0,0.02)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.03)',
        glow: '0 0 24px var(--accent-glow)',
        'glow-lg': '0 0 48px var(--accent-glow)',
        warm: '0 4px 16px rgba(212, 132, 90, 0.08)',
      },
      letterSpacing: {
        tight: '-0.025em',
        display: '-0.035em',
      },
    },
  },
  plugins: [],
}

export default config
