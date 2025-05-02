'use client';

import { useState } from "react";
import HomepageBackground from "./components/HomepageBackground";
import Logo from "./components/Logo";
import PageLayout from "./components/PageLayout";
import StoryModal from "./components/StoryModal";

export default function Home() {
  const [selectedHero, setSelectedHero] = useState("");
  const [selectedPlace, setSelectedPlace] = useState("");
  const [selectedMission, setSelectedMission] = useState("");
  const [selectedLifeSkill, setSelectedLifeSkill] = useState("");
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  
  const heroes = [
    { name: "Robo Rex", emoji: "🤖" },
    { name: "Drake", emoji: "🐉" },
    { name: "Sparkles", emoji: "🦄" },
    { name: "Mila TanTan", emoji: "👶" },
    { name: "Liam", emoji: "👦" },
    { name: "Garyn", emoji: "👶🏼" },
    { name: "Futa", emoji: "👦🏻" }
  ];
  
  const places = [
    { name: "Castle", emoji: "🏰" },
    { name: "Forest", emoji: "🌲" },
    { name: "Ocean", emoji: "🌊" },
    { name: "Candy Land", emoji: "🍭" },
    { name: "Silly Circus", emoji: "🎪" },
    { name: "Rainbow Cloud Island", emoji: "🌈" },
    { name: "Enchanted Garden", emoji: "🌷" },
    { name: "Bug World", emoji: "🐞" },
    { name: "Snowy Mountain", emoji: "❄️" },
    { name: "Crystal Caves", emoji: "💎" },
    { name: "Dino Land", emoji: "🦕" },
    { name: "Dragon Valley", emoji: "🐉" },
    { name: "Friendly Ghost Town", emoji: "👻" },
    { name: "Unicorn Fields", emoji: "🦄" }
  ];
  
  const missions = [
    { name: "Find Treasure", emoji: "💎" },
    { name: "Help a Friend", emoji: "🤝" },
    { name: "Build a Tower", emoji: "🧱" },
    { name: "Solve a Mystery", emoji: "🔍" },
    { name: "Explore a Secret Tunnel", emoji: "🕳️" },
    { name: "Follow a Map to Adventure", emoji: "🗺️" },
    { name: "Collect Sparkle Stones", emoji: "✨" },
    { name: "Cheer Someone Up", emoji: "😊" },
    { name: "Plan a Surprise Party", emoji: "🎁" },
    { name: "Clean up", emoji: "🧹" },
    { name: "Deliver a Special Letter", emoji: "✉️" },
    { name: "Find Something That was Lost", emoji: "🔎" },
    { name: "Tame a Baby Dragon", emoji: "🐲" },
    { name: "Find the Missing Song Notes", emoji: "🎵" },
    { name: "Paint a Picture that Comes to Life", emoji: "🎨" },
    { name: "Help Someone Learn the Alphabet", emoji: "🔤" },
    { name: "Count the Stars", emoji: "⭐" },
    { name: "Grow a Magic Garden", emoji: "🌱" },
    { name: "Help Birds Build a Nest", emoji: "🪹" },
    { name: "Find Firefly Light for the Lantern Festival", emoji: "🏮" }
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

  const openStoryModal = () => {
    setIsStoryModalOpen(true);
  };

  const closeStoryModal = () => {
    setIsStoryModalOpen(false);
  };
  
  return (
    <PageLayout currentPage="home">
      <main className="relative flex-grow flex flex-col">
        <HomepageBackground className="relative overflow-visible flex-grow">
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] p-8">
            <div className="max-w-4xl w-full flex flex-col items-center text-center gap-6 mb-12">
              <div className="mb-6">
                <Logo size={60} showText={false} className="mb-4" />
              </div>
              
              <h1 className="text-5xl sm:text-7xl font-bold text-primary font-baloo">
                Magic Story Buddy
              </h1>
              
              <p className="text-2xl sm:text-3xl text-secondary-foreground font-nunito tracking-wide leading-relaxed max-w-3xl">
                Pick a Buddy. Pick a Place. Make a Magic Story!
              </p>
              
              <div className="mt-8 mb-10 w-full max-w-2xl bg-gradient-to-br from-primary/20 to-accent/30 backdrop-blur-sm rounded-2xl p-8 border border-primary/30 shadow-lg">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="#make-story" 
                    className="rounded-full bg-indigo-700 py-4 px-6 text-white font-medium text-lg flex items-center justify-center gap-2 hover:bg-indigo-800 transition shadow-md sparkle-button font-poppins"
                  >
                    <span className="text-yellow-200">⭐</span> Try a Demo Story
                  </a>
                  <a
                    href="/auth/signup" 
                    className="rounded-full bg-blue-200 py-4 px-6 text-indigo-800 font-medium text-lg flex items-center justify-center gap-2 hover:bg-blue-300 transition shadow-md sparkle-button font-poppins"
                  >
                    <span>📱</span> Join Early Access List
                  </a>
                </div>
              </div>
              
              {/* Let's Make a Magic Story section */}
              <div id="make-story" className="w-full max-w-4xl bg-gradient-to-b from-background/60 to-background/80 rounded-2xl p-10 border border-primary/20 shadow-md mt-10 mb-8 reveal-on-scroll fade-in delay-100">
                <h3 className="text-4xl sm:text-5xl font-semibold text-primary mb-10 text-center font-baloo">Let's Make a Magic Story!</h3>
                
                <div className="flex flex-col md:flex-row gap-10 justify-between">
                  <div className="flex-1 flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-chart-1/30 rounded-full flex items-center justify-center text-4xl mb-5 transition-all duration-300">
                      {selectedHero ? 
                        heroes.find(h => h.name === selectedHero)?.emoji :
                        <span className="opacity-70">1</span>
                      }
                    </div>
                    <h4 className="text-xl font-medium mb-3 font-baloo">Pick a Hero</h4>
                    <div className="flex flex-wrap justify-center gap-3 mt-3">
                      {heroes.map((hero) => (
                        <div
                          key={hero.name}
                          className={`px-4 py-2 text-base rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 font-poppins ${
                            selectedHero === hero.name 
                              ? "bg-chart-1 text-white font-medium" 
                              : "bg-chart-1/20 border border-chart-1/40 hover:bg-chart-1/30"
                          }`}
                          onClick={() => setSelectedHero(hero.name)}
                        >
                          {hero.name} {hero.emoji}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-chart-2/30 rounded-full flex items-center justify-center text-4xl mb-5 transition-all duration-300">
                      {selectedPlace ? 
                        places.find(p => p.name === selectedPlace)?.emoji :
                        <span className="opacity-70">2</span>
                      }
                    </div>
                    <h4 className="text-xl font-medium mb-3 font-baloo">Choose a Place</h4>
                    <div className="flex flex-wrap justify-center gap-3 mt-3">
                      {places.map((place) => (
                        <div
                          key={place.name}
                          className={`px-4 py-2 text-base rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 font-poppins ${
                            selectedPlace === place.name 
                              ? "bg-chart-2 text-white font-medium" 
                              : "bg-chart-2/20 border border-chart-2/40 hover:bg-chart-2/30"
                          }`}
                          onClick={() => setSelectedPlace(place.name)}
                        >
                          {place.name} {place.emoji}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-chart-3/30 rounded-full flex items-center justify-center text-4xl mb-5 transition-all duration-300">
                      {selectedMission ? 
                        missions.find(m => m.name === selectedMission)?.emoji :
                        <span className="opacity-70">3</span>
                      }
                    </div>
                    <h4 className="text-xl font-medium mb-3 font-baloo">Select a Mission</h4>
                    <div className="flex flex-wrap justify-center gap-3 mt-3">
                      {missions.map((mission) => (
                        <div
                          key={mission.name}
                          className={`px-4 py-2 text-base rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 font-poppins ${
                            selectedMission === mission.name 
                              ? "bg-chart-3 text-white font-medium" 
                              : "bg-chart-3/20 border border-chart-3/40 hover:bg-chart-3/30"
                          }`}
                          onClick={() => setSelectedMission(mission.name)}
                        >
                          {mission.name} {mission.emoji}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-chart-4/30 rounded-full flex items-center justify-center text-4xl mb-5 transition-all duration-300">
                    {selectedLifeSkill ? 
                      lifeSkills.find(ls => ls.name === selectedLifeSkill)?.emoji :
                      <span className="opacity-70">+</span>
                    }
                  </div>
                  <h4 className="text-xl font-medium mb-3 font-baloo">Life Skill (Optional)</h4>
                  <div className="flex flex-wrap justify-center gap-3 mt-3 max-w-2xl">
                    {lifeSkills.map((skill) => (
                      <div
                        key={skill.name}
                        className={`px-4 py-2 text-base rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 font-poppins ${
                          selectedLifeSkill === skill.name 
                            ? "bg-chart-4 text-white font-medium" 
                            : "bg-chart-4/20 border border-chart-4/40 hover:bg-chart-4/30"
                        }`}
                        onClick={() => setSelectedLifeSkill(skill.name)}
                      >
                        {skill.name} {skill.emoji}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-center mt-10 mb-4">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl transition-all duration-500 ${
                    selectedHero && selectedPlace && selectedMission 
                      ? "bg-accent scale-110 sparkle-button" 
                      : "bg-accent/30"
                  }`}>
                    ✨
                  </div>
                  <div className="hidden md:block mx-4 flex-1 border-t-2 border-dashed border-accent/40"></div>
                  <div className="md:hidden mx-2 text-accent">→</div>
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl transition-all duration-500 ${
                    selectedHero && selectedPlace && selectedMission 
                      ? "bg-primary scale-125 animate-pulse shadow-lg" 
                      : "bg-primary/30"
                  }`}>
                    📖
                  </div>
                </div>
                <p className="text-center text-xl font-medium text-primary mt-4 font-nunito">
                  {selectedHero && selectedPlace && selectedMission 
                    ? `Your story about ${selectedHero} in the ${selectedPlace} is ready!` 
                    : "AI Magic creates a personalized bedtime story!"}
                </p>
                
                {selectedHero && selectedPlace && selectedMission && (
                  <div className="flex justify-center mt-6">
                    <button 
                      onClick={openStoryModal}
                      className="rounded-full bg-indigo-700 py-4 px-8 text-white font-medium text-lg flex items-center justify-center gap-2 hover:bg-indigo-800 transition shadow-md sparkle-button font-poppins"
                    >
                      <span className="text-yellow-200">⭐</span> Try This Story
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6 mt-4 justify-center">
                <a href="/auth/signin" className="sparkle-button rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-primary text-primary-foreground hover:opacity-90 font-medium text-lg h-14 px-10 min-w-40 font-poppins">
                  Sign In
                </a>
                <a href="/auth/signup" className="sparkle-button rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-accent text-accent-foreground hover:opacity-90 font-medium text-lg h-14 px-10 min-w-40 font-poppins">
                  Sign Up
        </a>
              </div>
              
              <div className="mt-8 w-full max-w-md">
                <a href="/dashboard" className="sparkle-button w-full rounded-full border-2 border-dashed border-primary/50 transition-colors flex items-center justify-center bg-transparent text-primary gap-2 hover:bg-primary/10 font-bold text-lg h-14 px-10 font-poppins">
                  👉 Demo Dashboard 👈
                </a>
              </div>
            </div>
            
            <div className="flex gap-6 items-center justify-center flex-wrap max-w-2xl mb-12">
              <div className="rounded-full h-16 w-16 bg-chart-1 flex items-center justify-center text-2xl">🦄</div>
              <div className="rounded-full h-16 w-16 bg-chart-2 flex items-center justify-center text-2xl">🌟</div>
              <div className="rounded-full h-16 w-16 bg-chart-3 flex items-center justify-center text-2xl">🦋</div>
              <div className="rounded-full h-16 w-16 bg-chart-4 flex items-center justify-center text-2xl">🌈</div>
              <div className="rounded-full h-16 w-16 bg-chart-5 flex items-center justify-center text-2xl">🐶</div>
            </div>
            
            <div className="w-full max-w-3xl text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-medium text-secondary-foreground/80 mb-8 font-baloo">
                Coming soon to your favorite app stores
              </h2>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a 
                  href="/download" 
                  className="sparkle-button flex items-center justify-center gap-4 px-8 py-4 bg-blue-100/80 hover:bg-blue-100 text-gray-800 rounded-full transition-colors sm:min-w-72 font-poppins"
        >
                  <span className="text-3xl">🍎</span>
                  <div className="flex flex-col items-start">
                    <span className="text-sm">Download on the</span>
                    <span className="text-xl font-bold">App Store</span>
                  </div>
                </a>
                
                <a 
                  href="/download" 
                  className="sparkle-button flex items-center justify-center gap-4 px-8 py-4 bg-green-100/80 hover:bg-green-100 text-gray-800 rounded-full transition-colors sm:min-w-72 font-poppins"
                >
                  <span className="text-3xl">🎮</span>
                  <div className="flex flex-col items-start">
                    <span className="text-sm">GET IT ON</span>
                    <span className="text-xl font-bold">Google Play</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </HomepageBackground>

        {/* Story Modal */}
        {isStoryModalOpen && (
          <StoryModal 
            isOpen={isStoryModalOpen} 
            onClose={closeStoryModal} 
            hero={selectedHero}
            place={selectedPlace}
            mission={selectedMission}
            lifeSkill={selectedLifeSkill}
          />
        )}
      </main>
    </PageLayout>
  );
}
