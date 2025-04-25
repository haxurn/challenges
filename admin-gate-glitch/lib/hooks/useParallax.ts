import React from 'react';
import { useState, useEffect } from 'react';

interface ParallaxOptions {
  intensity?: number;
  reverse?: boolean;
  axis?: 'both' | 'x' | 'y';
  clamp?: boolean;
  disabled?: boolean;
}

interface ParallaxResult {
  ref: React.RefObject<HTMLElement>;
  style: React.CSSProperties;
}

export function useParallax(options: ParallaxOptions = {}): ParallaxResult {
  const {
    intensity = 15,
    reverse = false,
    axis = 'both',
    clamp = true,
    disabled = false,
  } = options;

  const [style, setStyle] = useState<React.CSSProperties>({
    transform: 'translate3d(0, 0, 0)',
    transition: 'transform 0.1s ease-out',
  });

  const ref = React.createRef<HTMLElement>();

  useEffect(() => {
    if (disabled || typeof window === 'undefined') return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate offset from center (as percentage of window)
      let offsetX = (e.clientX - centerX) / window.innerWidth;
      let offsetY = (e.clientY - centerY) / window.innerHeight;
      
      // Apply reverse if needed
      if (reverse) {
        offsetX = -offsetX;
        offsetY = -offsetY;
      }
      
      // Apply intensity
      const moveX = offsetX * intensity;
      const moveY = offsetY * intensity;
      
      // Clamp values if needed
      const clampedMoveX = clamp ? Math.min(Math.max(moveX, -intensity), intensity) : moveX;
      const clampedMoveY = clamp ? Math.min(Math.max(moveY, -intensity), intensity) : moveY;
      
      // Apply transform based on axis
      if (axis === 'x') {
        setStyle({
          transform: `translate3d(${clampedMoveX}px, 0, 0)`,
          transition: 'transform 0.1s ease-out',
        });
      } else if (axis === 'y') {
        setStyle({
          transform: `translate3d(0, ${clampedMoveY}px, 0)`,
          transition: 'transform 0.1s ease-out',
        });
      } else {
        setStyle({
          transform: `translate3d(${clampedMoveX}px, ${clampedMoveY}px, 0)`,
          transition: 'transform 0.1s ease-out',
        });
      }
    };

    // Reset position when mouse leaves window
    const handleMouseLeave = () => {
      setStyle({
        transform: 'translate3d(0, 0, 0)',
        transition: 'transform 0.5s ease-out',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [ref, intensity, reverse, axis, clamp, disabled]);

  return { ref, style };
}