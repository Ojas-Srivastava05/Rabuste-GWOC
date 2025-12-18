'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Stack from '@/components/Stack';
import SpringCard from '@/components/SpringCard';

// TypingAnimation - small local component used only for the section title
function TypingAnimation({ text, duration = 100, className = "", showCursor = true }: { text: string; duration?: number; className?: string; showCursor?: boolean }) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, duration);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, duration]);

  return (
    <span className={`${className} relative inline-block`}>
      <span className="relative">
        {displayedText.split('').map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
            className="inline-block"
            style={{
              textShadow: '0 0 10px rgba(255,116,0,0.6), 0 0 20px rgba(255,116,0,0.35)',
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </span>

      {showCursor && (
        <motion.span
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
          className="inline-block w-[2px] h-[0.9em] ml-1 align-middle rounded-sm"
          style={{
            background: '#FF7400',
            boxShadow: '0 0 8px rgba(255,116,0,0.35)',
          }}
        />
      )}
    </span>
  );
}

export default function RobustaOrigin() {
  return (
    <section
      id="robusta-origin-section"
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: 'transparent',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Ambient Atmosphere */}
      <div
        style={{
          position: 'absolute',
          top: '60%',
          left: '-300px',
          width: '900px',
          height: '900px',
          background: 'radial-gradient(circle, rgba(255,116,0,0.05) 0%, rgba(255,116,0,0.01) 40%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(130px)',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* Content Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingLeft: '120px',
          paddingRight: '120px',
          paddingTop: '80px',
          paddingBottom: '80px'
        }}
      >
        {/* Horizontal layout: left = text, right = images */}
        <div style={{ maxWidth: '1100px', width: '100%', display: 'flex', gap: '48px', alignItems: 'flex-start' }}>
          {/* Left column: text content wrapped in interactive SpringCard */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <SpringCard className="w-full">
              <div style={{ padding: '28px' }}>
                {/* Section Label */}
                <div style={{ marginBottom: '24px' }}>
                  <h2
                    style={{
                      fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                      color: '#fffbd6',
                      letterSpacing: '0.08em',
                      fontWeight: 600,
                      lineHeight: '1.2',
                      margin: 0,
                      fontFamily: 'Georgia, serif'
                    }}
                  >
                    <TypingAnimation text="What is Robusta?" duration={80} showCursor={false} />
                  </h2>
                </div>

                {/* Paragraphs */}
                <div style={{ marginBottom: '18px' }}>
                  <p
                    style={{
                      fontSize: '1.125rem',
                      lineHeight: '1.85',
                      letterSpacing: '0.02em',
                      color: '#fffbd6',
                      margin: 0,
                      fontFamily: 'Georgia, serif',
                      fontWeight: 400
                    }}
                  >
                    Robusta beans are coffee beans known for their{' '}
                    <span style={{ color: '#FF7400', fontWeight: 600, letterSpacing: '0.03em' }}>
                      higher caffeine content
                    </span>
                    ,{' '}
                    <span style={{ color: '#FF7400', fontWeight: 600, letterSpacing: '0.03em' }}>
                      bold intensity
                    </span>
                    , and deep, earthy flavor.
                  </p>
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <p
                    style={{
                      fontSize: '1.125rem',
                      lineHeight: '1.85',
                      letterSpacing: '0.02em',
                      color: '#fffbd6',
                      margin: 0,
                      fontFamily: 'Georgia, serif',
                      fontWeight: 400
                    }}
                  >
                    They produce a stronger cup,{' '}
                    <span style={{ color: '#FF7400', fontWeight: 600, letterSpacing: '0.03em' }}>
                      richer crema
                    </span>
                    , and a more powerful coffee experience.
                  </p>
                </div>

                {/* Divider */}
                <div
                  style={{
                    height: '1px',
                    background: 'linear-gradient(to right, rgba(255,116,0,0.3), rgba(255,116,0,0.1), transparent)',
                    marginBottom: '18px'
                  }}
                />

                {/* Continue / scroll indicator under text */}
                <div
                  style={{
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center',
                    opacity: 0.9,
                    transition: 'opacity 0.3s ease'
                  }}
                >
                  <div style={{ width: '40px', height: '1px', background: 'rgba(255,116,0,0.5)' }} />
                  <span
                    style={{
                      fontSize: '0.75rem',
                      letterSpacing: '0.15em',
                      color: 'rgba(255,255,189,0.6)',
                      textTransform: 'uppercase',
                      fontWeight: 600
                    }}
                  >
                    Continue
                  </span>
                </div>
              </div>
            </SpringCard>
          </div>

          {/* positioned on the extreme right (inside section padding) */}
          <div
            style={{
              position: 'absolute',
              right: '120px', // matches the section paddingRight
              top: '50%',
              transform: 'translateY(-50%)',
              width: 420,
              height: 420,
              zIndex: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div style={{ width: '100%', height: '100%' }}>
              <Stack
                randomRotation={true}
                sensitivity={180}
                sendToBackOnClick={true}
                cards={[
                  "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=500&auto=format",
                  "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=500&auto=format",
                  "https://images.unsplash.com/photo-1452626212852-811d58933cae?q=80&w=500&auto=format",
                  "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=500&auto=format"
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`bean-${i + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ))}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
