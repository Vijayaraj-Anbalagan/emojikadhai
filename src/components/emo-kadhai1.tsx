'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Plus, Minus } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import confetti from "canvas-confetti";

export function EmoKadhai1() {
  const [emojis, setEmojis] = useState('');
  const [genres, setGenres] = useState<string[]>([]);
  const [characters, setCharacters] = useState([{ name: '', description: '' }]);
  const [storyLength, setStoryLength] = useState(200);
  const [story, setStory] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle genre selection (checkboxes)
  const handleGenreChange = (genre: string) => {
    setGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  // Handle character changes
  const handleCharacterChange = (index: number, field: 'name' | 'description', value: string) => {
    const newCharacters = [...characters];
    newCharacters[index][field] = value;
    setCharacters(newCharacters);
  };

  // Add or remove character input fields
  const handleCharacterCount = (action: 'add' | 'remove') => {
    if (action === 'add' && characters.length < 5) {
      setCharacters([...characters, { name: '', description: '' }]);
    } else if (action === 'remove' && characters.length > 1) {
      setCharacters(characters.slice(0, -1));
    }
  };

  // Function to call the API and generate the story
  const handleGenerateStory = async () => {

    // Show confetti animation
    const end = Date.now() + 2.5 * 1000; // 3 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];
 
    const frame = () => {
      if (Date.now() > end) return;
 
      confetti({
        particleCount: 1,
        angle: 60,
        spread: 40,
        startVelocity: 50,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 65,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });
 
      requestAnimationFrame(frame);
    };
 
    frame();
    setIsLoading(true);
    try {
      const response = await fetch('/api/generateStory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emojis,
          genres,
          characters,
          storyLength,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate story');
      }

      const data = await response.json();
      setStory(data.story);
    } catch (error) {
      console.error('Error generating story:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getLengthFeedback = (length: number) => {
    if (length < 100) return 'Too short';
    if (length >= 200 && length <= 300) return 'Good length';
    if (length >= 400) return 'Good to go';
    return '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      <h1 className="text-5xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
        Emo Kadhai
      </h1>
      <p className="text-center mb-12 text-gray-400">Create unique stories from emojis</p>

      <div className="max-w-2xl mx-auto space-y-8">
        {/* Emoji Input */}
        <div className="space-y-4">
          <Label htmlFor="emojis" className="text-lg font-semibold mr-4">Enter Emojis</Label>
          <TooltipProvider>
            <Tooltip>
            <TooltipTrigger>
            <Input
              id="emojis"
              value={emojis}
              onChange={(e) => setEmojis(e.target.value)}
              placeholder="Type emojis here..."
              className="text-2xl p-6 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            />
            </TooltipTrigger>
            <TooltipContent>Enter emojis here </TooltipContent>
            </Tooltip>
            </TooltipProvider>
          
        </div>

        {/* Genre Checkboxes */}
        <div>
          <Label className="text-lg font-semibold mb-2 block">Select Genre</Label>
          <div className="grid grid-cols-3 gap-2">
            {['Funny', 'Adventure', 'Horror', 'Romance', 'Sci-Fi', 'Fantasy', 'Mystery', 'Thriller', 'Drama'].map((genre) => (
              <div key={genre} className="flex items-center">
                <Checkbox
                  id={genre}
                  checked={genres.includes(genre)}
                  onCheckedChange={() => handleGenreChange(genre)}
                  className="border-gray-600 rounded-lg"
                />
                <label htmlFor={genre} className="ml-2 text-sm">{genre}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Characters Input Section */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label className="text-lg font-semibold">Characters</Label>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => handleCharacterCount('remove')}
                variant="outline"
                size="icon"
                disabled={characters.length <= 1}
                className="rounded-full bg-transparent border-gray-700 hover:bg-purple-500 hover:text-white"
              >
                <Minus className="h-4 w-4 fill-black" />
              </Button>
              <span>{characters.length}</span>
              <Button
                onClick={() => handleCharacterCount('add')}
                variant="outline"
                size="icon"
                disabled={characters.length >= 5}
                className="rounded-full bg-transparent border-gray-700 hover:bg-purple-500 hover:text-white"
              >
                <Plus className="h-4 w-4 fill-black" />
              </Button>
            </div>
          </div>

          {characters.map((char, index) => (
            <div key={index} className="mt-4 space-y-2">
              <Input
                placeholder="Character Name"
                value={char.name}
                onChange={(e) => handleCharacterChange(index, 'name', e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 rounded-lg shadow-sm"
              />
              <Textarea
                placeholder="Character Description"
                value={char.description}
                onChange={(e) => handleCharacterChange(index, 'description', e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 h-24 rounded-lg shadow-sm"
              />
            </div>
          ))}
        </div>

        {/* Story Length Slider */}
        <div className="space-y-2">
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

        {/* Generate Story Button */}
          <Button
            onClick={handleGenerateStory}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-lg py-6 rounded-lg shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? 'Generating...' : (
              <>
                Generate Story
                <Sparkles className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>

      {/* Story Response */}
      <Card className="bg-gray-800 border-gray-700 shadow-lg rounded-lg mt-12">
        <CardHeader>
          <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
            Your Story
          </CardTitle>
        </CardHeader>
        <CardContent className="max-h-96 overflow-y-auto p-4">
          {story ? (
            <ReactMarkdown className="prose prose-invert text-white">
              {story}
            </ReactMarkdown>
          ) : (
            <p className="text-gray-500 italic">Your magical story will appear here, bringing emojis to life in ways you never imagined...</p>
          )}
        </CardContent>
      </Card>
    </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-sm text-gray-500">
        Made with ❤️ by{' '}
        <a href="https://vjraj.online" className="text-purple-400 hover:text-purple-300">
          Vijayaraj Anbalagan
        </a>
      </footer>
    </div>
  );
}
