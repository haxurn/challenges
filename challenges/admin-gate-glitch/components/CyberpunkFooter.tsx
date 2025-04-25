"use client";

import { useState} from 'react';
import { HolographicButton } from '@/components/HolographicButton';
import { Trash2 } from 'lucide-react';

export function CyberpunkFooter() {
  const [showConfirm, setShowConfirm] = useState(false);
  
  const handleSystemReset = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch (e) {
    }
    console.log('SessionStorage before reset:', { ...sessionStorage });
    localStorage.clear();
    sessionStorage.clear();
    console.log('SessionStorage after reset:', { ...sessionStorage });
    setShowConfirm(false);
    setTimeout(() => {
      window.location.href = '/';
    }, 500);
  };
  
  return (
    <footer className="mt-auto py-6 px-4 border-t border-muted/30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm text-muted-foreground font-mono">
          Haxurn CTF v1.0 – Break the Matrix
        </div>
        
        <div className="flex items-center gap-2">
          {showConfirm ? (
            <>
              <span className="text-xs text-destructive font-mono">Confirm reset?</span>
              <HolographicButton 
                variant="danger" 
                size="sm"
                onClick={handleSystemReset}
              >
                <Trash2 size={14} />
                Reset
              </HolographicButton>
              <HolographicButton 
                variant="secondary" 
                size="sm"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </HolographicButton>
            </>
          ) : (
            <HolographicButton 
              variant="secondary" 
              size="sm"
              onClick={() => setShowConfirm(true)}
            >
              <Trash2 size={14} />
              System Reset
            </HolographicButton>
          )}
        </div>
      </div>
    </footer>
  );
}