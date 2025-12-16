'use client';

import React, { useState, useEffect } from 'react';
import SpotlightCard from '@/components/SpotlightCard';
import ShinyText from '@/components/ShinyText';

export default function WhyRobusta() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById('why-robusta-section');
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      const start = viewportHeight;
      const end = -section.clientHeight;
      const progress = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
      
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const robustAnswer = `Robusta is resilient, uncompromising, and bold by nature. It thrives where others struggle and delivers intensity without dilution. Rabuste chooses Robusta not to follow trends, but to honor strength, depth, and the craft of a coffee that does not soften itself to be accepted. Every choice reflects conviction. Robusta is ours.`;

  return (
    <section
      id="why-robusta-section"
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: 'transparent',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Ambient Atmosphere Layer */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '1000px',
          height: '1000px',
          background: 'radial-gradient(circle, rgba(255,116,0,0.08) 0%, rgba(255,116,0,0.03) 40%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(120px)',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* Scroll Progress Indicator */}
      <div
        style={{
          position: 'fixed',
          right: '32px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}
      >
        <div
          style={{
            width: '2px',
            height: '120px',
            backgroundColor: 'rgba(255,116,0,0.2)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              width: '100%',
              height: `${scrollProgress * 100}%`,
              backgroundColor: '#FF7400',
              transition: 'height 0.1s ease-out'
            }}
          />
        </div>
        <span
          style={{
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
            color: `rgba(255,116,0,${0.3 + scrollProgress * 0.5})`,
            fontWeight: 600,
            transition: 'color 0.1s ease-out'
          }}
        >
          {Math.round(scrollProgress * 100)}%
        </span>
      </div>

      {/* Content Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingLeft: '64px',
          paddingRight: '64px',
          paddingTop: '80px',
          paddingBottom: '80px'
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '1400px',
            display: 'grid',
            gridTemplateColumns: '0.8fr 1.2fr',
            gap: '120px',
            alignItems: 'center'
          }}
        >
          {/* Left: Elegant SpotlightCard */}
          <div style={{ perspective: '1200px', display: 'flex', justifyContent: 'flex-end' }}>
            <SpotlightCard
              spotlightColor="rgba(255, 116, 0, 0.15)"
              className="rounded-xl border border-orange-500/15 flex items-center justify-center p-16 backdrop-blur-sm"
              style={{
                background: 'linear-gradient(135deg, rgba(255,116,0,0.02) 0%, rgba(255,116,0,0.01) 100%)',
                boxShadow: '0 8px 32px rgba(255,116,0,0.08), inset 0 1px 0 rgba(255,255,255,0.05)',
                width: '100%',
                maxWidth: '380px',
                minHeight: '420px'
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '3.5rem',
                    marginBottom: '20px',
                    opacity: 0.3,
                    letterSpacing: '0.2em'
                  }}
                >
                  ☕
                </div>
                <h2
                  style={{
                    fontSize: '1.75rem',
                    color: '#fffbd6',
                    letterSpacing: '0.12em',
                    fontWeight: 600,
                    lineHeight: '1.4',
                    margin: '0 0 20px 0',
                    textTransform: 'uppercase',
                    fontFamily: 'Georgia, serif',
                    textShadow: '0 2px 8px rgba(255,116,0,0.1)'
                  }}
                >
                  What is
                </h2>
                <h2
                  style={{
                    fontSize: '2.25rem',
                    color: '#FF7400',
                    letterSpacing: '0.15em',
                    fontWeight: 700,
                    lineHeight: '1.3',
                    margin: 0,
                    textTransform: 'uppercase',
                    fontFamily: 'Georgia, serif',
                    textShadow: '0 2px 12px rgba(255,116,0,0.2)'
                  }}
                >
                  Robusta?
                </h2>
                <div
                  style={{
                    marginTop: '30px',
                    height: '1px',
                    background: 'linear-gradient(to right, transparent, rgba(255,116,0,0.3), transparent)',
                    width: '80%',
                    margin: '30px auto 0'
                  }}
                />
              </div>
            </SpotlightCard>
          </div>

          {/* Right: Premium ShinyText Answer */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ maxWidth: '520px' }}>
              <ShinyText
                text={robustAnswer}
                disabled={false}
                speed={3}
                className="text-lg leading-relaxed"
                style={{
                  color: '#fffbd6',
                  fontSize: '1.0625rem',
                  lineHeight: '1.85',
                  letterSpacing: '0.025em',
                  fontWeight: 400,
                  fontFamily: 'Georgia, serif',
                  maxWidth: '100%'
                }}
              />
              <div
                style={{
                  marginTop: '40px',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center'
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '1px',
                    background: 'linear-gradient(to right, rgba(255,116,0,0.8), transparent)'
                  }}
                />
                <span
                  style={{
                    fontSize: '0.875rem',
                    letterSpacing: '0.15em',
                    color: 'rgba(255,255,189,0.6)',
                    textTransform: 'uppercase',
                    fontWeight: 600
                  }}
                >
                  Conviction
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Divider */}
      <div
        style={{
          position: 'relative',
          height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(255,116,0,0.2), transparent)',
          zIndex: 5
        }}
      />
    </section>
  );
}
