'use client';

import React, { useState, useEffect } from 'react';
import SplitText from '@/components/SplitText';

export default function RabusteHero() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@800&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleAnimationComplete = () => {
    console.log('All letters have animated!');
  };

  const titleStyle = {
    color: '#FF7400',
    fontSize: 'clamp(2.5rem, 7vw, 6rem)',
    letterSpacing: '0.3em',
    textShadow: '0 0 40px rgba(255,116,0,0.4), 0 0 80px rgba(255,116,0,0.2)',
    fontFamily: '"Montserrat", sans-serif',
    fontWeight: 800,
    lineHeight: '1.5',
    margin: 0,
    position: 'relative',
    zIndex: 100
  };

  return (
    <section style={{ width: '100%', position: 'relative', minHeight: '100vh', zIndex: 1 }}>
      <div style={{ position: 'relative', zIndex: 10, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          className="transition-all duration-1000 ease-out"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            position: 'relative',
            zIndex: 100
          }}
        >
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 100 }}>
            <div style={titleStyle}>
              <SplitText
                text="RABUSTE"
                tag="h1"
                className="text-center tracking-widest select-none"
                delay={80}
                duration={0.5}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="center"
                onLetterAnimationComplete={handleAnimationComplete}
              />
            </div>
            <div style={titleStyle}>
              <SplitText
                text="COFFEE"
                tag="h1"
                className="text-center tracking-widest select-none"
                delay={80}
                duration={0.5}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="center"
                onLetterAnimationComplete={handleAnimationComplete}
              />
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 transition-opacity duration-1000 delay-1000"
        style={{ opacity: visible ? 0.4 : 0, zIndex: 10 }}
      >
        <div className="flex flex-col items-center gap-2">
          <div
            className="w-px h-16 animate-pulse"
            style={{
              background: 'linear-gradient(to bottom, transparent, rgba(255,116,0,0.3), transparent)',
              animationDuration: '2s'
            }}
          />
          <span className="text-xs tracking-widest uppercase" style={{ color: 'rgba(255,116,0,0.5)' }}>
            Scroll
          </span>
        </div>
      </div>
    </section>
  );
}