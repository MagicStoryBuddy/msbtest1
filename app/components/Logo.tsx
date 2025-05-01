import Link from 'next/link';

interface LogoProps {
  showText?: boolean;
  size?: number;
  className?: string;
}

export default function Logo({ showText = true, size = 40, className = '' }: LogoProps) {
  const scale = size / 40; // Base scaling factor
  
  return (
    <Link href="/" className={`flex flex-col items-center gap-2 ${className}`}>
      <div style={{ width: size * 2.5, height: size * 2.5, position: 'relative' }}>
        {/* SVG logo implementation matching the image */}
        <svg
          width={size * 2.5}
          height={size * 2.5}
          viewBox="0 0 300 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="breathe"
          style={{ transform: `scale(${scale})` }}
        >
          {/* Mint green cloud/background */}
          <ellipse cx="150" cy="130" rx="110" ry="100" fill="#D1F5E6" />
          
          {/* Floating stars */}
          <path
            d="M70 125L76 112L82 125L95 131L82 137L76 150L70 137L57 131L70 125Z"
            fill="#FFDC9A"
            className="star"
            style={{ animationDelay: "0.5s" }}
          />
          <circle cx="220" cy="105" r="8" fill="#FFDC9A" className="star" style={{ animationDelay: "1.2s" }} />
          <circle cx="250" cy="170" r="6" fill="#FFDC9A" className="star" style={{ animationDelay: "0.8s" }} />
          <path
            d="M250 90L254 80L258 90L268 94L258 98L254 108L250 98L240 94L250 90Z"
            fill="#FFDC9A"
            className="star"
            style={{ animationDelay: "1.5s" }}
          />
          
          {/* Smiling face */}
          <circle cx="150" cy="100" r="50" fill="#F7E0F5" stroke="#9F7AEA" strokeWidth="10" />
          <path
            d="M135 90 Q135 85, 130 85 Q125 85, 125 90"
            stroke="#9F7AEA"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M175 90 Q175 85, 170 85 Q165 85, 165 90"
            stroke="#9F7AEA"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M125 115 Q150 135, 175 115"
            stroke="#9F7AEA"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />
          
          {/* Open book */}
          <path
            d="M65 170 C70 145, 125 155, 150 165 C175 155, 230 145, 235 170 L235 220 C230 205, 175 195, 150 205 C125 195, 70 205, 65 220 L65 170Z"
            fill="#C1E5FA"
            stroke="#9F7AEA"
            strokeWidth="10"
          />
          <path
            d="M150 165 L150 205"
            stroke="#9F7AEA"
            strokeWidth="8"
          />
          <path
            d="M100 175 L115 171 M100 185 L120 180 M100 195 L118 189"
            stroke="#9F7AEA"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M200 175 L185 171 M200 185 L180 180 M200 195 L182 189"
            stroke="#9F7AEA"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
      
      {showText && (
        <span className="text-primary font-bold hover:opacity-90 text-center font-baloo">
          {showText === true ? "Magic Story Buddy" : ""}
        </span>
      )}
    </Link>
  );
} 