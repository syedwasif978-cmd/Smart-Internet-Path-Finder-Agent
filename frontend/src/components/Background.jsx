import React from 'react';
import { motion } from 'framer-motion';

const Background = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      zIndex: 0,
      pointerEvents: 'none',
      background: 'var(--soft-ivory)'
    }}>
      {/* Orb 1: Primary Purple */}
      <motion.div
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -50, 100, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-5%',
          width: '60vw',
          height: '60vw',
          background: 'radial-gradient(circle, rgba(148,106,139,0.15) 0%, rgba(148,106,139,0) 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          willChange: 'transform'
        }}
      />
      
      {/* Orb 2: Blush Pink */}
      <motion.div
        animate={{
          x: [0, -80, 50, 0],
          y: [0, 80, -50, 0],
          scale: [1, 1.2, 0.85, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '-10%',
          width: '70vw',
          height: '70vw',
          background: 'radial-gradient(circle, rgba(242,213,217,0.4) 0%, rgba(242,213,217,0) 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          willChange: 'transform'
        }}
      />
      
      {/* Orb 3: Muted Lavender */}
      <motion.div
        animate={{
          x: [0, 60, -60, 0],
          y: [0, -60, 60, 0],
          scale: [1, 1.05, 0.95, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5
        }}
        style={{
          position: 'absolute',
          top: '30%',
          left: '40%',
          width: '50vw',
          height: '50vw',
          background: 'radial-gradient(circle, rgba(201,182,218,0.2) 0%, rgba(201,182,218,0) 70%)',
          borderRadius: '50%',
          filter: 'blur(70px)',
          willChange: 'transform'
        }}
      />
      
      {/* Abstract Design Elements (Calligraphy feel/Waves) */}
      <svg width="100%" height="100%" style={{ position: 'absolute', opacity: 0.05, willChange: 'opacity' }}>
        <motion.path 
          d="M-200 400C100 200 300 600 600 300S900 600 1200 200" 
          stroke="var(--primary-purple)" 
          strokeWidth="2" 
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
        />
        <motion.path 
          d="M0 600C300 800 400 300 800 500S1200 800 1500 400" 
          stroke="var(--mauve)" 
          strokeWidth="3" 
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.3 }}
          transition={{ duration: 12, repeat: Infinity, repeatType: "reverse", ease: "linear", delay: 1 }}
        />
      </svg>
    </div>
  );
};

export default Background;
