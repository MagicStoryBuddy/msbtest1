import Link from "next/link";
import Image from "next/image";

export default function Help() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-primary hover:opacity-90">
              Magic Story Buddy
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-sm text-primary hover:underline">
                Dashboard
              </Link>
              <Link href="/settings" className="text-sm text-primary hover:underline">
                Settings
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8 text-center">Help & About</h1>

        {/* Tabs for different sections */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <a href="#faq" className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">
            FAQ
          </a>
          <a href="#contact" className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">
            Contact Us
          </a>
          <a href="#privacy" className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">
            Privacy Policy
          </a>
          <a href="#credits" className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">
            Our Team
          </a>
        </div>

        {/* FAQ Section */}
        <section id="faq" className="bg-card rounded-2xl shadow-md p-6 border border-border mb-8">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <span className="bg-primary/10 text-primary h-8 w-8 rounded-full flex items-center justify-center">?</span>
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div className="border-b border-border pb-5">
              <h3 className="text-lg font-medium mb-2">How does Magic Story Buddy choose stories?</h3>
              <p className="text-muted-foreground">
                Magic Story Buddy uses the OpenAI API to randomly generate unique stories, ensuring no two stories are ever the same. Free users can choose between 2-3 hero characters (robot, dragon, princess), 2-3 settings (castle, forest), and 2-3 adventures (find treasure, help a friend). Our AI technology crafts personalized narratives based on these choices while incorporating the life skills themes you've selected in the dashboard.
              </p>
            </div>
            
            <div className="border-b border-border pb-5">
              <h3 className="text-lg font-medium mb-2">What age range is Magic Story Buddy designed for?</h3>
              <p className="text-muted-foreground">
                Magic Story Buddy is specifically designed for children aged 3-5 years old. Our approach aligns with Montessori educational methods, such as incorporating tracing letters and numbers for 4-year-olds and nurturing imagination in 3-year-olds after their sense of reality has been established. The content grows with your child through these crucial developmental years.
              </p>
            </div>
            
            <div className="border-b border-border pb-5">
              <h3 className="text-lg font-medium mb-2">How often are new stories added?</h3>
              <p className="text-muted-foreground">
                We add new stories every week, ensuring there's always fresh content for your child. Each month focuses on different seasonal themes and life skills, giving your child a well-rounded storytelling experience throughout the year.
              </p>
            </div>
            
            <div className="border-b border-border pb-5">
              <h3 className="text-lg font-medium mb-2">Can I download stories for offline listening?</h3>
              <p className="text-muted-foreground">
                Yes! Premium subscribers can download up to 20 stories at a time for offline listening. This is perfect for road trips, flights, or any time you might not have internet access. Downloads refresh each month.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Is screen time limited within the app?</h3>
              <p className="text-muted-foreground">
                Absolutely. We've designed Magic Story Buddy with limited screen time in mind. Parents can set daily and weekly limits in the dashboard, and our bedtime mode gradually dims the screen and transitions to audio-only to promote healthy sleep habits.
              </p>
            </div>
          </div>
        </section>
        
        {/* Contact Form Section */}
        <section id="contact" className="bg-card rounded-2xl shadow-md p-6 border border-border mb-8">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <span className="bg-primary/10 text-primary h-8 w-8 rounded-full flex items-center justify-center">✉️</span>
            Contact Us
          </h2>
          
          <p className="mb-6 text-muted-foreground">
            Have questions, suggestions, or just want to share how Magic Story Buddy has helped your family? We'd love to hear from you!
          </p>
          
          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-1">
                Subject
              </label>
              <select
                id="subject"
                className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
                defaultValue=""
              >
                <option value="" disabled>Select a topic</option>
                <option value="support">Technical Support</option>
                <option value="feedback">Feedback & Suggestions</option>
                <option value="stories">Story Requests</option>
                <option value="partnership">Partnership Opportunities</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">
                Your Message
              </label>
              <textarea
                id="message"
                rows={5}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="How can we help you?"
                required
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90"
            >
              Send Message
            </button>
          </form>
        </section>
        
        {/* Privacy Policy Section */}
        <section id="privacy" className="bg-card rounded-2xl shadow-md p-6 border border-border mb-8">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <span className="bg-primary/10 text-primary h-8 w-8 rounded-full flex items-center justify-center">🔒</span>
            Privacy Policy
          </h2>
          
          <div className="prose prose-sm max-w-none text-muted-foreground">
            <p className="font-medium text-foreground">Last Updated: May 2023</p>
            
            <h3 className="text-lg font-medium mt-6 mb-2">1. Introduction</h3>
            <p>
              At Magic Story Buddy, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and website.
            </p>
            
            <h3 className="text-lg font-medium mt-6 mb-2">2. Information We Collect</h3>
            <p>
              <strong>Children's Information:</strong> We collect minimal information about children, limited to first name, age, and story preferences. We never collect location, contact details, or full identifiers from children under 13.
            </p>
            <p>
              <strong>Parent Information:</strong> We collect email addresses, account credentials, and optional profile information from parents or guardians.
            </p>
            
            <h3 className="text-lg font-medium mt-6 mb-2">3. How We Use Your Information</h3>
            <p>
              We use the collected information to provide and improve our service, personalize story recommendations, track usage for screen time limits, and communicate updates to parents.
            </p>
            
            <h3 className="text-lg font-medium mt-6 mb-2">4. Data Security</h3>
            <p>
              We implement industry-standard security measures to protect your personal information. Data is encrypted both in transit and at rest.
            </p>
            
            <h3 className="text-lg font-medium mt-6 mb-2">5. Your Rights</h3>
            <p>
              Parents have the right to review, edit, or delete their children's information at any time through the dashboard settings.
            </p>
            
            <p className="mt-6">
              <Link href="#" className="text-primary hover:underline">Read our full Privacy Policy</Link>
            </p>
          </div>
        </section>
        
        {/* Credits Section */}
        <section id="credits" className="bg-card rounded-2xl shadow-md p-6 border border-border">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <span className="bg-primary/10 text-primary h-8 w-8 rounded-full flex items-center justify-center">💫</span>
            Our Storytellers & Team
          </h2>
          
          <p className="mb-8 text-muted-foreground">
            Magic Story Buddy comes to life through the talent and dedication of our diverse team of writers, illustrators, educators, and developers.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="col-span-1 sm:col-span-2 md:col-span-3 bg-background rounded-xl p-6 border-2 border-primary/30 text-center shadow-md">
              <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-primary/20 flex items-center justify-center">
                <span className="text-4xl">✨</span>
              </div>
              <h3 className="text-xl font-bold text-primary">Thomas Clinard</h3>
              <p className="text-md text-primary mb-2">Founder & Chief Imagination Officer</p>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                The visionary mastermind behind Magic Story Buddy, Thomas combined his passion for childhood education with cutting-edge AI technology to create a platform that revolutionizes bedtime stories. His belief that every child deserves personalized stories that nurture both imagination and values drives the company's mission.
              </p>
            </div>
            
            <div className="bg-background rounded-xl p-4 border border-border text-center">
              <div className="w-20 h-20 rounded-full mx-auto mb-3 bg-chart-1/20 flex items-center justify-center">
                <span className="text-3xl">👩‍🎨</span>
              </div>
              <h3 className="font-medium">Emma Rodriguez</h3>
              <p className="text-sm text-primary mb-2">Lead Illustrator</p>
              <p className="text-xs text-muted-foreground">
                Emma brings 15 years of children's book illustration experience, creating the magical visual world of our stories.
              </p>
            </div>
            
            <div className="bg-background rounded-xl p-4 border border-border text-center">
              <div className="w-20 h-20 rounded-full mx-auto mb-3 bg-chart-2/20 flex items-center justify-center">
                <span className="text-3xl">🎤</span>
              </div>
              <h3 className="font-medium">Ayano Clinard</h3>
              <p className="text-sm text-primary mb-2">Voice Director & Creative Partner</p>
              <p className="text-xs text-muted-foreground">
                Thomas's wife and essential creative partner who brings stories to life with her exceptional voice narration and cultural expertise. Her Japanese heritage adds authentic multicultural elements to our stories.
              </p>
            </div>
            
            <div className="bg-background rounded-xl p-4 border border-border text-center">
              <div className="w-20 h-20 rounded-full mx-auto mb-3 bg-chart-3/20 flex items-center justify-center">
                <span className="text-3xl">👩‍🏫</span>
              </div>
              <h3 className="font-medium">Dr. Sarah Johnson</h3>
              <p className="text-sm text-primary mb-2">Child Development Advisor</p>
              <p className="text-xs text-muted-foreground">
                Child psychologist with expertise in early childhood education who ensures our content supports healthy development.
              </p>
            </div>
            
            <div className="bg-background rounded-xl p-4 border border-border text-center">
              <div className="w-20 h-20 rounded-full mx-auto mb-3 bg-chart-4/20 flex items-center justify-center">
                <span className="text-3xl">🧙‍♂️</span>
              </div>
              <h3 className="font-medium">Michael Okonjo</h3>
              <p className="text-sm text-primary mb-2">Fantasy Writer</p>
              <p className="text-xs text-muted-foreground">
                Award-winning children's author who creates our most imaginative adventure stories and magical worlds.
              </p>
            </div>
            
            <div className="bg-background rounded-xl p-4 border border-border text-center">
              <div className="w-20 h-20 rounded-full mx-auto mb-3 bg-chart-5/20 flex items-center justify-center">
                <span className="text-3xl">🎭</span>
              </div>
              <h3 className="font-medium">Aisha Patel</h3>
              <p className="text-sm text-primary mb-2">Voice Artist</p>
              <p className="text-xs text-muted-foreground">
                Professional voice actor who brings our characters to life with over 50 distinct character voices.
              </p>
            </div>
            
            <div className="bg-background rounded-xl p-4 border border-border text-center">
              <div className="w-20 h-20 rounded-full mx-auto mb-3 bg-accent/20 flex items-center justify-center">
                <span className="text-3xl">🌟</span>
              </div>
              <h3 className="font-medium">Join Our Team</h3>
              <p className="text-sm text-primary mb-2">We're Hiring!</p>
              <p className="text-xs text-muted-foreground">
                We're always looking for talented storytellers, illustrators, and developers to join our mission.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
} 