'use client';

import Link from "next/link";
import Logo from "../components/Logo";
import WhimsicalBackground from "../components/WhimsicalBackground";
import PageLayout from "../components/PageLayout";

export default function Stories() {
  return (
    <PageLayout currentPage="stories">
      <WhimsicalBackground className="min-h-[calc(100vh-40px)] overflow-visible">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 cozy-py">
          <div className="flex items-center justify-between mb-10 reveal-on-scroll fade-in">
            <div className="flex items-center gap-4">
              <div className="float-bubble relative" style={{ fontSize: '2rem' }}>📚</div>
              <h2 className="text-3xl font-bold text-foreground font-baloo">Mila's Stories</h2>
            </div>
            <div className="flex items-center gap-3">
              <select 
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary font-nunito"
                defaultValue="mila"
              >
                <option value="mila">Mila</option>
                <option value="joe">Joe</option>
              </select>
              <a href="/dashboard" className="text-sm text-primary hover:underline font-poppins">
                Back to Dashboard
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="md:col-span-2 space-y-8">
              {/* Stories Library */}
              <section className="bg-card rounded-2xl shadow-md p-8 border border-border reveal-on-scroll fade-in delay-100">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl breathe">📚</span>
                  <h3 className="text-xl font-semibold">Recent Stories</h3>
                </div>
                
                <div className="space-y-5">
                  <div className="bg-background rounded-xl p-6 border border-border hover:border-primary/50 transition-all duration-300 cursor-pointer">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex gap-4">
                        <div className="h-16 w-16 rounded-lg bg-chart-1/20 flex items-center justify-center text-2xl">
                          🦄
                        </div>
                        <div>
                          <h4 className="font-medium text-lg">The Princess and the Brave Unicorn</h4>
                          <p className="text-sm text-muted-foreground">Read yesterday • Theme: Bravery</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-xs px-2 py-1 bg-chart-2/20 text-chart-2 rounded-full">
                          New Badge!
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-background rounded-xl p-6 border border-border hover:border-primary/50 transition-all duration-300 cursor-pointer reveal-on-scroll fade-in delay-200">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex gap-4">
                        <div className="h-16 w-16 rounded-lg bg-chart-3/20 flex items-center justify-center text-2xl">
                          🐻
                        </div>
                        <div>
                          <h4 className="font-medium text-lg">The Sharing Bears</h4>
                          <p className="text-sm text-muted-foreground">Read 3 days ago • Theme: Kindness</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-background rounded-xl p-6 border border-border hover:border-primary/50 transition-all duration-300 cursor-pointer reveal-on-scroll fade-in delay-300">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex gap-4">
                        <div className="h-16 w-16 rounded-lg bg-chart-5/20 flex items-center justify-center text-2xl">
                          🐢
                        </div>
                        <div>
                          <h4 className="font-medium text-lg">Timmy the Patient Turtle</h4>
                          <p className="text-sm text-muted-foreground">Read last week • Theme: Patience</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-xs px-2 py-1 bg-chart-3/20 text-chart-3 rounded-full">
                          Patience Badge
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button className="w-full mt-6 flex items-center justify-center gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3 text-primary hover:bg-primary/10 transition-colors text-sm sparkle-button">
                  View All Stories
                </button>
              </section>
              
              {/* Start New Story */}
              <section className="bg-card rounded-2xl shadow-md p-8 border border-border reveal-on-scroll fade-in delay-200">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl float-bubble">✨</span>
                  <h3 className="text-xl font-semibold">Create New Story</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium mb-2 block">Story Theme</label>
                      <select className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                        <option value="random">Random Adventure</option>
                        <option value="kindness">Kindness & Sharing</option>
                        <option value="bravery">Bravery & Courage</option>
                        <option value="patience">Patience & Waiting</option>
                        <option value="anger">Managing Anger</option>
                      </select>
                    </div>
                    
                    <div className="flex-1">
                      <label className="text-sm font-medium mb-2 block">Main Character</label>
                      <select className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                        <option value="mila">Mila</option>
                        <option value="princess">Princess</option>
                        <option value="astronaut">Astronaut</option>
                        <option value="animal">Animal Friend</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Story Setting</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-chart-1/20 border-2 border-chart-1 rounded-xl p-3 text-center cursor-pointer">
                        <div className="text-xl mb-1">🏰</div>
                        <div className="text-xs font-medium">Castle</div>
                      </div>
                      <div className="bg-background border-2 border-transparent rounded-xl p-3 text-center cursor-pointer hover:border-primary/30">
                        <div className="text-xl mb-1">🌲</div>
                        <div className="text-xs font-medium">Forest</div>
                      </div>
                      <div className="bg-background border-2 border-transparent rounded-xl p-3 text-center cursor-pointer hover:border-primary/30">
                        <div className="text-xl mb-1">🌊</div>
                        <div className="text-xs font-medium">Ocean</div>
                      </div>
                      <div className="bg-background border-2 border-transparent rounded-xl p-3 text-center cursor-pointer hover:border-primary/30">
                        <div className="text-xl mb-1">🚀</div>
                        <div className="text-xs font-medium">Space</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <label className="text-sm font-medium mb-2 block">Include Parent Audio Message?</label>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <input type="checkbox" id="parent-audio" className="sr-only" defaultChecked />
                        <label
                          htmlFor="parent-audio"
                          className="block w-10 h-6 rounded-full bg-accent/30 cursor-pointer"
                        >
                          <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 transform translate-x-4"></span>
                        </label>
                      </div>
                      <span className="text-sm text-muted-foreground">Play "Goodnight Message" before story</span>
                    </div>
                  </div>
                </div>
                
                <button className="w-full mt-6 flex items-center justify-center gap-2 rounded-full border border-transparent bg-primary p-3 text-primary-foreground hover:opacity-90 transition-colors text-base font-medium sparkle-button">
                  Create a Custom Story
                </button>
              </section>
            </div>
            
            {/* Right Column - Badges and Rewards */}
            <div className="space-y-8">
              <section className="bg-card rounded-2xl shadow-md p-8 border border-border reveal-on-scroll fade-in delay-300">
                <div className="absolute top-0 right-0 mt-1 mr-6">
                  <div className="star text-yellow-300 text-xl" style={{ animationDelay: '0.3s' }}>✨</div>
                </div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl breathe">🏆</span>
                  <h3 className="text-lg font-semibold">Mila's Badges</h3>
                </div>
                
                <div className="bg-background rounded-xl p-4 border border-border mb-4">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-chart-1/20 border border-chart-1/50 rounded-lg p-2 text-center">
                      <div className="text-xl mb-1">🌟</div>
                      <div className="text-xs">5 Stories</div>
                    </div>
                    <div className="bg-chart-2/20 border border-chart-2/50 rounded-lg p-2 text-center">
                      <div className="text-xl mb-1">🦋</div>
                      <div className="text-xs">Kindness</div>
                    </div>
                    <div className="bg-chart-3/20 border border-chart-3/50 rounded-lg p-2 text-center">
                      <div className="text-xl mb-1">🐢</div>
                      <div className="text-xs">Patience</div>
                    </div>
                    <div className="bg-chart-4/20 border border-chart-4/50 rounded-lg p-2 text-center">
                      <div className="text-xl mb-1">🔍</div>
                      <div className="text-xs">Explorer</div>
                    </div>
                    <div className="bg-chart-5/20 border border-chart-5/50 rounded-lg p-2 text-center">
                      <div className="text-xl mb-1">🦄</div>
                      <div className="text-xs">New!</div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-2 text-center opacity-60">
                      <div className="text-xl mb-1">❓</div>
                      <div className="text-xs">Coming</div>
                    </div>
                  </div>
                  <div className="mt-3 text-center">
                    <p className="text-sm font-medium text-primary">5 badges collected!</p>
                    <p className="text-xs text-muted-foreground">10 more to unlock special story</p>
                  </div>
                </div>
                
                <div className="bg-chart-2/10 rounded-xl p-4 border border-chart-2/30">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-10 w-10 rounded-full bg-chart-2/30 flex items-center justify-center text-xl">
                      🎉
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">New Badge Unlocked!</h4>
                      <p className="text-xs text-muted-foreground">Yesterday at 7:32 PM</p>
                    </div>
                  </div>
                  <p className="text-sm bg-white/50 p-3 rounded-lg text-center">
                    Mila earned the <span className="font-medium">Brave Adventurer</span> badge for completing her first bravery-themed story!
                  </p>
                </div>
              </section>
              
              <section className="bg-card rounded-2xl shadow-md p-8 border border-border reveal-on-scroll fade-in delay-400">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl float-bubble">🎯</span>
                  <h3 className="text-lg font-semibold">Story Goals</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-chart-1/20 flex items-center justify-center text-lg">
                      ✅
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium">Complete 5 stories</p>
                        <p className="text-xs font-medium">5/5</p>
                      </div>
                      <div className="h-2 bg-muted rounded-full mt-1 overflow-hidden">
                        <div className="h-full w-full bg-chart-1 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-chart-3/20 flex items-center justify-center text-lg">
                      🔄
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium">Read all themes</p>
                        <p className="text-xs font-medium">3/6</p>
                      </div>
                      <div className="h-2 bg-muted rounded-full mt-1 overflow-hidden">
                        <div className="h-full w-1/2 bg-chart-3 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-chart-5/20 flex items-center justify-center text-lg">
                      ⭐
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium">Find hidden stars</p>
                        <p className="text-xs font-medium">2/10</p>
                      </div>
                      <div className="h-2 bg-muted rounded-full mt-1 overflow-hidden">
                        <div className="h-full w-1/5 bg-chart-5 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button className="w-full mt-4 flex items-center justify-center gap-2 rounded-lg border border-primary/20 bg-primary/5 p-2 text-primary hover:bg-primary/10 transition-colors text-sm sparkle-button">
                  View Saved Stories
                </button>
              </section>
            </div>
          </div>
        </main>
      </WhimsicalBackground>
    </PageLayout>
  );
} 