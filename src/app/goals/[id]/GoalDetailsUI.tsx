'use client'

import Link from 'next/link'
import { Goal, Milestone, GOAL_CATEGORIES } from '@/types'
import { MilestoneList } from '@/components/MilestoneList'
import { Card } from '@/components/ui/Card'
import { ArrowLeft, Calendar, Heart, Briefcase, Wallet, User, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DeleteGoalButton } from './DeleteGoalButton'
import { GoalStatusSelector } from '@/components/GoalStatusSelector'

const categoryIcons: Record<string, React.ElementType> = {
  health: Heart, career: Briefcase, finance: Wallet, personal: User, learning: BookOpen,
}

const categoryColors: Record<string, { pill: string }> = {
  health:   { pill: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' },
  career:   { pill: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400' },
  finance:  { pill: 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400' },
  personal: { pill: 'bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400' },
  learning: { pill: 'bg-pink-50 text-pink-600 dark:bg-pink-950 dark:text-pink-400' },
}

interface GoalDetailsUIProps {
  goal: Goal
  milestones: Milestone[]
}

export function GoalDetailsUI({ goal, milestones }: GoalDetailsUIProps) {
  const category = GOAL_CATEGORIES.find((c) => c.value === goal.category)
  const Icon = categoryIcons[goal.category] || User
  const colors = categoryColors[goal.category] || categoryColors.personal

  const completed = milestones.filter((m) => m.is_completed).length
  const total = milestones.length
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

  const formatDate = (d: string | null) => {
    if (!d) return null
    return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/goals" className="inline-flex items-center gap-2 text-txt-secondary hover:text-txt mb-6 transition-colors text-sm font-medium">
        <ArrowLeft size={16} />
        Back to Goals
      </Link>

      <Card className="mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', colors.pill)}>
              <Icon size={18} />
            </div>
            <div>
              {category && (
                <span className="text-xs text-txt-secondary tracking-wide uppercase">{category.label}</span>
              )}
              <GoalStatusSelector goalId={goal.id} currentStatus={goal.status} />
            </div>
          </div>
          <DeleteGoalButton goalId={goal.id} />
        </div>

        <h1 className="font-display font-bold text-2xl text-txt tracking-tight mb-3">{goal.title}</h1>

        {goal.description && (
          <p className="text-txt-secondary mb-4 leading-relaxed">{goal.description}</p>
        )}

        {goal.target_date && (
          <div className="flex items-center gap-2 text-txt-secondary text-sm mb-6">
            <Calendar size={14} />
            <span>Target: {formatDate(goal.target_date)}</span>
          </div>
        )}

        {total > 0 && (
          <div className="pt-4 border-t border-line">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-xs text-txt-secondary tracking-wide uppercase">Overall Progress</span>
              <span className="font-semibold text-txt">{pct}%</span>
            </div>
            <div className="w-full bg-line-light rounded-full h-1.5 overflow-hidden">
              <div className="bg-accent rounded-full h-1.5 transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
            <p className="text-sm text-txt-secondary mt-2">{completed} of {total} milestones completed</p>
          </div>
        )}
      </Card>

      <div className="mb-4">
        <h2 className="font-display font-bold text-base text-txt tracking-tight uppercase">Monthly Milestones</h2>
        <p className="text-sm text-txt-secondary">AI-generated roadmap to achieve your goal</p>
      </div>

      {milestones.length > 0 ? (
        <MilestoneList milestones={milestones} goalId={goal.id} />
      ) : (
        <Card>
          <p className="text-txt-secondary text-center py-8">No milestones generated yet. This may take a moment...</p>
        </Card>
      )}
    </div>
  )
}
