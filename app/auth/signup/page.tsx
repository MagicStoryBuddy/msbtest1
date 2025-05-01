'use client';

import Link from "next/link";
import Logo from "../../components/Logo";
import WhimsicalBackground from "../../components/WhimsicalBackground";

export default function SignUp() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <WhimsicalBackground className="min-h-screen">
        <div className="max-w-lg w-full bg-card rounded-2xl shadow-lg p-8 reveal-on-scroll fade-in">
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <Logo size={60} className="mx-auto justify-center breathe" />
              <h2 className="text-2xl font-semibold mb-2 mt-4 font-baloo">Create an Account</h2>
              <p className="text-muted-foreground font-nunito">Join Magic Story Buddy for wonderful bedtime stories</p>
            </div>

            <form className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium font-nunito">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="parent@example.com"
                  className="h-12 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-nunito"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-sm font-medium font-nunito">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-12 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-nunito"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium font-nunito">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="h-12 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-nunito"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="parentName" className="text-sm font-medium font-nunito">
                  Parent Name
                </label>
                <input
                  id="parentName"
                  type="text"
                  placeholder="Your name"
                  className="h-12 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-nunito"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="childName" className="text-sm font-medium font-nunito">
                  Child Name
                </label>
                <input
                  id="childName"
                  type="text"
                  placeholder="Child's name"
                  className="h-12 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-nunito"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="childAge" className="text-sm font-medium font-nunito">
                  Child Age
                </label>
                <select
                  id="childAge"
                  className="h-12 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-nunito"
                  required
                  defaultValue=""
                >
                  <option value="" disabled>Select age</option>
                  <option value="under3">Under 3 years</option>
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
                className="sparkle-button h-12 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 mt-4 font-poppins"
              >
                Create Account
              </button>
            </form>

            <div className="text-center text-sm">
              <p className="text-muted-foreground font-nunito">
                Already have an account?{" "}
                <Link href="/auth/signin" className="text-primary hover:underline font-poppins">
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