import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { Goal, Milestone, Checkin } from '@/types'
import { Navbar } from '@/components/Navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ProgressRing } from '@/components/ProgressRing'
import { GoalCard } from '@/components/GoalCard'
import { EmptyState } from '@/components/EmptyState'
import { Target, Flame, MessageSquare, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch all data
  const [goalsResult, milestonesResult, checkinsResult] = await Promise.all([
    supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase.from('milestones').select('*'),
    supabase
      .from('checkins')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1),
  ])

  const goals = (goalsResult.data || []) as Goal[]
  const milestones = (milestonesResult.data || []) as Milestone[]
  const latestCheckin = (checkinsResult.data?.[0] || null) as Checkin | null

  const activeGoals = goals.filter((g) => g.status === 'active')
  const completedGoals = goals.filter((g) => g.status === 'completed')

  // Calculate overall progress
  const goalMilestones = milestones.filter((m) =>
    goals.some((g) => g.id === m.goal_id)
  )
  const completedMilestones = goalMilestones.filter((m) => m.is_completed)
  const overallProgress =
    goalMilestones.length > 0
      ? Math.round((completedMilestones.length / goalMilestones.length) * 100)
      : 0

  // Calculate streak (simplified - count consecutive weeks with check-ins)
  const streak = latestCheckin ? 1 : 0 // Simplified for demo

  const goalsWithMilestones = activeGoals.slice(0, 3).map((goal) => ({
    goal,
    milestones: milestones.filter((m) => m.goal_id === goal.id),
  }))

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={{ email: user.email || '' }} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text">
            Welcome back!
          </h1>
          <p className="text-gray-600 mt-1">
            Here&apos;s your progress on achieving your 2026 goals
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="bg-primary/10 rounded-full p-3">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text">{activeGoals.length}</p>
                <p className="text-sm text-gray-600">Active Goals</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="bg-success/10 rounded-full p-3">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text">{completedMilestones.length}</p>
                <p className="text-sm text-gray-600">Milestones Done</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="bg-warning/10 rounded-full p-3">
                <Flame className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text">{streak}</p>
                <p className="text-sm text-gray-600">Week Streak</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <ProgressRing progress={overallProgress} size="sm" />
              <div>
                <p className="text-sm font-medium text-text">Overall Progress</p>
                <p className="text-xs text-gray-600">
                  {completedMilestones.length}/{goalMilestones.length} milestones
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Goals */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-text">Your Goals</h2>
              <Link
                href="/goals"
                className="text-primary text-sm font-medium hover:underline"
              >
                View all
              </Link>
            </div>

            {goalsWithMilestones.length === 0 ? (
              <EmptyState
                title="No goals yet"
                description="Start your journey by creating your first goal"
                actionLabel="Create Goal"
                actionHref="/goals/new"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goalsWithMilestones.map(({ goal, milestones }) => (
                  <GoalCard key={goal.id} goal={goal} milestones={milestones} />
                ))}
              </div>
            )}
          </div>

          {/* Latest Feedback */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-text">Latest Feedback</h2>
              <Link
                href="/checkin"
                className="text-primary text-sm font-medium hover:underline"
              >
                Check-in
              </Link>
            </div>

            <Card>
              {latestCheckin?.ai_feedback ? (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium text-primary">AI Coach</span>
                  </div>
                  <p className="text-gray-700">{latestCheckin.ai_feedback}</p>
                  <p className="text-xs text-gray-400 mt-3">
                    Week {latestCheckin.week_number}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center py-6 text-gray-500">
                  <MessageSquare className="w-10 h-10 mb-2 opacity-50" />
                  <p className="text-sm">No feedback yet</p>
                  <Link
                    href="/checkin"
                    className="text-primary text-sm font-medium mt-2 hover:underline"
                  >
                    Do your first check-in
                  </Link>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
