import Link from "next/link";
import Image from "next/image";
import Logo from "../components/Logo";

export default function Download() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Logo size={40} />
            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm text-primary hover:underline">
                Home
              </Link>
              <Link href="/help" className="text-sm text-primary hover:underline">
                Help
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-chart-3/20 to-background py-16 md:py-24">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-chart-1/20"></div>
            <div className="absolute top-40 right-10 w-60 h-60 rounded-full bg-chart-2/20"></div>
            <div className="absolute bottom-10 left-1/4 w-80 h-80 rounded-full bg-chart-4/10"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center items-center gap-4 mb-6">
              <Image 
                src="/logo.svg"
                alt="Magic Story Buddy Logo"
                width={100}
                height={100}
                priority
                className="floating-element"
                style={{ animationDelay: '1s' }}
              />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
                Magic Story Buddy
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              The Last Bedtime Book You'll Ever Need
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a 
                href="#" 
                className="sparkle-button flex items-center justify-center gap-3 px-8 py-4 bg-black text-white rounded-xl hover:bg-black/90 transition-colors"
              >
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M17.1643 12.5913C17.1643 10.3158 18.9583 8.67203 19.0611 8.58432C17.9154 6.84506 16.1214 6.6343 15.4891 6.61746C13.9731 6.46054 12.5081 7.52368 11.7352 7.52368C10.9445 7.52368 9.74498 6.6343 8.48608 6.65954C6.847 6.68477 5.3311 7.5912 4.47682 9.03835C2.70029 11.9841 4.01857 16.3648 5.71701 18.5987C6.57129 19.6871 7.57996 20.9082 8.88349 20.8577C10.1425 20.8072 10.6166 20.0434 12.1159 20.0434C13.6152 20.0434 14.0549 20.8577 15.376 20.8325C16.7292 20.8072 17.6006 19.7272 18.4205 18.6303C19.3935 17.3667 19.7821 16.1289 19.8 16.08C19.764 16.0632 17.1714 15.0339 17.1643 12.5913Z"/>
                  <path d="M14.0717 4.90046C14.7728 4.04618 15.2471 2.85726 15.1034 1.64258C14.0885 1.68465 12.8249 2.31154 12.0932 3.14898C11.4431 3.88774 10.87 5.1192 11.0318 6.2828C12.1774 6.36358 13.3411 5.73669 14.0717 4.90046Z"/>
                </svg>
                <div>
                  <div className="text-xs">Download on the</div>
                  <div className="text-xl font-semibold">App Store</div>
                </div>
              </a>
              
              <a 
                href="#" 
                className="sparkle-button flex items-center justify-center gap-3 px-8 py-4 bg-black text-white rounded-xl hover:bg-black/90 transition-colors"
              >
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M17.5531 8.02553C14.5617 6.56956 12.2962 4.35086 11.2258 2.52777L11.2224 2.52078C11.1719 2.43455 11.1 2.36224 11.0138 2.31233C10.9275 2.26242 10.8295 2.23643 10.7296 2.23711C10.6298 2.23778 10.5322 2.26509 10.4467 2.31618C10.3611 2.36727 10.2903 2.4405 10.2412 2.52744L10.2351 2.53833C9.17133 4.35311 6.91672 6.56328 3.92094 8.02586C3.81436 8.07308 3.72357 8.1522 3.66129 8.25317C3.59901 8.35414 3.56813 8.47232 3.57301 8.59159L3.57367 8.59925V8.61014V15.3438C3.57367 18.9931 6.69469 21.9996 11.1954 21.9996H12.2786C16.7802 21.9996 19.9015 18.9931 19.9015 15.3438V8.61014C19.9015 8.52156 19.8835 8.43385 19.8484 8.35273C19.8134 8.27161 19.7622 8.19908 19.6981 8.14015C19.634 8.08122 19.5585 8.03723 19.4763 8.01118C19.394 7.98513 19.3068 7.97769 19.2213 7.98942H19.2147C18.6553 8.09783 18.0996 8.0978 17.5531 8.02553ZM13.547 17.7154C13.547 17.804 13.5299 17.8916 13.4968 17.9728C13.4638 18.0539 13.4156 18.1267 13.3553 18.1863C13.295 18.2459 13.2239 18.2911 13.1465 18.3187C13.0691 18.3464 12.9869 18.3559 12.9055 18.3467H9.57021C9.34015 18.3467 9.11953 18.2535 8.95776 18.0881C8.79599 17.9227 8.70533 17.6979 8.70533 17.4636C8.70533 17.2292 8.79599 17.0045 8.95776 16.8391C9.11953 16.6736 9.34015 16.5805 9.57021 16.5805H12.9028H12.9055C12.9869 16.5712 13.0691 16.5807 13.1465 16.6084C13.2239 16.636 13.295 16.6811 13.3553 16.7407C13.4156 16.8003 13.4638 16.8731 13.4968 16.9543C13.5299 17.0354 13.547 17.123 13.547 17.2116V17.7154ZM15.5932 13.7396C15.5932 13.828 15.5761 13.9153 15.5431 13.9962C15.5102 14.0771 15.4621 14.1496 15.402 14.209C15.3418 14.2684 15.2709 14.3135 15.1938 14.3411C15.1166 14.3687 15.0347 14.3783 14.9535 14.3693H7.53039C7.30033 14.3693 7.07971 14.2762 6.91794 14.1107C6.75618 13.9453 6.66552 13.7205 6.66552 13.4862C6.66552 13.2518 6.75618 13.0271 6.91794 12.8617C7.07971 12.6962 7.30033 12.6031 7.53039 12.6031H14.9535C15.0347 12.5941 15.1166 12.6037 15.1938 12.6313C15.2709 12.6589 15.3418 12.704 15.402 12.7634C15.4621 12.8228 15.5102 12.8953 15.5431 12.9762C15.5761 13.0571 15.5932 13.1444 15.5932 13.2328V13.7396Z"/>
                </svg>
                <div>
                  <div className="text-xs">GET IT ON</div>
                  <div className="text-xl font-semibold">Google Play</div>
                </div>
              </a>
            </div>
            
            <div className="relative max-w-3xl mx-auto">
              <div className="absolute inset-0 -z-10 bg-chart-1/10 rounded-3xl transform rotate-2"></div>
              <div className="bg-background border-4 border-chart-1/20 rounded-2xl overflow-hidden shadow-xl">
                <div className="aspect-video w-full flex items-center justify-center bg-gradient-to-r from-chart-1/10 to-chart-2/10">
                  <div className="text-center p-6">
                    <span className="text-6xl mb-4 inline-block">🎬</span>
                    <p className="text-lg text-muted-foreground">Demo video placeholder</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Screenshots Section */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="bg-chart-2/10 px-6 py-2 rounded-full">Story Moments</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Screenshot 1 */}
            <div className="bg-card rounded-2xl overflow-hidden shadow-md border border-border transition-transform hover:scale-[1.02]">
              <div className="aspect-[9/16] relative bg-gradient-to-b from-chart-1/20 to-transparent p-6 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl mb-4">🦄</div>
                  <div className="text-xl font-medium mb-2">Unicorn Adventure</div>
                  <p className="text-sm text-muted-foreground">
                    Meet Sparkle the unicorn and embark on a magical journey through Rainbow Forest
                  </p>
                </div>
              </div>
              <div className="p-4 bg-card">
                <p className="text-xs text-muted-foreground">Screenshot: Story selection screen</p>
              </div>
            </div>
            
            {/* Screenshot 2 */}
            <div className="bg-card rounded-2xl overflow-hidden shadow-md border border-border transition-transform hover:scale-[1.02]">
              <div className="aspect-[9/16] relative bg-gradient-to-b from-chart-3/20 to-transparent p-6 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl mb-4">🤖</div>
                  <div className="text-xl font-medium mb-2">Robot Friends</div>
                  <p className="text-sm text-muted-foreground">
                    Join Beep the robot as he learns about friendship and helping others
                  </p>
                </div>
              </div>
              <div className="p-4 bg-card">
                <p className="text-xs text-muted-foreground">Screenshot: Interactive story page</p>
              </div>
            </div>
            
            {/* Screenshot 3 */}
            <div className="bg-card rounded-2xl overflow-hidden shadow-md border border-border transition-transform hover:scale-[1.02]">
              <div className="aspect-[9/16] relative bg-gradient-to-b from-chart-5/20 to-transparent p-6 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl mb-4">🐉</div>
                  <div className="text-xl font-medium mb-2">Dragon Tales</div>
                  <p className="text-sm text-muted-foreground">
                    Discover how Drake the dragon overcomes his fears and finds hidden treasure
                  </p>
                </div>
              </div>
              <div className="p-4 bg-card">
                <p className="text-xs text-muted-foreground">Screenshot: Story ending with moral</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-gradient-to-b from-background to-chart-2/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              <span className="bg-chart-3/10 px-6 py-2 rounded-full">Key Features</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-background rounded-xl p-6 text-center shadow-md border border-border">
                <div className="text-3xl mb-4">✨</div>
                <h3 className="text-lg font-medium mb-2">Unique Stories Every Time</h3>
                <p className="text-sm text-muted-foreground">
                  AI-generated stories ensure your child never hears the same tale twice
                </p>
              </div>
              
              <div className="bg-background rounded-xl p-6 text-center shadow-md border border-border">
                <div className="text-3xl mb-4">🧠</div>
                <h3 className="text-lg font-medium mb-2">Educational Content</h3>
                <p className="text-sm text-muted-foreground">
                  Aligns with Montessori methods for age-appropriate learning
                </p>
              </div>
              
              <div className="bg-background rounded-xl p-6 text-center shadow-md border border-border">
                <div className="text-3xl mb-4">⏱️</div>
                <h3 className="text-lg font-medium mb-2">Screen Time Management</h3>
                <p className="text-sm text-muted-foreground">
                  Parent controls to limit digital engagement and create healthy habits
                </p>
              </div>
              
              <div className="bg-background rounded-xl p-6 text-center shadow-md border border-border">
                <div className="text-3xl mb-4">💖</div>
                <h3 className="text-lg font-medium mb-2">Values Development</h3>
                <p className="text-sm text-muted-foreground">
                  Stories that nurture kindness, bravery, patience and other essential life skills
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16">
            <span className="bg-chart-4/10 px-6 py-2 rounded-full">What Parents Say</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card rounded-xl p-6 shadow-md border border-border relative">
              <div className="absolute -top-8 left-8 w-16 h-16 rounded-full bg-chart-1/20 flex items-center justify-center text-2xl">
                👩‍👧
              </div>
              <div className="mt-6">
                <p className="italic text-muted-foreground mb-4">
                  "Magic Story Buddy has been a game-changer for our bedtime routine. My daughter looks forward to her personalized stories every night, and I love how they teach important values in such an engaging way."
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Sarah M.</p>
                    <p className="text-sm text-muted-foreground">Mother of a 4-year-old</p>
                  </div>
                  <div className="text-primary text-xl">★★★★★</div>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-xl p-6 shadow-md border border-border relative">
              <div className="absolute -top-8 left-8 w-16 h-16 rounded-full bg-chart-3/20 flex items-center justify-center text-2xl">
                👨‍👦
              </div>
              <div className="mt-6">
                <p className="italic text-muted-foreground mb-4">
                  "As a busy parent, finding quality content that both entertains and educates is challenging. Magic Story Buddy delivers on both fronts! My son is learning about emotions while having fun with characters he loves."
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Michael T.</p>
                    <p className="text-sm text-muted-foreground">Father of a 3-year-old</p>
                  </div>
                  <div className="text-primary text-xl">★★★★★</div>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-xl p-6 shadow-md border border-border relative">
              <div className="absolute -top-8 left-8 w-16 h-16 rounded-full bg-chart-2/20 flex items-center justify-center text-2xl">
                👵
              </div>
              <div className="mt-6">
                <p className="italic text-muted-foreground mb-4">
                  "I got this for my grandchildren and they absolutely love it! When they visit, they always ask for story time with Magic Story Buddy. The way it helps with letter tracing is particularly impressive."
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Patricia J.</p>
                    <p className="text-sm text-muted-foreground">Grandmother of two</p>
                  </div>
                  <div className="text-primary text-xl">★★★★★</div>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-xl p-6 shadow-md border border-border relative">
              <div className="absolute -top-8 left-8 w-16 h-16 rounded-full bg-chart-5/20 flex items-center justify-center text-2xl">
                👩‍🏫
              </div>
              <div className="mt-6">
                <p className="italic text-muted-foreground mb-4">
                  "As a preschool teacher, I recommend Magic Story Buddy to all parents. The Montessori alignment is spot-on, and I've seen how these stories boost language development and imagination in my classroom."
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Lisa W.</p>
                    <p className="text-sm text-muted-foreground">Early Childhood Educator</p>
                  </div>
                  <div className="text-primary text-xl">★★★★★</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Download CTA Section */}
        <section className="py-16 bg-gradient-to-t from-background to-chart-1/10">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Start Your Story Journey Today</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Download Magic Story Buddy and transform bedtime into a magical, educational adventure your child will love.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#" 
                className="sparkle-button flex items-center justify-center gap-3 px-8 py-4 bg-black text-white rounded-xl hover:bg-black/90 transition-colors"
              >
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M17.1643 12.5913C17.1643 10.3158 18.9583 8.67203 19.0611 8.58432C17.9154 6.84506 16.1214 6.6343 15.4891 6.61746C13.9731 6.46054 12.5081 7.52368 11.7352 7.52368C10.9445 7.52368 9.74498 6.6343 8.48608 6.65954C6.847 6.68477 5.3311 7.5912 4.47682 9.03835C2.70029 11.9841 4.01857 16.3648 5.71701 18.5987C6.57129 19.6871 7.57996 20.9082 8.88349 20.8577C10.1425 20.8072 10.6166 20.0434 12.1159 20.0434C13.6152 20.0434 14.0549 20.8577 15.376 20.8325C16.7292 20.8072 17.6006 19.7272 18.4205 18.6303C19.3935 17.3667 19.7821 16.1289 19.8 16.08C19.764 16.0632 17.1714 15.0339 17.1643 12.5913Z"/>
                  <path d="M14.0717 4.90046C14.7728 4.04618 15.2471 2.85726 15.1034 1.64258C14.0885 1.68465 12.8249 2.31154 12.0932 3.14898C11.4431 3.88774 10.87 5.1192 11.0318 6.2828C12.1774 6.36358 13.3411 5.73669 14.0717 4.90046Z"/>
                </svg>
                <div>
                  <div className="text-xs">Download on the</div>
                  <div className="text-xl font-semibold">App Store</div>
                </div>
              </a>
              
              <a 
                href="#" 
                className="sparkle-button flex items-center justify-center gap-3 px-8 py-4 bg-black text-white rounded-xl hover:bg-black/90 transition-colors"
              >
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M17.5531 8.02553C14.5617 6.56956 12.2962 4.35086 11.2258 2.52777L11.2224 2.52078C11.1719 2.43455 11.1 2.36224 11.0138 2.31233C10.9275 2.26242 10.8295 2.23643 10.7296 2.23711C10.6298 2.23778 10.5322 2.26509 10.4467 2.31618C10.3611 2.36727 10.2903 2.4405 10.2412 2.52744L10.2351 2.53833C9.17133 4.35311 6.91672 6.56328 3.92094 8.02586C3.81436 8.07308 3.72357 8.1522 3.66129 8.25317C3.59901 8.35414 3.56813 8.47232 3.57301 8.59159L3.57367 8.59925V8.61014V15.3438C3.57367 18.9931 6.69469 21.9996 11.1954 21.9996H12.2786C16.7802 21.9996 19.9015 18.9931 19.9015 15.3438V8.61014C19.9015 8.52156 19.8835 8.43385 19.8484 8.35273C19.8134 8.27161 19.7622 8.19908 19.6981 8.14015C19.634 8.08122 19.5585 8.03723 19.4763 8.01118C19.394 7.98513 19.3068 7.97769 19.2213 7.98942H19.2147C18.6553 8.09783 18.0996 8.0978 17.5531 8.02553ZM13.547 17.7154C13.547 17.804 13.5299 17.8916 13.4968 17.9728C13.4638 18.0539 13.4156 18.1267 13.3553 18.1863C13.295 18.2459 13.2239 18.2911 13.1465 18.3187C13.0691 18.3464 12.9869 18.3559 12.9055 18.3467H9.57021C9.34015 18.3467 9.11953 18.2535 8.95776 18.0881C8.79599 17.9227 8.70533 17.6979 8.70533 17.4636C8.70533 17.2292 8.79599 17.0045 8.95776 16.8391C9.11953 16.6736 9.34015 16.5805 9.57021 16.5805H12.9028H12.9055C12.9869 16.5712 13.0691 16.5807 13.1465 16.6084C13.2239 16.636 13.295 16.6811 13.3553 16.7407C13.4156 16.8003 13.4638 16.8731 13.4968 16.9543C13.5299 17.0354 13.547 17.123 13.547 17.2116V17.7154ZM15.5932 13.7396C15.5932 13.828 15.5761 13.9153 15.5431 13.9962C15.5102 14.0771 15.4621 14.1496 15.402 14.209C15.3418 14.2684 15.2709 14.3135 15.1938 14.3411C15.1166 14.3687 15.0347 14.3783 14.9535 14.3693H7.53039C7.30033 14.3693 7.07971 14.2762 6.91794 14.1107C6.75618 13.9453 6.66552 13.7205 6.66552 13.4862C6.66552 13.2518 6.75618 13.0271 6.91794 12.8617C7.07971 12.6962 7.30033 12.6031 7.53039 12.6031H14.9535C15.0347 12.5941 15.1166 12.6037 15.1938 12.6313C15.2709 12.6589 15.3418 12.704 15.402 12.7634C15.4621 12.8228 15.5102 12.8953 15.5431 12.9762C15.5761 13.0571 15.5932 13.1444 15.5932 13.2328V13.7396Z"/>
                </svg>
                <div>
                  <div className="text-xs">GET IT ON</div>
                  <div className="text-xl font-semibold">Google Play</div>
                </div>
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-card py-8 text-center text-sm text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p>Made with ❤️ for kids • <Link href="/help" className="hover:underline hover:text-primary">Help & About</Link></p>
          <p className="mt-2">© 2023 Magic Story Buddy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 