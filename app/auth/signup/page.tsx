import Link from "next/link";

export default function SignUp() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full bg-card rounded-2xl shadow-lg p-8">
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <Link href="/" className="inline-block">
              <h1 className="text-3xl font-bold text-primary mb-2 hover:opacity-90">Magic Story Buddy</h1>
            </Link>
            <h2 className="text-2xl font-semibold mb-2">Sign Up</h2>
            <p className="text-muted-foreground">Create your Magic Story Buddy account</p>
          </div>

          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="parent@example.com"
                className="h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="parentName" className="text-sm font-medium">
                Parent Name
              </label>
              <input
                id="parentName"
                type="text"
                placeholder="Your name"
                className="h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="childName" className="text-sm font-medium">
                Child Name
              </label>
              <input
                id="childName"
                type="text"
                placeholder="Child's name"
                className="h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="childAge" className="text-sm font-medium">
                Child Age
              </label>
              <select
                id="childAge"
                className="h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
                defaultValue=""
              >
                <option value="" disabled>Select age</option>
                <option value="3">3 years</option>
                <option value="4">4 years</option>
                <option value="5">5 years</option>
                <option value="6">6 years</option>
                <option value="7">7 years</option>
                <option value="8">8 years</option>
              </select>
            </div>

            <button
              type="submit"
              className="h-12 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 mt-2"
            >
              Create Account
            </button>
          </form>

          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/signin" className="text-primary hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 