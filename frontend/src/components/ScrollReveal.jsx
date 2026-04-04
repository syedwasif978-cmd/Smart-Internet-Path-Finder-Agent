import React from 'react';
import { motion } from 'framer-motion';

const ScrollReveal = ({ children, delay = 0, style, className }) => {
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // If motion is reduced, render immediately without animation
  if (prefersReducedMotion) {
    return (
      <div style={style} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.5, 
        delay: delay, 
        ease: [0.125, 0.46, 0.45, 0.94]
      }}
      style={style}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
