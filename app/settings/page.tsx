import Link from "next/link";
import Logo from "../components/Logo";

export default function Settings() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Logo size={40} />
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-sm text-primary hover:underline">
                Dashboard
              </Link>
              <Link href="/help" className="text-sm text-primary hover:underline">
                Help
              </Link>
              <button className="text-sm text-primary hover:underline">Sign Out</button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-2 mb-8">
          <Link 
            href="/dashboard" 
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Dashboard
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm">Settings</span>
        </div>

        <h2 className="text-3xl font-bold text-foreground mb-8">Account Settings</h2>

        <div className="space-y-8">
          {/* Account Settings Section */}
          <section className="bg-card rounded-2xl shadow-md p-6 border border-border">
            <h3 className="text-xl font-semibold mb-4">Account Information</h3>
            
            <form className="space-y-5">
              <div className="space-y-5">
                <div>
                  <label htmlFor="email" className="text-sm font-medium mb-1.5 block">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    defaultValue="parent@example.com"
                    className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <button className="rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium sparkle-button">
                  Update Email
                </button>
              </div>
              
              <div className="border-t border-border pt-5">
                <h4 className="font-medium mb-3">Change Password</h4>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="currentPassword" className="text-sm font-medium mb-1.5 block">
                      Current Password
                    </label>
                    <input
                      id="currentPassword"
                      type="password"
                      placeholder="••••••••"
                      className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="newPassword" className="text-sm font-medium mb-1.5 block">
                      New Password
                    </label>
                    <input
                      id="newPassword"
                      type="password"
                      placeholder="••••••••"
                      className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="text-sm font-medium mb-1.5 block">
                      Confirm New Password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <button className="rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium sparkle-button">
                    Update Password
                  </button>
                </div>
              </div>
            </form>
          </section>

          {/* Notifications Section */}
          <section className="bg-card rounded-2xl shadow-md p-6 border border-border">
            <h3 className="text-xl font-semibold mb-4">Notification Preferences</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-muted-foreground">Receive updates and weekly insights</p>
                </div>
                <div className="relative">
                  <input type="checkbox" id="email-notify" className="sr-only" defaultChecked />
                  <label
                    htmlFor="email-notify"
                    className="block w-10 h-6 rounded-full bg-accent/30 cursor-pointer"
                  >
                    <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 transform translate-x-4"></span>
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Push Notifications</h4>
                  <p className="text-sm text-muted-foreground">Get alerts when your child completes a story</p>
                </div>
                <div className="relative">
                  <input type="checkbox" id="push-notify" className="sr-only" defaultChecked />
                  <label
                    htmlFor="push-notify"
                    className="block w-10 h-6 rounded-full bg-accent/30 cursor-pointer"
                  >
                    <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 transform translate-x-4"></span>
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Achievement Notifications</h4>
                  <p className="text-sm text-muted-foreground">Celebrate when your child reaches milestones</p>
                </div>
                <div className="relative">
                  <input type="checkbox" id="achievement-notify" className="sr-only" defaultChecked />
                  <label
                    htmlFor="achievement-notify"
                    className="block w-10 h-6 rounded-full bg-accent/30 cursor-pointer"
                  >
                    <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 transform translate-x-4"></span>
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Marketing Communications</h4>
                  <p className="text-sm text-muted-foreground">Special offers and product updates</p>
                </div>
                <div className="relative">
                  <input type="checkbox" id="marketing-notify" className="sr-only" />
                  <label
                    htmlFor="marketing-notify"
                    className="block w-10 h-6 rounded-full bg-accent/30 cursor-pointer"
                  >
                    <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 transform translate-x-0"></span>
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* Display Settings Section */}
          <section className="bg-card rounded-2xl shadow-md p-6 border border-border">
            <h3 className="text-xl font-semibold mb-4">Display Settings</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Dark Mode</h4>
                  <p className="text-sm text-muted-foreground">Use a darker theme that's easier on the eyes</p>
                </div>
                <div className="relative">
                  <input type="checkbox" id="dark-mode" className="sr-only" />
                  <label
                    htmlFor="dark-mode"
                    className="block w-10 h-6 rounded-full bg-accent/30 cursor-pointer"
                  >
                    <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 transform translate-x-0"></span>
                  </label>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Language</h4>
                <select 
                  className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  defaultValue="en"
                >
                  <option value="en">English</option>
                  <option value="es">Español (Spanish)</option>
                  <option value="fr">Français (French)</option>
                  <option value="de">Deutsch (German)</option>
                  <option value="zh">中文 (Chinese)</option>
                  <option value="ja">日本語 (Japanese)</option>
                  <option value="ko">한국어 (Korean)</option>
                </select>
                <p className="text-xs text-muted-foreground mt-2">
                  Changing language will apply to the interface and available stories
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Text Size</h4>
                <div className="flex items-center gap-3">
                  <span className="text-xs">A</span>
                  <input 
                    type="range" 
                    min="1" 
                    max="5" 
                    step="1" 
                    defaultValue="3"
                    className="flex-1 accent-primary" 
                  />
                  <span className="text-lg">A</span>
                </div>
              </div>
            </div>
          </section>
          
          <div className="flex justify-end gap-3">
            <Link 
              href="/dashboard" 
              className="rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium"
            >
              Cancel
            </Link>
            <button className="rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium sparkle-button">
              Save All Settings
            </button>
          </div>
        </div>
      </main>
    </div>
  );
} 