import React from 'react';

interface WhimsicalBackgroundProps {
  starCount?: number;
  cloudCount?: number;
  className?: string;
  children?: React.ReactNode;
}

export default function WhimsicalBackground({
  starCount = 6,
  cloudCount = 2,
  className = '',
  children
}: WhimsicalBackgroundProps) {
  // Generate random stars
  const stars = Array.from({ length: starCount }).map((_, index) => {
    const size = Math.floor(Math.random() * 3) + 1;
    const top = Math.floor(Math.random() * 100);
    const left = Math.floor(Math.random() * 100);
    const delay = Math.random() * 3;
    const emoji = ['✨', '⭐', '🌟'][Math.floor(Math.random() * 3)];
    
    return (
      <div 
        key={`star-${index}`}
        className="star text-yellow-300" 
        style={{ 
          top: `${top}%`, 
          left: `${left}%`, 
          fontSize: `${size * 0.6}rem`,
          animationDelay: `${delay}s`,
          zIndex: 1
        }}
      >
        {emoji}
      </div>
    );
  });

  // Generate random clouds
  const clouds = Array.from({ length: cloudCount }).map((_, index) => {
    const size = Math.floor(Math.random() * 2) + 1;
    const top = Math.floor(Math.random() * 90);
    const left = Math.floor(Math.random() * 90);
    const delay = Math.random() * 5;
    
    return (
      <div 
        key={`cloud-${index}`}
        className="cloud text-blue-100" 
        style={{ 
          top: `${top}%`, 
          left: `${left}%`, 
          fontSize: `${size + 1}rem`,
          animationDelay: `${delay}s`,
          zIndex: 1
        }}
      >
        ☁️
      </div>
    );
  });

  return (
    <div className={`whimsical-bg ${className}`}>
      <div className="star-sprinkle">
        {stars}
      </div>
      <div className="cloud-overlay">
        {clouds}
      </div>
      {children}
    </div>
  );
} 