import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SavedStory {
  id: string;
  title: string;
  content: string;
  date: string;
  hero: string;
  place?: string;
  mission?: string;
  lifeSkill?: string;
  additionalHeroes?: string[];
}

interface SavedStoriesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadStory: (story: SavedStory) => void;
}

export default function SavedStoriesDrawer({ isOpen, onClose, onLoadStory }: SavedStoriesDrawerProps) {
  const [savedStories, setSavedStories] = useState<SavedStory[]>([]);
  const [selectedStory, setSelectedStory] = useState<SavedStory | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Load saved stories from localStorage when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedStories = localStorage.getItem('magicStoryBuddy_savedStories');
      if (storedStories) {
        setSavedStories(JSON.parse(storedStories));
      }
    }
  }, [isOpen]); // Reload when drawer opens

  // Close preview when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedStory(null);
      setConfirmDelete(null);
    }
  }, [isOpen]);

  // Load the selected story and close the drawer
  const handleLoadStory = (story: SavedStory) => {
    onLoadStory(story);
    onClose();
  };

  // Delete a story after confirmation
  const handleDeleteStory = (id: string) => {
    if (confirmDelete === id) {
      const updatedStories = savedStories.filter(story => story.id !== id);
      setSavedStories(updatedStories);
      localStorage.setItem('magicStoryBuddy_savedStories', JSON.stringify(updatedStories));
      setConfirmDelete(null);
      if (selectedStory?.id === id) {
        setSelectedStory(null);
      }
    } else {
      setConfirmDelete(id);
    }
  };

  // Extract title from story content (the first line that starts with #)
  const getStoryTitle = (content: string): string => {
    const titleMatch = content.match(/^#\s*(.+)$/m);
    return titleMatch ? titleMatch[1] : 'Untitled Story';
  };

  // Get story preview (first 100 characters after the title)
  const getStoryPreview = (content: string): string => {
    // Remove the title line and trim
    const withoutTitle = content.replace(/^#\s*.+$/m, '').trim();
    return withoutTitle.length > 100 
      ? `${withoutTitle.substring(0, 100)}...` 
      : withoutTitle;
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };

  // Get emoji for character
  const getHeroEmoji = (heroName: string): string => {
    const heroes = {
      "Robo Rex": "🤖",
      "Drake": "🐉",
      "Sparkles": "🦄",
      "Mila TanTan": "👶",
      "Liam": "👦",
      "Garyn": "👶🏼",
      "Bop-Bop": "🐰",
      "Puffy": "☁️"
    };
    
    return (heroes as Record<string, string>)[heroName] || "📖";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div 
            className="relative w-full max-w-md bg-background shadow-xl h-full overflow-hidden flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          >
            {/* Header */}
            <div className="border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold font-baloo text-primary">
                Saved Stories
              </h2>
              <button
                onClick={onClose}
                className="rounded-full h-8 w-8 flex items-center justify-center text-muted-foreground hover:bg-accent/10"
              >
                ✕
              </button>
            </div>
            
            {/* Content */}
            <div className="flex flex-1 overflow-hidden">
              {/* Stories list */}
              <div className={`flex-1 overflow-y-auto ${selectedStory ? 'hidden md:block' : ''}`}>
                {savedStories.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <div className="text-5xl mb-4">📚</div>
                    <p>No saved stories yet.</p>
                    <p className="mt-2 text-sm">When you save a story, it will appear here.</p>
                  </div>
                ) : (
                  <ul className="divide-y">
                    {savedStories.map((story) => (
                      <li key={story.id} className="group">
                        <div
                          className={`w-full px-6 py-4 text-left hover:bg-accent/10 flex items-start transition-colors cursor-pointer ${selectedStory?.id === story.id ? 'bg-accent/20' : ''}`}
                          onClick={() => setSelectedStory(story)}
                        >
                          <div className="mr-3 text-2xl mt-1">
                            {getHeroEmoji(story.hero)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-base truncate pr-2 text-primary">
                                {getStoryTitle(story.content)}
                              </h3>
                              <div className="flex gap-1">
                                <button
                                  className="text-xs opacity-0 group-hover:opacity-100 focus:opacity-100 px-2 py-1 rounded-full bg-accent/10 hover:bg-accent/20 text-accent-foreground transition-all"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleLoadStory(story);
                                  }}
                                >
                                  Load
                                </button>
                                <button
                                  className={`text-xs opacity-0 group-hover:opacity-100 focus:opacity-100 px-2 py-1 rounded-full transition-all ${
                                    confirmDelete === story.id 
                                      ? 'bg-destructive text-destructive-foreground' 
                                      : 'bg-destructive/10 hover:bg-destructive/20 text-destructive'
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteStory(story.id);
                                  }}
                                >
                                  {confirmDelete === story.id ? 'Confirm' : 'Delete'}
                                </button>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(story.date)}
                            </p>
                            <p className="text-sm line-clamp-2 text-muted-foreground mt-1">
                              {getStoryPreview(story.content)}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              {/* Story preview */}
              {selectedStory && (
                <div className="flex-1 overflow-y-auto border-l bg-card md:block">
                  <div className="sticky top-0 bg-card border-b p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{getStoryTitle(selectedStory.content)}</h3>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(selectedStory.date)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="text-xs px-3 py-1.5 rounded bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={() => handleLoadStory(selectedStory)}
                      >
                        Load Story
                      </button>
                      <button
                        className="md:hidden text-xs px-2 py-1 rounded border hover:bg-accent/10"
                        onClick={() => setSelectedStory(null)}
                      >
                        Back
                      </button>
                    </div>
                  </div>
                  <div className="p-4 prose prose-sm max-w-none">
                    {selectedStory.content.split('\n').map((line, i) => {
                      // Format title (lines starting with #)
                      if (line.startsWith('# ')) {
                        return (
                          <h1 key={i} className="text-xl font-bold mb-4">
                            {line.substring(2)}
                          </h1>
                        );
                      }
                      
                      // Handle choice markers
                      if (line.includes('===CHOICE POINT===') || 
                          line.includes('===END CHOICE POINT===') ||
                          line.includes('===OPTION A OUTCOME===') ||
                          line.includes('===END OPTION A OUTCOME===') ||
                          line.includes('===OPTION B OUTCOME===') ||
                          line.includes('===END OPTION B OUTCOME===')) {
                        return null;
                      }
                      
                      // Regular paragraph
                      return line ? (
                        <p key={i} className="my-2">
                          {line}
                        </p>
                      ) : (
                        <br key={i} />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 