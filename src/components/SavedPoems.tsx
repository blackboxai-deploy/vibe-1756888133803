'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Heart, Trash2, Eye } from 'lucide-react'
import type { Poem } from '@/app/page'

interface SavedPoemsProps {
  onPoemSelect: (poem: Poem) => void
}

export function SavedPoems({ onPoemSelect }: SavedPoemsProps) {
  const [savedPoems, setSavedPoems] = useState<Poem[]>([])

  useEffect(() => {
    // Load saved poems from localStorage
    const stored = localStorage.getItem('savedPoems')
    if (stored) {
      try {
        const poems = JSON.parse(stored)
        setSavedPoems(poems)
      } catch (error) {
        console.error('Error parsing saved poems:', error)
        setSavedPoems([])
      }
    }
  }, [])

  const handleDeletePoem = (poemId: string, event: React.MouseEvent) => {
    event.stopPropagation() // Prevent triggering the view action
    
    const updatedPoems = savedPoems.filter(poem => poem.id !== poemId)
    setSavedPoems(updatedPoems)
    localStorage.setItem('savedPoems', JSON.stringify(updatedPoems))
  }

  const clearAllPoems = () => {
    setSavedPoems([])
    localStorage.removeItem('savedPoems')
  }

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (savedPoems.length === 0) {
    return (
      <div className="text-center space-y-4 py-8">
        <div className="bg-gray-50 rounded-full p-4 w-16 h-16 mx-auto flex items-center justify-center">
          <Heart className="h-8 w-8 text-gray-400" />
        </div>
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">No Saved Poems Yet</h4>
          <p className="text-sm text-gray-500">
            Create and save your favorite poems to see them here.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header with clear action */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {savedPoems.length} saved poem{savedPoems.length !== 1 ? 's' : ''}
        </p>
        {savedPoems.length > 0 && (
          <Button
            onClick={clearAllPoems}
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-600 hover:bg-red-50 h-7 px-2"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Poems List */}
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-3">
          {savedPoems.map((poem) => (
            <Card 
              key={poem.id} 
              className="cursor-pointer hover:shadow-md transition-shadow border border-gray-200 hover:border-purple-200"
              onClick={() => onPoemSelect(poem)}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Poem preview */}
                  <div className="font-serif text-sm text-gray-800 leading-relaxed">
                    {truncateText(poem.content)}
                  </div>
                  
                  {/* Metadata and actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-xs border-purple-200 text-purple-600 bg-purple-50">
                        {poem.style}
                      </Badge>
                      <Badge variant="outline" className="text-xs border-blue-200 text-blue-600 bg-blue-50">
                        {poem.mood}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        {formatDate(poem.createdAt)}
                      </span>
                      <Button
                        onClick={(e) => handleDeletePoem(poem.id, e)}
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Theme */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Theme:</span>
                    <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                      {poem.theme}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Usage tip */}
      <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
        <div className="flex items-start gap-2">
          <Eye className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-blue-700">
            Click on any saved poem to view it in full. You can save up to 20 poems.
          </p>
        </div>
      </div>
    </div>
  )
}