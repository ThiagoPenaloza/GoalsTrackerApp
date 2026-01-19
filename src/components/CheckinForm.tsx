'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { Goal, MOOD_OPTIONS, MoodType } from '@/types'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { cn } from '@/lib/utils'

interface CheckinFormProps {
  goals: Goal[]
  userId: string
}

export function CheckinForm({ goals, userId }: CheckinFormProps) {
  const [selectedGoal, setSelectedGoal] = useState<string>(goals[0]?.id || '')
  const [progressNote, setProgressNote] = useState('')
  const [mood, setMood] = useState<MoodType>('good')
  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const getCurrentWeek = () => {
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 1)
    const diff = now.getTime() - start.getTime()
    const oneWeek = 1000 * 60 * 60 * 24 * 7
    return Math.ceil(diff / oneWeek)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setFeedback(null)

    try {
      const weekNumber = getCurrentWeek()

      // Create check-in
      const { data: checkin, error: checkinError } = await supabase
        .from('checkins')
        .insert({
          user_id: userId,
          goal_id: selectedGoal,
          week_number: weekNumber,
          progress_note: progressNote || null,
          mood,
        })
        .select()
        .single()

      if (checkinError) throw checkinError

      // Get goal title for AI feedback
      const goal = goals.find((g) => g.id === selectedGoal)

      // Generate AI feedback
      const response = await fetch('/api/ai/coach-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkinId: checkin.id,
          goalTitle: goal?.title,
          progressNote,
          mood,
          weekNumber,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setFeedback(data.feedback)
      }

      setProgressNote('')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit check-in')
    } finally {
      setIsLoading(false)
    }
  }

  if (goals.length === 0) {
    return (
      <Card>
        <p className="text-gray-500 text-center py-4">
          Create a goal first to start checking in on your progress.
        </p>
      </Card>
    )
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold text-text mb-4">Weekly Check-in</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Goal
          </label>
          <select
            value={selectedGoal}
            onChange={(e) => setSelectedGoal(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          >
            {goals.map((goal) => (
              <option key={goal.id} value={goal.id}>
                {goal.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How are you feeling about this goal?
          </label>
          <div className="flex flex-wrap gap-2">
            {MOOD_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setMood(option.value)}
                className={cn(
                  'px-4 py-2 rounded-lg border-2 transition-all flex items-center gap-2',
                  mood === option.value
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                )}
              >
                <span>{option.emoji}</span>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Progress Notes (Optional)
          </label>
          <textarea
            value={progressNote}
            onChange={(e) => setProgressNote(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none min-h-[100px]"
            placeholder="What did you accomplish this week? Any challenges?"
          />
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        {feedback && (
          <div className="bg-primary/5 border border-primary/20 px-4 py-3 rounded-lg">
            <p className="text-sm font-medium text-primary mb-1">AI Coach Feedback</p>
            <p className="text-gray-700">{feedback}</p>
          </div>
        )}

        <Button type="submit" isLoading={isLoading} className="w-full">
          {isLoading ? 'Submitting...' : 'Submit Check-in'}
        </Button>
      </form>
    </Card>
  )
}
