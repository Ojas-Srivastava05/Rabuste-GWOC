'use client';

import React from 'react';

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
        <div style={{ maxWidth: '850px', width: '100%' }}>
          {/* Section Label */}
          <div style={{ marginBottom: '80px' }}>
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
            What is Robusta?
            </h2>
          </div>

          {/* Definition Paragraph 1 */}
          <div style={{ marginBottom: '48px' }}>
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
              <span
                style={{
                  color: '#FF7400',
                  fontWeight: 600,
                  letterSpacing: '0.03em'
                }}
              >
                higher caffeine content
              </span>
              , <span
                style={{
                  color: '#FF7400',
                  fontWeight: 600,
                  letterSpacing: '0.03em'
                }}
              >
                bold intensity
              </span>
              , and deep, earthy flavor.
            </p>
          </div>

          {/* Definition Paragraph 2 */}
          <div style={{ marginBottom: '80px' }}>
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
              They produce a stronger cup, <span
                style={{
                  color: '#FF7400',
                  fontWeight: 600,
                  letterSpacing: '0.03em'
                }}
              >
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
              marginBottom: '80px'
            }}
          />

          {/* Scroll Indicator */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
              opacity: 0.5,
              transition: 'opacity 0.3s ease'
            }}
          >
            <div
              style={{
                width: '40px',
                height: '1px',
                background: 'rgba(255,116,0,0.5)'
              }}
            />
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
      </div>
    </section>
  );
}
