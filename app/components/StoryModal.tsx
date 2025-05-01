'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  hero: string;
  place: string;
  mission: string;
}

export default function StoryModal({ isOpen, onClose, hero, place, mission }: StoryModalProps) {
  const [story, setStory] = useState<string>('');
  const [generating, setGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && hero && place && mission) {
      generateStory();
    }
  }, [isOpen, hero, place, mission]);

  async function generateStory() {
    setGenerating(true);
    setError(null);

    let heroDescription = '';
    if (hero === 'Robo Rex') {
      heroDescription = 'Robo Rex the brave, slightly silly robot';
    } else if (hero === 'Drake') {
      heroDescription = 'Drake the Dragon, the dramatic boastful but slightly scaredy cat dragon - smallest of his litter who cant breathe fire but instead breathes colored steam';
    } else if (hero === 'Sparkles') {
      heroDescription = 'Sparkles the unicorn';
    }

    try {
      console.log('Sending request to generate story:', { hero: heroDescription, place, mission });
      
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hero: heroDescription,
          place,
          mission,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('API error response:', data);
        throw new Error(data.message || 'Failed to generate story');
      }

      if (!data.story) {
        throw new Error('No story content returned from API');
      }

      setStory(data.story);
    } catch (err: any) {
      console.error('Error generating story:', err);
      setError(err.message || 'Sorry, we had trouble creating your story. Please try again!');
    } finally {
      setGenerating(false);
    }
  }

  // For demonstration purposes, if there's an error, let's provide a sample story
  // so users can still see the functionality
  const provideFallbackStory = () => {
    const fallbackStories: Record<string, string> = {
      'Robo Rex': "Once upon a time, there was a brave but silly robot named Robo Rex. Robo Rex liked to make funny beeping sounds and do silly dances. One day, in the " + place + ", Robo Rex was asked to " + mission.toLowerCase() + ". \"I can do that!\" said Robo Rex with a happy beep. Robo Rex tried very hard and even though it wasn't easy, the robot never gave up. In the end, Robo Rex learned that being patient and trying your best is what matters most. All of Robo Rex's friends were very proud. Beep-boop! The end.",
      'Drake': "Once upon a time, there was a small dragon named Drake. Drake couldn't breathe fire like the other dragons. Instead, he breathed colorful steam! One day, in the " + place + ", Drake was asked to " + mission.toLowerCase() + ". \"I'll try my best!\" said Drake, even though he was a little scared. Drake discovered that his colorful steam was actually very helpful for this mission! Drake learned that being different isn't bad - everyone has special talents that make them unique. Drake felt very proud. The end.",
      'Sparkles': "Once upon a time, there was a magical unicorn named Sparkles. Sparkles had a beautiful rainbow mane that glittered in the sunlight. One day, in the " + place + ", Sparkles was asked to " + mission.toLowerCase() + ". \"I'd be happy to help!\" said Sparkles with a gentle neigh. Sparkles used her unicorn magic to accomplish the mission, but found that the real magic was in sharing and being kind to others. Everyone in the " + place + " learned an important lesson about friendship that day. The end."
    };

    setStory(fallbackStories[hero] || fallbackStories['Sparkles']);
    setError(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-background rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-xl relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
            >
              ✕
            </button>

            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-2xl mr-3">
                {hero === 'Robo Rex' ? '🤖' : hero === 'Drake' ? '🐉' : '🦄'}
              </div>
              <h2 className="text-2xl font-bold font-baloo">Your Magical Story</h2>
            </div>

            <div className="flex gap-3 justify-center items-center mb-6">
              <span className="px-3 py-1 bg-chart-1/20 rounded-full text-sm">
                {hero} {hero === 'Robo Rex' ? '🤖' : hero === 'Drake' ? '🐉' : '🦄'}
              </span>
              <span className="px-3 py-1 bg-chart-2/20 rounded-full text-sm">
                {place} {place === 'Castle' ? '🏰' : place === 'Forest' ? '🌲' : '🚀'}
              </span>
              <span className="px-3 py-1 bg-chart-3/20 rounded-full text-sm">
                {mission} {mission === 'Find Treasure' ? '💎' : mission === 'Help a Friend' ? '🤝' : '🎪'}
              </span>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 shadow-inner min-h-[200px]">
              {generating ? (
                <div className="h-full flex flex-col items-center justify-center py-10">
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-muted-foreground animate-pulse">Creating your magical story...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-500 mb-4">{error}</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={generateStory}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={provideFallbackStory}
                      className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors mt-2 sm:mt-0"
                    >
                      Use Sample Story
                    </button>
                  </div>
                </div>
              ) : (
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap font-nunito leading-relaxed text-lg">
                    {story}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-primary/30 text-primary rounded-lg hover:bg-primary/10 transition-colors"
              >
                Close
              </button>
              <button
                onClick={generateStory}
                disabled={generating}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {generating ? 'Generating...' : 'Generate New Story'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 