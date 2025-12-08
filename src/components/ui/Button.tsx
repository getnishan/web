import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'accent';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-full font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-95',
          {
            'bg-primary text-white hover:bg-primary-variant shadow-lg shadow-primary/20': variant === 'primary',
            'bg-secondary text-white hover:bg-secondary-variant shadow-lg shadow-secondary/20': variant === 'secondary',
            'bg-accent-orange text-white hover:bg-orange-600 shadow-lg shadow-accent-orange/20': variant === 'accent',
            'border-2 border-secondary text-secondary bg-transparent hover:bg-secondary/5': variant === 'outline',
            'h-10 px-5 text-sm': size === 'sm',
            'h-12 px-8 text-base': size === 'md',
            'h-16 px-10 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
