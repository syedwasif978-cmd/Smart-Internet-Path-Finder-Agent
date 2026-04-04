import { useEffect, useRef } from 'react';

/**
 * Hook for scroll-triggered animations
 * Adds fade-in and slide-up animation when element enters viewport
 * Respects user's motion preferences
 */
export function useScrollAnimation() {
  const ref = useRef(null);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Skip animation for users who prefer reduced motion
          if (!prefersReducedMotion) {
            entry.target.classList.add('scroll-animate-in');
          }
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return ref;
}

export default useScrollAnimation;
