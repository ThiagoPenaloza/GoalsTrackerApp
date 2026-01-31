'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import { Target, LayoutDashboard, Crosshair, MessageCircle, LogOut } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { cn } from '@/lib/utils'

interface NavbarProps {
  user?: { email: string }
}

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/goals', label: 'Goals', icon: Crosshair },
  { href: '/checkin', label: 'Check-in', icon: MessageCircle },
]

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-line bg-bg/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center">
              <Target size={16} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display font-semibold text-txt hidden sm:block" style={{ fontStyle: 'italic' }}>
              MyGoals
            </span>
          </Link>

          {/* Navigation Links */}
          {user && (
            <div className="flex items-center gap-1">
              {navLinks.map(({ href, label, icon: Icon }) => {
                const active = pathname.startsWith(href)
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                      active
                        ? 'bg-accent-light text-accent dark:text-orange-400'
                        : 'text-txt-secondary hover:text-txt hover:bg-surface-raised'
                    )}
                  >
                    <Icon size={16} strokeWidth={active ? 2.5 : 2} />
                    <span className="hidden sm:inline">{label}</span>
                  </Link>
                )
              })}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user && (
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-txt-secondary hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
