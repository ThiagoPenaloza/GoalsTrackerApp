export interface Goal {
  id: string
  user_id: string
  title: string
  description: string | null
  category: 'health' | 'career' | 'finance' | 'personal' | 'learning'
  target_date: string | null
  status: 'active' | 'completed' | 'abandoned'
  created_at: string
  updated_at: string
}

export interface Milestone {
  id: string
  goal_id: string
  title: string
  month: number
  is_completed: boolean
  completed_at: string | null
  created_at: string
}

export interface Checkin {
  id: string
  user_id: string
  goal_id: string
  week_number: number
  progress_note: string | null
  mood: 'great' | 'good' | 'okay' | 'struggling'
  ai_feedback: string | null
  created_at: string
}

export interface GoalWithMilestones extends Goal {
  milestones: Milestone[]
}

export type GoalCategory = Goal['category']
export type GoalStatus = Goal['status']
export type MoodType = Checkin['mood']

export const GOAL_CATEGORIES: { value: GoalCategory; label: string; color: string }[] = [
  { value: 'health', label: 'Health', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'career', label: 'Career', color: 'bg-blue-100 text-blue-700' },
  { value: 'finance', label: 'Finance', color: 'bg-amber-100 text-amber-700' },
  { value: 'personal', label: 'Personal', color: 'bg-purple-100 text-purple-700' },
  { value: 'learning', label: 'Learning', color: 'bg-pink-100 text-pink-700' },
]

export const MOOD_OPTIONS: { value: MoodType; label: string; emoji: string }[] = [
  { value: 'great', label: 'Great', emoji: '🚀' },
  { value: 'good', label: 'Good', emoji: '😊' },
  { value: 'okay', label: 'Okay', emoji: '😐' },
  { value: 'struggling', label: 'Struggling', emoji: '😓' },
]
