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

  if (!user) redirect('/auth/login')

  const { data: goals } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const typedGoals = (goals || []) as Goal[]
  const goalIds = typedGoals.map((g) => g.id)

  // Only fetch milestones for user's own goals
  const { data: milestones } = goalIds.length > 0
    ? await supabase.from('milestones').select('*').in('goal_id', goalIds)
    : { data: [] }

  const typedMilestones = (milestones || []) as Milestone[]

  return (
    <div className="min-h-screen bg-bg">
      <Navbar user={{ email: user.email || '' }} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8 stagger-1">
          <div>
            <h1 className="font-display font-bold text-2xl text-txt tracking-tight">Your Goals</h1>
            <p className="text-txt-secondary mt-1">Track and manage your 2026 goals</p>
          </div>
          <Link
            href="/goals/new"
            className="inline-flex items-center gap-2 bg-accent text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-orange-600 transition-colors"
          >
            <Plus size={16} strokeWidth={2.5} />
            New Goal
          </Link>
        </div>

        {typedGoals.length === 0 ? (
          <EmptyState
            title="No goals yet"
            description="Create your first goal and let AI generate a milestone roadmap for you."
            actionLabel="Create Goal"
            actionHref="/goals/new"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-2">
            {typedGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                milestones={typedMilestones.filter((m) => m.goal_id === goal.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
