'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function DynamicBackground() {
  const [key, setKey] = useState(0);

  // Listen for VR close event to force re-render
  useEffect(() => {
    const handleVRClose = () => {
      // Force component to re-render
      setKey(prev => prev + 1);
    };

    window.addEventListener('vr-closed', handleVRClose);
    window.addEventListener('resize', handleVRClose);
    
    return () => {
      window.removeEventListener('vr-closed', handleVRClose);
      window.removeEventListener('resize', handleVRClose);
    };
  }, []);

  return (
    <div 
      key={key}
      className="fixed inset-0 pointer-events-none overflow-hidden" 
      style={{ zIndex: 0 }}
    >
      {/* Rich coffee-colored orbs */}
      <motion.div
        className="absolute -top-1/4 -right-1/4 w-[1200px] h-[1200px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(184, 115, 51, 0.25) 0%, rgba(205, 127, 50, 0.15) 40%, transparent 70%)',
          filter: 'blur(100px)',
        }}
        animate={{
          x: [0, 120, 0],
          y: [0, -60, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute -bottom-1/4 -left-1/4 w-[1000px] h-[1000px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(205, 127, 50, 0.2) 0%, rgba(184, 115, 51, 0.12) 40%, transparent 70%)',
          filter: 'blur(90px)',
        }}
        animate={{
          x: [0, -90, 0],
          y: [0, 70, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      <motion.div
        className="absolute top-1/3 right-1/3 w-[800px] h-[800px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(212, 165, 116, 0.18) 0%, rgba(184, 115, 51, 0.1) 50%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        animate={{
          x: [0, 70, 0],
          y: [0, -50, 0],
          scale: [1, 1.15, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      
      {/* Additional warm glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-[900px] h-[900px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(184, 115, 51, 0.15) 0%, transparent 60%)',
          filter: 'blur(100px)',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Elegant grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(184, 115, 51, 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(184, 115, 51, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Animated premium diagonal pattern */}
      <motion.div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 80px,
            rgba(212, 165, 116, 0.4) 80px,
            rgba(212, 165, 116, 0.4) 82px
          )`,
        }}
        animate={{
          x: [0, 80],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      
      {/* Coffee steam effect */}
      <motion.div
        className="absolute bottom-0 left-1/4 w-[300px] h-[600px]"
        style={{
          background: 'linear-gradient(to top, rgba(184, 115, 51, 0.1), transparent)',
          filter: 'blur(40px)',
        }}
        animate={{
          y: [0, -100, 0],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}