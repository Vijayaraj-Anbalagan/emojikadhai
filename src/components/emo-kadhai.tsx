'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Plus, Minus } from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

export function EmoKadhai() {
  const [emojis, setEmojis] = useState('')
  const [genres, setGenres] = useState<string[]>([])
  const [characters, setCharacters] = useState([{ name: '', description: '' }])
  const [storyLength, setStoryLength] = useState(200)
  const [story, setStory] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleGenreChange = (genre: string) => {
    setGenres(prev => 
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    )
  }

  const handleCharacterChange = (index: number, field: 'name' | 'description', value: string) => {
    const newCharacters = [...characters]
    newCharacters[index][field] = value
    setCharacters(newCharacters)
  }

  const handleCharacterCount = (action: 'add' | 'remove') => {
    if (action === 'add' && characters.length < 5) {
      setCharacters([...characters, { name: '', description: '' }])
    } else if (action === 'remove' && characters.length > 1) {
      setCharacters(characters.slice(0, -1))
    }
  }

  const handleGenerateStory = async () => {
    setIsLoading(true)
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setStory("# The Emoji Adventure\n\nOnce upon a time, in a world of emojis, there lived a brave 😊 named Joy. Joy loved to explore the vast 🌈 landscapes of Emojitopia.\n\nOne day, Joy met a mysterious 🦄 who spoke of a hidden treasure in the 🏔️ Mountains of Mirth. Excited by the prospect of adventure, Joy set out on a quest.\n\nAlong the way, Joy encountered many challenges:\n\n- Crossing the 🌊 Sea of Smileys\n- Navigating through the 🌳 Forest of Faces\n- Climbing the steep 🏔️ Mountains of Mirth\n\nBut with determination and the help of new friends like 🐒 Monkeyround and 🦉 Wisehoot, Joy persevered.\n\nFinally, atop the highest peak, Joy discovered the treasure: a magical 📱 that could bring any emoji to life!\n\nFrom that day on, Emojitopia was filled with more joy and adventure than ever before. And Joy? Well, Joy was already planning the next big quest! 😄🎉")
    setIsLoading(false)
  }

  const getLengthFeedback = (length: number) => {
    if (length < 100) return "Too short"
    if (length >= 200 && length <= 300) return "Good length"
    if (length >= 400) return "Good to go"
    return ""
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      <h1 className="text-5xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
        Emo Kadhai
      </h1>
      <p className="text-center mb-12 text-gray-400">Create unique stories from emojis</p>
      
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="space-y-2">
          <Label htmlFor="emojis" className="text-lg font-semibold">Enter Emojis</Label>
          <Input
            id="emojis"
            value={emojis}
            onChange={(e) => setEmojis(e.target.value)}
            placeholder="Type emojis here..."
            className="text-2xl p-6 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        <div>
          <Label className="text-lg font-semibold mb-2 block">Select Genre</Label>
          <div className="grid grid-cols-3 gap-2">
            {['Funny', 'Adventure', 'Horror', 'Romance', 'Sci-Fi', 'Fantasy', 'Mystery', 'Thriller', 'Drama'].map((genre) => (
              <div key={genre} className="flex items-center">
                <Checkbox
                  id={genre}
                  checked={genres.includes(genre)}
                  onCheckedChange={() => handleGenreChange(genre)}
                  className="border-gray-600"
                />
                <label htmlFor={genre} className="ml-2 text-sm">{genre}</label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <Label className="text-lg font-semibold">Characters</Label>
            <div className="flex items-center space-x-2">
              <Button 
                onClick={() => handleCharacterCount('remove')} 
                variant="outline" 
                size="icon"
                disabled={characters.length <= 1}
              >
                <Minus className="h-4 w-4 text-black" />
              </Button>
              <span>{characters.length}</span>
              <Button 
                onClick={() => handleCharacterCount('add')} 
                variant="outline" 
                size="icon"
                disabled={characters.length >= 5}
              >
                <Plus className="h-4 w-4 text-black" />
              </Button>
            </div>
          </div>
          {characters.map((char, index) => (
            <div key={index} className="mt-4 space-y-2">
              <Input
                placeholder="Character Name"
                value={char.name}
                onChange={(e) => handleCharacterChange(index, 'name', e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
              />
              <Textarea
                placeholder="Character Description"
                value={char.description}
                onChange={(e) => handleCharacterChange(index, 'description', e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 h-24"
              />
            </div>
          ))}
        </div>

        <div>
          <Label className="text-lg font-semibold block mb-2">
            Story Length: {storyLength} words
            <span className="ml-2 text-sm font-normal text-gray-400">
              {getLengthFeedback(storyLength)}
            </span>
          </Label>
          <Slider
            min={50}
            max={500}
            step={10}
            value={[storyLength]}
            onValueChange={(value) => setStoryLength(value[0])}
            className="mt-2"
          />
        </div>

        <Button 
          onClick={handleGenerateStory} 
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-lg py-6"
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : (
            <>
              Generate Story
              <Sparkles className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>

        <p className="text-center text-sm text-gray-500 italic">
          The stories generated are for fun and educational purposes. AI can make mistakes and produce unexpected results.
        </p>

        <Card className="bg-gray-800 border-gray-700 shadow-lg">
          <CardHeader>
            <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
              Your Story
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto">
            {story ? (
              <ReactMarkdown className="prose prose-invert">
                {story}
              </ReactMarkdown>
            ) : (
              <p className="text-gray-500 italic">Your magical story will appear here, bringing emojis to life in ways you never imagined...</p>
            )}
          </CardContent>
        </Card>
      </div>

      <footer className="mt-12 text-center text-sm text-gray-500">
        Made with ❤️ by{' '}
        <Link href="https://vjraj.online" className="text-purple-400 hover:text-purple-300">
          Vijayaraj Anbalagan
        </Link>
      </footer>
    </div>
  )
}