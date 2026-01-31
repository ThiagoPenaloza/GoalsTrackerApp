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

    // Update milestone - also filter by goal_id for extra security
    // RLS policies in Supabase should also enforce ownership
    await supabase
      .from('milestones')
      .update({
        is_completed: !milestone.is_completed,
        completed_at: !milestone.is_completed ? new Date().toISOString() : null,
      })
      .eq('id', milestone.id)
      .eq('goal_id', goalId)

    router.refresh()
    setLoadingId(null)
  }

  // Detect weekly mode: more milestones than unique month values
  const uniqueMonths = new Set(milestones.map((m) => m.month)).size
  const isWeekly = milestones.length > uniqueMonths

  // Group milestones by month for rendering with headers
  const grouped = milestones.reduce<Record<number, Milestone[]>>((acc, m) => {
    const key = m.month
    if (!acc[key]) acc[key] = []
    acc[key].push(m)
    return acc
  }, {})

  const sortedMonths = Object.keys(grouped).map(Number).sort((a, b) => a - b)

  let weekCounter = 0

  return (
    <div className="space-y-4">
      {sortedMonths.map((month) => (
        <div key={month}>
          {/* Month group header */}
          <p className="text-xs font-semibold text-txt-muted uppercase tracking-wider mb-2">
            Month {month}
          </p>
          <div className="space-y-2">
            {grouped[month].map((m) => {
              weekCounter++
              const label = isWeekly ? `Week ${weekCounter}` : `Month ${m.month}`
              return (
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
                      {m.title.replace(/^(Week|Month)\s*\d+:\s*/i, '')}
                    </p>
                    {isWeekly && (
                      <p className="text-xs text-txt-muted mt-0.5">{label}</p>
                    )}
                  </div>
                  {!m.is_completed && (
                    <Circle size={14} className="text-txt-muted flex-shrink-0 mt-1" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
