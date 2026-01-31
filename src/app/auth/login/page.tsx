'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-client'
import { Target, LogIn, Mail, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showResendOption, setShowResendOption] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  // Check for error in URL params (from callback)
  useEffect(() => {
    const urlError = searchParams.get('error')
    if (urlError) {
      setError(urlError)
    }
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setShowResendOption(false)
    setResendSuccess(false)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      // Check if error is related to unconfirmed email
      const isUnconfirmedError =
        error.message.toLowerCase().includes('email not confirmed') ||
        error.message.toLowerCase().includes('email confirmation')

      if (isUnconfirmedError) {
        setError('Please confirm your email address before signing in.')
        setShowResendOption(true)
      } else {
        setError(error.message)
      }
      setIsLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  const handleResendConfirmation = async () => {
    if (!email) {
      setError('Please enter your email address first')
      return
    }

    setResendLoading(true)
    setError(null)

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    setResendLoading(false)

    if (error) {
      setError(error.message)
    } else {
      setResendSuccess(true)
      setShowResendOption(false)
    }
  }

  return (
    <div className="bg-surface border border-line rounded-card p-8 stagger-2">
      <h1 className="font-display font-bold text-xl text-txt tracking-tight mb-6">Sign In</h1>

      <form onSubmit={handleLogin} className="space-y-5">
        <Input label="Email" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
        <Input label="Password" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" required />

        {/* Resend confirmation success message */}
        {resendSuccess && (
          <div className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 px-4 py-3 rounded-xl text-sm border border-emerald-200 dark:border-emerald-900">
            <div className="flex items-center gap-2">
              <Mail size={16} />
              <span>Confirmation email sent! Check your inbox.</span>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm border border-red-200 dark:border-red-900">
            {error}
          </div>
        )}

        {/* Resend confirmation button */}
        {showResendOption && email && (
          <button
            type="button"
            onClick={handleResendConfirmation}
            disabled={resendLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-accent bg-accent-light hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-xl transition-colors disabled:opacity-50"
          >
            {resendLoading ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail size={14} />
                Resend Confirmation Email
              </>
            )}
          </button>
        )}

        <Button type="submit" isLoading={isLoading} className="w-full gap-2" size="lg">
          {isLoading ? 'Signing in...' : <><LogIn size={16} /> Sign In</>}
        </Button>
      </form>

      <div className="flex items-center gap-4 my-8">
        <div className="flex-1 h-px bg-line" />
        <span className="text-xs text-txt-muted">or</span>
        <div className="flex-1 h-px bg-line" />
      </div>

      <p className="text-center text-txt-secondary text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/auth/signup" className="text-accent font-semibold hover:underline">Sign up</Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10 stagger-1">
          <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mb-4">
            <Target size={24} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-2xl text-txt tracking-tight">MyGoals AI</span>
          <p className="text-txt-muted text-sm mt-1">Welcome back to your journey</p>
        </div>

        {/* Login Card - wrapped in Suspense for useSearchParams */}
        <Suspense fallback={
          <div className="bg-surface border border-line rounded-card p-8 animate-pulse">
            <div className="h-7 bg-line rounded w-24 mb-6" />
            <div className="space-y-5">
              <div className="h-16 bg-line rounded" />
              <div className="h-16 bg-line rounded" />
              <div className="h-12 bg-line rounded" />
            </div>
          </div>
        }>
          <LoginForm />
        </Suspense>

        <div className="text-center mt-8 stagger-3">
          <Link href="/" className="text-txt-muted hover:text-txt transition-colors text-sm">
            &larr; Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
