'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { GoalStatus } from '@/types'
import { ChevronDown, Check, X, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

const statusConfig: Record<GoalStatus, { label: string; color: string; icon: React.ElementType }> = {
  active:    { label: 'Active',    color: 'text-accent bg-accent-light',        icon: Circle },
  completed: { label: 'Done',      color: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950', icon: Check },
  abandoned: { label: 'Dropped',   color: 'text-red-500 bg-red-50 dark:text-red-400 dark:bg-red-950',     icon: X },
}

interface GoalStatusSelectorProps {
  goalId: string
  currentStatus: GoalStatus
}

export function GoalStatusSelector({ goalId, currentStatus }: GoalStatusSelectorProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleChange = async (status: GoalStatus) => {
    setOpen(false)
    await supabase.from('goals').update({ status }).eq('id', goalId)
    router.refresh()
  }

  const current = statusConfig[currentStatus]

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors',
          current.color
        )}
      >
        {current.label}
        <ChevronDown size={12} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 bg-surface border border-line rounded-xl shadow-card-hover py-1 z-20 min-w-[120px]">
            {(Object.entries(statusConfig) as [GoalStatus, typeof current][]).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => handleChange(key)}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 text-xs font-medium hover:bg-surface-raised transition-colors',
                  key === currentStatus ? 'text-accent' : 'text-txt-secondary'
                )}
              >
                <cfg.icon size={14} />
                {cfg.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
