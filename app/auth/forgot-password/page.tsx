import Link from "next/link";
import Logo from "../../components/Logo";
import WhimsicalBackground from "../../components/WhimsicalBackground";

export default function ForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <WhimsicalBackground starCount={12} cloudCount={3} className="min-h-screen">
        <div className="max-w-md w-full bg-card rounded-2xl shadow-lg p-8 reveal-on-scroll fade-in">
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <Logo size={56} className="mx-auto justify-center breathe" />
              <h2 className="text-2xl font-semibold mb-2 mt-4">Forgot Password</h2>
              <p className="text-muted-foreground">
                Enter your email and we'll send you a link to reset your password
              </p>
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
                  className="h-12 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <button
                type="submit"
                className="sparkle-button h-12 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 mt-4"
              >
                Send Reset Link
              </button>
            </form>

            <div className="text-center text-sm">
              <p className="text-muted-foreground">
                Remember your password?{" "}
                <Link href="/auth/signin" className="text-primary hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </WhimsicalBackground>
    </div>
  );
} 