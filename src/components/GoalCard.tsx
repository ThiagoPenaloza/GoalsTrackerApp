import Link from 'next/link'
import { Goal, Milestone, GOAL_CATEGORIES } from '@/types'
import { Card } from './ui/Card'
import { Calendar, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GoalCardProps {
  goal: Goal
  milestones?: Milestone[]
}

export function GoalCard({ goal, milestones = [] }: GoalCardProps) {
  const category = GOAL_CATEGORIES.find((c) => c.value === goal.category)
  const completedMilestones = milestones.filter((m) => m.is_completed).length
  const totalMilestones = milestones.length
  const progressPercentage = totalMilestones > 0
    ? Math.round((completedMilestones / totalMilestones) * 100)
    : 0

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <Link href={`/goals/${goal.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="flex flex-col h-full">
          <div className="flex items-start justify-between mb-3">
            {category && (
              <span className={cn('px-2 py-1 rounded-full text-xs font-medium', category.color)}>
                {category.label}
              </span>
            )}
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>

          <h3 className="text-lg font-semibold text-text mb-2 line-clamp-2">
            {goal.title}
          </h3>

          {goal.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
              {goal.description}
            </p>
          )}

          {goal.target_date && (
            <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(goal.target_date)}</span>
            </div>
          )}

          {totalMilestones > 0 && (
            <div className="mt-auto">
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium text-text">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary rounded-full h-2 transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1.5">
                {completedMilestones} of {totalMilestones} milestones completed
              </p>
            </div>
          )}
        </div>
      </Card>
    </Link>
  )
}
