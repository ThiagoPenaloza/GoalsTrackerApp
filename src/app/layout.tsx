import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '2026 Goals Tracker',
  description: 'Track and achieve your 2026 goals with AI-powered milestones',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background">
        {children}
      </body>
    </html>
  )
}
