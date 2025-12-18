'use client';

import React, { useEffect } from 'react';
import AnimatedContent from '../AnimatedContent';

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
        alignItems: 'flex-start',      // ensure content stacks from the top
        justifyContent: 'center',
        paddingTop: '28px',            // room at top for the title
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
          backgroundImage: "url('/origin/file.jpg')",
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

      {/* Section title: absolute full-width row (centers reliably). Animate only the H1 so wrapper positioning isn't affected by AnimatedContent internals */}
      <div
        style={{
          position: 'absolute',
          top: '18px',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          zIndex: 60,
          pointerEvents: 'auto'
        }}
      >
        <AnimatedContent distance={60} reverse={true} duration={0.9} delay={0.05} threshold={0.15}>
          <h1
            role="heading"
            aria-level={1}
            className="plantation-header"
            style={{
              margin: 0,
              display: 'inline-block',
              fontSize: 'clamp(1.5rem, 3.5vw, 3rem)',
              color: '#3B2B23',
              padding: '8px 18px',
              textAlign: 'center',
            }}
          >
            ORIGIN
          </h1>
        </AnimatedContent>
      </div>

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
              // stronger brighten + contrast so the beans read clearly
              filter: 'brightness(1.35) contrast(1.12) saturate(1.2) drop-shadow(0 30px 60px rgba(0,0,0,0.45))',
              transform: 'translateY(-4px)'
            }}
          />
        </div>
      </AnimatedContent>
    </section>
  );
}