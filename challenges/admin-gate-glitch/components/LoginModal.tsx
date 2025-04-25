'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useState } from 'react';
import { GlitchText } from '@/components/GlitchText';
import { HolographicButton } from '@/components/HolographicButton';
import { X, Lock, User, AlertTriangle, Shield } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (role: string) => void; // ✅ FIXED TYPE
}

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const { role } = await res.json();
        setIsSuccess(true);
        setTimeout(() => {
          onLoginSuccess(role);
          onClose();
        }, 1000);
      } else {
        setErrorMessage('Invalid credentials');
        setError('root', { message: 'Invalid credentials' });
      }
    } catch {
      setErrorMessage('System error');
      setError('root', { message: 'System error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div 
        className={`modal-cyberpunk w-full max-w-md p-6 z-10 transform transition-all duration-500 ${
          isSuccess 
            ? 'scale-110 opacity-0 rotate-3d(1, 1, 1, 15deg)' 
            : 'scale-100 opacity-100'
        }`}
        style={{ 
          transform: isSuccess ? 'scale(1.1) rotate3d(1, 1, 1, 15deg)' : undefined,
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 
            id="login-modal-title"
            className="text-xl font-bold font-mono tracking-wider"
          >
            <GlitchText text="SYSTEM LOGIN" variant="cyan" as="span" />
          </h2>
          
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close login modal"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Error message */}
        {errorMessage && (
          <div className="mb-6 p-3 bg-destructive/20 border border-destructive/50 rounded flex items-center gap-2 text-sm">
            <AlertTriangle size={18} className="text-destructive" />
            <span className="neon-text-magenta">{errorMessage}</span>
          </div>
        )}
        
        {/* Success message */}
        {isSuccess && (
          <div className="mb-6 p-3 bg-green-500/20 border border-green-500/50 rounded flex items-center gap-2 text-sm">
            <Shield size={18} className="text-green-500" />
            <span className="text-green-400 font-bold">Access Granted</span>
          </div>
        )}
        
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Username */}
            <div className="space-y-2">
              <label 
                htmlFor="username" 
                className="block text-sm font-medium text-foreground/80"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User size={16} className="text-muted-foreground mr-2" />
                </div>
                <input
                  id="username"
                  type="text"
                  {...register('username')}
                  className="terminal-input pl-10 w-full"
                  placeholder="Enter username"
                  disabled={isLoading || isSuccess}
                  autoComplete="username"
                  required
                />
              </div>
              {errors.username && (
                <p className="text-destructive text-xs mt-1">{errors.username.message}</p>
              )}
            </div>
            
            {/* Password */}
            <div className="space-y-2">
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-foreground/80"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock size={16} className="text-muted-foreground mr-2" />
                </div>
                <input
                  id="password"
                  type="password"
                  {...register('password')}
                  className="terminal-input pl-10 w-full"
                  placeholder="Enter password"
                  disabled={isLoading || isSuccess}
                  autoComplete="current-password"
                  required
                />
              </div>
              {errors.password && (
                <p className="text-destructive text-xs mt-1">{errors.password.message}</p>
              )}
            </div>
            
            {/* Buttons */}
            <div className="flex gap-2 pt-2">
              <HolographicButton
                type="button"
                variant="danger"
                onClick={onClose}
                disabled={isLoading || isSuccess}
                fullWidth
              >
                Disconnect
              </HolographicButton>
              
              <HolographicButton
                type="submit"
                variant="primary"
                disabled={isLoading || isSuccess}
                fullWidth
              >
                {isLoading ? 'Connecting...' : 'Connect'}
              </HolographicButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}