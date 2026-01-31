import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { Goal, Milestone, Checkin } from '@/types'

export async function DashboardContent() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  // First fetch user's goals
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
  const completedMilestones = goalMilestones.filter((m) => m.is_completed)
  const overallProgress = goalMilestones.length > 0
    ? Math.round((completedMilestones.length / goalMilestones.length) * 100)
    : 0

  return { goals, milestones, latestCheckin, activeGoals, completedMilestones, goalMilestones, overallProgress }
}
