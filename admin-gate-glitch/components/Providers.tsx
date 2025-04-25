"use client";

import { useState, useEffect } from 'react';
import { ParticleBackground } from '@/components/ParticleBackground';

export function Providers({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="cyberpunk-grid" />
      <div className="scan-line" />
      <ParticleBackground />
      {children}
    </>
  );
}