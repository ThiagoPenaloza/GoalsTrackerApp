import Link from 'next/link'
import { Goal, Milestone, GOAL_CATEGORIES } from '@/types'
import { Card } from './ui/Card'
import { ArrowRight, Calendar, Heart, Briefcase, Wallet, User, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

const categoryIcons: Record<string, React.ElementType> = {
  health: Heart,
  career: Briefcase,
  finance: Wallet,
  personal: User,
  learning: BookOpen,
}

const categoryAccents: Record<string, { pill: string; bar: string; icon: string }> = {
  health:   { pill: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400', bar: 'bg-emerald-500', icon: 'text-emerald-500' },
  career:   { pill: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400', bar: 'bg-blue-500', icon: 'text-blue-500' },
  finance:  { pill: 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400', bar: 'bg-amber-500', icon: 'text-amber-500' },
  personal: { pill: 'bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400', bar: 'bg-purple-500', icon: 'text-purple-500' },
  learning: { pill: 'bg-pink-50 text-pink-600 dark:bg-pink-950 dark:text-pink-400', bar: 'bg-pink-500', icon: 'text-pink-500' },
}

interface GoalCardProps {
  goal: Goal
  milestones?: Milestone[]
}

export function GoalCard({ goal, milestones = [] }: GoalCardProps) {
  const category = GOAL_CATEGORIES.find((c) => c.value === goal.category)
  const completed = milestones.filter((m) => m.is_completed).length
  const total = milestones.length
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

  const Icon = categoryIcons[goal.category] || User
  const colors = categoryAccents[goal.category] || categoryAccents.personal

  const formatDate = (d: string | null) => {
    if (!d) return null
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <Link href={`/goals/${goal.id}`}>
      <Card hover className="h-full group">
        <div className="flex flex-col h-full">
          {/* Top row: icon + arrow */}
          <div className="flex items-start justify-between mb-4">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', colors.pill)}>
              <Icon size={18} strokeWidth={2} />
            </div>
            <div className="w-7 h-7 rounded-full border border-line flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight size={14} className="text-txt-secondary" />
            </div>
          </div>

          {/* Title */}
          <h3 className="font-display font-bold text-base text-txt tracking-tight mb-1 line-clamp-2">
            {goal.title}
          </h3>

          {/* Category pill */}
          {category && (
            <span className={cn('inline-block self-start text-xs font-medium px-2 py-0.5 rounded-full mb-3', colors.pill)}>
              {category.label}
            </span>
          )}

          {/* Description */}
          {goal.description && (
            <p className="text-sm text-txt-secondary mb-4 line-clamp-2 flex-grow leading-relaxed">
              {goal.description}
            </p>
          )}

          {/* Target date */}
          {goal.target_date && (
            <div className="flex items-center gap-1.5 text-xs text-txt-muted mb-4">
              <Calendar size={13} />
              <span>{formatDate(goal.target_date)}</span>
            </div>
          )}

          {/* Progress */}
          {total > 0 && (
            <div className="mt-auto pt-4 border-t border-line">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-txt-muted text-xs">Progress</span>
                <span className="font-display font-bold text-txt text-xs">{pct}%</span>
              </div>
              <div className="w-full bg-line-light rounded-full h-1.5 overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all duration-500', colors.bar)}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-xs text-txt-muted mt-2">
                {completed}/{total} milestones
              </p>
            </div>
          )}
        </div>
      </Card>
    </Link>
  )
}
