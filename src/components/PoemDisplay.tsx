'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { LoadingAnimation } from '@/components/LoadingAnimation'
import { Heart, Download, Share2, Copy, RefreshCw, BookOpen } from 'lucide-react'
import type { Poem } from '@/app/page'

interface PoemDisplayProps {
  poem: Poem | null
  isGenerating: boolean
}

export function PoemDisplay({ poem, isGenerating }: PoemDisplayProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  useEffect(() => {
    if (poem) {
      // Check if poem is already saved
      const savedPoems = JSON.parse(localStorage.getItem('savedPoems') || '[]')
      setIsSaved(savedPoems.some((p: Poem) => p.id === poem.id))
    }
  }, [poem])

  const handleSavePoem = () => {
    if (!poem) return

    const savedPoems = JSON.parse(localStorage.getItem('savedPoems') || '[]')
    
    if (!isSaved) {
      // Save poem
      const updatedPoems = [poem, ...savedPoems.slice(0, 19)] // Keep max 20 saved poems
      localStorage.setItem('savedPoems', JSON.stringify(updatedPoems))
      setIsSaved(true)
    } else {
      // Remove poem
      const updatedPoems = savedPoems.filter((p: Poem) => p.id !== poem.id)
      localStorage.setItem('savedPoems', JSON.stringify(updatedPoems))
      setIsSaved(false)
    }
  }

  const handleDownload = () => {
    if (!poem) return

    const content = `${poem.content}\n\n---\nTheme: ${poem.theme}\nStyle: ${poem.style}\nMood: ${poem.mood}\nCreated: ${new Date(poem.createdAt).toLocaleDateString()}`
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `poem-${poem.theme.toLowerCase().replace(/\s+/g, '-')}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleCopy = async () => {
    if (!poem) return

    try {
      await navigator.clipboard.writeText(poem.content)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  const handleShare = async () => {
    if (!poem) return

    const shareText = `Check out this ${poem.style} poem about ${poem.theme}:\n\n${poem.content}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `A ${poem.style} poem about ${poem.theme}`,
          text: shareText,
        })
      } catch (err) {
        console.log('Share cancelled or failed:', err)
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareText)
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      } catch (err) {
        console.error('Failed to copy for sharing:', err)
      }
    }
  }

  const formatPoemLines = (content: string) => {
    return content.split('\n').map((line, index) => (
      <span key={index} className="block leading-relaxed">
        {line.trim() || '\u00A0'} {/* Non-breaking space for empty lines */}
      </span>
    ))
  }

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
        <LoadingAnimation />
        <div className="text-center space-y-2">
          <h3 className="text-xl font-medium text-gray-700">Crafting Your Poem</h3>
          <p className="text-gray-500 max-w-md">
            Our AI poet is carefully weaving words together to create something beautiful for you...
          </p>
        </div>
      </div>
    )
  }

  if (!poem) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 text-center">
        <div className="bg-gray-50 rounded-full p-6">
          <BookOpen className="h-12 w-12 text-gray-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-medium text-gray-700">Ready to Create Poetry</h3>
          <p className="text-gray-500 max-w-md">
            Choose a theme, select your preferred style and mood, then let AI create a beautiful poem for you.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Poem Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2 justify-center">
          <Badge variant="outline" className="border-purple-200 text-purple-700 bg-purple-50">
            {poem.style.charAt(0).toUpperCase() + poem.style.slice(1)}
          </Badge>
          <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
            {poem.mood.charAt(0).toUpperCase() + poem.mood.slice(1)}
          </Badge>
          <Badge variant="outline" className="border-gray-200 text-gray-600 bg-gray-50">
            {poem.theme}
          </Badge>
        </div>
        <Separator className="w-1/2 mx-auto" />
      </div>

      {/* Poem Content */}
      <Card className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 shadow-inner">
        <CardContent className="p-8">
          <div className="text-center space-y-1">
            <div className="font-serif text-lg md:text-xl leading-loose text-gray-800 whitespace-pre-wrap">
              {formatPoemLines(poem.content)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Button
          onClick={handleSavePoem}
          variant="outline"
          size="sm"
          className={`gap-2 ${
            isSaved 
              ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' 
              : 'border-purple-200 text-purple-600 hover:bg-purple-50'
          }`}
        >
          <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
          {isSaved ? 'Saved' : 'Save'}
        </Button>

        <Button
          onClick={handleCopy}
          variant="outline"
          size="sm"
          className="gap-2 border-blue-200 text-blue-600 hover:bg-blue-50"
        >
          <Copy className="h-4 w-4" />
          {copySuccess ? 'Copied!' : 'Copy'}
        </Button>

        <Button
          onClick={handleDownload}
          variant="outline"
          size="sm"
          className="gap-2 border-green-200 text-green-600 hover:bg-green-50"
        >
          <Download className="h-4 w-4" />
          Download
        </Button>

        <Button
          onClick={handleShare}
          variant="outline"
          size="sm"
          className="gap-2 border-orange-200 text-orange-600 hover:bg-orange-50"
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>

        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          size="sm"
          className="gap-2 border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          <RefreshCw className="h-4 w-4" />
          New Poem
        </Button>
      </div>

      {/* Poem Metadata */}
      <div className="text-center pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400">
          Created on {new Date(poem.createdAt).toLocaleDateString()} at{' '}
          {new Date(poem.createdAt).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </div>
    </div>
  )
}