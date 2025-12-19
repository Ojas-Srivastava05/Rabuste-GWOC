'use client';

import React, { useEffect } from 'react';
import AnimatedContent from '../AnimatedContent';
import SpotlightCard from '../SpotlightCard';

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
        flexDirection: 'column',       // stack children vertically (image above paragraph)
        alignItems: 'center',
        justifyContent: 'flex-start',
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
          backgroundImage: "url('/origin/origindark.png')",
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
        <AnimatedContent container="#snap-main-container" distance={60} reverse={true} duration={0.9} delay={0.05} threshold={0.15}>
          <SpotlightCard spotlightColor="rgba(250,208,196,0.08)" className="origin-title-spotlight">
            <h1
              role="heading"
              aria-level={1}
              className="plantation-header"
              style={{
                margin: 0,
                display: 'inline-block',
                fontSize: 'clamp(1.5rem, 3.5vw, 3rem)',
                color: '#FAD0C4',
                padding: '6px 14px',
                textAlign: 'center',
              }}
            >
              ORIGIN
            </h1>
          </SpotlightCard>
        </AnimatedContent>
      </div>

      <AnimatedContent container="#snap-main-container" distance={120} reverse={false} duration={1.0} delay={0.08} threshold={0.2}>
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 40px 0', // remove bottom padding so following content sits below
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
              transform: 'translateY(-4px)',
              display: 'block',
              marginBottom: '28px' // ensure visual gap between image and paragraph
            }}
          />
        </div>
      </AnimatedContent>

      {/* descriptive text below the beans, rendered as a SpotlightCard */}
      <AnimatedContent container="#snap-main-container" distance={40} reverse={false} duration={0.8} delay={0.12} threshold={0.15}>
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            justifyContent: 'center',
            padding: '20px 40px',
            pointerEvents: 'auto'
          }}
        >
          {/* ensure spotlight pseudo-element is visible above overlays:
              - set CSS var directly on the element
              - raise z-index and give padding on the SpotlightCard itself
          */}
          <SpotlightCard
            className="origin-spotlight"
            spotlightColor="rgba(250,208,196,0.12)"
            style={
              {
                // set CSS variable used by SpotlightCard.css
                ['--spotlight-color' as any]: 'rgba(250,208,196,0.12)',
                position: 'relative',
                zIndex: 60, // make sure spotlight sits above overlays
                padding: '18px 22px',
                borderRadius: 12,
                maxWidth: '880px',
                display: 'inline-block',
                background: 'transparent',
              } as React.CSSProperties
            }
          >
            {/* split into separate lines at each sentence (dot) */}
            <div style={{ color: '#FAD0C4', textAlign: 'center', lineHeight: 1.8, fontFamily: "Montserrat, 'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial" }}>
              <p style={{ margin: 0 }}>
                Robusta coffee beans originate from the{' '}
                <span style={{ color: '#E6C9A8', fontWeight: 700 }}>rainforests of Central &amp; Western Africa</span>, especially the{' '}
                <strong style={{ color: '#C89B7B' }}>Congo Basin</strong>.
              </p>

              <p style={{ margin: '0.8rem 0 0' }}>
                They evolved to survive{' '}
                <em style={{ color: '#FAD0C4', fontStyle: 'italic' }}>harsh climates, pests, and lower altitudes</em>, which gives them{' '}
                <strong style={{ color: '#C89B7B' }}>higher caffeine</strong> and a{' '}
                <span style={{ color: '#C89B7B', fontWeight: 700 }}>stronger structure</span> than other coffee beans.
              </p>

              <p style={{ margin: '0.8rem 0 0' }}>
                As coffee spread globally, Robusta found its place in{' '}
                <span style={{ color: '#E6C9A8' }}>Asia and India</span>, valued for its{' '}
                <strong style={{ color: '#C89B7B' }}>resilience, intensity, and bold character</strong> — a bean shaped by endurance and strength.
              </p>
            </div>
          </SpotlightCard>
        </div>
      </AnimatedContent>
    </section>
  );
}