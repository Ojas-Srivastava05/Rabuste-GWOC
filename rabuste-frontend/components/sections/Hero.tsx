'use client';

import React from 'react';
import AnimatedContent from '../AnimatedContent';

export default function Hero() {
  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',        // center vertically
        justifyContent: 'center',    // center horizontally
        overflow: 'hidden',
        backgroundColor: 'transparent',
      }}
    >
      <AnimatedContent distance={80} reverse={false} duration={0.9} delay={0.05} threshold={0.15}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src="/Rabuste%20logo.png"
            alt="Rabuste logo"
            style={{
              maxWidth: 'min(60vw, 480px)',
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
              pointerEvents: 'none',
              transform: 'translateY(-70px)', // shift image up slightly
            }}
          />
        </div>
      </AnimatedContent>
    </section>
  );
}