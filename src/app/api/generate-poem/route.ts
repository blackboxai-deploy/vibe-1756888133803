import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { theme, style = 'free verse', mood = 'neutral' } = body

    if (!theme || theme.trim().length === 0) {
      return NextResponse.json(
        { error: 'Theme is required' },
        { status: 400 }
      )
    }

    // Construct intelligent system prompt based on poem style and mood
    const systemPrompt = createSystemPrompt(style, mood)
    const userPrompt = `Create a ${style} poem with a ${mood} mood about: ${theme}. 
    
    Make the poem meaningful, creative, and emotionally resonant. Focus on vivid imagery and authentic expression.
    
    ${getStyleGuidelines(style)}
    
    Return only the poem text without any additional commentary, titles, or explanations.`

    console.log('Sending request to API with model:', 'anthropic/claude-3.5-sonnet')
    
    // Call Claude via OpenRouter custom endpoint
    const response = await fetch('https://oi-server.onrender.com/chat/completions', {
      method: 'POST',
      headers: {
        'CustomerId': 'cherryypie1111@gmail.com',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer xxx'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.8,
        max_tokens: 500
      })
    })

    console.log('API Response status:', response.status)
    console.log('API Response headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error:', response.status, response.statusText, errorText)
      return NextResponse.json(
        { error: 'Failed to generate poem. Please try again.', details: errorText },
        { status: 500 }
      )
    }

    const data = await response.json()
    console.log('API Response data:', data)
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid API response structure:', data)
      return NextResponse.json(
        { error: 'Invalid response from AI service', response: data },
        { status: 500 }
      )
    }

    const poemContent = data.choices[0].message.content.trim()

    // Create poem object with metadata
    const poem = {
      id: `poem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content: poemContent,
      theme: theme.trim(),
      style: style.toLowerCase(),
      mood: mood.toLowerCase(),
      createdAt: new Date().toISOString()
    }

    return NextResponse.json({ poem })

  } catch (error) {
    console.error('Error generating poem:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}

function createSystemPrompt(style: string, mood: string): string {
  return `You are a gifted poet with expertise in various poetic forms and styles. Your task is to create beautiful, meaningful poetry that captures emotions and paints vivid imagery.

Guidelines:
- Write in ${style} style
- Convey a ${mood} mood and emotional tone
- Use rich, sensory language and metaphors
- Create authentic, heartfelt expression
- Ensure proper rhythm and flow
- Make each line meaningful and purposeful
- Avoid clichés and create original imagery

Remember to follow the specific structural requirements of the chosen poetry style while maintaining emotional authenticity and creative expression.`
}

function getStyleGuidelines(style: string): string {
  const guidelines: { [key: string]: string } = {
    'haiku': 'Follow the traditional 5-7-5 syllable pattern across three lines. Focus on nature, seasons, or moments of reflection. Include a seasonal reference or nature imagery.',
    
    'sonnet': 'Write 14 lines in iambic pentameter with a clear rhyme scheme (ABAB CDCD EFEF GG for Shakespearean or ABBAABBA CDECDE for Petrarchan). Include a turn or shift in perspective.',
    
    'free verse': 'Use natural speech rhythms without strict meter or rhyme. Focus on imagery, line breaks for emphasis, and organic structure that serves the poem\'s meaning.',
    
    'limerick': 'Write exactly 5 lines with AABBA rhyme scheme. Lines 1, 2, and 5 should have 7-10 syllables. Lines 3 and 4 should have 5-7 syllables. Include humor or wit.',
    
    'acrostic': 'Use the first letters of each line to spell out a word related to the theme. Make each line meaningful and connected to create a cohesive poem.',
    
    'cinquain': 'Write 5 lines with a 2-4-6-8-2 syllable pattern. Focus on a single image or moment, building intensity toward the middle and resolving softly.',
    
    'ballad': 'Tell a story in quatrains with ABAB or ABCB rhyme scheme. Use simple language and meter, focusing on narrative and emotion.',
    
    'tanka': 'Write 5 lines with 5-7-5-7-7 syllable pattern. Often more personal and emotional than haiku, can include multiple images or a progression of thought.'
  }
  
  return guidelines[style.toLowerCase()] || 'Write with attention to rhythm, imagery, and emotional impact appropriate to the chosen style.'
}