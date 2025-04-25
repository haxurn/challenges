// Type definitions for the application

// Authentication
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string;
}

// System status
export interface SystemStatus {
  isLocked: boolean;
  lastAccess?: Date;
}

// Component props types
export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export interface GlitchProps {
  text: string;
  intensity?: 'low' | 'medium' | 'high';
  variant?: 'cyan' | 'magenta' | 'purple';
}

export interface HolographicElementProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
  interactive?: boolean;
}

// Animation related types
export interface ParticleProps {
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
}

// API related types
export interface ApiErrorResponse {
  error: string;
  code: number;
  message: string;
}