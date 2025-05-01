import React from 'react';

interface HomepageBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export default function HomepageBackground({ children, className = '' }: HomepageBackgroundProps) {
  return (
    <div className={`relative w-full ${className}`}>
      <div className="absolute inset-0 bg-[#f5f9e6] z-0"></div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
} 