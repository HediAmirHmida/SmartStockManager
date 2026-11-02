import { NextRequest, NextResponse } from 'next/server'

type ChatMessage = {
  role?: string
  content?: string
}

function toGeminiContents(messages: ChatMessage[]) {
  return messages
    .filter((message) => message.content?.trim())
    .map((message) => ({
      role: message.role === 'assistant' || message.role === 'model' ? 'model' : 'user',
      parts: [{ text: message.content as string }],
    }))
}

function extractText(data: {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
}) {
  return (
    data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? '')
      .join('')
      .trim() || ''
  )
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        {
          response: 'Gemini is not configured. Add GEMINI_API_KEY to your environment variables.',
          error: true,
        },
        { status: 500 }
      )
    }

    const { messages, inventoryData } = await request.json()

    const inventoryContext = inventoryData
      ? `Current inventory data: ${JSON.stringify(inventoryData)}`
      : 'No inventory data available'

    const systemInstruction = `You are an intelligent inventory assistant for a stock management system.
Help users with queries about their inventory, stock levels, sales data, and provide insights.
${inventoryContext}
Be helpful, specific, and provide actionable information.
If users ask about restocking, suggest optimal quantities based on available data.
Keep responses concise but informative.`

    const contents = toGeminiContents(Array.isArray(messages) ? messages : [])
    while (contents.length && contents[0].role !== 'user') {
      contents.shift()
    }
    if (contents.length === 0) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 })
    }

    const models = [
      process.env.GEMINI_MODEL,
      'gemini-flash-lite-latest',
      'gemini-3.5-flash-lite',
      'gemini-3.1-flash-lite',
      'gemini-2.5-flash-lite',
    ].filter((model, index, list): model is string => Boolean(model) && list.indexOf(model) === index)

    const payload = {
      systemInstruction: {
        parts: [{ text: systemInstruction }],
      },
      contents,
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
      },
    }

    let data: { error?: { message?: string }; candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> } | null = null
    let lastError = 'Gemini API error'

    for (const model of models) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey,
          },
          body: JSON.stringify(payload),
        }
      )

      data = await response.json()
      if (response.ok) break

      lastError = data?.error?.message || `Gemini API error: ${response.status}`
      console.error(`Gemini API error (${model}):`, lastError)

      const overloaded = response.status === 429 || response.status === 503 || /high demand|unavailable|overload/i.test(lastError)
      if (!overloaded) break
    }

    if (!data || data.error) {
      return NextResponse.json(
        {
          response: `I'm sorry, I couldn't reach Gemini. ${lastError}`,
          error: true,
        },
        { status: 502 }
      )
    }

    const text = extractText(data)
    if (!text) {
      return NextResponse.json(
        {
          response: "I didn't get a usable response from Gemini. Please try again.",
          error: true,
        },
        { status: 502 }
      )
    }

    return NextResponse.json({
      response: text,
      done: true,
    })
  } catch (error) {
    console.error('AI Chat API error:', error)

    return NextResponse.json(
      {
        response: "I'm sorry, I'm currently unable to process your request. Please try again in a moment.",
        error: true,
      },
      { status: 500 }
    )
  }
}
