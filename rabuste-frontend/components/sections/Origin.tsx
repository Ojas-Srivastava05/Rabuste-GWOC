'use client';

import React from 'react';

export default function Origin() {
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
          filter: 'blur(10px) saturate(1.05)',
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

      {/* Foreground image (RobustaBeans) */}
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
            maxWidth: 'min(740px, 85%)',
            width: '100%',
            height: 'auto',
            objectFit: 'contain',
            filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.6))',
            transform: 'translateY(-6px)'
          }}
        />
      </div>
    </section>
  );
}