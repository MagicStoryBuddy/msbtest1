import Image from "next/image";
import Link from "next/link";
import Logo from "./components/Logo";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Logo size={48} className="text-2xl" />
            <nav className="flex items-center gap-6">
              <Link href="/" className="text-sm font-medium text-primary hover:text-primary/80">
                Home
              </Link>
              <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary">
                Dashboard
              </Link>
              <Link href="/stories" className="text-sm font-medium text-muted-foreground hover:text-primary">
                Stories & Settings
              </Link>
              <Link href="/insights" className="text-sm font-medium text-muted-foreground hover:text-primary">
                Insights
              </Link>
              <Link href="/help" className="text-sm font-medium text-muted-foreground hover:text-primary">
                Help
              </Link>
              <Link href="/account" className="text-sm font-medium text-muted-foreground hover:text-primary">
                Account
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="grid grid-rows-[1fr_20px] items-center justify-items-center min-h-[calc(100vh-73px)] p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-[32px] row-start-1 items-center max-w-6xl w-full">
          <div className="flex flex-col md:flex-row w-full gap-8 items-center">
            <div className="flex flex-col gap-6 md:w-1/2">
              <div className="relative">
                {/* Animated stars and clouds around title */}
                <div className="star text-yellow-300 text-xl" style={{ top: '-15px', left: '10%', animationDelay: '0.5s' }}>✨</div>
                <div className="star text-yellow-300 text-xl" style={{ top: '-5px', right: '20%', animationDelay: '1.2s' }}>⭐</div>
                <div className="star text-yellow-300 text-xl" style={{ bottom: '0px', right: '10%', animationDelay: '0.8s' }}>✨</div>
                <div className="cloud text-blue-100 text-2xl" style={{ top: '-20px', left: '30%', animationDelay: '1.5s' }}>☁️</div>
                <div className="cloud text-blue-100 text-2xl" style={{ bottom: '-5px', left: '5%', animationDelay: '2s' }}>☁️</div>
                
                <div className="floating-element text-chart-3 text-lg" style={{ top: '5px', right: '5%', animationDelay: '0.3s' }}>🌟</div>
                <div className="floating-element text-chart-2 text-lg" style={{ bottom: '10px', left: '35%', animationDelay: '1.7s' }}>✨</div>
                
                <div className="flex items-center gap-4">
                  <Image 
                    src="/logo.svg"
                    alt="Magic Story Buddy Logo"
                    width={80}
                    height={80}
                    priority
                    className="floating-element"
                    style={{ animationDelay: '1s' }}
                  />
                  <h1 className="text-4xl md:text-5xl font-bold text-primary text-center md:text-left relative z-10">
                    Magic Story Buddy
                  </h1>
                </div>
              </div>
              
              <p className="text-2xl md:text-3xl text-center md:text-left text-secondary-foreground font-[family-name:var(--font-rounded)] tracking-wide leading-relaxed">
                The Last Bedtime Book You'll Ever Need.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 my-4">
                <a href="/auth/signin" className="sparkle-button rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-primary text-primary-foreground gap-2 hover:opacity-90 font-medium text-lg h-12 px-6">
                  Sign In
                </a>
                <a href="/auth/signup" className="sparkle-button rounded-full border border-solid border-secondary transition-colors flex items-center justify-center bg-secondary text-secondary-foreground gap-2 hover:opacity-90 font-medium text-lg h-12 px-6">
                  Sign Up
                </a>
              </div>
              
              <div className="mt-2 w-full">
                <a href="/dashboard" className="sparkle-button w-full rounded-full border-2 border-dashed border-chart-5 transition-colors flex items-center justify-center bg-chart-5/10 text-chart-5 gap-2 hover:bg-chart-5/20 font-bold text-lg h-12 px-6">
                  👉 Demo Dashboard 👈
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 bg-muted/50 p-6 rounded-2xl">
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                  <span className="text-2xl mb-2">💖</span>
                  <h3 className="font-semibold">Empowers values</h3>
                </div>
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                  <span className="text-2xl mb-2">⏱️</span>
                  <h3 className="font-semibold">Limits screen time</h3>
                </div>
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                  <span className="text-2xl mb-2">🧠</span>
                  <h3 className="font-semibold">Supports emotional learning</h3>
                </div>
              </div>
            </div>

            <div className="md:w-1/2 relative">
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-chart-2 rounded-full opacity-20 transform translate-x-4 translate-y-4"></div>
                <div className="relative bg-chart-1/20 border-4 border-chart-1/30 rounded-3xl h-full w-full overflow-hidden flex items-center justify-center">
                  <div className="text-8xl">📚👧👦🧸</div>
                  <div className="absolute bottom-4 text-center text-lg font-medium text-primary">
                    Pastel illustration placeholder
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 items-center justify-center flex-wrap">
            <div className="rounded-full h-16 w-16 bg-chart-1 flex items-center justify-center text-2xl">🦄</div>
            <div className="rounded-full h-16 w-16 bg-chart-2 flex items-center justify-center text-2xl">🌟</div>
            <div className="rounded-full h-16 w-16 bg-chart-3 flex items-center justify-center text-2xl">🦋</div>
            <div className="rounded-full h-16 w-16 bg-chart-4 flex items-center justify-center text-2xl">🌈</div>
            <div className="rounded-full h-16 w-16 bg-chart-5 flex items-center justify-center text-2xl">🐶</div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
            <a href="/download" className="sparkle-button rounded-full border border-solid border-black/10 transition-colors flex items-center justify-center bg-secondary text-secondary-foreground gap-1 hover:opacity-90 font-medium text-sm h-10 px-4">
              <span className="text-lg mr-1">🍎</span> App Store
            </a>
            <a href="/download" className="sparkle-button rounded-full border border-solid border-black/10 transition-colors flex items-center justify-center bg-accent text-accent-foreground gap-1 hover:opacity-90 font-medium text-sm h-10 px-4">
              <span className="text-lg mr-1">🤖</span> Google Play
            </a>
          </div>
        </main>
        <footer className="row-start-2 flex gap-[24px] flex-wrap items-center justify-center text-muted-foreground">
          Made with ❤️ for kids • <a href="/help" className="hover:underline hover:text-primary">Help & About</a>
        </footer>
      </div>
    </div>
  );
}
