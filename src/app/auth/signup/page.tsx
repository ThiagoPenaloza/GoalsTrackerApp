'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-client'
import { Target, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) { setError('Passwords do not match'); setIsLoading(false); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); setIsLoading(false); return }

    const { error } = await supabase.auth.signUp({ email, password })

    if (error) { setError(error.message); setIsLoading(false); return }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10 stagger-1">
          <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mb-4">
            <Target size={24} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-2xl text-txt tracking-tight">MyGoals AI</span>
          <p className="text-txt-muted text-sm mt-1">Begin your journey</p>
        </div>

        {/* Signup Card */}
        <div className="bg-surface border border-line rounded-card p-8 stagger-2">
          <h1 className="font-display font-bold text-xl text-txt tracking-tight mb-6">Create Account</h1>

          <form onSubmit={handleSignUp} className="space-y-5">
            <Input label="Email" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            <Input label="Password" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" required />
            <Input label="Confirm Password" id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm your password" required />

            {error && (
              <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm border border-red-200 dark:border-red-900">
                {error}
              </div>
            )}

            <Button type="submit" isLoading={isLoading} className="w-full gap-2" size="lg">
              {isLoading ? 'Creating account...' : <><UserPlus size={16} /> Start Your Journey</>}
            </Button>
          </form>

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-line" />
            <span className="text-xs text-txt-muted">or</span>
            <div className="flex-1 h-px bg-line" />
          </div>

          <p className="text-center text-txt-secondary text-sm">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-accent font-semibold hover:underline">Sign in</Link>
          </p>
        </div>

        <div className="text-center mt-8 stagger-3">
          <Link href="/" className="text-txt-muted hover:text-txt transition-colors text-sm">&larr; Back to home</Link>
        </div>

        {/* Trust badges */}
        <div className="flex justify-center gap-6 mt-8 stagger-4">
          <div className="flex items-center gap-1.5 text-txt-muted text-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Free forever</span>
          </div>
          <div className="flex items-center gap-1.5 text-txt-muted text-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span>No credit card</span>
          </div>
          <div className="flex items-center gap-1.5 text-txt-muted text-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>AI-powered</span>
          </div>
        </div>
      </div>
    </div>
  )
}
