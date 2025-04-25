'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, LockIcon, UnlockIcon } from 'lucide-react';

interface HeaderProps {
  showErrorMessage?: boolean;
  errorMessage?: string;
}

export function Header({ showErrorMessage = false, errorMessage = "Access Denied: Unauthorized" }: HeaderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check localStorage for authentication status
    const checkAuth = () => {
      setIsAuthenticated(localStorage.getItem('authenticated') === 'true');
    };
    checkAuth();
    // Listen for changes to localStorage (multi-tab support)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  return (
    <header className="relative z-10 py-4 px-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <UnlockIcon className="text-green-500 h-5 w-5" />
          ) : (
            <LockIcon className="text-red-500 h-5 w-5" />
          )}
          <span className={cn(
            "text-xs font-mono px-2 py-0.5 rounded-md",
            isAuthenticated 
              ? "bg-green-500/20 text-green-500 border border-green-500/30" 
              : "bg-red-500/20 text-red-500 border border-red-500/30"
          )}>
            System Status: {isAuthenticated ? "Unlocked" : "Locked"}
          </span>
        </div>
        
        {/* Error message (conditionally rendered) */}
        {showErrorMessage && (
          <div className="mt-2 md:mt-0 flex items-center gap-2 p-2 bg-destructive/10 border border-destructive/30 rounded-md animate-pulse">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="text-sm font-mono text-destructive">{errorMessage}</span>
          </div>
        )}
      </div>
    </header>
  );
}
