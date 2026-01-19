import { createClient } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import { Goal, Milestone, GOAL_CATEGORIES } from '@/types'
import { Navbar } from '@/components/Navbar'
import { MilestoneList } from '@/components/MilestoneList'
import { Card } from '@/components/ui/Card'
import { ArrowLeft, Calendar, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { DeleteGoalButton } from './DeleteGoalButton'
import { GoalStatusSelector } from '@/components/GoalStatusSelector'

interface GoalDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function GoalDetailPage({ params }: GoalDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: goal } = await supabase
    .from('goals')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!goal) {
    notFound()
  }

  const { data: milestones } = await supabase
    .from('milestones')
    .select('*')
    .eq('goal_id', id)
    .order('month', { ascending: true })

  const typedGoal = goal as Goal
  const typedMilestones = (milestones || []) as Milestone[]
  const category = GOAL_CATEGORIES.find((c) => c.value === typedGoal.category)

  const completedCount = typedMilestones.filter((m) => m.is_completed).length
  const totalCount = typedMilestones.length
  const progressPercentage = totalCount > 0
    ? Math.round((completedCount / totalCount) * 100)
    : 0

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={{ email: user.email || '' }} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/goals"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Goals
        </Link>

        <Card className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {category && (
                <span className={cn('px-3 py-1 rounded-full text-sm font-medium', category.color)}>
                  {category.label}
                </span>
              )}
              <GoalStatusSelector goalId={typedGoal.id} currentStatus={typedGoal.status} />
            </div>
            <DeleteGoalButton goalId={typedGoal.id} />
          </div>

          <h1 className="text-2xl font-bold text-text mb-2">{typedGoal.title}</h1>

          {typedGoal.description && (
            <p className="text-gray-600 mb-4">{typedGoal.description}</p>
          )}

          {typedGoal.target_date && (
            <div className="flex items-center gap-2 text-gray-500 mb-6">
              <Calendar className="w-4 h-4" />
              <span>Target: {formatDate(typedGoal.target_date)}</span>
            </div>
          )}

          {totalCount > 0 && (
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Overall Progress</span>
                <span className="font-semibold text-text">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-primary rounded-full h-3 transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {completedCount} of {totalCount} milestones completed
              </p>
            </div>
          )}
        </Card>

        <div className="mb-4">
          <h2 className="text-xl font-semibold text-text">Monthly Milestones</h2>
          <p className="text-gray-600 text-sm">AI-generated roadmap to achieve your goal</p>
        </div>

        {typedMilestones.length > 0 ? (
          <MilestoneList milestones={typedMilestones} goalId={id} />
        ) : (
          <Card>
            <p className="text-gray-500 text-center py-8">
              No milestones generated yet. This may take a moment...
            </p>
          </Card>
        )}
      </main>
    </div>
  )
}
