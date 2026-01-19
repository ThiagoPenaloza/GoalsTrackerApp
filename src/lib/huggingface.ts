import OpenAI from 'openai'

const client = new OpenAI({
  baseURL: 'https://router.huggingface.co/v1',
  apiKey: process.env.HUGGING_FACE_ACCESS_TOKEN,
})

export async function generateText(prompt: string, systemPrompt?: string): Promise<string> {
  const chatCompletion = await client.chat.completions.create({
    model: 'meta-llama/Llama-3.1-8B-Instruct',
    messages: [
      { role: 'system', content: systemPrompt || 'You are a helpful assistant.' },
      { role: 'user', content: prompt }
    ],
    max_tokens: 1000,
    temperature: 0.7,
  })

  return chatCompletion.choices[0].message.content || ''
}

export { client }
