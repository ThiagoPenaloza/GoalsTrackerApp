'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { GOAL_CATEGORIES, GoalCategory } from '@/types'
import { ArrowLeft, Heart, Briefcase, Wallet, User, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const categoryIcons: Record<string, React.ElementType> = {
  health: Heart,
  career: Briefcase,
  finance: Wallet,
  personal: User,
  learning: BookOpen,
}

export default function NewGoalPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<GoalCategory>('personal')
  const [targetDate, setTargetDate] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }

      const { data: goal, error: goalError } = await supabase
        .from('goals')
        .insert({
          user_id: user.id, title,
          description: description || null,
          category, target_date: targetDate || null, status: 'active',
        })
        .select().single()

      if (goalError) throw goalError

      const response = await fetch('/api/ai/generate-milestones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goalId: goal.id, title, description, category, targetDate: targetDate || null }),
      })
      if (!response.ok) console.error('Failed to generate milestones, but goal was created')

      router.push(`/goals/${goal.id}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create goal')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      <Navbar user={{ email: '' }} />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/goals" className="inline-flex items-center gap-2 text-txt-secondary hover:text-txt mb-6 transition-colors text-sm font-medium">
          <ArrowLeft size={16} />
          Back to Goals
        </Link>

        <Card>
          <h1 className="font-display font-bold text-xl text-txt tracking-tight mb-6">Create New Goal</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input label="Goal Title" id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Run a marathon" required />
            <Textarea label="Description (Optional)" id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your goal in more detail..." rows={4} />

            <div>
              <label className="block text-xs font-medium text-txt-secondary tracking-wide uppercase mb-3">Category</label>
              <div className="flex flex-wrap gap-2">
                {GOAL_CATEGORIES.map((cat) => {
                  const Icon = categoryIcons[cat.value] || User
                  const isSelected = category === cat.value
                  return (
                    <button
                      key={cat.value} type="button" onClick={() => setCategory(cat.value)}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all',
                        isSelected ? 'border-accent bg-accent-light text-accent' : 'border-line text-txt-secondary hover:border-accent/30 hover:text-txt'
                      )}
                    >
                      <Icon size={16} />
                      <span className="text-sm font-medium">{cat.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <Input label="Target Date (Optional)" id="targetDate" type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />

            {error && (
              <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm border border-red-200 dark:border-red-900">
                {error}
              </div>
            )}

            <Button type="submit" isLoading={isLoading} className="w-full">
              {isLoading ? 'Creating & Generating Milestones...' : 'Create Goal'}
            </Button>
          </form>
        </Card>
      </main>
    </div>
  )
}
