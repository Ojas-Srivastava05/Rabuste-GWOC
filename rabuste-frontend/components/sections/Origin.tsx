'use client';

import React, { useEffect } from 'react';
import AnimatedContent from '../AnimatedContent';
import StarBorder from '../StarBorder';

export default function Origin() {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  return (
    <section
      id="origin-section"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: '#0a0a0a'
      }}
    >
      {/* Blurred background image (from public/origin/originbg.jpg) */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: "url('/origin/originbg.jpg')",
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          filter: 'blur(5px) saturate(1.05)',
          transform: 'scale(1.06)', // avoid visible edges when blurred
          opacity: 0.90,
          zIndex: 0,
        }}
      />

      {/* Soft dark overlay to improve contrast */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(10,10,10,0.35)',
          zIndex: 1,
        }}
      />

      {/* Section title: use StarBorder to render a clearly visible card in dark coffee */}
      <AnimatedContent distance={60} reverse={true} duration={0.9} delay={0.05} threshold={0.15}>
        {/* absolute full-width row to reliably center the StarBorder card */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: '36px',
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            zIndex: 10,
            pointerEvents: 'none'
          }}
        >
          <StarBorder
            as="div"
            className="star-border-origin"
            color="#3B2B23"
            speed="8s"
            style={{
              borderRadius: 14,
              // ensure the StarBorder itself doesn't expand to full width
              display: 'inline-flex',
            }}
          >
            <h1
              className="plantation-header"
              style={{
                margin: 0,
                fontSize: 'clamp(1.5rem, 3.5vw, 3rem)',
                color: '#FAD0C4',
                pointerEvents: 'none'
              }}
            >
              ORIGIN
            </h1>
          </StarBorder>
        </div>
      </AnimatedContent>

      <AnimatedContent distance={120} reverse={false} duration={1.0} delay={0.08} threshold={0.2}>
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            pointerEvents: 'none'
          }}
        >
          <img
            src="/origin/RobustaBeans.png"
            alt="Robusta beans"
            style={{
              maxWidth: 'min(1000px, 85%)',
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.6))',
              transform: 'translateY(-6px)'
            }}
          />
        </div>
      </AnimatedContent>
    </section>
  );
}