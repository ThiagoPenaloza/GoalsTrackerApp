'use client'

import { useState } from 'react'
import { Milestone } from '@/types'
import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import { Check, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MilestoneListProps {
  milestones: Milestone[]
  goalId: string
}

export function MilestoneList({ milestones, goalId }: MilestoneListProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const toggleMilestone = async (milestone: Milestone) => {
    setLoadingId(milestone.id)

    await supabase
      .from('milestones')
      .update({
        is_completed: !milestone.is_completed,
        completed_at: !milestone.is_completed ? new Date().toISOString() : null,
      })
      .eq('id', milestone.id)

    router.refresh()
    setLoadingId(null)
  }

  return (
    <div className="space-y-2">
      {milestones.map((m) => (
        <button
          key={m.id}
          onClick={() => toggleMilestone(m)}
          disabled={loadingId === m.id}
          className={cn(
            'w-full flex items-start gap-3 p-4 rounded-card border text-left transition-all',
            m.is_completed
              ? 'bg-surface-raised border-line'
              : 'bg-surface border-line hover:border-accent/30'
          )}
        >
          <div className={cn(
            'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors',
            m.is_completed
              ? 'bg-accent border-accent'
              : 'border-line'
          )}>
            {m.is_completed && <Check size={12} className="text-white" strokeWidth={3} />}
          </div>
          <div className="flex-1 min-w-0">
            <p className={cn(
              'text-sm font-medium',
              m.is_completed ? 'text-txt-muted line-through' : 'text-txt'
            )}>
              {m.title}
            </p>
            <p className="text-xs text-txt-muted mt-0.5">Month {m.month}</p>
          </div>
          {!m.is_completed && (
            <Circle size={14} className="text-txt-muted flex-shrink-0 mt-1" />
          )}
        </button>
      ))}
    </div>
  )
}
