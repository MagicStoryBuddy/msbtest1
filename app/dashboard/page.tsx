import Link from "next/link";
import Logo from "../components/Logo";
import WhimsicalBackground from "../components/WhimsicalBackground";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex justify-between items-center">
            <Logo size={28} showText={false} />
            <nav className="flex items-center gap-4 text-xs">
              <Link href="/" className="font-medium text-muted-foreground hover:text-primary">
                Home
              </Link>
              <Link href="/dashboard" className="font-medium text-primary hover:text-primary/80">
                Dashboard
              </Link>
              <Link href="/stories" className="font-medium text-muted-foreground hover:text-primary">
                Stories
              </Link>
              <Link href="/help" className="font-medium text-muted-foreground hover:text-primary">
                Help
              </Link>
              <button className="font-medium text-muted-foreground hover:text-primary">Sign Out</button>
            </nav>
          </div>
        </div>
      </header>
      
      <WhimsicalBackground className="min-h-[calc(100vh-40px)] overflow-visible">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 cozy-py">
          <h2 className="text-3xl font-bold text-foreground mb-8 cozy-mb reveal-on-scroll fade-in">Parent Dashboard</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Child Profiles Section with Sibling Mode */}
            <section className="bg-card rounded-2xl shadow-md p-8 border border-border reveal-on-scroll fade-in delay-100 breathe">
              <div className="float-bubble" style={{ position: 'absolute', top: '-15px', right: '10px', fontSize: '1.5rem' }}>👦</div>
              <div className="float-bubble" style={{ position: 'absolute', top: '-10px', right: '40px', fontSize: '1.5rem' }}>👧</div>
              
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">🧒</span>
                <h3 className="text-xl font-semibold">Child Profiles</h3>
                <span className="ml-auto px-2 py-1 bg-primary/20 text-primary font-medium rounded-full text-xs">
                  Sibling Mode Enabled
                </span>
              </div>
              
              <div className="space-y-6">
                <div className="bg-background rounded-xl p-6 border border-border hover:border-primary/50 transition-all duration-300">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-14 rounded-full bg-chart-3 flex items-center justify-center text-2xl">
                        👧
                      </div>
                      <div>
                        <h4 className="font-medium text-lg">Mila</h4>
                        <p className="text-sm text-muted-foreground">5 years old</p>
                      </div>
                    </div>
                    <button className="text-sm text-primary hover:underline">Edit</button>
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between bg-muted/50 rounded-lg p-4">
                      <span className="text-sm">Bedtime Story Mode</span>
                      <div className="relative">
                        <input type="checkbox" id="bedtime-toggle" className="sr-only" defaultChecked />
                        <label
                          htmlFor="bedtime-toggle"
                          className="block w-10 h-6 rounded-full bg-accent/30 cursor-pointer"
                        >
                          <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 transform translate-x-0"></span>
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-muted/50 rounded-lg p-4">
                      <span className="text-sm">Sound</span>
                      <div className="relative">
                        <input type="checkbox" id="sound-toggle" className="sr-only" defaultChecked />
                        <label
                          htmlFor="sound-toggle"
                          className="block w-10 h-6 rounded-full bg-accent/30 cursor-pointer"
                        >
                          <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 transform translate-x-4"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-background rounded-xl p-6 border border-border hover:border-primary/50 transition-all duration-300">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-14 rounded-full bg-chart-4 flex items-center justify-center text-2xl">
                        👦
                      </div>
                      <div>
                        <h4 className="font-medium text-lg">Joe</h4>
                        <p className="text-sm text-muted-foreground">3 years old</p>
                      </div>
                    </div>
                    <button className="text-sm text-primary hover:underline">Edit</button>
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between bg-muted/50 rounded-lg p-4">
                      <span className="text-sm">Bedtime Story Mode</span>
                      <div className="relative">
                        <input type="checkbox" id="joe-bedtime-toggle" className="sr-only" defaultChecked />
                        <label
                          htmlFor="joe-bedtime-toggle"
                          className="block w-10 h-6 rounded-full bg-accent/30 cursor-pointer"
                        >
                          <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 transform translate-x-0"></span>
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-muted/50 rounded-lg p-4">
                      <span className="text-sm">Sound</span>
                      <div className="relative">
                        <input type="checkbox" id="joe-sound-toggle" className="sr-only" defaultChecked />
                        <label
                          htmlFor="joe-sound-toggle"
                          className="block w-10 h-6 rounded-full bg-accent/30 cursor-pointer"
                        >
                          <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 transform translate-x-4"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button className="w-full flex items-center justify-center gap-2 rounded-lg border border-dashed border-primary/50 p-4 text-primary hover:bg-primary/5 transition-colors sparkle-button">
                  <span className="text-lg">+</span> Add Another Child
                </button>
              </div>
            </section>

            {/* Life Skills Themes Section */}
            <section className="bg-card rounded-2xl shadow-md p-8 border border-border reveal-on-scroll fade-in delay-200">
              <div className="float-bubble" style={{ position: 'absolute', top: '-15px', right: '15px', fontSize: '1.5rem' }}>💭</div>
              
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">💡</span>
                <h3 className="text-xl font-semibold">Life Skills Themes</h3>
              </div>
              
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">Choose current growth focus for:</p>
                <select 
                  className="h-10 rounded-lg border border-input bg-background px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  defaultValue="mila"
                >
                  <option value="mila">Mila</option>
                  <option value="joe">Joe</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-chart-1/20 border-2 border-chart-1 rounded-xl p-4 text-center hover:scale-105 transition-transform duration-300">
                  <div className="text-2xl mb-2 breathe">❤️</div>
                  <div className="text-sm font-medium">Kindness</div>
                </div>
                <div className="bg-background border-2 border-transparent rounded-xl p-4 text-center hover:border-chart-2/50 hover:bg-chart-2/10 transition-all duration-300">
                  <div className="text-2xl mb-2">🦁</div>
                  <div className="text-sm font-medium">Bravery</div>
                </div>
                <div className="bg-background border-2 border-transparent rounded-xl p-4 text-center hover:border-chart-3/50 hover:bg-chart-3/10 transition-all duration-300">
                  <div className="text-2xl mb-2">🧘</div>
                  <div className="text-sm font-medium">Patience</div>
                </div>
                <div className="bg-background border-2 border-transparent rounded-xl p-4 text-center hover:border-chart-4/50 hover:bg-chart-4/10 transition-all duration-300">
                  <div className="text-2xl mb-2">😤</div>
                  <div className="text-sm font-medium">Dealing with Anger</div>
                </div>
                <div className="bg-background border-2 border-transparent rounded-xl p-4 text-center hover:border-chart-5/50 hover:bg-chart-5/10 transition-all duration-300">
                  <div className="text-2xl mb-2">🧠</div>
                  <div className="text-sm font-medium">Focus & Attention</div>
                </div>
                <div className="bg-background border-2 border-transparent rounded-xl p-4 text-center hover:border-primary/50 hover:bg-primary/10 transition-all duration-300">
                  <div className="text-2xl mb-2">🙏</div>
                  <div className="text-sm font-medium">Gratitude</div>
                </div>
              </div>
              
              <p className="mt-6 text-xs text-muted-foreground">Selected themes influence which stories appear more frequently.</p>
            </section>

            {/* Rewards & Stickers Section */}
            <section className="bg-card rounded-2xl shadow-md p-6 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🏆</span>
                <h3 className="text-xl font-semibold">Rewards & Stickers</h3>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">View badges earned by:</p>
                <select 
                  className="h-8 rounded-lg border border-input bg-background px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  defaultValue="mila"
                >
                  <option value="mila">Mila</option>
                  <option value="joe">Joe</option>
                </select>
              </div>
              
              <div className="bg-muted/30 rounded-xl p-4 mb-4">
                <h4 className="text-sm font-medium mb-3">Recently Unlocked</h4>
                <div className="grid grid-cols-4 gap-2">
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
                </div>
              </div>
              
              <div className="bg-background rounded-xl p-4 border border-border">
                <h4 className="text-sm font-medium mb-3">Coming Soon</h4>
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-muted/30 rounded-lg p-2 text-center opacity-60">
                    <div className="text-xl mb-1">🦁</div>
                    <div className="text-xs">Bravery</div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-2 text-center opacity-60">
                    <div className="text-xl mb-1">🧠</div>
                    <div className="text-xs">Smart</div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-2 text-center opacity-60">
                    <div className="text-xl mb-1">🎨</div>
                    <div className="text-xs">Artist</div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-2 text-center opacity-60">
                    <div className="text-xl mb-1">📚</div>
                    <div className="text-xs">10 Stories</div>
                  </div>
                </div>
              </div>
              
              <button className="w-full mt-4 flex items-center justify-center gap-2 rounded-lg border border-primary/20 bg-primary/5 p-2 text-primary hover:bg-primary/10 transition-colors text-sm sparkle-button">
                <span>🖨️</span> Print Reward Certificate
              </button>
            </section>

            {/* Screen Time Settings Section */}
            <section className="bg-card rounded-2xl shadow-md p-6 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">⏱️</span>
                <h3 className="text-xl font-semibold">Screen Time Settings</h3>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">Settings for:</p>
                <select 
                  className="h-8 rounded-lg border border-input bg-background px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  defaultValue="mila"
                >
                  <option value="mila">Mila</option>
                  <option value="joe">Joe</option>
                </select>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium mb-2 block">Max stories per day</label>
                  <select 
                    className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    defaultValue="3"
                  >
                    <option value="2">2 stories</option>
                    <option value="3">3 stories</option>
                    <option value="4">4 stories</option>
                    <option value="5">5 stories</option>
                    <option value="unlimited">Unlimited</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Weekly time limit</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="range" 
                      min="30" 
                      max="210" 
                      step="30" 
                      defaultValue="90"
                      className="w-full accent-primary" 
                    />
                    <span className="text-sm whitespace-nowrap">90 mins/week</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Auto bedtime shutdown</span>
                  <div className="relative">
                    <input type="checkbox" id="bedtime-shutdown" className="sr-only" defaultChecked />
                    <label
                      htmlFor="bedtime-shutdown"
                      className="block w-10 h-6 rounded-full bg-accent/30 cursor-pointer"
                    >
                      <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 transform translate-x-4"></span>
                    </label>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground">When enabled, story playback will softly fade out with a lullaby when bedtime is reached.</p>
              </div>
            </section>

            {/* Progress Insights Section */}
            <section className="bg-card rounded-2xl shadow-md p-6 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">📈</span>
                <h3 className="text-xl font-semibold">Progress Insights</h3>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">Stats for:</p>
                <select 
                  className="h-8 rounded-lg border border-input bg-background px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  defaultValue="mila"
                >
                  <option value="mila">Mila</option>
                  <option value="joe">Joe</option>
                </select>
              </div>
              
              <div className="mb-5">
                <h4 className="text-sm font-medium mb-2">Stories completed this week</h4>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                    <div key={i} className="text-xs text-muted-foreground">{day}</div>
                  ))}
                  {[2, 1, 0, 3, 1, 0, 0].map((count, i) => (
                    <div key={i} className={`rounded-md py-1 text-xs ${count > 0 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      {count}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-5">
                <h4 className="text-sm font-medium mb-2">Top themes this month</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-chart-1/20 h-7 w-7 rounded-md flex items-center justify-center">❤️</div>
                    <div className="text-sm">Kindness</div>
                    <div className="ml-auto text-sm font-medium">12 stories</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-chart-2/20 h-7 w-7 rounded-md flex items-center justify-center">🦁</div>
                    <div className="text-sm">Bravery</div>
                    <div className="ml-auto text-sm font-medium">8 stories</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-chart-3/20 h-7 w-7 rounded-md flex items-center justify-center">🧘</div>
                    <div className="text-sm">Patience</div>
                    <div className="ml-auto text-sm font-medium">5 stories</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4 border border-border text-center">
                <p className="text-sm font-medium text-accent-foreground">
                  "Mila's been rocking kindness stories lately!"
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Keep up the great progress with these positive themes.
                </p>
              </div>
            </section>
            
            {/* Shareable Moments & Audio Messages Section */}
            <section className="bg-card rounded-2xl shadow-md p-6 border border-border md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">✨</span>
                <h3 className="text-xl font-semibold">Story Moments & Messages</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Shareable Story Moments */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Recent Story Moments</h4>
                  
                  <div className="bg-background rounded-xl p-4 border border-border">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h5 className="text-sm font-medium">The Princess and the Brave Unicorn</h5>
                        <p className="text-xs text-muted-foreground">Mila • Yesterday at 7:32 PM</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-1.5 rounded-md bg-muted/40 hover:bg-muted text-muted-foreground">
                          <span className="text-sm">📧</span>
                        </button>
                        <button className="p-1.5 rounded-md bg-muted/40 hover:bg-muted text-muted-foreground">
                          <span className="text-sm">💾</span>
                        </button>
                      </div>
                    </div>
                    <p className="text-xs bg-muted/30 p-3 rounded-lg">
                      "...and the princess learned that being brave means doing what's right, even when you're scared. The unicorn smiled, its rainbow horn glowing with pride..."
                    </p>
                  </div>
                  
                  <div className="bg-background rounded-xl p-4 border border-border">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h5 className="text-sm font-medium">The Sharing Bears</h5>
                        <p className="text-xs text-muted-foreground">Joe • 3 days ago</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-1.5 rounded-md bg-muted/40 hover:bg-muted text-muted-foreground">
                          <span className="text-sm">📧</span>
                        </button>
                        <button className="p-1.5 rounded-md bg-muted/40 hover:bg-muted text-muted-foreground">
                          <span className="text-sm">💾</span>
                        </button>
                      </div>
                    </div>
                    <p className="text-xs bg-muted/30 p-3 rounded-lg">
                      "...Little Bear discovered that sharing his honey made him happier than eating it all himself. His friends gathered around, thankful for his kindness..."
                    </p>
                  </div>
                  
                  <button className="w-full flex items-center justify-center gap-2 rounded-lg border border-primary/20 bg-primary/5 p-2 text-primary hover:bg-primary/10 transition-colors text-sm sparkle-button">
                    View All Story Moments
                  </button>
                </div>
                
                {/* Audio Messages */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Recorded Parent Messages</h4>
                  
                  <div className="bg-background rounded-xl p-4 border border-border">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h5 className="text-sm font-medium">Goodnight Message</h5>
                        <p className="text-xs text-muted-foreground">For Mila</p>
                      </div>
                      <div>
                        <div className="relative inline-block">
                          <input type="checkbox" id="mila-audio-toggle" className="sr-only" defaultChecked />
                          <label
                            htmlFor="mila-audio-toggle"
                            className="block w-10 h-6 rounded-full bg-accent/30 cursor-pointer"
                          >
                            <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 transform translate-x-4"></span>
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-muted/30 rounded-lg p-3 flex items-center gap-3">
                      <button className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground sparkle-button">
                        <span className="text-xs">▶️</span>
                      </button>
                      <div className="h-2 bg-muted rounded-full flex-1">
                        <div className="h-full w-1/3 bg-primary rounded-full"></div>
                      </div>
                      <span className="text-xs text-muted-foreground">0:12</span>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-2">
                      "Hi Mila, I love you! Enjoy your story and sweet dreams! ❤️"
                    </p>
                  </div>
                  
                  <div className="bg-background rounded-xl p-4 border border-border">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h5 className="text-sm font-medium">Naptime Message</h5>
                        <p className="text-xs text-muted-foreground">For Joe</p>
                      </div>
                      <div>
                        <div className="relative inline-block">
                          <input type="checkbox" id="joe-audio-toggle" className="sr-only" defaultChecked />
                          <label
                            htmlFor="joe-audio-toggle"
                            className="block w-10 h-6 rounded-full bg-accent/30 cursor-pointer"
                          >
                            <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 transform translate-x-4"></span>
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-muted/30 rounded-lg p-3 flex items-center gap-3">
                      <button className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground sparkle-button">
                        <span className="text-xs">▶️</span>
                      </button>
                      <div className="h-2 bg-muted rounded-full flex-1">
                        <div className="h-full w-1/2 bg-primary rounded-full"></div>
                      </div>
                      <span className="text-xs text-muted-foreground">0:17</span>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-2">
                      "Hey Joe, it's time for a little rest. Mommy loves you so much! ❤️"
                    </p>
                  </div>
                  
                  <button className="w-full flex items-center justify-center gap-2 rounded-lg border border-dashed border-primary/50 p-2 text-primary hover:bg-primary/5 transition-colors text-sm sparkle-button">
                    <span className="text-lg">🎙️</span> Record New Message
                  </button>
                </div>
              </div>
            </section>
          </div>
        </main>
      </WhimsicalBackground>
    </div>
  );
} 