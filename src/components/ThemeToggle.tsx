'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from './ThemeProvider'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      className="relative w-9 h-9 rounded-full border border-line hover:border-accent/40 flex items-center justify-center text-txt-secondary hover:text-accent transition-all duration-300 focus-ring overflow-hidden"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative w-4 h-4">
        {/* Sun icon - visible in dark mode */}
        <Sun
          size={16}
          className={`absolute inset-0 transition-all duration-300 ${theme === 'dark'
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 rotate-90 scale-0'
            }`}
        />
        {/* Moon icon - visible in light mode */}
        <Moon
          size={16}
          className={`absolute inset-0 transition-all duration-300 ${theme === 'light'
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 -rotate-90 scale-0'
            }`}
        />
      </div>
    </button>
  )
}

