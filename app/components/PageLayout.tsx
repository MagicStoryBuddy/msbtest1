'use client';

import Link from "next/link";
import Logo from "./Logo";

interface PageLayoutProps {
  children: React.ReactNode;
  currentPage?: 'home' | 'dashboard' | 'stories' | 'help';
}

export default function PageLayout({ children, currentPage = 'home' }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex justify-between items-center">
            <Logo size={28} showText={false} />
            <nav className="flex items-center gap-4 text-xs font-poppins">
              <Link href="/" className={`font-medium hover:text-primary ${currentPage === 'home' ? 'text-primary' : 'text-muted-foreground'}`}>
                Home
              </Link>
              <Link href="/dashboard" className={`font-medium hover:text-primary ${currentPage === 'dashboard' ? 'text-primary' : 'text-muted-foreground'}`}>
                Dashboard
              </Link>
              <Link href="/stories" className={`font-medium hover:text-primary ${currentPage === 'stories' ? 'text-primary' : 'text-muted-foreground'}`}>
                Stories
              </Link>
              <Link href="/help" className={`font-medium hover:text-primary ${currentPage === 'help' ? 'text-primary' : 'text-muted-foreground'}`}>
                Help
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {children}

      <footer className="mt-12 flex gap-[24px] flex-wrap items-center justify-center text-muted-foreground backdrop-blur-sm bg-white/30 px-4 py-1 rounded-full font-nunito">
        Made with ❤️ for kids • <a href="/help" className="hover:underline hover:text-primary">Help & About</a>
      </footer>
    </div>
  );
} 