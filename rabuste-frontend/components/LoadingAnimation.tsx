'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Coffee bean loader */}
      <div className="relative w-20 h-20">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0"
            style={{
              border: '3px solid',
              borderColor: i === 0 ? '#B87333' : i === 1 ? '#CD7F32' : '#733635',
              borderRadius: '50%',
              opacity: 0.6,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.6, 0, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut",
            }}
          />
        ))}
        <div 
          className="absolute inset-0 flex items-center justify-center text-4xl"
          style={{ filter: 'drop-shadow(0 0 8px rgba(184, 115, 51, 0.6))' }}
        >
          ☕
        </div>
      </div>

      {/* Loading text */}
      <motion.div
        className="text-lg tracking-[0.3em] uppercase"
        style={{
          color: '#B87333',
          fontFamily: 'var(--font-heading)',
          fontWeight: 400,
        }}
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        LOADING
      </motion.div>
    </div>
  );
}