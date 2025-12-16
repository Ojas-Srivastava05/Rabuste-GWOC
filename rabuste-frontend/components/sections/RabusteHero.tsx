'use client';

import React, { useState, useEffect } from 'react';

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

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0" style={{ backgroundColor: '#0a0a0a' }} />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(255,116,0,0.3) 0%, transparent 50%)',
          filter: 'blur(80px)'
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(255,116,0,0.1) 0%, transparent 70%)',
          filter: 'blur(120px)'
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.7) 100%)'
        }}
      />

      <div className="relative z-10 flex items-center justify-center h-full">
        <div
          className="transition-all duration-1000 ease-out"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)'
          }}
        >
          <h1
            className="text-center tracking-widest select-none"
            style={{
              color: '#FF7400',
              fontSize: 'clamp(3rem, 8vw, 7rem)',
              letterSpacing: '0.3em',
              textShadow: '0 0 40px rgba(255,116,0,0.4), 0 0 80px rgba(255,116,0,0.2)',
              fontFamily: '"Montserrat", sans-serif',
              fontWeight: 800
            }}
          >
            RABUSTE COFFEE
          </h1>

          <div
            className="mx-auto mt-6 transition-all duration-1000 delay-300"
            style={{
              width: visible ? '120px' : '0px',
              height: '2px',
              backgroundColor: '#FF7400',
              opacity: visible ? 0.6 : 0,
              boxShadow: '0 0 10px rgba(255,116,0,0.3)'
            }}
          />
        </div>
      </div>

      <div
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 transition-opacity duration-1000 delay-1000"
        style={{ opacity: visible ? 0.4 : 0 }}
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

      <div
        className="absolute bottom-0 w-full transition-transform duration-700"
        style={{
          transform: 'translateY(100%)',
          backgroundColor: '#0a0a0a',
          borderTop: '1px solid rgba(255,116,0,0.1)'
        }}
      >
        <div className="container mx-auto px-6 py-24">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6 tracking-wide" style={{ color: '#FF7400' }}>
              The Ritual Begins
            </h2>
            <p className="text-lg leading-relaxed opacity-80" style={{ color: '#d4d4d4' }}>
              Every bean tells a story. Every roast marks a moment. This is not just coffee—this is presence, craft, and intention.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}