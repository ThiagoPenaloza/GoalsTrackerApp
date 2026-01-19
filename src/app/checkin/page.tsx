import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { Goal, Checkin } from '@/types'
import { Navbar } from '@/components/Navbar'
import { CheckinForm } from '@/components/CheckinForm'
import { Card } from '@/components/ui/Card'
import { MessageSquare } from 'lucide-react'

export default async function CheckinPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: goals } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  const { data: recentCheckins } = await supabase
    .from('checkins')
    .select('*, goals(title)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const typedGoals = (goals || []) as Goal[]
  const typedCheckins = (recentCheckins || []) as (Checkin & { goals: { title: string } })[]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={{ email: user.email || '' }} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text">Weekly Check-in</h1>
          <p className="text-gray-600 mt-1">
            Reflect on your progress and get AI coaching feedback
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CheckinForm goals={typedGoals} userId={user.id} />

          <div>
            <h2 className="text-xl font-semibold text-text mb-4">Recent Check-ins</h2>

            {typedCheckins.length === 0 ? (
              <Card>
                <div className="flex flex-col items-center py-8 text-gray-500">
                  <MessageSquare className="w-12 h-12 mb-2 opacity-50" />
                  <p>No check-ins yet</p>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {typedCheckins.map((checkin) => (
                  <Card key={checkin.id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm font-medium text-primary">
                        {checkin.goals?.title}
                      </span>
                      <span className="text-xs text-gray-500">
                        Week {checkin.week_number}
                      </span>
                    </div>

                    {checkin.progress_note && (
                      <p className="text-gray-700 text-sm mb-2">
                        {checkin.progress_note}
                      </p>
                    )}

                    {checkin.ai_feedback && (
                      <div className="bg-primary/5 rounded-lg p-3 mt-2">
                        <p className="text-xs font-medium text-primary mb-1">
                          AI Feedback
                        </p>
                        <p className="text-sm text-gray-700">{checkin.ai_feedback}</p>
                      </div>
                    )}

                    <p className="text-xs text-gray-400 mt-2">
                      {formatDate(checkin.created_at)}
                    </p>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
