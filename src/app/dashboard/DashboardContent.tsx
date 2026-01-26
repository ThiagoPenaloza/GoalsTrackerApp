import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { Goal, Milestone, Checkin } from '@/types'

export async function DashboardContent() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const [goalsResult, milestonesResult, checkinsResult] = await Promise.all([
    supabase.from('goals').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('milestones').select('*'),
    supabase.from('checkins').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1),
  ])

  const goals = (goalsResult.data || []) as Goal[]
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
