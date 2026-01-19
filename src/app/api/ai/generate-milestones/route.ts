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

export async function POST(request: NextRequest) {
  try {
    const { goalId, title, description, category } = await request.json()

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

    // Generate milestones using Hugging Face Router with OpenAI client
    const prompt = `Given a user's goal, generate exactly 12 monthly milestones (one for each month of the year) that will help them achieve their goal progressively.

Goal: ${title}
${description ? `Description: ${description}` : ''}
${category ? `Category: ${category}` : ''}

Respond with ONLY a valid JSON array of 12 objects, each with "month" (1-12) and "title" (a specific, actionable milestone). No other text.

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

      // Ensure we have 12 milestones
      milestones = milestones.slice(0, 12)
      while (milestones.length < 12) {
        milestones.push({
          month: milestones.length + 1,
          title: `Continue working on ${title}`,
        })
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      console.error('Raw response:', responseText)
      // Generate fallback milestones
      milestones = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        title: `Month ${i + 1}: Progress milestone for ${title}`,
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
