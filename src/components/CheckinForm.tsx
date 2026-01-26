'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { Goal, MOOD_OPTIONS, MoodType } from '@/types'
import { Button } from './ui/Button'
import { cn } from '@/lib/utils'

interface CheckinFormProps {
  goals: Goal[]
  userId: string
}

export function CheckinForm({ goals, userId }: CheckinFormProps) {
  const [selectedGoal, setSelectedGoal] = useState('')
  const [mood, setMood] = useState<MoodType>('good')
  const [note, setNote] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedGoal) return
    setIsLoading(true)

    const weekNumber = Math.ceil(
      (new Date().getTime() - new Date(new Date().getFullYear(), 0, 1).getTime()) / 604800000
    )

    const { data: checkin, error } = await supabase
      .from('checkins')
      .insert({
        user_id: userId,
        goal_id: selectedGoal,
        week_number: weekNumber,
        progress_note: note || null,
        mood,
      })
      .select()
      .single()

    if (error) {
      setIsLoading(false)
      return
    }

    // Request AI feedback
    try {
      const res = await fetch('/api/ai/checkin-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkinId: checkin.id, mood, note }),
      })
      if (res.ok) {
        const data = await res.json()
        setFeedback(data.feedback)
      }
    } catch {
      // AI feedback is optional
    }

    setIsLoading(false)
    router.refresh()
  }

  if (feedback) {
    return (
      <div className="bg-surface border border-line rounded-card p-6 text-center">
        <div className="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center mx-auto mb-4">
          <span className="text-xl">
            {MOOD_OPTIONS.find((m) => m.value === mood)?.emoji}
          </span>
        </div>
        <h3 className="font-display font-bold text-lg text-txt mb-3">AI Coach Says</h3>
        <p className="text-txt-secondary leading-relaxed italic">&ldquo;{feedback}&rdquo;</p>
        <Button onClick={() => { setFeedback(null); setNote(''); setSelectedGoal('') }} variant="secondary" className="mt-6">
          New Check-in
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Goal selector */}
      <div>
        <label className="block text-xs font-medium text-txt-secondary tracking-wide uppercase mb-2">
          Select Goal
        </label>
        <select
          value={selectedGoal}
          onChange={(e) => setSelectedGoal(e.target.value)}
          className="w-full px-4 py-2.5 bg-transparent border border-line rounded-xl text-txt focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
          required
        >
          <option value="">Choose a goal...</option>
          {goals.map((g) => (
            <option key={g.id} value={g.id}>{g.title}</option>
          ))}
        </select>
      </div>

      {/* Mood */}
      <div>
        <label className="block text-xs font-medium text-txt-secondary tracking-wide uppercase mb-3">
          How are you feeling?
        </label>
        <div className="flex gap-2">
          {MOOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setMood(opt.value)}
              className={cn(
                'flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border transition-all',
                mood === opt.value
                  ? 'border-accent bg-accent-light'
                  : 'border-line hover:border-accent/30'
              )}
            >
              <span className="text-lg">{opt.emoji}</span>
              <span className="text-xs font-medium text-txt-secondary">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Note */}
      <div>
        <label className="block text-xs font-medium text-txt-secondary tracking-wide uppercase mb-2">
          Progress Note
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full px-4 py-2.5 bg-transparent border border-line rounded-xl text-txt placeholder:text-txt-muted resize-none focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
          rows={4}
          placeholder="What progress did you make this week?"
        />
      </div>

      <Button type="submit" isLoading={isLoading} className="w-full">
        {isLoading ? 'Submitting...' : 'Submit Check-in'}
      </Button>
    </form>
  )
}
