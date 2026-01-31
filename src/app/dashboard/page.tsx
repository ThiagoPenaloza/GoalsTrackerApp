import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { Goal, Milestone, Checkin } from '@/types'
import { Navbar } from '@/components/Navbar'
import { GoalCard } from '@/components/GoalCard'
import { EmptyState } from '@/components/EmptyState'
import { ProgressRing } from '@/components/ProgressRing'
import { Card } from '@/components/ui/Card'
import { Target, TrendingUp, Flame, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  // First get user's goals
  const { data: goalsData } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const goals = (goalsData || []) as Goal[]
  const goalIds = goals.map((g) => g.id)

  // Then fetch milestones ONLY for user's goals and checkins
  const [milestonesResult, checkinsResult] = await Promise.all([
    goalIds.length > 0
      ? supabase.from('milestones').select('*').in('goal_id', goalIds)
      : Promise.resolve({ data: [] }),
    supabase.from('checkins').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1),
  ])

  const milestones = (milestonesResult.data || []) as Milestone[]
  const latestCheckin = (checkinsResult.data?.[0] || null) as Checkin | null

  const activeGoals = goals.filter((g) => g.status === 'active')
  const goalMilestones = milestones.filter((m) => goals.some((g) => g.id === m.goal_id))
  const completedMs = goalMilestones.filter((m) => m.is_completed)
  const overallProgress = goalMilestones.length > 0
    ? Math.round((completedMs.length / goalMilestones.length) * 100)
    : 0
  const streak = latestCheckin ? 1 : 0

  const goalsWithMilestones = activeGoals.slice(0, 4).map((goal) => ({
    goal,
    milestones: milestones.filter((m) => m.goal_id === goal.id),
  }))

  return (
    <div className="min-h-screen bg-bg">
      <Navbar user={{ email: user.email || '' }} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8 stagger-1">
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-txt tracking-tight">
            Welcome back
          </h1>
          <p className="text-txt-secondary mt-1">Here&apos;s how your goals are progressing.</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-2">
          <StatCard icon={<Target size={20} />} value={activeGoals.length} label="Active Goals" />
          <StatCard icon={<TrendingUp size={20} />} value={completedMs.length} label="Milestones Done" />
          <StatCard icon={<Flame size={20} />} value={streak} label="Week Streak" />
          <Card className="flex items-center gap-4">
            <ProgressRing progress={overallProgress} size="sm" />
            <div>
              <p className="text-xs text-txt-muted font-medium">Overall</p>
              <p className="text-sm font-semibold text-txt">{completedMs.length}/{goalMilestones.length} done</p>
            </div>
          </Card>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 stagger-3">
          {/* Goals */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-lg text-txt tracking-tight">Your Goals</h2>
              <Link href="/goals" className="inline-flex items-center gap-1.5 text-sm font-medium text-txt-secondary hover:text-accent transition-colors">
                View all <ArrowRight size={14} />
              </Link>
            </div>

            {goalsWithMilestones.length === 0 ? (
              <EmptyState
                title="No goals yet"
                description="Start by setting your first goal. AI will generate milestones for you."
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

          {/* AI Feedback sidebar */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-lg text-txt tracking-tight">AI Wisdom</h2>
              <Link href="/checkin" className="inline-flex items-center gap-1.5 text-sm font-medium text-txt-secondary hover:text-accent transition-colors">
                Check-in <ArrowRight size={14} />
              </Link>
            </div>

            <Card>
              {latestCheckin?.ai_feedback ? (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center">
                      <Sparkles size={18} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-accent">AI Coach</p>
                      <p className="text-xs text-txt-muted">Week {latestCheckin.week_number}</p>
                    </div>
                  </div>
                  <p className="text-txt-secondary text-sm leading-relaxed italic border-l-2 border-accent/30 pl-4">
                    &ldquo;{latestCheckin.ai_feedback}&rdquo;
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center mx-auto mb-4">
                    <Sparkles size={20} className="text-accent" />
                  </div>
                  <p className="text-txt font-semibold mb-1">No reflections yet</p>
                  <p className="text-txt-secondary text-sm mb-4">Complete a check-in for AI insights</p>
                  <Link href="/checkin" className="inline-flex items-center gap-2 bg-accent text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-orange-600 transition-colors">
                    Start Check-in <ArrowRight size={14} />
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

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <Card className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center text-accent flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="font-display font-bold text-xl text-txt">{value}</p>
        <p className="text-xs text-txt-muted font-medium">{label}</p>
      </div>
    </Card>
  )
}
