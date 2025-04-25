"use client";

import { useState, useEffect } from 'react';
import { GlitchText } from '@/components/GlitchText';
import { HolographicButton } from '@/components/HolographicButton';
import { Copy, Check } from 'lucide-react';

interface HolographicCubeProps {
  flag: string;
}

export function HolographicCube({ flag }: HolographicCubeProps) {
  const [copied, setCopied] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [typedFlag, setTypedFlag] = useState('');
  
  // Typewriter effect for revealing the flag
  useEffect(() => {
    if (!revealed) return;
    
    let currentIndex = 0;
    const flagLength = flag.length;
    
    const interval = setInterval(() => {
      if (currentIndex <= flagLength) {
        setTypedFlag(flag.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 50);
    
    return () => clearInterval(interval);
  }, [flag, revealed]);
  
  // Auto reveal after 1 second
  useEffect(() => {
    const timer = setTimeout(() => {
      setRevealed(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Copy flag to clipboard
  const copyFlag = () => {
    navigator.clipboard.writeText(flag).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="cube-container">
        <div className="cube">
          <div className="cube-face face-front">
            <GlitchText text="FLAG" variant="cyan" as="span" />
          </div>
          <div className="cube-face face-back">
            <GlitchText text="FLAG" variant="magenta" as="span" />
          </div>
          <div className="cube-face face-right">
            <GlitchText text="FLAG" variant="purple" as="span" />
          </div>
          <div className="cube-face face-left">
            <GlitchText text="FLAG" variant="cyan" as="span" />
          </div>
          <div className="cube-face face-top">
            <GlitchText text="FLAG" variant="magenta" as="span" />
          </div>
          <div className="cube-face face-bottom">
            <GlitchText text="FLAG" variant="purple" as="span" />
          </div>
        </div>
      </div>
      
      <div className="holographic p-4 max-w-md w-full text-center">
        <p className="text-lg font-mono mb-2 text-primary">
          {revealed ? typedFlag : "Decrypting flag..."}
          {!revealed && <span className="animate-pulse">|</span>}
        </p>
        
        <HolographicButton
          onClick={copyFlag}
          variant="secondary"
          className="mt-4"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "Copied!" : "Copy Flag"}
        </HolographicButton>
      </div>
    </div>
  );
}