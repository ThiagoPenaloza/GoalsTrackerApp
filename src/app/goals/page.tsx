import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { Goal, Milestone } from '@/types'
import { Navbar } from '@/components/Navbar'
import { GoalCard } from '@/components/GoalCard'
import { EmptyState } from '@/components/EmptyState'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function GoalsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: goals } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const { data: milestones } = await supabase
    .from('milestones')
    .select('*')

  const goalsWithMilestones = (goals as Goal[] || []).map((goal) => ({
    goal,
    milestones: (milestones as Milestone[] || []).filter((m) => m.goal_id === goal.id),
  }))

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={{ email: user.email || '' }} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text">Your Goals</h1>
            <p className="text-gray-600 mt-1">Track and manage your 2026 goals</p>
          </div>
          <Link
            href="/goals/new"
            className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Goal
          </Link>
        </div>

        {goalsWithMilestones.length === 0 ? (
          <EmptyState
            title="No goals yet"
            description="Start your journey by creating your first goal. Our AI will help you break it down into monthly milestones."
            actionLabel="Create Your First Goal"
            actionHref="/goals/new"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goalsWithMilestones.map(({ goal, milestones }) => (
              <GoalCard key={goal.id} goal={goal} milestones={milestones} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
