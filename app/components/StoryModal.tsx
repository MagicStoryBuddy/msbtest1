'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SavedStoriesDrawer from './SavedStoriesDrawer';

interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  hero: string;
  place: string;
  mission: string;
  lifeSkill?: string;
  additionalHeroes?: string[]; // Add this new prop
}

// Interface for the story choice options
interface StoryChoice {
  optionA: string;
  optionB: string;
  emojiA: string;
  emojiB: string;
  outcomeA: string;
  outcomeB: string;
}

// Interface for saved stories
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

export default function StoryModal({ isOpen, onClose, hero, place, mission, lifeSkill, additionalHeroes = [] }: StoryModalProps) {
  const [story, setStory] = useState<string>('');
  const [generating, setGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [usedFallback, setUsedFallback] = useState<boolean>(false);
  const [showNewAdventureOptions, setShowNewAdventureOptions] = useState<boolean>(false);
  
  // New state for the choose your own path feature
  const [storyBeforeChoice, setStoryBeforeChoice] = useState<string>('');
  const [storyChoice, setStoryChoice] = useState<StoryChoice | null>(null);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null);
  const [storyAfterChoice, setStoryAfterChoice] = useState<string>('');
  const [atChoicePoint, setAtChoicePoint] = useState<boolean>(false);
  
  // Read aloud feature state
  const [isReading, setIsReading] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  // Audio refs for sound effects
  const hoverSoundRef = useRef<HTMLAudioElement | null>(null);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);
  
  // State for editing parameters
  const [newHero, setNewHero] = useState<string>(hero);
  const [newPlace, setNewPlace] = useState<string>(place);
  const [newMission, setNewMission] = useState<string>(mission);
  const [newLifeSkill, setNewLifeSkill] = useState<string>(lifeSkill || '');
  const [newAdditionalHeroes, setNewAdditionalHeroes] = useState<string[]>(additionalHeroes);
  
  // Current parameters (either original or new)
  const [currentHero, setCurrentHero] = useState<string>(hero);
  const [currentPlace, setCurrentPlace] = useState<string>(place);
  const [currentMission, setCurrentMission] = useState<string>(mission);
  const [currentLifeSkill, setCurrentLifeSkill] = useState<string>(lifeSkill || '');
  const [currentAdditionalHeroes, setCurrentAdditionalHeroes] = useState<string[]>(additionalHeroes);
  
  // New state for saved stories feature
  const [showSavedStories, setShowSavedStories] = useState<boolean>(false);
  const [storyJustSaved, setStoryJustSaved] = useState<boolean>(false);
  
  // Available options for the story generator
  const heroes = [
    { name: "Robo Rex", emoji: "🤖" },
    { name: "Drake", emoji: "🐉" },
    { name: "Sparkles", emoji: "🦄" },
    { name: "Mila TanTan", emoji: "👶" },
    { name: "Liam", emoji: "👦" },
    { name: "Garyn", emoji: "👶🏼" },
    { name: "Bop-Bop", emoji: "🐰" },
    { name: "Puffy", emoji: "☁️" }
  ];
  
  const places = [
    { name: "Castle", emoji: "🏰" },
    { name: "Forest", emoji: "🌲" },
    { name: "Candy Land", emoji: "🍭" },
    { name: "Dino Land", emoji: "🦕" }
  ];
  
  const missions = [
    { name: "Find Treasure", emoji: "💎" },
    { name: "Help a Friend", emoji: "🤝" },
    { name: "Solve a Mystery", emoji: "🔍" },
    { name: "Paint a Picture that Comes to Life", emoji: "🎨" },
    { name: "Tame a Baby Dragon", emoji: "🐲" }
  ];
  
  const lifeSkills = [
    { name: "Bravery", emoji: "🦸‍♀️" },
    { name: "Dealing with Anger", emoji: "😤" },
    { name: "Kindness", emoji: "💗" },
    { name: "Shyness", emoji: "🙈" },
    { name: "Patience", emoji: "⏳" },
    { name: "Brushing Teeth", emoji: "🪥" },
    { name: "Focus and Attention", emoji: "🔍" },
    { name: "Gratitude", emoji: "🙏" }
  ];
  
  useEffect(() => {
    if (isOpen && hero) {
      generateStory();
    }
  }, [isOpen, hero, place, mission, lifeSkill, additionalHeroes]);
  
  useEffect(() => {
    // Reset parameters when modal is opened
    setNewHero(hero);
    setNewPlace(place);
    setNewMission(mission);
    setNewLifeSkill(lifeSkill || '');
    setNewAdditionalHeroes(additionalHeroes);
    setCurrentHero(hero);
    setCurrentPlace(place);
    setCurrentMission(mission);
    setCurrentLifeSkill(lifeSkill || '');
    setCurrentAdditionalHeroes(additionalHeroes);
    setShowNewAdventureOptions(false);
    
    // Stop any ongoing speech when the modal is closed
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [hero, place, mission, lifeSkill, additionalHeroes, isOpen]);

  // Initialize speech synthesis voices
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      // Chrome needs this to populate the voices array
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.getVoices();
        };
      }
      
      // Call getVoices to initialize the list
      window.speechSynthesis.getVoices();
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      hoverSoundRef.current = new Audio('/sounds/hover.mp3');
      clickSoundRef.current = new Audio('/sounds/click.mp3');
      
      // Optional: Preload the audio
      hoverSoundRef.current.load();
      clickSoundRef.current.load();
    }
  }, []);
  
  // Play sound functions
  const playHoverSound = () => {
    if (hoverSoundRef.current) {
      hoverSoundRef.current.currentTime = 0;
      hoverSoundRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
  };
  
  const playClickSound = () => {
    if (clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
  };
  
  // Function to handle option selection
  const handleOptionSelect = (option: 'A' | 'B') => {
    playClickSound();
    setSelectedOption(option);
  };

  // Render the choice confirmation with animation
  const renderChoiceConfirmation = () => {
    if (!storyChoice) return null;
    
    const selectedChoiceText = selectedOption === 'A' ? storyChoice.optionA : storyChoice.optionB;
    const selectedEmoji = selectedOption === 'A' ? storyChoice.emojiA : storyChoice.emojiB;
    const bgColor = selectedOption === 'A' ? 'from-pink-200 to-pink-100' : 'from-teal-200 to-teal-100';
    const textColor = selectedOption === 'A' ? 'text-pink-800' : 'text-teal-800';
    
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="my-6 flex flex-col items-center"
      >
        <div className={`w-20 h-20 bg-gradient-to-br ${bgColor} rounded-full flex items-center justify-center shadow-md mb-2`}>
          <motion.div
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 20
            }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut"
              }}
              className="text-5xl"
            >
              {selectedEmoji}
            </motion.div>
          </motion.div>
        </div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className={`text-xl font-medium font-baloo ${textColor} text-center mb-6`}
        >
          You chose {selectedChoiceText}!
        </motion.div>
      </motion.div>
    );
  };

  async function generateStory(useNewParams: boolean = false) {
    setGenerating(true);
    setError(null);
    setUsedFallback(false);
    setStory('');
    setShowNewAdventureOptions(false);
    
    // Use either original or new parameters
    const heroToUse = useNewParams ? newHero : hero;
    const placeToUse = useNewParams ? newPlace : place;
    const missionToUse = useNewParams ? newMission : mission;
    const lifeSkillToUse = useNewParams ? newLifeSkill : lifeSkill;
    const additionalHeroesToUse = useNewParams ? newAdditionalHeroes : additionalHeroes;
    
    // Update current parameters
    setCurrentHero(heroToUse);
    setCurrentPlace(placeToUse);
    setCurrentMission(missionToUse);
    setCurrentLifeSkill(lifeSkillToUse || '');
    setCurrentAdditionalHeroes(additionalHeroesToUse);

    // Combine all heroes
    const allHeroes = [heroToUse, ...additionalHeroesToUse].filter(Boolean);

    // Create hero description
    let heroDescription = '';
    if (heroToUse === 'Robo Rex') {
      heroDescription = 'Robo Rex the brave, slightly silly robot';
    } else if (heroToUse === 'Drake') {
      heroDescription = 'Drake the Dragon, the dramatic boastful but slightly scaredy cat dragon - smallest of his litter who cant breathe fire but instead breathes colored steam';
    } else if (heroToUse === 'Sparkles') {
      heroDescription = 'Sparkles the unicorn';
    } else if (heroToUse === 'Mila TanTan') {
      heroDescription = 'Mila TanTan, the adorable 3 month old baby. She likes giggling and cuddles from her Mommy Moo and Daddy Doo. She powers up by drinking Mommy\'s Magic Milk.';
    } else if (heroToUse === 'Liam') {
      heroDescription = 'Liam, a 7 year old boy. He loves blue pickup trucks and plays soccer. He doesn\'t like his Grandpa Bop\'s yucky healthy food.';
    } else if (heroToUse === 'Garyn') {
      heroDescription = 'Garyn, an 8 month old baby boy. He has long eyelashes that drive everyone crazy and a smile that lights up any room. His mom likes to sing to him, "He\'s a Hap-py, Happy Boy, he\'s a happy happy happy boy!"';
    } else if (heroToUse === 'Bop-Bop') {
      heroDescription = 'Bop-Bop the Beat Bunny, a bouncy and rhythmic Rhythm Rabbit. He talks fast, is always joyful, and comes from a musical meadow where every step makes music. His catchphrase is "Let\'s hop to the top — drop the beat, don\'t stop!"';
    } else if (heroToUse === 'Puffy') {
      heroDescription = 'Puffy the Fluffy Cloud Pup, a shy and soft-hearted Sky Dog. He can float through air, hide in clouds, and sneezes little storms. Puffy fell from a dreaming sky and is learning to be brave. His catchphrase is "I-I\'m not very brave… but I am very fluffy."';
    }

    // Add friend descriptions for additional heroes
    if (additionalHeroesToUse.length > 0) {
      const friendDescriptions = additionalHeroesToUse.map(friendName => {
        if (friendName === 'Robo Rex') {
          return 'Robo Rex the brave, slightly silly robot';
        } else if (friendName === 'Drake') {
          return 'Drake the Dragon, the dramatic boastful but slightly scaredy cat dragon who breathes colored steam';
        } else if (friendName === 'Sparkles') {
          return 'Sparkles the unicorn';
        } else if (friendName === 'Mila TanTan') {
          return 'Mila TanTan, the adorable 3 month old baby';
        } else if (friendName === 'Liam') {
          return 'Liam, a 7 year old boy who loves blue pickup trucks';
        } else if (friendName === 'Garyn') {
          return 'Garyn, an 8 month old baby boy with long eyelashes';
        } else if (friendName === 'Bop-Bop') {
          return 'Bop-Bop the Beat Bunny, a bouncy and rhythmic Rhythm Rabbit';
        } else if (friendName === 'Puffy') {
          return 'Puffy the Fluffy Cloud Pup, a shy and soft-hearted Sky Dog';
        }
        return friendName;
      });
      
      heroDescription += ` and their friend${additionalHeroesToUse.length > 1 ? 's' : ''} ${friendDescriptions.join(' and ')}`;
    }

    try {
      console.log('Sending request to generate story:', { 
        hero: heroDescription, 
        place: placeToUse, 
        mission: missionToUse,
        lifeSkill: lifeSkillToUse,
        additionalHeroes: additionalHeroesToUse
      });
      
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hero: heroDescription,
          place: placeToUse,
          mission: missionToUse,
          lifeSkill: lifeSkillToUse,
          additionalHeroes: additionalHeroesToUse
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

      // Enhance the story with emojis before setting it
      const enhancedStory = enhanceStoryWithEmojis(data.story);
      setStory(enhancedStory);
      setUsedFallback(data.usedFallback || false);
      
      // Process the story to extract the choice point
      processStoryForChoicePoint(enhancedStory);
    } catch (err: any) {
      console.error('Error generating story:', err);
      setError(err.message || 'Sorry, we had trouble creating your story. Please try again!');
    } finally {
      setGenerating(false);
    }
  }

  // Process the story to extract the choice point
  const processStoryForChoicePoint = (storyText: string) => {
    // Reset choice state
    setSelectedOption(null);
    setAtChoicePoint(false);
    
    // First check for the new formatted markers
    const choicePointStart = storyText.indexOf("===CHOICE POINT===");
    const choicePointEnd = storyText.indexOf("===END CHOICE POINT===");
    const optionAStart = storyText.indexOf("===OPTION A OUTCOME===");
    const optionAEnd = storyText.indexOf("===END OPTION A OUTCOME===");
    const optionBStart = storyText.indexOf("===OPTION B OUTCOME===");
    const optionBEnd = storyText.indexOf("===END OPTION B OUTCOME===");
    
    // Check if we have the formatted markers
    if (choicePointStart !== -1 && choicePointEnd !== -1 && 
        optionAStart !== -1 && optionAEnd !== -1 && 
        optionBStart !== -1 && optionBEnd !== -1) {
      
      // Extract the story segments
      const storyBefore = storyText.substring(0, choicePointStart);
      const choiceText = storyText.substring(choicePointStart + 18, choicePointEnd).trim();
      const optionAOutcome = storyText.substring(optionAStart + 21, optionAEnd).trim();
      const optionBOutcome = storyText.substring(optionBStart + 21, optionBEnd).trim();
      
      // Check if there's content after the last outcome marker
      const lastEndMarker = Math.max(optionAEnd + 24, optionBEnd + 24);
      const storyAfter = lastEndMarker < storyText.length ? storyText.substring(lastEndMarker) : "";
      
      // Extract the options from the choice text
      // Look for "Should they [Option A] or [Option B]?" pattern
      const optionPattern = /Should .+ \[(.+?)\] or \[(.+?)\]\?/i;
      const optionMatch = choiceText.match(optionPattern);
      
      let optionA = "First choice";
      let optionB = "Second choice";
      
      if (optionMatch && optionMatch.length >= 3) {
        optionA = optionMatch[1].trim();
        optionB = optionMatch[2].trim();
      } else {
        // Try a fallback pattern for "Should they X or Y?"
        const shouldMatch = choiceText.match(/Should .+ (.+?) or (.+?)\?/i);
        if (shouldMatch && shouldMatch.length >= 3) {
          optionA = shouldMatch[1].trim();
          optionB = shouldMatch[2].trim();
        } else {
          // Try a more general pattern for any choice with "or"
          const orSplit = choiceText.split(" or ");
          if (orSplit.length >= 2) {
            // Try to extract from "Should they... X or Y?" format
            const firstPart = orSplit[0];
            const shouldMatch = firstPart.match(/Should .+ (.+)$/i);
            if (shouldMatch) {
              optionA = shouldMatch[1].trim();
            }
            
            // Get the second option
            const secondPart = orSplit[1];
            const questionMatch = secondPart.match(/^(.+?)\?/i);
            if (questionMatch) {
              optionB = questionMatch[1].trim();
            }
          }
        }
      }
      
      // Determine appropriate emojis
      let emojiA = '🌈';
      let emojiB = '✨';
      
      // Determine emojis based on the content of options - expanded set of mappings
      // Animals and creatures - specific characters first (high priority)
      if (optionA.toLowerCase().includes('dragon')) emojiA = '🐉';
      if (optionA.toLowerCase().includes('owl')) emojiA = '🦉';
      if (optionA.toLowerCase().includes('butterfly')) emojiA = '🦋';
      if (optionA.toLowerCase().includes('animal')) emojiA = '🐾';
      if (optionA.toLowerCase().includes('bug')) emojiA = '🦋';
      
      // Places and containers - specific places first
      if (optionA.toLowerCase().includes('door')) emojiA = '🚪';
      if (optionA.toLowerCase().includes('tent')) emojiA = '⛺';
      if (optionA.toLowerCase().includes('inside')) emojiA = '🏠';
      if (optionA.toLowerCase().includes('rainbow')) emojiA = '🌈';
      
      // Environmental elements
      if (optionA.toLowerCase().includes('flower') || optionA.toLowerCase().includes('garden')) emojiA = '🌸';
      if (optionA.toLowerCase().includes('path') || optionA.toLowerCase().includes('road')) emojiA = '🛣️';
      if (optionA.toLowerCase().includes('tunnel') || optionA.toLowerCase().includes('cave')) emojiA = '🕳️';
      if (optionA.toLowerCase().includes('forest') || optionA.toLowerCase().includes('tree')) emojiA = '🌲';
      if (optionA.toLowerCase().includes('bridge')) emojiA = '🌉';
      if (optionA.toLowerCase().includes('waterfall')) emojiA = '🌊';
      if (optionA.toLowerCase().includes('water') || optionA.toLowerCase().includes('river')) emojiA = '💧';
      if (optionA.toLowerCase().includes('mountain')) emojiA = '⛰️';
      if (optionA.toLowerCase().includes('meadow')) emojiA = '🌿';
      if (optionA.toLowerCase().includes('night') || optionA.toLowerCase().includes('moon')) emojiA = '🌙';
      if (optionA.toLowerCase().includes('sun') || optionA.toLowerCase().includes('day')) emojiA = '☀️';
      
      // Actions and approaches
      if (optionA.toLowerCase().includes('magic') || optionA.toLowerCase().includes('spell')) emojiA = '✨';
      if (optionA.toLowerCase().includes('wait')) emojiA = '⏳';
      if (optionA.toLowerCase().includes('sing') || optionA.toLowerCase().includes('music')) emojiA = '🎵';
      if (optionA.toLowerCase().includes('dance')) emojiA = '💃';
      if (optionA.toLowerCase().includes('ask') || optionA.toLowerCase().includes('help')) emojiA = '🙋';
      if (optionA.toLowerCase().includes('quiet') || optionA.toLowerCase().includes('sneaky')) emojiA = '🤫';
      if (optionA.toLowerCase().includes('brave') || optionA.toLowerCase().includes('direct')) emojiA = '🦸';
      if (optionA.toLowerCase().includes('logic') || optionA.toLowerCase().includes('think')) emojiA = '🧠';
      if (optionA.toLowerCase().includes('create') || optionA.toLowerCase().includes('art')) emojiA = '🎨';
      if (optionA.toLowerCase().includes('climb')) emojiA = '🧗';
      
      // Tools (lowest priority)
      if (optionA.toLowerCase().includes('map')) emojiA = '🗺️';
      if (optionA.toLowerCase().includes('key')) emojiA = '🔑';
      if (optionA.toLowerCase().includes('bell')) emojiA = '🔔';
      if (optionA.toLowerCase().includes('build') || optionA.toLowerCase().includes('make')) emojiA = '🛠️';
      if (optionA.toLowerCase().includes('pulley') || optionA.toLowerCase().includes('rope')) emojiA = '⚙️';
      if (optionA.toLowerCase().includes('strong') || optionA.toLowerCase().includes('strength')) emojiA = '💪';
      if (optionA.toLowerCase().includes('arm')) emojiA = '💪';
      
      // Repeat the same comprehensive mapping for option B with the same priority ordering
      // Animals and creatures - specific characters first (high priority)
      if (optionB.toLowerCase().includes('dragon')) emojiB = '🐉';
      if (optionB.toLowerCase().includes('owl')) emojiB = '🦉';
      if (optionB.toLowerCase().includes('butterfly')) emojiB = '🦋';
      if (optionB.toLowerCase().includes('animal')) emojiB = '🐾';
      if (optionB.toLowerCase().includes('bug')) emojiB = '🦋';
      
      // Places and containers - specific places first
      if (optionB.toLowerCase().includes('door')) emojiB = '🚪';
      if (optionB.toLowerCase().includes('tent')) emojiB = '⛺';
      if (optionB.toLowerCase().includes('under')) emojiB = '⬇️';
      if (optionB.toLowerCase().includes('wagon')) emojiB = '🚃';
      if (optionB.toLowerCase().includes('rainbow')) emojiB = '🌈';
      
      // Environmental elements
      if (optionB.toLowerCase().includes('flower') || optionB.toLowerCase().includes('garden')) emojiB = '🌸';
      if (optionB.toLowerCase().includes('path') || optionB.toLowerCase().includes('road')) emojiB = '🛣️';
      if (optionB.toLowerCase().includes('tunnel') || optionB.toLowerCase().includes('cave')) emojiB = '🕳️';
      if (optionB.toLowerCase().includes('forest') || optionB.toLowerCase().includes('tree')) emojiB = '🌲';
      if (optionB.toLowerCase().includes('bridge')) emojiB = '🌉';
      if (optionB.toLowerCase().includes('waterfall')) emojiB = '🌊';
      if (optionB.toLowerCase().includes('water') || optionB.toLowerCase().includes('river')) emojiB = '💧';
      if (optionB.toLowerCase().includes('mountain')) emojiB = '⛰️';
      if (optionB.toLowerCase().includes('meadow')) emojiB = '🌿';
      if (optionB.toLowerCase().includes('night') || optionB.toLowerCase().includes('moon')) emojiB = '🌙';
      if (optionB.toLowerCase().includes('sun') || optionB.toLowerCase().includes('day')) emojiB = '☀️';
      
      // Actions and approaches
      if (optionB.toLowerCase().includes('magic') || optionB.toLowerCase().includes('spell')) emojiB = '✨';
      if (optionB.toLowerCase().includes('wait')) emojiB = '⏳';
      if (optionB.toLowerCase().includes('sing') || optionB.toLowerCase().includes('music')) emojiB = '🎵';
      if (optionB.toLowerCase().includes('dance')) emojiB = '💃';
      if (optionB.toLowerCase().includes('ask') || optionB.toLowerCase().includes('help')) emojiB = '🙋';
      if (optionB.toLowerCase().includes('quiet') || optionB.toLowerCase().includes('sneaky')) emojiB = '🤫';
      if (optionB.toLowerCase().includes('brave') || optionB.toLowerCase().includes('direct')) emojiB = '🦸';
      if (optionB.toLowerCase().includes('logic') || optionB.toLowerCase().includes('think')) emojiB = '🧠';
      if (optionB.toLowerCase().includes('create') || optionB.toLowerCase().includes('art')) emojiB = '🎨';
      if (optionB.toLowerCase().includes('climb')) emojiB = '🧗';
      
      // Tools (lowest priority)
      if (optionB.toLowerCase().includes('map')) emojiB = '🗺️';
      if (optionB.toLowerCase().includes('key')) emojiB = '🔑';
      if (optionB.toLowerCase().includes('bell')) emojiB = '🔔';
      if (optionB.toLowerCase().includes('build') || optionB.toLowerCase().includes('make')) emojiB = '🛠️';
      if (optionB.toLowerCase().includes('pulley') || optionB.toLowerCase().includes('rope')) emojiB = '⚙️';
      if (optionB.toLowerCase().includes('strong') || optionB.toLowerCase().includes('strength')) emojiB = '💪';
      if (optionB.toLowerCase().includes('arm')) emojiB = '💪';
      
      setStoryBeforeChoice(storyBefore + choiceText);
      setStoryChoice({
        optionA,
        optionB,
        emojiA,
        emojiB,
        outcomeA: optionAOutcome,
        outcomeB: optionBOutcome
      });
      setStoryAfterChoice(storyAfter);
      setAtChoicePoint(true);
      
      // Since we found and processed the choice markers, we need to
      // remove the markers from the main story text to prevent them
      // from being displayed directly
      const filteredStory = storyBefore + storyAfter;
      setStory(filteredStory);
      
      return;
    }
    
    // If no formatted markers, fall back to the previous approach
    // Try different patterns to find the choice point
    
    // Pattern 1: Look for the choice pattern with asterisks: *Should [character] [do something]?*
    let choiceMatch = storyText.match(/\*Should .+\?\*/);
    
    // Pattern 2: Look for "Which way should [character] go?" or similar
    if (!choiceMatch) {
      choiceMatch = storyText.match(/Which (way|path|option|choice) should [^\?]+\?/);
    }
    
    // Pattern 3: Look for a direct question about choice
    if (!choiceMatch) {
      choiceMatch = storyText.match(/Should (he|she|they|[A-Z][a-z]+) (choose|take|go|pick|select) [^\?]+\?/);
    }
    
    if (!choiceMatch || choiceMatch.index === undefined) {
      // No choice found, just display the whole story
      setStoryBeforeChoice('');
      setStoryChoice(null);
      setStoryAfterChoice('');
      return;
    }
    
    const choiceIndex = choiceMatch.index;
    const choiceText = choiceMatch[0];
    
    // Find the two options
    // Look for text like "On one side was..." or similar patterns
    const beforeChoiceText = storyText.substring(0, choiceIndex);
    
    // To find where the outcome starts, look for paragraph after the choice
    const afterChoiceIndex = choiceIndex + choiceText.length;
    const remainingText = storyText.substring(afterChoiceIndex);
    
    // Find the next paragraph break after the choice
    let paragraphBreakIndex = remainingText.indexOf("\n\n");
    if (paragraphBreakIndex === -1) {
      // Try a single newline if double isn't found
      paragraphBreakIndex = remainingText.indexOf("\n");
    }
    
    if (paragraphBreakIndex === -1) {
      // Couldn't find clean separation, just show the whole story
      return;
    }
    
    // Extract the options paragraph
    const optionsParagraph = remainingText.substring(0, paragraphBreakIndex);
    
    // Extract the outcome and rest of the story
    const outcomeAndRest = remainingText.substring(paragraphBreakIndex + 2);
    
    // Parse the options - try multiple patterns
    // Look for "Option A... Option B..." pattern or similar patterns
    let optionAMatch = optionsParagraph.match(/(On one side|The first option|The first path|One way|To the left|Option A) was (a |the |)([^.]+)\./i);
    let optionBMatch = optionsParagraph.match(/(On the other side|The second option|The second path|Another way|To the right|Option B) was (a |the |)([^.]+)\./i);
    
    // Try another common pattern
    if (!optionAMatch || !optionBMatch) {
      // Try to find any two distinct options in the same paragraph
      const options = optionsParagraph.split(/\.\s+/);
      if (options.length >= 2) {
        // Just take the first two sentences as options
        optionAMatch = options[0].match(/(.+)/);
        optionBMatch = options[1].match(/(.+)/);
      }
    }
    
    if (!optionAMatch || !optionBMatch) {
      // As a fallback, create generic options
      optionAMatch = ["Option A", "", "", "First choice"];
      optionBMatch = ["Option B", "", "", "Second choice"];
    }
    
    // Extract the options
    const optionA = optionAMatch[3] ? optionAMatch[3].trim() : "First choice";
    const optionB = optionBMatch[3] ? optionBMatch[3].trim() : "Second choice";
    
    // Find the outcome paragraph - it's the paragraph that starts after the options
    // and explains what the character chose
    let outcomeMatch = outcomeAndRest.match(/([^ ]+ (thought|decided|chose))/i);
    
    // Try alternative outcome patterns if the first one didn't work
    if (!outcomeMatch) {
      outcomeMatch = outcomeAndRest.match(/(picked|selected|took|went with)/i);
    }
    
    if (!outcomeMatch) {
      // Couldn't find a clean outcome, assume it starts immediately after options
      outcomeMatch = outcomeAndRest.match(/(.{0,50})/i);
    }
    
    if (!outcomeMatch) {
      // Couldn't find outcome, just show the whole story
      return;
    }
    
    // Split at the outcome to separate the outcome from the rest of the story
    const outcomeSplitIndex = outcomeAndRest.indexOf(outcomeMatch[0]);
    const outcome = outcomeAndRest.substring(0, outcomeSplitIndex + 150); // Include some context
    const restOfStory = outcomeAndRest.substring(outcomeSplitIndex);
    
    // Set up the choice interface
    setStoryBeforeChoice(beforeChoiceText + choiceText);
    
    // Assign emojis based on the options
    let emojiA = '🌈';
    let emojiB = '✨';
    
    // Determine emojis based on the content of options - expanded set of mappings
    // Animals and creatures - specific characters first (high priority)
    if (optionA.toLowerCase().includes('dragon')) emojiA = '🐉';
    if (optionA.toLowerCase().includes('owl')) emojiA = '🦉';
    if (optionA.toLowerCase().includes('butterfly')) emojiA = '🦋';
    if (optionA.toLowerCase().includes('animal')) emojiA = '🐾';
    if (optionA.toLowerCase().includes('bug')) emojiA = '🦋';
    
    // Places and containers - specific places first
    if (optionA.toLowerCase().includes('door')) emojiA = '🚪';
    if (optionA.toLowerCase().includes('tent')) emojiA = '⛺';
    if (optionA.toLowerCase().includes('inside')) emojiA = '🏠';
    if (optionA.toLowerCase().includes('rainbow')) emojiA = '🌈';
    
    // Environmental elements
    if (optionA.toLowerCase().includes('flower') || optionA.toLowerCase().includes('garden')) emojiA = '🌸';
    if (optionA.toLowerCase().includes('path') || optionA.toLowerCase().includes('road')) emojiA = '🛣️';
    if (optionA.toLowerCase().includes('tunnel') || optionA.toLowerCase().includes('cave')) emojiA = '🕳️';
    if (optionA.toLowerCase().includes('forest') || optionA.toLowerCase().includes('tree')) emojiA = '🌲';
    if (optionA.toLowerCase().includes('bridge')) emojiA = '🌉';
    if (optionA.toLowerCase().includes('waterfall')) emojiA = '🌊';
    if (optionA.toLowerCase().includes('water') || optionA.toLowerCase().includes('river')) emojiA = '💧';
    if (optionA.toLowerCase().includes('mountain')) emojiA = '⛰️';
    if (optionA.toLowerCase().includes('meadow')) emojiA = '🌿';
    if (optionA.toLowerCase().includes('night') || optionA.toLowerCase().includes('moon')) emojiA = '🌙';
    if (optionA.toLowerCase().includes('sun') || optionA.toLowerCase().includes('day')) emojiA = '☀️';
    
    // Actions and approaches
    if (optionA.toLowerCase().includes('magic') || optionA.toLowerCase().includes('spell')) emojiA = '✨';
    if (optionA.toLowerCase().includes('wait')) emojiA = '⏳';
    if (optionA.toLowerCase().includes('sing') || optionA.toLowerCase().includes('music')) emojiA = '🎵';
    if (optionA.toLowerCase().includes('dance')) emojiA = '💃';
    if (optionA.toLowerCase().includes('ask') || optionA.toLowerCase().includes('help')) emojiA = '🙋';
    if (optionA.toLowerCase().includes('quiet') || optionA.toLowerCase().includes('sneaky')) emojiA = '🤫';
    if (optionA.toLowerCase().includes('brave') || optionA.toLowerCase().includes('direct')) emojiA = '🦸';
    if (optionA.toLowerCase().includes('logic') || optionA.toLowerCase().includes('think')) emojiA = '🧠';
    if (optionA.toLowerCase().includes('create') || optionA.toLowerCase().includes('art')) emojiA = '🎨';
    if (optionA.toLowerCase().includes('climb')) emojiA = '🧗';
    
    // Tools (lowest priority)
    if (optionA.toLowerCase().includes('map')) emojiA = '🗺️';
    if (optionA.toLowerCase().includes('key')) emojiA = '🔑';
    if (optionA.toLowerCase().includes('bell')) emojiA = '🔔';
    if (optionA.toLowerCase().includes('build') || optionA.toLowerCase().includes('make')) emojiA = '🛠️';
    if (optionA.toLowerCase().includes('pulley') || optionA.toLowerCase().includes('rope')) emojiA = '⚙️';
    if (optionA.toLowerCase().includes('strong') || optionA.toLowerCase().includes('strength')) emojiA = '💪';
    if (optionA.toLowerCase().includes('arm')) emojiA = '💪';
    
    // Repeat the same comprehensive mapping for option B with the same priority ordering
    // Animals and creatures - specific characters first (high priority)
    if (optionB.toLowerCase().includes('dragon')) emojiB = '🐉';
    if (optionB.toLowerCase().includes('owl')) emojiB = '🦉';
    if (optionB.toLowerCase().includes('butterfly')) emojiB = '🦋';
    if (optionB.toLowerCase().includes('animal')) emojiB = '🐾';
    if (optionB.toLowerCase().includes('bug')) emojiB = '🦋';
    
    // Places and containers - specific places first
    if (optionB.toLowerCase().includes('door')) emojiB = '🚪';
    if (optionB.toLowerCase().includes('tent')) emojiB = '⛺';
    if (optionB.toLowerCase().includes('under')) emojiB = '⬇️';
    if (optionB.toLowerCase().includes('wagon')) emojiB = '🚃';
    if (optionB.toLowerCase().includes('rainbow')) emojiB = '🌈';
    
    // Environmental elements
    if (optionB.toLowerCase().includes('flower') || optionB.toLowerCase().includes('garden')) emojiB = '🌸';
    if (optionB.toLowerCase().includes('path') || optionB.toLowerCase().includes('road')) emojiB = '🛣️';
    if (optionB.toLowerCase().includes('tunnel') || optionB.toLowerCase().includes('cave')) emojiB = '🕳️';
    if (optionB.toLowerCase().includes('forest') || optionB.toLowerCase().includes('tree')) emojiB = '🌲';
    if (optionB.toLowerCase().includes('bridge')) emojiB = '🌉';
    if (optionB.toLowerCase().includes('waterfall')) emojiB = '🌊';
    if (optionB.toLowerCase().includes('water') || optionB.toLowerCase().includes('river')) emojiB = '💧';
    if (optionB.toLowerCase().includes('mountain')) emojiB = '⛰️';
    if (optionB.toLowerCase().includes('meadow')) emojiB = '🌿';
    if (optionB.toLowerCase().includes('night') || optionB.toLowerCase().includes('moon')) emojiB = '🌙';
    if (optionB.toLowerCase().includes('sun') || optionB.toLowerCase().includes('day')) emojiB = '☀️';
    
    // Actions and approaches
    if (optionB.toLowerCase().includes('magic') || optionB.toLowerCase().includes('spell')) emojiB = '✨';
    if (optionB.toLowerCase().includes('wait')) emojiB = '⏳';
    if (optionB.toLowerCase().includes('sing') || optionB.toLowerCase().includes('music')) emojiB = '🎵';
    if (optionB.toLowerCase().includes('dance')) emojiB = '💃';
    if (optionB.toLowerCase().includes('ask') || optionB.toLowerCase().includes('help')) emojiB = '🙋';
    if (optionB.toLowerCase().includes('quiet') || optionB.toLowerCase().includes('sneaky')) emojiB = '🤫';
    if (optionB.toLowerCase().includes('brave') || optionB.toLowerCase().includes('direct')) emojiB = '🦸';
    if (optionB.toLowerCase().includes('logic') || optionB.toLowerCase().includes('think')) emojiB = '🧠';
    if (optionB.toLowerCase().includes('create') || optionB.toLowerCase().includes('art')) emojiB = '🎨';
    if (optionB.toLowerCase().includes('climb')) emojiB = '🧗';
    
    // Tools (lowest priority)
    if (optionB.toLowerCase().includes('map')) emojiB = '🗺️';
    if (optionB.toLowerCase().includes('key')) emojiB = '🔑';
    if (optionB.toLowerCase().includes('bell')) emojiB = '🔔';
    if (optionB.toLowerCase().includes('build') || optionB.toLowerCase().includes('make')) emojiB = '🛠️';
    if (optionB.toLowerCase().includes('pulley') || optionB.toLowerCase().includes('rope')) emojiB = '⚙️';
    if (optionB.toLowerCase().includes('strong') || optionB.toLowerCase().includes('strength')) emojiB = '💪';
    if (optionB.toLowerCase().includes('arm')) emojiB = '💪';
    
    setStoryChoice({
      optionA,
      optionB,
      emojiA,
      emojiB,
      outcomeA: outcome, // We'll use the same outcome for both since we don't know which is which
      outcomeB: outcome
    });
    
    setStoryAfterChoice(restOfStory);
    setAtChoicePoint(true);
  };

  // For demonstration purposes, if there's an error, let's provide a sample story
  // so users can still see the functionality
  const provideFallbackStory = () => {
    const fallbackStories: Record<string, string> = {
      'Robo Rex': "Robo Rex was a brave, silly robot who liked to make funny beeping sounds. One day, in the " + currentPlace + ", Robo Rex was asked to " + currentMission.toLowerCase() + ". \"I can do that!\" said Robo Rex with a happy beep. Robo Rex tried very hard and even though it wasn't easy, the robot never gave up. In the end, Robo Rex learned that being patient and trying your best is what matters most. All of Robo Rex's friends were very proud. Beep-boop! The end. Would you like to go on another adventure with Robo Rex? Or are you ready to join Robo Rex in Dreamland?",
      
      'Drake': "Drake was the smallest dragon who breathed colorful steam instead of fire. One day, in the " + currentPlace + ", everyone needed help to " + currentMission.toLowerCase() + ". \"I, the MIGHTY Drake, shall help!\" he announced loudly, though his knees were shaking a little. When Drake arrived, he tried his best to be brave. He puffed out colorful steam that made everyone smile. With the help of his new friends, Drake managed to " + currentMission.toLowerCase() + "! Drake learned that it's okay to be scared sometimes, and that even small dragons can do big things. The end. Would you like to go on another adventure with Drake? Or are you ready to join Drake in Dreamland?",
      
      'Sparkles': "Sparkles was a unicorn with a shimmery mane and a horn that twinkled like stars. One day, in the " + currentPlace + ", Sparkles was asked to help " + currentMission.toLowerCase() + ". \"I would love to help!\" said Sparkles with a gentle neigh. Sparkles worked hard and used unicorn magic to solve problems. Along the way, Sparkles made new friends who helped too. Together, they managed to " + currentMission.toLowerCase() + "! Everyone celebrated with a rainbow dance. Sparkles learned that helping others and working together makes magic happen. The end. Would you like to go on another adventure with Sparkles? Or are you ready to join Sparkles in Dreamland?",
      
      'Mila TanTan': "Mila TanTan was an adorable 3-month-old baby with the sweetest smile. One day, in the " + currentPlace + ", everyone needed help to " + currentMission.toLowerCase() + ". Even though Mila was just a tiny baby, she wanted to help! Mila's secret power was drinking Mommy's Magic Milk, which made her strong and happy. When they arrived at the " + currentPlace + ", Mila giggled and waved her tiny hands. Her happy baby noises gave everyone good ideas! With everyone working together, they managed to " + currentMission.toLowerCase() + "! Mila learned that even the smallest babies can help make the world better. The end. Would you like to go on another adventure with Mila TanTan? Or are you ready to join Mila TanTan in Dreamland?",
      
      'Liam': "Liam was a seven-year-old boy who loved playing soccer and collecting blue pickup trucks. One day, in the " + currentPlace + ", everyone needed help to " + currentMission.toLowerCase() + ". \"I can help!\" said Liam excitedly. Liam brought his favorite blue pickup truck along for the adventure. When they arrived at the " + currentPlace + ", Liam used his soccer skills and his truck to help solve the problem. It wasn't easy, and Liam had to try several times, but he didn't give up. Finally, they managed to " + currentMission.toLowerCase() + "! Liam was happy he could help, and everyone thanked him. Liam learned that persistence and creativity can solve many problems. The end. Would you like to go on another adventure with Liam? Or are you ready to join Liam in Dreamland?",
      
      'Garyn': "Garyn was an eight-month-old baby boy with long eyelashes and a bright smile. One day, in the " + currentPlace + ", everyone needed help to " + currentMission.toLowerCase() + ". Garyn couldn't talk yet, but he wanted to help too! \"He's a Hap-py, Happy Boy,\" his mom sang as she rocked him. This always made Garyn giggle and wiggle his tiny toes. When they arrived at the " + currentPlace + ", Garyn's smile was so bright that it made everyone feel brave and cheerful. Suddenly, Garyn's happy laugh gave everyone a wonderful idea! Working together, they were able to " + currentMission.toLowerCase() + "! Garyn learned that even the smallest people can help in big ways, just by being themselves. The end. Would you like to go on another adventure with Garyn? Or are you ready to join Garyn in Dreamland?",
      
      'Bop-Bop': "Bop-Bop the Beat Bunny hopped joyfully through the musical meadow, where every step made a different musical note. One day, in the " + currentPlace + ", everyone needed help to " + currentMission.toLowerCase() + ". \"Let's hop to the top — drop the beat, don't stop!\" Bop-Bop exclaimed, bouncing with excitement. As they arrived at the " + currentPlace + ", Bop-Bop's fast-talking rhythm and joyful energy brought music to everyone around. With a series of rhythmic jumps, Bop-Bop discovered a hidden zone that contained just what they needed to " + currentMission.toLowerCase() + "! Everyone danced to Bop-Bop's beatbox celebration. Bop-Bop learned that bringing your own special rhythm to a problem can unlock amazing solutions. The end. Would you like to go on another adventure with Bop-Bop? Or are you ready to join Bop-Bop in Dreamland?",
      
      'Puffy': "Puffy the Fluffy Cloud Pup floated gently above the dreaming sky, his soft fur catching the sunlight. One day, in the " + currentPlace + ", everyone needed help to " + currentMission.toLowerCase() + ". \"I-I'm not very brave… but I am very fluffy,\" Puffy whispered shyly. Despite his fears, Puffy knew he had to try. As they approached the " + currentPlace + ", Puffy hid in a passing cloud when he felt scared. But when the moment came, Puffy sneezed a little storm that unexpectedly helped to " + currentMission.toLowerCase() + "! Everyone cheered for the shy Sky Dog. Puffy learned that even when you're afraid, your unique abilities can shine through and help others. The end. Would you like to go on another adventure with Puffy? Or are you ready to join Puffy in Dreamland?"
    };

    const fallbackStory = fallbackStories[currentHero] || fallbackStories['Sparkles'];
    
    // Enhance the fallback story with emojis before setting it
    const enhancedFallbackStory = enhanceStoryWithEmojis(fallbackStory);
    setStory(enhancedFallbackStory);
    setError(null);
    setUsedFallback(true);
    
    // Process the fallback story for choice points too
    processStoryForChoicePoint(enhancedFallbackStory);
  };

  // Get emoji for place
  const getPlaceEmoji = () => {
    if (currentPlace === 'Castle') return '🏰';
    if (currentPlace === 'Forest') return '🌲';
    if (currentPlace === 'Candy Land') return '🍭';
    if (currentPlace === 'Dino Land') return '🦕';
    return '🏠';
  };

  // Get emoji for mission
  const getMissionEmoji = () => {
    if (currentMission === 'Find Treasure') return '💎';
    if (currentMission === 'Help a Friend') return '🤝';
    if (currentMission === 'Solve a Mystery') return '🔍';
    if (currentMission === 'Paint a Picture that Comes to Life') return '🎨';
    if (currentMission === 'Tame a Baby Dragon') return '🐲';
    return '🎯';
  };

  // Get emoji for life skill
  const getLifeSkillEmoji = () => {
    if (!currentLifeSkill) return '🌟';
    if (currentLifeSkill === 'Bravery') return '🦸‍♀️';
    if (currentLifeSkill === 'Dealing with Anger') return '😤';
    if (currentLifeSkill === 'Kindness') return '💗';
    if (currentLifeSkill === 'Shyness') return '🙈';
    if (currentLifeSkill === 'Patience') return '⏳';
    if (currentLifeSkill === 'Brushing Teeth') return '🪥';
    if (currentLifeSkill === 'Focus and Attention') return '🔍';
    if (currentLifeSkill === 'Gratitude') return '🙏';
    return '🌟';
  };

  // Function to start reading the story aloud
  const startReading = () => {
    if ((!story && !storyBeforeChoice) || generating) return;
    
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Determine what text to read based on story state
      let textToRead;
      
      if (atChoicePoint) {
        if (selectedOption) {
          // If option is selected, read outcome and ending
          const outcome = selectedOption === 'A' ? storyChoice?.outcomeA : storyChoice?.outcomeB;
          textToRead = (outcome || '') + ' ' + storyAfterChoice;
        } else {
          // If at choice point but no option selected, just read the story before choice
          textToRead = storyBeforeChoice;
        }
      } else {
        // Not at choice point, read the whole story
        textToRead = story;
      }
      
      // Remove emojis from text for better speech synthesis
      textToRead = textToRead.replace(/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
      
      // Create a new speech utterance
      const utterance = new SpeechSynthesisUtterance(textToRead);
      
      // Set properties for a child-friendly voice
      utterance.rate = 0.9; // Slightly slower rate
      utterance.pitch = 1.1; // Slightly higher pitch
      
      // Try to find a child-friendly voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Samantha') || // Good US English voice on macOS
        voice.name.includes('Karen') ||    // Alternative US English voice
        voice.name.includes('Tessa')       // UK English voice
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      // Add event handlers
      utterance.onend = () => {
        setIsReading(false);
        setIsPaused(false);
      };
      
      utterance.onpause = () => {
        setIsPaused(true);
      };
      
      utterance.onresume = () => {
        setIsPaused(false);
      };
      
      // Store the utterance in a ref so we can control it later
      speechSynthRef.current = utterance;
      
      // Start speaking
      window.speechSynthesis.speak(utterance);
      setIsReading(true);
      setIsPaused(false);
    }
  };
  
  // Function to pause/resume reading
  const togglePauseReading = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    }
  };
  
  // Function to stop reading
  const stopReading = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsReading(false);
      setIsPaused(false);
    }
  };

  // Function to enhance the story text with emojis
  const enhanceStoryWithEmojis = (text: string): string => {
    if (!text) return text;
    
    // Don't modify text that already has our markers
    if (text.includes("===CHOICE POINT===")) return text;
    
    // Mapping of terms to emojis
    const emojiMap: Record<string, string> = {
      // Characters
      'Robo Rex': ' 🤖',
      'robot': ' 🤖',
      'Drake': ' 🐉',
      'dragon': ' 🐉',
      'Sparkles': ' 🦄',
      'unicorn': ' 🦄',
      'Mila TanTan': ' 👶',
      'baby': ' 👶',
      'Liam': ' 👦',
      'Garyn': ' 👶🏼',
      'Bop-Bop': ' 🐰',
      'Beat Bunny': ' 🐰',
      'rabbit': ' 🐰',
      'Rhythm Rabbit': ' 🐰',
      'beatbox': ' 🎵',
      'Puffy': ' ☁️',
      'Cloud Pup': ' ☁️',
      'Sky Dog': ' ☁️',
      'fluffy': ' ☁️',
      'cloud': ' ☁️',
      
      // Places
      'castle': ' 🏰',
      'forest': ' 🌲',
      'ocean': ' 🌊',
      'candy land': ' 🍭',
      'circus': ' 🎪',
      'rainbow': ' 🌈',
      'garden': ' 🌷',
      'bug world': ' 🐞',
      'mountain': ' ⛰️',
      'snow': ' ❄️',
      'crystal': ' 💎',
      'dino': ' 🦕',
      'dragon valley': ' 🐉',
      'ghost town': ' 👻',
      'unicorn fields': ' 🦄',
      'musical meadow': ' 🎵',
      'dreaming sky': ' 💭',
      
      // Common story elements
      'magic': ' ✨',
      'star': ' ⭐',
      'laugh': ' 😄',
      'smile': ' 😊',
      'happy': ' 😊',
      'sad': ' 😢',
      'friend': ' 👫',
      'adventure': ' 🚀',
      'treasure': ' 💎',
      'mystery': ' 🔍',
      'surprise': ' 🎁',
      'party': ' 🎉',
      'song': ' 🎵',
      'music': ' 🎵',
      'dance': ' 💃',
      'flower': ' 🌸',
      'sun': ' ☀️',
      'moon': ' 🌙',
      'night': ' 🌃',
      'morning': ' 🌅',
      'bird': ' 🐦',
      'animal': ' 🐾',
      'fly': ' 🦋',
      'water': ' 💧',
      'river': ' 🏞️',
      'scared': ' 😨',
      'brave': ' 🦸',
      'courage': ' 💪',
      'kindness': ' 💗',
      'help': ' 🤝',
      'dream': ' 💤',
      'sleep': ' 😴',
      'food': ' 🍕',
      'eat': ' 🍽️',
      'drink': ' 🥤',
      'tea': ' 🍵'
    };
    
    // Add emojis without duplicating them
    let enhancedText = text;
    
    // Only process the main sentences, not the ending question
    let mainText = enhancedText;
    let endingQuestion = '';
    
    // Split off the ending question if it exists
    if (enhancedText.includes("Would you like to go on another adventure")) {
      const parts = enhancedText.split("Would you like to go on another adventure");
      mainText = parts[0];
      endingQuestion = "Would you like to go on another adventure" + parts[1];
    }
    
    // Process each sentence to add emojis (avoiding emoji duplication)
    const sentences = mainText.split(/(?<=[.!?])\s+/);
    const enhancedSentences = sentences.map(sentence => {
      let enhancedSentence = sentence;
      
      // Track emojis already added to this sentence to avoid duplicates
      const emojisAddedToSentence = new Set<string>();
      
      Object.entries(emojiMap).forEach(([term, emoji]) => {
        // Only add the emoji if:
        // 1. The term is in the sentence (case insensitive)
        // 2. We haven't already added this emoji to this sentence
        // 3. The sentence doesn't already contain this emoji
        if (
          enhancedSentence.toLowerCase().includes(term.toLowerCase()) && 
          !emojisAddedToSentence.has(emoji) && 
          !enhancedSentence.includes(emoji)
        ) {
          // Only add emoji at the end of the sentence if it doesn't end with punctuation
          if (/[.!?]$/.test(enhancedSentence)) {
            enhancedSentence = enhancedSentence.replace(/([.!?])$/, `${emoji}$1`);
          } else {
            enhancedSentence += emoji;
          }
          emojisAddedToSentence.add(emoji);
        }
      });
      
      return enhancedSentence;
    });
    
    // Combine the enhanced sentences back into text
    enhancedText = enhancedSentences.join(' ') + (endingQuestion ? ' ' + endingQuestion : '');
    
    return enhancedText;
  };

  // New function to save the current story
  const saveCurrentStory = () => {
    if (!story) return;
    
    // Generate story ID
    const storyId = `story_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // Create the story object
    const storyToSave: SavedStory = {
      id: storyId,
      title: getStoryTitle(story),
      content: story,
      date: new Date().toISOString(),
      hero: currentHero,
      place: currentPlace || undefined,
      mission: currentMission || undefined,
      lifeSkill: currentLifeSkill || undefined,
      additionalHeroes: currentAdditionalHeroes
    };
    
    // Get existing saved stories from localStorage
    const existingStoriesJSON = localStorage.getItem('magicStoryBuddy_savedStories');
    const existingStories: SavedStory[] = existingStoriesJSON ? JSON.parse(existingStoriesJSON) : [];
    
    // Add the new story
    const updatedStories = [storyToSave, ...existingStories];
    
    // Save to localStorage
    localStorage.setItem('magicStoryBuddy_savedStories', JSON.stringify(updatedStories));
    
    // Show saved confirmation
    setStoryJustSaved(true);
    
    // Reset the saved indicator after 3 seconds
    setTimeout(() => {
      setStoryJustSaved(false);
    }, 3000);
  };
  
  // Load a saved story
  const loadSavedStory = (savedStory: SavedStory) => {
    // Set story content
    setStory(savedStory.content);
    
    // Update parameters
    setCurrentHero(savedStory.hero);
    setCurrentPlace(savedStory.place || '');
    setCurrentMission(savedStory.mission || '');
    setCurrentLifeSkill(savedStory.lifeSkill || '');
    setCurrentAdditionalHeroes(savedStory.additionalHeroes || []);
    
    // Reset story choice state
    setSelectedOption(null);
    setAtChoicePoint(false);
    
    // Process the story for choice points
    processStoryForChoicePoint(savedStory.content);
  };
  
  // Extract title from story content
  const getStoryTitle = (content: string): string => {
    const titleMatch = content.match(/^#\s*(.+)$/m);
    return titleMatch ? titleMatch[1] : 'Untitled Story';
  };

  // New UI helper functions
  const renderSaveButton = () => {
    if (!story || generating) return null;
    
    return (
      <button
        onClick={saveCurrentStory}
        className={`text-sm flex items-center gap-1 px-3 py-1 rounded-full transition-all ${
          storyJustSaved 
            ? 'bg-green-500 text-white' 
            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
        }`}
      >
        {storyJustSaved ? '✓ Saved!' : '💾 Save Story'}
      </button>
    );
  };
  
  const renderOpenSavedStoriesButton = () => {
    return (
      <button
        onClick={() => setShowSavedStories(true)}
        className="text-sm flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-all"
      >
        📚 My Stories
      </button>
    );
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
              if (e.target === e.currentTarget) onClose();
            }}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-white to-purple-50 rounded-3xl p-4 sm:p-6 max-w-4xl w-full max-h-[90vh] sm:max-h-[85vh] md:h-[80vh] overflow-hidden shadow-xl relative flex flex-col ipad-portrait:h-[85vh] ipad-portrait:max-w-[85vw] ipad-portrait:p-8 ipad-landscape:h-[85vh] ipad-landscape:w-[80vw] ipad-landscape:p-8"
              style={{
                boxShadow: '0 10px 40px rgba(160, 120, 200, 0.2)'
              }}
            >
              <div className="absolute top-0 right-0 left-0 h-24 bg-gradient-to-r from-pink-100/70 to-purple-100/70 rounded-t-3xl z-0"></div>

              {/* Background pattern that looks like an e-reader */}
              <div 
                className="absolute inset-0 z-0 opacity-5 pointer-events-none"
                style={{
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%239C92AC" fill-opacity="1" fill-rule="evenodd"%3E%3Cpath d="M0 40L40 0H20L0 20M40 40V20L20 40"/%3E%3C/g%3E%3C/svg%3E")'
                }}
              ></div>
              
              <div className="relative z-10 flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-3xl mr-3 shadow-sm border border-primary/10">
                    {currentHero === 'Robo Rex' ? '🤖' : 
                     currentHero === 'Drake' ? '🐉' : 
                     currentHero === 'Mila TanTan' ? '👶' : 
                     currentHero === 'Liam' ? '👦' : 
                     currentHero === 'Garyn' ? '👶🏼' : 
                     currentHero === 'Bop-Bop' ? '🐰' : 
                     currentHero === 'Puffy' ? '☁️' : '🦄'}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold font-baloo bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Magical Adventure
                  </h2>
                </div>
              
                <div className="flex items-center gap-2">
                  {/* Add Save and My Stories buttons */}
                  {renderSaveButton()}
                  {renderOpenSavedStoriesButton()}
                  
                  {/* Read aloud controls */}
                  {story && !generating && !showNewAdventureOptions && (
                    <div className="mr-2 hidden sm:flex">
                      {isReading ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={isPaused ? togglePauseReading : stopReading}
                            className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                            title={isPaused ? "Resume reading" : "Stop reading"}
                          >
                            {isPaused ? '▶️' : '⏹️'}
                          </button>
                          {!isPaused && (
                            <button
                              onClick={togglePauseReading}
                              className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                              title="Pause reading"
                            >
                              ⏸️
                            </button>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={startReading}
                          className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors inline-flex items-center gap-1"
                          title="Read aloud"
                        >
                          <span className="text-lg">🔊</span>
                          <span className="text-xs font-medium text-primary">Read</span>
                        </button>
                      )}
                    </div>
                  )}
                 
                  <button
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-white hover:bg-red-50 hover:text-red-500 border border-gray-200 transition-colors"
                    aria-label="Close"
                    onMouseEnter={playHoverSound}
                    onClick={() => {
                      playClickSound();
                      onClose();
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 justify-center items-center mb-5 px-2">
                <span className="px-3 py-1.5 bg-gradient-to-r from-chart-1/20 to-chart-1/5 rounded-full text-sm sm:text-base font-medium shadow-sm border border-chart-1/10">
                  {currentHero} {currentHero === 'Robo Rex' ? '🤖' : 
                                 currentHero === 'Drake' ? '🐉' : 
                                 currentHero === 'Mila TanTan' ? '👶' : 
                                 currentHero === 'Liam' ? '👦' : 
                                 currentHero === 'Garyn' ? '👶🏼' : 
                                 currentHero === 'Bop-Bop' ? '🐰' : 
                                 currentHero === 'Puffy' ? '☁️' : '🦄'}
                </span>
                <span className="px-3 py-1.5 bg-gradient-to-r from-chart-2/20 to-chart-2/5 rounded-full text-sm sm:text-base font-medium shadow-sm border border-chart-2/10">
                  {currentPlace} {getPlaceEmoji()}
                </span>
                <span className="px-3 py-1.5 bg-gradient-to-r from-chart-3/20 to-chart-3/5 rounded-full text-sm sm:text-base font-medium shadow-sm border border-chart-3/10">
                  {currentMission} {getMissionEmoji()}
                </span>
                {currentLifeSkill && (
                  <span className="px-3 py-1.5 bg-gradient-to-r from-chart-4/20 to-chart-4/5 rounded-full text-sm sm:text-base font-medium shadow-sm border border-chart-4/10">
                    {currentLifeSkill} {getLifeSkillEmoji()}
                  </span>
                )}
              </div>

              {/* Mobile read aloud button */}
              {story && !generating && !showNewAdventureOptions && (
                <div className="sm:hidden flex justify-center mb-3">
                  {isReading ? (
                    <div className="flex items-center gap-2 bg-primary/10 rounded-full p-1 px-3">
                      <button
                        onClick={isPaused ? togglePauseReading : stopReading}
                        className="p-1.5 rounded-full hover:bg-white/30 transition-colors"
                        title={isPaused ? "Resume reading" : "Stop reading"}
                      >
                        {isPaused ? '▶️' : '⏹️'}
                      </button>
                      {!isPaused && (
                        <button
                          onClick={togglePauseReading}
                          className="p-1.5 rounded-full hover:bg-white/30 transition-colors"
                          title="Pause reading"
                        >
                          ⏸️
                        </button>
                      )}
                      <span className="text-xs font-medium">Reading aloud...</span>
                    </div>
                  ) : (
                    <button
                      onClick={startReading}
                      className="px-4 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors inline-flex items-center gap-1.5"
                      title="Read aloud"
                    >
                      <span className="text-lg">🔊</span>
                      <span className="text-sm font-medium">Read Aloud</span>
                    </button>
                  )}
                </div>
              )}

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 md:p-6 shadow-inner border border-purple-100/50 flex-1 overflow-y-auto"
                    style={{
                      /* Page styling to look like a book/e-reader */
                      backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0) 10%, rgba(0,0,0,0) 90%, rgba(0,0,0,0.02) 100%)'
                    }}
              >
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
                        onClick={() => generateStory()}
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
                ) : showNewAdventureOptions ? (
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-4 font-baloo text-center">New Adventure Options</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Choose Buddies (up to 3)</label>
                        <div className="flex flex-col space-y-2 max-h-60 overflow-y-auto bg-white p-2 rounded-lg border">
                          {heroes.map((heroOption) => (
                            <div key={heroOption.name} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`hero-${heroOption.name}`}
                                checked={newHero === heroOption.name || newAdditionalHeroes.includes(heroOption.name)}
                                onChange={() => {
                                  // If this is already the main hero
                                  if (newHero === heroOption.name) {
                                    // Remove it as main hero
                                    setNewHero('');
                                  }
                                  // If in additional heroes list
                                  else if (newAdditionalHeroes.includes(heroOption.name)) {
                                    // Remove from additional heroes
                                    setNewAdditionalHeroes(prev => prev.filter(h => h !== heroOption.name));
                                  }
                                  // If not selected and we have no main hero
                                  else if (!newHero) {
                                    // Set as main hero
                                    setNewHero(heroOption.name);
                                  }
                                  // If not selected and we already have a main hero
                                  else {
                                    // Add to additional heroes if we have less than 2 additional heroes
                                    if (newAdditionalHeroes.length < 2) {
                                      setNewAdditionalHeroes(prev => [...prev, heroOption.name]);
                                    }
                                  }
                                }}
                                className="mr-2"
                              />
                              <label htmlFor={`hero-${heroOption.name}`} className="flex items-center">
                                <span className="text-xl mr-2">{heroOption.emoji}</span>
                                {heroOption.name}
                                {newHero === heroOption.name && 
                                  <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Main</span>
                                }
                              </label>
                            </div>
                          ))}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {newHero && <div>Main buddy: {newHero}</div>}
                          {newAdditionalHeroes.length > 0 && (
                            <div>Friend{newAdditionalHeroes.length > 1 ? 's' : ''}: {newAdditionalHeroes.join(', ')}</div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Choose Place</label>
                        <select 
                          className="w-full p-2 border rounded-lg bg-background"
                          value={newPlace}
                          onChange={(e) => setNewPlace(e.target.value)}
                        >
                          <option value="">Random Place</option>
                          {places.map(place => (
                            <option key={place.name} value={place.name}>{place.name} {place.emoji}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Choose Mission</label>
                        <select 
                          className="w-full p-2 border rounded-lg bg-background"
                          value={newMission}
                          onChange={(e) => setNewMission(e.target.value)}
                        >
                          <option value="">Random Mission</option>
                          {missions.map(mission => (
                            <option key={mission.name} value={mission.name}>{mission.name} {mission.emoji}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Life Skill (Optional)</label>
                        <div className="text-xs text-indigo-600 mb-2">For parents: Choose a value or skill you'd like the story to teach</div>
                        <select 
                          className="w-full p-2 border rounded-lg bg-background"
                          value={newLifeSkill}
                          onChange={(e) => setNewLifeSkill(e.target.value)}
                        >
                          <option value="">None</option>
                          {lifeSkills.map(skill => (
                            <option key={skill.name} value={skill.name}>{skill.name} {skill.emoji}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex justify-center">
                      <button
                        onClick={() => generateStory(true)}
                        disabled={!newHero && newAdditionalHeroes.length === 0}
                        className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:opacity-90 transition-opacity shadow-md disabled:opacity-50"
                      >
                        Begin New Adventure ✨
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-none">
                    {usedFallback && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-amber-700 text-sm">
                        <p className="flex items-center gap-2 font-medium">
                          <span className="text-lg">ℹ️</span> We're using our built-in storyteller today instead of OpenAI. Don't worry - each story is still unique with different characters, settings, and teaching points!
                        </p>
                      </div>
                    )}
                    <div className="whitespace-pre-wrap leading-relaxed text-lg sm:text-xl px-2 sm:px-4 font-comic font-medium"
                          style={{ 
                            color: '#5D4777',
                            textShadow: '0 1px 2px rgba(0,0,0,0.02)',
                            lineHeight: '1.8',
                            letterSpacing: '0.01em'
                          }}
                    >
                      {atChoicePoint ? (
                        <>
                          {/* Display story before the choice */}
                          <div>{storyBeforeChoice}</div>
                          
                          {/* Display the options as big emoji buttons */}
                          {!selectedOption && storyChoice && (
                            <div className="my-10 py-8 px-4 bg-gradient-to-br from-amber-50/80 to-orange-50/50 rounded-xl border border-amber-100/50 shadow-inner">
                              <div className="text-center mb-6">
                                <h3 className="font-baloo text-2xl text-amber-700 mb-2">Choose wisely!</h3>
                                <p className="text-amber-600/90 text-sm italic max-w-md mx-auto">Your decision will change the path of the story...</p>
                              </div>
                              <div className="flex flex-col sm:flex-row justify-center gap-8 sm:gap-16">
                                <motion.button 
                                  whileHover={{ 
                                    scale: 1.05, 
                                    y: -8,
                                    transition: { 
                                      type: "spring", 
                                      stiffness: 300, 
                                      damping: 10 
                                    }
                                  }}
                                  className="choice-option focus:outline-none group"
                                  onClick={() => handleOptionSelect('A')}
                                  onMouseEnter={playHoverSound}
                                >
                                  <div className="w-28 sm:w-36 h-28 sm:h-36 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full flex items-center justify-center text-6xl sm:text-7xl mb-3 shadow-md group-hover:shadow-lg group-hover:shadow-pink-200/30 transition-all duration-300 border-2 border-pink-300/40">
                                    {storyChoice.emojiA}
                                  </div>
                                  <div className="text-center font-medium text-lg px-6 py-2 bg-pink-100/80 rounded-xl text-pink-900 shadow-sm max-w-[200px] whitespace-normal break-words min-h-[4rem] flex items-center justify-center">{storyChoice.optionA}</div>
                                </motion.button>
                                
                                <motion.button 
                                  whileHover={{ 
                                    scale: 1.05, 
                                    y: -8,
                                    transition: { 
                                      type: "spring", 
                                      stiffness: 300, 
                                      damping: 10 
                                    }
                                  }}
                                  className="choice-option focus:outline-none group"
                                  onClick={() => handleOptionSelect('B')}
                                  onMouseEnter={playHoverSound}
                                >
                                  <div className="w-28 sm:w-36 h-28 sm:h-36 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center text-6xl sm:text-7xl mb-3 shadow-md group-hover:shadow-lg group-hover:shadow-teal-200/30 transition-all duration-300 border-2 border-teal-300/40">
                                    {storyChoice.emojiB}
                                  </div>
                                  <div className="text-center font-medium text-lg px-6 py-2 bg-teal-100/80 rounded-xl text-teal-900 shadow-sm max-w-[200px] whitespace-normal break-words min-h-[4rem] flex items-center justify-center">{storyChoice.optionB}</div>
                                </motion.button>
                              </div>
                            </div>
                          )}
                          
                          {/* Display the outcome based on the selected option */}
                          {selectedOption && storyChoice && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ 
                                duration: 0.8,
                                type: "spring",
                                stiffness: 100,
                                damping: 15
                              }}
                            >
                              {renderChoiceConfirmation()}
                              <div className="mt-4">{selectedOption === 'A' ? storyChoice.outcomeA : storyChoice.outcomeB}</div>
                              <div>{storyAfterChoice}</div>
                            </motion.div>
                          )}
                        </>
                      ) : (
                        // Display the full story if not at a choice point
                        <>{story}</>
                      )}
                    </div>
                    
                    {/* Show adventure options only if we're at the end of the story */}
                    {!atChoicePoint && story.includes("Would you like to go on another adventure") && (
                      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setShowNewAdventureOptions(true)}
                          className="px-5 py-3 bg-gradient-to-r from-accent to-pink-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
                        >
                          ✨ Go on Another Adventure
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={onClose}
                          className="px-5 py-3 bg-gradient-to-r from-purple-100 to-blue-100 text-primary font-medium rounded-lg shadow-sm hover:shadow transition-all border border-primary/10"
                        >
                          😴 Go to Dreamland
                        </motion.button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-between">
                {!showNewAdventureOptions && (
                  <button
                    onClick={() => generateStory()}
                    disabled={generating}
                    className="px-5 py-2.5 bg-gradient-to-r from-primary to-accent text-white rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 font-medium"
                  >
                    {generating ? 'Generating...' : '✨ New Story'}
                  </button>
                )}
                
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 border border-primary/30 text-primary rounded-lg hover:bg-primary/10 transition-colors font-medium ml-auto"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Add SavedStoriesDrawer */}
      <SavedStoriesDrawer 
        isOpen={showSavedStories}
        onClose={() => setShowSavedStories(false)}
        onLoadStory={loadSavedStory}
      />
    </>
  );
} 