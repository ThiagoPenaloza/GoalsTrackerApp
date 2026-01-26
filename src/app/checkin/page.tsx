import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { Goal, Checkin } from '@/types'
import { Navbar } from '@/components/Navbar'
import { CheckinForm } from '@/components/CheckinForm'
import { Card } from '@/components/ui/Card'
import { MessageCircle, Sparkles } from 'lucide-react'

export default async function CheckinPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: goals } = await supabase
    .from('goals').select('*').eq('user_id', user.id).eq('status', 'active').order('created_at', { ascending: false })

  const { data: recentCheckins } = await supabase
    .from('checkins').select('*, goals(title)').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5)

  const typedGoals = (goals || []) as Goal[]
  const typedCheckins = (recentCheckins || []) as (Checkin & { goals: { title: string } })[]

  return (
    <div className="min-h-screen bg-bg">
      <Navbar user={{ email: user.email || '' }} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 stagger-1">
          <h1 className="font-display font-bold text-2xl text-txt tracking-tight">Weekly Check-in</h1>
          <p className="text-txt-secondary mt-1">Reflect on your progress and get AI coaching</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3 stagger-2">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center">
                  <MessageCircle size={18} className="text-accent" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-base text-txt">New Check-in</h2>
                  <p className="text-xs text-txt-muted">How was your week?</p>
                </div>
              </div>
              <CheckinForm goals={typedGoals} userId={user.id} />
            </Card>
          </div>

          {/* Recent checkins */}
          <div className="lg:col-span-2 stagger-3">
            <h3 className="font-display font-bold text-base text-txt tracking-tight mb-4">Recent Check-ins</h3>
            {typedCheckins.length === 0 ? (
              <Card>
                <p className="text-txt-secondary text-sm text-center py-6">No check-ins yet</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {typedCheckins.map((checkin) => (
                  <Card key={checkin.id}>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-accent-light flex items-center justify-center flex-shrink-0">
                        <Sparkles size={14} className="text-accent" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-txt truncate">{checkin.goals?.title}</p>
                        <p className="text-xs text-txt-muted">Week {checkin.week_number}</p>
                        {checkin.ai_feedback && (
                          <p className="text-xs text-txt-secondary mt-2 leading-relaxed italic line-clamp-2">
                            &ldquo;{checkin.ai_feedback}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>
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
