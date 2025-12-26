'use client';

import React from 'react';

export default function BackgroundPattern() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #B87333 1px, transparent 1px),
            linear-gradient(to bottom, #B87333 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Animated gradient orbs */}
      <div 
        className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full opacity-10"
        style={{
          background: 'radial-gradient(circle, rgba(184, 115, 51, 0.3) 0%, transparent 70%)',
          filter: 'blur(100px)',
          animation: 'floatSlow 20s ease-in-out infinite',
        }}
      />
      
      <div 
        className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full opacity-10"
        style={{
          background: 'radial-gradient(circle, rgba(115, 54, 53, 0.3) 0%, transparent 70%)',
          filter: 'blur(100px)',
          animation: 'floatSlow 25s ease-in-out infinite',
          animationDelay: '5s',
        }}
      />

      {/* Diagonal lines */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 100px,
            rgba(184, 115, 51, 0.5) 100px,
            rgba(184, 115, 51, 0.5) 101px
          )`,
        }}
      />
    </div>
  );
}