import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

const client = new OpenAI({
  baseURL: 'https://router.huggingface.co/v1',
  apiKey: process.env.HUGGING_FACE_ACCESS_TOKEN,
})

interface MilestoneData {
  month: number
  title: string
}

function calculateMonths(targetDate: string | null): number {
  if (!targetDate) return 12

  const now = new Date()
  const target = new Date(targetDate)
  const diffMs = target.getTime() - now.getTime()
  const diffMonths = Math.ceil(diffMs / (1000 * 60 * 60 * 24 * 30.44))

  return Math.max(1, Math.min(diffMonths, 24))
}

export async function POST(request: NextRequest) {
  try {
    const { goalId, title, description, category, targetDate } = await request.json()

    if (!goalId || !title) {
      return NextResponse.json(
        { error: 'Goal ID and title are required' },
        { status: 400 }
      )
    }

    // Create Supabase client
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    // Verify user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify the goal belongs to the current user
    const { data: goal, error: goalError } = await supabase
      .from('goals')
      .select('id')
      .eq('id', goalId)
      .eq('user_id', user.id)
      .single()

    if (goalError || !goal) {
      return NextResponse.json({ error: 'Goal not found or access denied' }, { status: 403 })
    }

    const numMonths = calculateMonths(targetDate)
    const isShortTerm = numMonths <= 3
    const targetSteps = isShortTerm ? numMonths * 4 : numMonths
    const granularity = isShortTerm ? 'weekly' : 'monthly'

    // Generate milestones using Hugging Face Router with OpenAI client
    const prompt = isShortTerm
      ? `Given a user's goal, generate exactly ${targetSteps} weekly milestones (roughly 4 per month over ${numMonths} month${numMonths > 1 ? 's' : ''}) that will help them achieve their goal progressively.

Goal: ${title}
${description ? `Description: ${description}` : ''}
${category ? `Category: ${category}` : ''}
Timeline: ${numMonths} month${numMonths > 1 ? 's' : ''} (${targetSteps} weeks)

Respond with ONLY a valid JSON array of ${targetSteps} objects, each with "month" (the actual month number this week falls in, 1-${numMonths}) and "title" (a specific, actionable milestone WITHOUT any "Week X:" prefix — just the objective). Roughly 4 items should share each month number. No other text.

Example format for a 2-month goal with 8 steps:
[{"month":1,"title":"Research and create a detailed plan"},{"month":1,"title":"Set up tracking system"},{"month":1,"title":"Begin initial practice"},{"month":1,"title":"Review first progress"},{"month":2,"title":"Increase intensity"},{"month":2,"title":"Tackle harder challenges"},{"month":2,"title":"Refine approach"},{"month":2,"title":"Complete final push"}]`
      : `Given a user's goal, generate exactly ${targetSteps} monthly milestones (one for each month over a ${numMonths}-month period) that will help them achieve their goal progressively.

Goal: ${title}
${description ? `Description: ${description}` : ''}
${category ? `Category: ${category}` : ''}
Timeline: ${numMonths} months

Respond with ONLY a valid JSON array of ${targetSteps} objects, each with "month" (1-${targetSteps}) and "title" (a specific, actionable milestone). No other text.

Example format:
[{"month":1,"title":"Research and create a detailed plan"},{"month":2,"title":"Start with basic steps"}...]`

    const chatCompletion = await client.chat.completions.create({
      model: 'meta-llama/Llama-3.1-8B-Instruct',
      messages: [
        { role: 'system', content: 'You are a goal-planning assistant that only responds with valid JSON arrays. Never include any text outside of the JSON array.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1500,
      temperature: 0.7,
    })

    const responseText = chatCompletion.choices[0].message.content || ''

    // Parse the generated milestones
    let milestones: MilestoneData[]
    try {
      const text = responseText.trim()
      // Find the JSON array in the response
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (!jsonMatch) {
        throw new Error('No JSON array found in response')
      }
      milestones = JSON.parse(jsonMatch[0])

      // Validate the structure
      if (!Array.isArray(milestones) || milestones.length === 0) {
        throw new Error('Invalid milestones format')
      }

      // Ensure we have exactly targetSteps milestones
      milestones = milestones.slice(0, targetSteps)
      while (milestones.length < targetSteps) {
        const step = milestones.length + 1
        const month = isShortTerm ? Math.ceil(step / 4) : step
        milestones.push({
          month: Math.min(month, numMonths),
          title: `Continue working on ${title}`,
        })
      }

      // Clamp all month values to valid range
      if (isShortTerm) {
        milestones = milestones.map((m, i) => ({
          ...m,
          month: Math.min(Math.max(m.month, 1), numMonths),
        }))
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      console.error('Raw response:', responseText)
      // Generate fallback milestones
      milestones = Array.from({ length: targetSteps }, (_, i) => ({
        month: isShortTerm ? Math.min(Math.ceil((i + 1) / 4), numMonths) : i + 1,
        title: `Progress milestone for ${title}`,
      }))
    }

    // Insert milestones into database
    const milestonesToInsert = milestones.map((m) => ({
      goal_id: goalId,
      title: m.title,
      month: m.month,
      is_completed: false,
    }))

    const { error: insertError } = await supabase
      .from('milestones')
      .insert(milestonesToInsert)

    if (insertError) {
      console.error('Failed to insert milestones:', insertError)
      return NextResponse.json(
        { error: 'Failed to save milestones' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, milestones: milestonesToInsert })
  } catch (error) {
    console.error('Error generating milestones:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('AI API Error Details:', errorMessage)
    return NextResponse.json(
      { error: 'Failed to generate milestones', details: errorMessage },
      { status: 500 }
    )
  }
}
