import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

const client = new OpenAI({
  baseURL: 'https://router.huggingface.co/v1',
  apiKey: process.env.HUGGING_FACE_ACCESS_TOKEN,
})

export async function POST(request: NextRequest) {
  try {
    const { checkinId, goalTitle, progressNote, mood, weekNumber } = await request.json()

    if (!checkinId || !goalTitle) {
      return NextResponse.json(
        { error: 'Check-in ID and goal title are required' },
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

    // Generate coaching feedback using Hugging Face Router with OpenAI client
    const moodContext = {
      great: 'The user is feeling great and motivated.',
      good: 'The user is feeling good about their progress.',
      okay: 'The user is feeling okay, might need some encouragement.',
      struggling: 'The user is struggling and needs support and motivation.',
    }

    const prompt = `Provide brief, personalized feedback (2-3 sentences) based on this weekly check-in.

Goal: ${goalTitle}
Week: ${weekNumber} of 52
Mood: ${mood} - ${moodContext[mood as keyof typeof moodContext] || ''}
Progress Note: ${progressNote || 'No notes provided'}

Give motivational, actionable feedback. Be warm but concise. Focus on celebrating progress or offering support based on their mood.`

    const chatCompletion = await client.chat.completions.create({
      model: 'meta-llama/Llama-3.1-8B-Instruct',
      messages: [
        { role: 'system', content: 'You are an encouraging and supportive goal coach. Keep responses brief (2-3 sentences) and supportive. Be warm and motivational.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 200,
      temperature: 0.8,
    })

    const feedback = chatCompletion.choices[0].message.content?.trim() || 'Keep up the great work on your goals!'

    // Update the check-in with AI feedback - ONLY if it belongs to current user
    const { error: updateError } = await supabase
      .from('checkins')
      .update({ ai_feedback: feedback })
      .eq('id', checkinId)
      .eq('user_id', user.id)

    if (updateError) {
      console.error('Failed to update check-in:', updateError)
      return NextResponse.json(
        { error: 'Failed to save feedback' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, feedback })
  } catch (error) {
    console.error('Error generating feedback:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('AI API Error Details:', errorMessage)
    return NextResponse.json(
      { error: 'Failed to generate feedback', details: errorMessage },
      { status: 500 }
    )
  }
}
