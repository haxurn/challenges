"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface HolographicButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function HolographicButton({
  children,
  className,
  href,
  variant = 'primary',
  onClick,
  disabled = false,
  type = 'button',
  fullWidth = false,
  size = 'md',
}: HolographicButtonProps) {
  const [isPressed, setIsPressed] = useState(false);


  const handleMouseDown = () => {
    if (!disabled) setIsPressed(true);
  };

  const handleMouseUp = () => {
    if (!disabled) setIsPressed(false);
  };


  const handleClick = () => {
    if (disabled || !onClick) return;
    onClick();
  };


  const sizeClasses = 
    size === 'sm' ? 'py-1.5 px-3 text-sm' :
    size === 'lg' ? 'py-4 px-8 text-lg' :
    'py-3 px-6 text-base';

  const variantClasses = 
    variant === 'primary' ? 'bg-primary/10 border-primary/50 text-primary hover:bg-primary/20' :
    variant === 'secondary' ? 'bg-secondary/10 border-secondary/50 text-secondary hover:bg-secondary/20' :
    'bg-destructive/10 border-destructive/50 text-destructive hover:bg-destructive/20';

  const buttonClasses = cn(
    'relative btn-3d',
    'font-mono uppercase tracking-wide font-bold',
    'border-2 rounded-md',
    'transition-all duration-300 ease-out',
    'backdrop-blur-sm',
    'flex items-center justify-center gap-2',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50',
    variantClasses,
    sizeClasses,
    fullWidth ? 'w-full' : '',
    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    isPressed ? 'transform translate-y-0.5 scale-[0.98]' : '',
    className
  );

  // Button has different markup for link vs button
  if (href) {
    return (
      <Link 
        href={disabled ? '#' : href}
        className={buttonClasses}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => setIsPressed(false)}
        onClick={disabled ? undefined : onClick}
        aria-disabled={disabled}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => setIsPressed(false)}
      disabled={disabled}
    >
      {children}
    </button>
  );
}