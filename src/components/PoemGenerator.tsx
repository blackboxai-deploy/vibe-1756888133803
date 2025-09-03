'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Loader2 } from 'lucide-react'
import type { Poem } from '@/app/page'

interface PoemGeneratorProps {
  onPoemGenerated: (poem: Poem) => void
  onGenerationStart: () => void
  onGenerationError: () => void
  isGenerating: boolean
}

const poemStyles = [
  { value: 'free verse', label: 'Free Verse', description: 'Natural rhythm, no strict rules' },
  { value: 'haiku', label: 'Haiku', description: '5-7-5 syllable pattern' },
  { value: 'sonnet', label: 'Sonnet', description: '14 lines with rhyme scheme' },
  { value: 'limerick', label: 'Limerick', description: 'Humorous 5-line poem' },
  { value: 'tanka', label: 'Tanka', description: '5-7-5-7-7 syllable pattern' },
  { value: 'cinquain', label: 'Cinquain', description: '5 lines with syllable pattern' },
  { value: 'ballad', label: 'Ballad', description: 'Narrative song-like poem' },
  { value: 'acrostic', label: 'Acrostic', description: 'First letters spell a word' }
]

const poemMoods = [
  { value: 'joyful', label: 'Joyful', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'melancholy', label: 'Melancholy', color: 'bg-blue-100 text-blue-800' },
  { value: 'romantic', label: 'Romantic', color: 'bg-pink-100 text-pink-800' },
  { value: 'inspirational', label: 'Inspirational', color: 'bg-green-100 text-green-800' },
  { value: 'peaceful', label: 'Peaceful', color: 'bg-purple-100 text-purple-800' },
  { value: 'mysterious', label: 'Mysterious', color: 'bg-gray-100 text-gray-800' },
  { value: 'nostalgic', label: 'Nostalgic', color: 'bg-orange-100 text-orange-800' },
  { value: 'dramatic', label: 'Dramatic', color: 'bg-red-100 text-red-800' }
]

const themeExamples = [
  'Autumn forest',
  'First love',
  'City at night',
  'Ocean waves',
  'Childhood memories',
  'Mountain sunrise',
  'Rainy afternoon',
  'Dancing stars'
]

export function PoemGenerator({ onPoemGenerated, onGenerationStart, onGenerationError, isGenerating }: PoemGeneratorProps) {
  const [theme, setTheme] = useState('')
  const [style, setStyle] = useState('free verse')
  const [mood, setMood] = useState('peaceful')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!theme.trim()) {
      setError('Please enter a theme or topic for your poem.')
      return
    }

    setError(null)
    onGenerationStart()

    try {
      const response = await fetch('/api/generate-poem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          theme: theme.trim(),
          style,
          mood
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate poem')
      }

      if (data.poem) {
        onPoemGenerated(data.poem)
      } else {
        throw new Error('Invalid response format')
      }

    } catch (err) {
      console.error('Error generating poem:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate poem. Please try again.')
      onGenerationError()
    }
  }

  const handleThemeExampleClick = (example: string) => {
    setTheme(example)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Theme Input */}
      <div className="space-y-2">
        <Label htmlFor="theme" className="text-sm font-medium text-gray-700">
          What would you like your poem to be about?
        </Label>
        <Textarea
          id="theme"
          placeholder="Enter a theme, topic, or describe what inspires you..."
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="min-h-[100px] resize-none"
          disabled={isGenerating}
        />
        
        {/* Theme Examples */}
        <div className="space-y-2">
          <p className="text-xs text-gray-500">Try these examples:</p>
          <div className="flex flex-wrap gap-2">
            {themeExamples.map((example) => (
              <Button
                key={example}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleThemeExampleClick(example)}
                disabled={isGenerating}
                className="h-7 px-3 text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200"
              >
                {example}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Poem Style Selection */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Poem Style</Label>
        <Select value={style} onValueChange={setStyle} disabled={isGenerating}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {poemStyles.map((styleOption) => (
              <SelectItem key={styleOption.value} value={styleOption.value}>
                <div className="flex flex-col">
                  <span className="font-medium">{styleOption.label}</span>
                  <span className="text-xs text-gray-500">{styleOption.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Mood Selection */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Mood & Tone</Label>
        <div className="flex flex-wrap gap-2">
          {poemMoods.map((moodOption) => (
            <Button
              key={moodOption.value}
              type="button"
              variant={mood === moodOption.value ? "default" : "outline"}
              size="sm"
              onClick={() => setMood(moodOption.value)}
              disabled={isGenerating}
              className={`h-8 ${
                mood === moodOption.value 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              {moodOption.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-sm text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Generate Button */}
      <Button
        type="submit"
        disabled={isGenerating || !theme.trim()}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-6 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Creating Your Poem...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-5 w-5" />
            Generate Poem
          </>
        )}
      </Button>

      {/* Current Selection Summary */}
      <div className="flex flex-wrap gap-2 pt-2">
        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
          Style: {poemStyles.find(s => s.value === style)?.label}
        </Badge>
        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
          Mood: {poemMoods.find(m => m.value === mood)?.label}
        </Badge>
      </div>
    </form>
  )
}