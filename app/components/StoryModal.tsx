'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  hero: string;
  place: string;
  mission: string;
  lifeSkill?: string;
}

export default function StoryModal({ isOpen, onClose, hero, place, mission, lifeSkill }: StoryModalProps) {
  const [story, setStory] = useState<string>('');
  const [generating, setGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [usedFallback, setUsedFallback] = useState<boolean>(false);
  const [showNewAdventureOptions, setShowNewAdventureOptions] = useState<boolean>(false);
  
  // State for editing parameters
  const [newHero, setNewHero] = useState<string>(hero);
  const [newPlace, setNewPlace] = useState<string>(place);
  const [newMission, setNewMission] = useState<string>(mission);
  const [newLifeSkill, setNewLifeSkill] = useState<string>(lifeSkill || '');
  
  // Current parameters (either original or new)
  const [currentHero, setCurrentHero] = useState<string>(hero);
  const [currentPlace, setCurrentPlace] = useState<string>(place);
  const [currentMission, setCurrentMission] = useState<string>(mission);
  const [currentLifeSkill, setCurrentLifeSkill] = useState<string>(lifeSkill || '');
  
  useEffect(() => {
    if (isOpen && hero && place && mission) {
      generateStory();
    }
  }, [isOpen, hero, place, mission, lifeSkill]);
  
  useEffect(() => {
    // Reset parameters when modal is opened
    setNewHero(hero);
    setNewPlace(place);
    setNewMission(mission);
    setNewLifeSkill(lifeSkill || '');
    setCurrentHero(hero);
    setCurrentPlace(place);
    setCurrentMission(mission);
    setCurrentLifeSkill(lifeSkill || '');
    setShowNewAdventureOptions(false);
  }, [hero, place, mission, lifeSkill, isOpen]);

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
    
    // Update current parameters
    setCurrentHero(heroToUse);
    setCurrentPlace(placeToUse);
    setCurrentMission(missionToUse);
    setCurrentLifeSkill(lifeSkillToUse || '');

    let heroDescription = '';
    if (heroToUse === 'Robo Rex') {
      heroDescription = 'Robo Rex the brave, slightly silly robot';
    } else if (heroToUse === 'Drake') {
      heroDescription = 'Drake the Dragon, the dramatic boastful but slightly scaredy cat dragon - smallest of his litter who cant breathe fire but instead breathes colored steam';
    } else if (heroToUse === 'Sparkles') {
      heroDescription = 'Sparkles the unicorn';
    } else if (heroToUse === 'Mila TanTan') {
      heroDescription = 'Mila TanTan, the adorable 3 month old baby. She likes giggling and cuddles from her Mommy Moo and Daddy Doo. She powers up by drinking Mommy\'s Magic Milk. She is a cousin to Liam, the 7 year old boy, and Garyn, the 8 month old baby boy.';
    } else if (heroToUse === 'Liam') {
      heroDescription = 'Liam, a 7 year old boy, big brother to Garyn and cousin to Mila TanTan. He loves blue pickup trucks and plays soccer. He doesn\'t like his Grandpa Bop\'s yucky healthy food.';
    } else if (heroToUse === 'Garyn') {
      heroDescription = 'Garyn, an 8 month old baby boy and little brother of Liam and cousin to Mila TanTan. He has long eyelashes that drive everyone crazy and a smile that lights up any room. His mom likes to sing to him, "He\'s a Hap-py, Happy Boy, he\'s a happy happy happy boy!"';
    } else if (heroToUse === 'Futa') {
      heroDescription = 'Futa, a 5 year old boy. He likes Chip and Dale and Mugicha tea. He doesn\'t like water. His mama Yumiko is the best ABC teacher in the world.';
    }

    try {
      console.log('Sending request to generate story:', { 
        hero: heroDescription, 
        place: placeToUse, 
        mission: missionToUse,
        lifeSkill: lifeSkillToUse
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
      setUsedFallback(data.usedFallback || false);
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
      'Robo Rex': "Once upon a time, there was a brave but silly robot named Robo Rex. Robo Rex liked to make funny beeping sounds and do silly dances. One day, in the " + currentPlace + ", Robo Rex was asked to " + currentMission.toLowerCase() + ". \"I can do that!\" said Robo Rex with a happy beep. Robo Rex tried very hard and even though it wasn't easy, the robot never gave up. In the end, Robo Rex learned that being patient and trying your best is what matters most. All of Robo Rex's friends were very proud. Beep-boop! The end. Would you like to go on another adventure with Robo Rex? Or are you ready to join Robo Rex in Dreamland?",
      'Drake': "Once upon a time, there was a dragon named Drake. Drake was the smallest dragon in his family and couldn't breathe fire like his brothers and sisters. Instead, he breathed colorful steam! Drake was a bit dramatic and liked to boast, but he was also a little bit scared of many things. One day, in the " + currentPlace + ", everyone needed help to " + currentMission.toLowerCase() + ". \"I, the MIGHTY Drake, shall help!\" he announced loudly, though his knees were shaking a little. When Drake arrived at the " + currentPlace + ", he tried his best to be brave. He puffed out colorful steam that made everyone smile. With the help of his new friends, Drake managed to " + currentMission.toLowerCase() + "! Drake learned that it's okay to be scared sometimes, and that even small dragons can do big things. The end. Would you like to go on another adventure with Drake? Or are you ready to join Drake in Dreamland?",
      'Sparkles': "Once upon a time, there was a beautiful unicorn named Sparkles. Sparkles had a shimmery mane and a horn that twinkled like the stars. One day, in the " + currentPlace + ", Sparkles was asked to help " + currentMission.toLowerCase() + ". \"I would love to help!\" said Sparkles with a gentle neigh. Sparkles worked hard and used unicorn magic to solve problems. Along the way, Sparkles made new friends who helped too. Together, they managed to " + currentMission.toLowerCase() + "! Everyone celebrated with a rainbow dance. Sparkles learned that helping others and working together makes magic happen. The end. Would you like to go on another adventure with Sparkles? Or are you ready to join Sparkles in Dreamland?",
      'Mila TanTan': "Once upon a time, there was an adorable 3-month-old baby named Mila TanTan. Mila had the sweetest smile and loved cuddling with her Mommy Moo and Daddy Doo. One day, in the " + currentPlace + ", everyone needed help to " + currentMission.toLowerCase() + ". Even though Mila was just a tiny baby, she wanted to help! Mila's secret power was drinking Mommy's Magic Milk, which made her strong and happy. When they arrived at the " + currentPlace + ", Mila giggled and waved her tiny hands. Her happy baby noises gave everyone good ideas! With everyone working together, they managed to " + currentMission.toLowerCase() + "! Mila's cousins, Liam and Garyn, were very proud of her. Mila learned that even the smallest babies can help make the world better. The end. Would you like to go on another adventure with Mila TanTan? Or are you ready to join Mila TanTan in Dreamland?",
      'Liam': "Once upon a time, there was a seven-year-old boy named Liam. Liam loved playing soccer and collecting blue pickup trucks. He was a big brother to baby Garyn and a cousin to baby Mila TanTan. One day, in the " + currentPlace + ", everyone needed help to " + currentMission.toLowerCase() + ". \"I can help!\" said Liam excitedly. Liam brought his favorite blue pickup truck along for the adventure. When they arrived at the " + currentPlace + ", Liam used his soccer skills and his truck to help solve the problem. It wasn't easy, and Liam had to try several times, but he didn't give up. Finally, they managed to " + currentMission.toLowerCase() + "! Liam was happy he could help, and everyone thanked him. Liam learned that persistence and creativity can solve many problems. The end. Would you like to go on another adventure with Liam? Or are you ready to join Liam in Dreamland?",
      'Garyn': "Once upon a time, there was an eight-month-old baby boy named Garyn. Garyn had the longest eyelashes anyone had ever seen and a smile that could light up the darkest room. He was the little brother of Liam and a cousin to Mila TanTan. One day, in the " + currentPlace + ", everyone needed help to " + currentMission.toLowerCase() + ". Garyn couldn't talk yet, but he wanted to help too! \"He's a Hap-py, Happy Boy,\" his mom sang as she rocked him. This always made Garyn giggle and wiggle his tiny toes. When they arrived at the " + currentPlace + ", Garyn's smile was so bright and beautiful that it made everyone feel brave and cheerful. His long eyelashes fluttered as he watched the grown-ups try to solve the problem. Suddenly, Garyn's happy laugh gave everyone a wonderful idea! Working together, they were able to " + currentMission.toLowerCase() + "! Garyn's big brother Liam was very proud and gave him a gentle high-five. Garyn learned that even the smallest people can help in big ways, just by being themselves. The end. Would you like to go on another adventure with Garyn? Or are you ready to join Garyn in Dreamland?",
      'Futa': "Once upon a time, there was a 5-year-old boy named Futa. Futa had bright eyes and loved watching Chip and Dale cartoons. He enjoyed drinking warm Mugicha tea but didn't like water very much. His mama Yumiko was the best ABC teacher in the whole wide world! One day, in the " + currentPlace + ", everyone needed help to " + currentMission.toLowerCase() + ". \"I can help!\" said Futa happily. He packed his favorite Mugicha tea (but no water!) and set off on an adventure. When he arrived at the " + currentPlace + ", Futa had to make a choice between taking a path through pretty flowers or crawling through a tunnel made of twisty tree roots. Futa chose the flower path and met a friendly squirrel who looked just like Chip from his cartoon! Together with his new friend, Futa was able to " + currentMission.toLowerCase() + "! Everyone cheered and thanked him. When Futa got home, his mama Yumiko made him his favorite tea and listened to his adventure story. Futa learned that being brave and helping others makes everyone happy. The end. Would you like to go on another adventure with Futa? Or are you ready to join Futa in Dreamland?"
    };

    setStory(fallbackStories[currentHero] || fallbackStories['Sparkles']);
    setError(null);
    setUsedFallback(true);
  };

  // Get emoji for place
  const getPlaceEmoji = () => {
    if (currentPlace === 'Castle') return '🏰';
    if (currentPlace === 'Forest') return '🌲';
    if (currentPlace === 'Ocean') return '🌊';
    if (currentPlace === 'Candy Land') return '🍭';
    if (currentPlace === 'Silly Circus') return '🎪';
    if (currentPlace === 'Rainbow Cloud Island') return '🌈';
    if (currentPlace === 'Enchanted Garden') return '🌷';
    if (currentPlace === 'Bug World') return '🐞';
    if (currentPlace === 'Snowy Mountain') return '❄️';
    if (currentPlace === 'Crystal Caves') return '💎';
    if (currentPlace === 'Dino Land') return '🦕';
    if (currentPlace === 'Dragon Valley') return '🐉';
    if (currentPlace === 'Friendly Ghost Town') return '👻';
    if (currentPlace === 'Unicorn Fields') return '🦄';
    return '🏠';
  };

  // Get emoji for mission
  const getMissionEmoji = () => {
    if (currentMission === 'Find Treasure') return '💎';
    if (currentMission === 'Help a Friend') return '🤝';
    if (currentMission === 'Build a Tower') return '🧱';
    if (currentMission === 'Solve a Mystery') return '🔍';
    if (currentMission === 'Explore a Secret Tunnel') return '🕳️';
    if (currentMission === 'Follow a Map to Adventure') return '🗺️';
    if (currentMission === 'Collect Sparkle Stones') return '✨';
    if (currentMission === 'Cheer Someone Up') return '😊';
    if (currentMission === 'Plan a Surprise Party') return '🎁';
    if (currentMission === 'Clean up') return '🧹';
    if (currentMission === 'Deliver a Special Letter') return '✉️';
    if (currentMission === 'Find Something That was Lost') return '🔎';
    if (currentMission === 'Tame a Baby Dragon') return '🐲';
    if (currentMission === 'Find the Missing Song Notes') return '🎵';
    if (currentMission === 'Paint a Picture that Comes to Life') return '🎨';
    if (currentMission === 'Help Someone Learn the Alphabet') return '🔤';
    if (currentMission === 'Count the Stars') return '⭐';
    if (currentMission === 'Grow a Magic Garden') return '🌱';
    if (currentMission === 'Help Birds Build a Nest') return '🪹';
    if (currentMission === 'Find Firefly Light for the Lantern Festival') return '🏮';
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
            className="bg-background rounded-2xl p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto shadow-xl relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
            >
              ✕
            </button>

            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-2xl mr-3">
                {currentHero === 'Robo Rex' ? '🤖' : 
                 currentHero === 'Drake' ? '🐉' : 
                 currentHero === 'Mila TanTan' ? '👶' : 
                 currentHero === 'Liam' ? '👦' : 
                 currentHero === 'Garyn' ? '👶🏼' : 
                 currentHero === 'Futa' ? '👦🏻' : '🦄'}
              </div>
              <h2 className="text-2xl font-bold font-baloo">Your Magical Story</h2>
            </div>

            <div className="flex gap-3 justify-center items-center mb-6">
              <span className="px-3 py-1 bg-chart-1/20 rounded-full text-sm">
                {currentHero} {currentHero === 'Robo Rex' ? '🤖' : 
                               currentHero === 'Drake' ? '🐉' : 
                               currentHero === 'Mila TanTan' ? '👶' : 
                               currentHero === 'Liam' ? '👦' : 
                               currentHero === 'Garyn' ? '👶🏼' : 
                               currentHero === 'Futa' ? '👦🏻' : '🦄'}
              </span>
              <span className="px-3 py-1 bg-chart-2/20 rounded-full text-sm">
                {currentPlace} {getPlaceEmoji()}
              </span>
              <span className="px-3 py-1 bg-chart-3/20 rounded-full text-sm">
                {currentMission} {getMissionEmoji()}
              </span>
              {currentLifeSkill && (
                <span className="px-3 py-1 bg-chart-4/20 rounded-full text-sm">
                  {currentLifeSkill} {getLifeSkillEmoji()}
                </span>
              )}
            </div>

            <div className="bg-card border border-border rounded-xl p-5 shadow-inner min-h-[300px]">
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
                      <label className="block text-sm font-medium mb-2">Choose Hero</label>
                      <select 
                        className="w-full p-2 border rounded-lg bg-background"
                        value={newHero}
                        onChange={(e) => setNewHero(e.target.value)}
                      >
                        <option value="Robo Rex">Robo Rex 🤖</option>
                        <option value="Drake">Drake 🐉</option>
                        <option value="Sparkles">Sparkles 🦄</option>
                        <option value="Mila TanTan">Mila TanTan 👶</option>
                        <option value="Liam">Liam 👦</option>
                        <option value="Garyn">Garyn 👶🏼</option>
                        <option value="Futa">Futa 👦🏻</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Choose Place</label>
                      <select 
                        className="w-full p-2 border rounded-lg bg-background"
                        value={newPlace}
                        onChange={(e) => setNewPlace(e.target.value)}
                      >
                        <option value="Castle">Castle 🏰</option>
                        <option value="Forest">Forest 🌲</option>
                        <option value="Ocean">Ocean 🌊</option>
                        <option value="Candy Land">Candy Land 🍭</option>
                        <option value="Silly Circus">Silly Circus 🎪</option>
                        <option value="Rainbow Cloud Island">Rainbow Cloud Island 🌈</option>
                        <option value="Enchanted Garden">Enchanted Garden 🌷</option>
                        <option value="Bug World">Bug World 🐞</option>
                        <option value="Snowy Mountain">Snowy Mountain ❄️</option>
                        <option value="Crystal Caves">Crystal Caves 💎</option>
                        <option value="Dino Land">Dino Land 🦕</option>
                        <option value="Dragon Valley">Dragon Valley 🐉</option>
                        <option value="Friendly Ghost Town">Friendly Ghost Town 👻</option>
                        <option value="Unicorn Fields">Unicorn Fields 🦄</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Choose Mission</label>
                      <select 
                        className="w-full p-2 border rounded-lg bg-background"
                        value={newMission}
                        onChange={(e) => setNewMission(e.target.value)}
                      >
                        <option value="Find Treasure">Find Treasure 💎</option>
                        <option value="Help a Friend">Help a Friend 🤝</option>
                        <option value="Build a Tower">Build a Tower 🧱</option>
                        <option value="Solve a Mystery">Solve a Mystery 🔍</option>
                        <option value="Explore a Secret Tunnel">Explore a Secret Tunnel 🕳️</option>
                        <option value="Follow a Map to Adventure">Follow a Map to Adventure 🗺️</option>
                        <option value="Collect Sparkle Stones">Collect Sparkle Stones ✨</option>
                        <option value="Cheer Someone Up">Cheer Someone Up 😊</option>
                        <option value="Plan a Surprise Party">Plan a Surprise Party 🎁</option>
                        <option value="Clean up">Clean up 🧹</option>
                        <option value="Deliver a Special Letter">Deliver a Special Letter ✉️</option>
                        <option value="Find Something That was Lost">Find Something That was Lost 🔎</option>
                        <option value="Tame a Baby Dragon">Tame a Baby Dragon 🐲</option>
                        <option value="Find the Missing Song Notes">Find the Missing Song Notes 🎵</option>
                        <option value="Paint a Picture that Comes to Life">Paint a Picture that Comes to Life 🎨</option>
                        <option value="Help Someone Learn the Alphabet">Help Someone Learn the Alphabet 🔤</option>
                        <option value="Count the Stars">Count the Stars ⭐</option>
                        <option value="Grow a Magic Garden">Grow a Magic Garden 🌱</option>
                        <option value="Help Birds Build a Nest">Help Birds Build a Nest 🪹</option>
                        <option value="Find Firefly Light for the Lantern Festival">Find Firefly Light for the Lantern Festival 🏮</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Life Skill (Optional)</label>
                      <select 
                        className="w-full p-2 border rounded-lg bg-background"
                        value={newLifeSkill}
                        onChange={(e) => setNewLifeSkill(e.target.value)}
                      >
                        <option value="">None</option>
                        <option value="Bravery">Bravery 🦸‍♀️</option>
                        <option value="Dealing with Anger">Dealing with Anger 😤</option>
                        <option value="Kindness">Kindness 💗</option>
                        <option value="Shyness">Shyness 🙈</option>
                        <option value="Patience">Patience ⏳</option>
                        <option value="Brushing Teeth">Brushing Teeth 🪥</option>
                        <option value="Focus and Attention">Focus and Attention 🔍</option>
                        <option value="Gratitude">Gratitude 🙏</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <button
                      onClick={() => generateStory(true)}
                      className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Begin New Adventure
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
                  <div className="whitespace-pre-wrap font-nunito leading-relaxed text-lg">
                    {story}
                  </div>
                  
                  {story.includes("Would you like to go on another adventure") && (
                    <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                      <button
                        onClick={() => setShowNewAdventureOptions(true)}
                        className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                      >
                        Go on Another Adventure
                      </button>
                      <button
                        onClick={onClose}
                        className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                      >
                        Go to Dreamland (Close)
                      </button>
                    </div>
                  )}
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
              {!showNewAdventureOptions && (
                <button
                  onClick={() => generateStory()}
                  disabled={generating}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {generating ? 'Generating...' : 'Generate New Story'}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 