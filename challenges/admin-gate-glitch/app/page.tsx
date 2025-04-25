'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GlitchText } from '@/components/GlitchText';
import { HolographicButton } from '@/components/HolographicButton';
import { LoginModal } from '@/components/LoginModal';
import { CyberpunkFooter } from '@/components/CyberpunkFooter';
import { Header } from '@/components/Header';
import { useParallax } from '@/lib/hooks/useParallax';

function ErrorHeader() {
  const searchParams = useSearchParams();
  const hasError = searchParams.has('error');
  const errorType = searchParams.get('error');
  return (
    <Header
      showErrorMessage={hasError}
      errorMessage={errorType === 'unauthorized'
        ? "Access Denied: Unauthorized"
        : "System Error: Unknown"
      }
    />
  );
}

export default function Home() {
  const router = useRouter();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  const titleParallax = useParallax({ intensity: 20 });
  const buttonParallax = useParallax({ intensity: 10, reverse: true });

  useEffect(() => {
    const authStatus = localStorage.getItem('authenticated') === 'true';
    const storedRole = localStorage.getItem('userRole');
    setIsAuthenticated(authStatus);
    setUserRole(storedRole);
  }, []);

  const handleLoginSuccess = (role: string) => {
    setIsAuthenticated(true);
    setUserRole(role);
    localStorage.setItem('authenticated', 'true');
    window.location.href = '/admin';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Suspense fallback={<Header showErrorMessage={false} errorMessage={undefined} />}>
        <ErrorHeader />
      </Suspense>

      <main className="flex-1 flex flex-col">
        <section className="relative py-20 md:py-32 flex flex-col items-center justify-center px-6 overflow-hidden">
          <div 
            ref={titleParallax.ref as React.RefObject<HTMLDivElement>}
            style={titleParallax.style}
            className="text-center mb-10"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tighter">
              <GlitchText 
                text="Admin Gate Glitch" 
                variant="cyan" 
                as="span"
                intensity="medium"
              />
            </h1>

            <p className="text-lg md:text-xl font-mono max-w-2xl mx-auto text-muted-foreground">
              <GlitchText 
                text="Crack the system. Claim the flag." 
                variant="magenta" 
                intensity="low"
                as="span"
              />
            </p>
          </div>

          <div 
            ref={buttonParallax.ref as React.RefObject<HTMLDivElement>}
            style={buttonParallax.style}
            className="flex flex-col sm:flex-row gap-4 mt-6"
          >
            <HolographicButton
              disabled={isLoginModalOpen}
              variant="primary"
              size="lg"
              onClick={() => setIsLoginModalOpen(true)}
            >
              Access Admin Core
            </HolographicButton>
            
            <HolographicButton
              onClick={() => setIsLoginModalOpen(true)}
              variant="secondary"
              size="lg"
            >
              System Login
            </HolographicButton>
          </div>

          <div className="mt-16 holographic p-4 max-w-lg w-full">
            <div className="text-center text-sm text-muted-foreground font-mono">
              <p>
                The admin panel is locked tight, accessible only to those with the right credentials. But word on the street is there’s a sneaky way to slip past the security check. Find the hidden shortcut that tricks the system into thinking you’re already cleared, and grab the flag waiting inside.
              </p>
              {isAuthenticated && userRole === 'user' && (
                <p className="mt-4 text-primary">Logged in as User. Admin access required to complete the challenge.</p>
              )}
            </div>
          </div>
        </section>
      </main>

      <CyberpunkFooter />

      {isLoginModalOpen && (
        <LoginModal 
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
}
