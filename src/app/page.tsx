'use client'

import { useState } from 'react'
import { PoemGenerator } from '@/components/PoemGenerator'
import { PoemDisplay } from '@/components/PoemDisplay'
import { SavedPoems } from '@/components/SavedPoems'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { BookOpen, Sparkles, Heart, Download } from 'lucide-react'

export interface Poem {
  id: string
  content: string
  theme: string
  style: string
  mood: string
  createdAt: string
}

export default function Home() {
  const [currentPoem, setCurrentPoem] = useState<Poem | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showSaved, setShowSaved] = useState(false)

  const handlePoemGenerated = (poem: Poem) => {
    setCurrentPoem(poem)
    setIsGenerating(false)
  }

  const handleGenerationStart = () => {
    setIsGenerating(true)
  }

  const handleGenerationError = () => {
    setIsGenerating(false)
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-full p-4 shadow-lg">
            <BookOpen className="h-12 w-12 text-purple-600" />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
          Poetry
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 ml-3">
            Generator
          </span>
        </h1>
        
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
          Transform your thoughts into beautiful poetry with the power of AI. 
          Create personalized poems in various styles, from haikus to sonnets.
        </p>

        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500 mb-8">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-500" />
            <span>AI-Powered Generation</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-red-500" />
            <span>Multiple Poem Styles</span>
          </div>
          <div className="flex items-center gap-2">
            <Download className="h-4 w-4 text-blue-500" />
            <span>Save & Download</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Left Column - Generator */}
        <div className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Create Your Poem</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSaved(!showSaved)}
                  className="text-purple-600 border-purple-200 hover:bg-purple-50"
                >
                  {showSaved ? 'Hide' : 'Show'} Saved
                </Button>
              </div>
              
              <PoemGenerator
                onPoemGenerated={handlePoemGenerated}
                onGenerationStart={handleGenerationStart}
                onGenerationError={handleGenerationError}
                isGenerating={isGenerating}
              />
            </CardContent>
          </Card>

          {/* Saved Poems Section */}
          {showSaved && (
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Saved Poems</h3>
                <SavedPoems onPoemSelect={setCurrentPoem} />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Display */}
        <div className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 min-h-[400px]">
            <CardContent className="p-8">
              <PoemDisplay 
                poem={currentPoem}
                isGenerating={isGenerating}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-16 text-center">
        <Separator className="my-12" />
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="space-y-3">
            <div className="bg-purple-100 rounded-full p-3 w-12 h-12 mx-auto flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">AI-Powered</h3>
            <p className="text-gray-600 text-sm">
              Advanced AI understands your themes and creates meaningful, original poetry
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Multiple Styles</h3>
            <p className="text-gray-600 text-sm">
              Choose from haikus, sonnets, free verse, and more to match your vision
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto flex items-center justify-center">
              <Heart className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Personal Touch</h3>
            <p className="text-gray-600 text-sm">
              Save favorites, download as text files, and share your creations
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}