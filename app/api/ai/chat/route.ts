import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { messages, inventoryData } = await request.json()

    // Prepare the context with inventory data
    const inventoryContext = inventoryData ?
      `Current inventory data: ${JSON.stringify(inventoryData)}` :
      'No inventory data available'

    // Prepare messages for Ollama
    const systemMessage = {
      role: 'system',
      content: `You are an intelligent inventory assistant for a stock management system.
      Help users with queries about their inventory, stock levels, sales data, and provide insights.
      ${inventoryContext}
      Be helpful, specific, and provide actionable information.
      If users ask about restocking, suggest optimal quantities based on available data.
      Keep responses concise but informative.`
    }

    const conversationMessages = [systemMessage, ...messages]

    // Call Ollama API
    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3.2:1b',
        messages: conversationMessages,
        stream: false, // We'll handle streaming later if needed
        options: {
          temperature: 0.7,
          top_p: 0.9,
        }
      }),
    })

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json({
      response: data.message.content,
      done: data.done
    })

  } catch (error) {
    console.error('AI Chat API error:', error)

    // Fallback response if Ollama is not available
    return NextResponse.json({
      response: "I'm sorry, I'm currently unable to process your request. Please make sure Ollama is running locally. You can start it by running 'ollama serve' in your terminal.",
      error: true
    }, { status: 500 })
  }
}