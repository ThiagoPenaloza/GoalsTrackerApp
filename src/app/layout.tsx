import type { Metadata } from 'next'
import { Manrope, DM_Sans } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'MyGoals AI',
  description: 'Track your goals with AI-powered milestones',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${manrope.variable} ${dmSans.variable}`}>
      <body className="min-h-screen antialiased font-sans bg-bg text-txt">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
