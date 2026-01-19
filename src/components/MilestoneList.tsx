'use client'

import { useState } from 'react'
import { Milestone } from '@/types'
import { createClient } from '@/lib/supabase-client'
import { Check, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MilestoneListProps {
  milestones: Milestone[]
  goalId: string
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export function MilestoneList({ milestones: initialMilestones, goalId }: MilestoneListProps) {
  const [milestones, setMilestones] = useState(initialMilestones)
  const [updating, setUpdating] = useState<string | null>(null)
  const supabase = createClient()

  const sortedMilestones = [...milestones].sort((a, b) => a.month - b.month)

  const handleToggle = async (milestone: Milestone) => {
    setUpdating(milestone.id)

    const newCompleted = !milestone.is_completed

    const { error } = await supabase
      .from('milestones')
      .update({
        is_completed: newCompleted,
        completed_at: newCompleted ? new Date().toISOString() : null,
      })
      .eq('id', milestone.id)

    if (!error) {
      setMilestones((prev) =>
        prev.map((m) =>
          m.id === milestone.id
            ? { ...m, is_completed: newCompleted, completed_at: newCompleted ? new Date().toISOString() : null }
            : m
        )
      )
    }

    setUpdating(null)
  }

  return (
    <div className="space-y-3">
      {sortedMilestones.map((milestone) => (
        <div
          key={milestone.id}
          className={cn(
            'flex items-start gap-3 p-4 rounded-lg border transition-all',
            milestone.is_completed
              ? 'bg-success/5 border-success/20'
              : 'bg-white border-gray-200 hover:border-gray-300'
          )}
        >
          <button
            onClick={() => handleToggle(milestone)}
            disabled={updating === milestone.id}
            className={cn(
              'flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
              milestone.is_completed
                ? 'bg-success border-success text-white'
                : 'border-gray-300 hover:border-primary',
              updating === milestone.id && 'opacity-50'
            )}
          >
            {milestone.is_completed ? (
              <Check className="w-4 h-4" />
            ) : (
              <Circle className="w-3 h-3 text-transparent" />
            )}
          </button>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                {MONTH_NAMES[milestone.month - 1]}
              </span>
            </div>
            <p
              className={cn(
                'text-gray-700',
                milestone.is_completed && 'line-through text-gray-500'
              )}
            >
              {milestone.title}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
