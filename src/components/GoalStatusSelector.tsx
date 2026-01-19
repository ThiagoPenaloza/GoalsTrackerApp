'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { GoalStatus } from '@/types'
import { cn } from '@/lib/utils'
import { Check, X, Circle, ChevronDown } from 'lucide-react'

interface GoalStatusSelectorProps {
  goalId: string
  currentStatus: GoalStatus
}

const STATUS_OPTIONS: { value: GoalStatus; label: string; icon: typeof Check; color: string }[] = [
  { value: 'active', label: 'Active', icon: Circle, color: 'text-primary bg-primary/10' },
  { value: 'completed', label: 'Completed', icon: Check, color: 'text-success bg-success/10' },
  { value: 'abandoned', label: 'Abandoned', icon: X, color: 'text-gray-500 bg-gray-100' },
]

export function GoalStatusSelector({ goalId, currentStatus }: GoalStatusSelectorProps) {
  const [status, setStatus] = useState<GoalStatus>(currentStatus)
  const [isOpen, setIsOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const currentOption = STATUS_OPTIONS.find((opt) => opt.value === status)

  const handleStatusChange = async (newStatus: GoalStatus) => {
    if (newStatus === status) {
      setIsOpen(false)
      return
    }

    setIsUpdating(true)
    setIsOpen(false)

    const { error } = await supabase
      .from('goals')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', goalId)

    if (!error) {
      setStatus(newStatus)
      router.refresh()
    }

    setIsUpdating(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isUpdating}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all',
          currentOption?.color,
          'border-current/20 hover:border-current/40',
          isUpdating && 'opacity-50 cursor-not-allowed'
        )}
      >
        {currentOption && (
          <>
            <currentOption.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{currentOption.label}</span>
            <ChevronDown className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')} />
          </>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border z-20 py-1">
            {STATUS_OPTIONS.map((option) => {
              const Icon = option.icon
              const isSelected = option.value === status
              return (
                <button
                  key={option.value}
                  onClick={() => handleStatusChange(option.value)}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors',
                    isSelected
                      ? option.color
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{option.label}</span>
                  {isSelected && <Check className="w-4 h-4 ml-auto" />}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
