import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  showText?: boolean;
  size?: number;
  className?: string;
}

export default function Logo({ showText = true, size = 40, className = '' }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <div style={{ width: size, height: size, position: 'relative' }}>
        <Image
          src="/logo.svg"
          alt="Magic Story Buddy Logo"
          width={size}
          height={size}
          priority
        />
      </div>
      {showText && (
        <span className="text-primary font-bold hover:opacity-90">Magic Story Buddy</span>
      )}
    </Link>
  );
} 