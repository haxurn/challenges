"use client";

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface GlitchTextProps {
  text: string;
  className?: string;
  variant?: 'cyan' | 'magenta' | 'purple';
  intensity?: 'low' | 'medium' | 'high';
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
}

export function GlitchText({
  text,
  className,
  variant = 'cyan',
  intensity = 'medium',
  as: Component = 'span',
}: GlitchTextProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Apply intensity to glitch effect
  const getIntensityStyle = () => {
    switch (intensity) {
      case 'low':
        return { '--glitch-duration': '8s' } as React.CSSProperties;
      case 'medium':
        return { '--glitch-duration': '4s' } as React.CSSProperties;
      case 'high':
        return { '--glitch-duration': '2s' } as React.CSSProperties;
      default:
        return { '--glitch-duration': '4s' } as React.CSSProperties;
    }
  };

  // Apply variant styles
  const variantClass = variant === 'cyan' 
    ? 'neon-text' 
    : variant === 'magenta' 
      ? 'neon-text-magenta' 
      : 'neon-text-purple';

  if (!mounted) {
    return <Component className={cn(className, variantClass)}>{text}</Component>;
  }

  return (
    <Component 
      className={cn('glitch-text', variantClass, className)}
      data-text={text}
      style={getIntensityStyle()}
      aria-label={text}
    >
      {text}
    </Component>
  );
}