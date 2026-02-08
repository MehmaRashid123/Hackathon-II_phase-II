'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface AnimatedBackgroundProps {
  className?: string;
}

/**
 * Animated gradient background component for landing page hero section.
 * Uses CSS animations for smooth gradient transitions with performance optimization.
 */
export function AnimatedBackground({ className = '' }: AnimatedBackgroundProps) {
  const [isClient, setIsClient] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };
    
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Don't render during SSR
  if (!isClient) {
    return (
      <div className={`absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 ${className}`} />
    );
  }

  // Static gradient for users who prefer reduced motion
  if (prefersReducedMotion) {
    return (
      <div className={`absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 ${className}`} />
    );
  }

  return (
    <>
      <style jsx global>{`
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .animated-gradient {
          background: linear-gradient(
            -45deg,
            #e0f2fe,
            #ddd6fe,
            #fce7f3,
            #e0e7ff,
            #dbeafe
          );
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
        }
        
        .dark .animated-gradient {
          background: linear-gradient(
            -45deg,
            #1e293b,
            #1e1b4b,
            #312e81,
            #1e3a8a,
            #0f172a
          );
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
        }
      `}</style>
      <div 
        className={`absolute inset-0 -z-10 animated-gradient ${className}`}
        data-testid="animated-background"
      />
    </>
  );
}
