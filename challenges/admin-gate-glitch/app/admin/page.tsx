'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GlitchText } from '@/components/GlitchText';
import { HolographicButton } from '@/components/HolographicButton';
import { HolographicCube } from '@/components/HolographicCube';
import { CyberpunkFooter } from '@/components/CyberpunkFooter';
import { Header } from '@/components/Header';
import { Shield, AlertTriangle } from 'lucide-react';
import { useParallax } from '@/lib/hooks/useParallax';
export const dynamic = 'force-dynamic';
export default function AdminPage() {
  const router = useRouter();
  const [isRevealed, setIsRevealed] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  const titleParallax = useParallax({ intensity: 15 });

  const flag = 'FLAG{middleware_bypass_cve_2025_29927}';

  useEffect(() => {
    const revealTimer = setTimeout(() => setIsRevealed(true), 500);
    const particleTimer = setTimeout(() => setShowParticles(true), 1000);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(particleTimer);
    };
  }, []);

  const SuccessParticles = () => {
    if (!showParticles) return null;

    return (
      <div className="fixed inset-0 pointer-events-none z-10 flex items-center justify-center">
        <div className="absolute inset-0">
          {Array.from({ length: 100 }).map((_, i) => {
            const size = Math.random() * 10 + 5;
            const duration = Math.random() * 2 + 1;
            const delay = Math.random() * 0.5;
            const x = Math.random() * 100;
            const y = Math.random() * 100;

            return (
              <div
                key={i}
                className="absolute rounded-full bg-primary"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${x}%`,
                  top: `${y}%`,
                  opacity: 0,
                  boxShadow: `0 0 ${size * 2}px rgba(0, 240, 255, 0.8)`,
                  animation: `fadeInOut ${duration}s ease-out ${delay}s`,
                }}
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0d0d0d] text-cyan-400">
      <SuccessParticles />
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div
          ref={titleParallax.ref as React.RefObject<HTMLDivElement>}
          style={titleParallax.style}
          className={`text-center mb-10 transform transition-all duration-1000 ${
            isRevealed ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}
        >
          <div className="inline-flex items-center gap-2 mb-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
              <GlitchText text="Admin Core Unlocked" variant="cyan" as="span" />
            </h1>
          </div>
          <p className="text-lg font-mono mt-4 text-muted-foreground max-w-lg mx-auto">
            System Breached. Patch CVE-2025-29927 in production.
          </p>
        </div>
        <div
          className={`transition-all duration-1000 ${
            isRevealed ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}
        >
          <HolographicCube flag={flag} />
        </div>

        {/* This comment will appear in DevTools source */}
        <div
          dangerouslySetInnerHTML={{
            __html: `
              <!-- 
                Leaked admin credentials:
                username: superadmin
                password: supersecretpassword
              -->
            `,
          }}
        />

        <div
          className={`mt-10 max-w-md w-full p-4 bg-destructive/10 border border-destructive/50 rounded-md transition-all duration-1000 ${
            isRevealed ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-destructive mb-1">Security Vulnerability Detected</h3>
              <p className="text-xs text-muted-foreground">
                This system has been compromised via a middleware authorization bypass vulnerability.
                Update your security protocols immediately.
              </p>
            </div>
          </div>
        </div>
        <div
          className={`mt-8 transition-all duration-1000 ${
            isRevealed ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}
        >
          <HolographicButton href="/" variant="secondary">
            Return to Mainframe
          </HolographicButton>
        </div>
      </main>
      <CyberpunkFooter />
      <style jsx global>{`
        @keyframes fadeInOut {
          0% {
            transform: scale(0) translate(0, 0);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          100% {
            transform: scale(1) translate(0, -100px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
