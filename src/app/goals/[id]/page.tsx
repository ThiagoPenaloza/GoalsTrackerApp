import { createClient } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import { Goal, Milestone } from '@/types'
import { Navbar } from '@/components/Navbar'
import { GoalDetailsUI } from './GoalDetailsUI'

interface GoalDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function GoalDetailPage({ params }: GoalDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: goal } = await supabase
    .from('goals').select('*').eq('id', id).eq('user_id', user.id).single()

  if (!goal) notFound()

  const { data: milestones } = await supabase
    .from('milestones').select('*').eq('goal_id', id).order('month', { ascending: true })

  return (
    <div className="min-h-screen bg-bg">
      <Navbar user={{ email: user.email || '' }} />
      <GoalDetailsUI goal={goal as Goal} milestones={(milestones || []) as Milestone[]} />
    </div>
  )
}
