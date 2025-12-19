'use client';

import React, { useEffect, useState } from 'react';
import Masonry from '../Masonry';

const items = [
  { id: '1', img: '../hero/img1.jpeg', url: '#', height: 400 },
  { id: '2', img: '../hero/img2.jpeg', url: '#', height: 700 },
  { id: '3', img: '../hero/img3.jpeg', url: '#', height: 600 },
  { id: '4', img: '../hero/img4.jpeg', url: '#', height: 700 },
  { id: '5', img: '../hero/img5.jpeg', url: '#', height: 400 },
  { id: '6', img: '../hero/img6.jpeg', url: '#', height: 600 },
  { id: '7', img: '../hero/img7.jpeg', url: '#', height: 600 },
  { id: '8', img: '../hero/img8.jpeg', url: '#', height: 400 },
  { id: '9', img: '../hero/img9.jpeg', url: '#', height: 700 },
  { id: '10', img: '../hero/img10.jpeg', url: '#', height: 700 },
  // add more items as needed
];

export default function Hero() {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const check = () => setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const sectionStyle: React.CSSProperties = {
    width: '100%',
    // let content determine height so images are shown fully
    height: 'auto',
    minHeight: isMobile ? 'auto' : '100vh',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingTop: isMobile ? 56 : 100,
    paddingBottom: isMobile ? 48 : 0,
    // allow scrolling so tall images are visible without clipping
    overflowY: 'auto',
  };

  // responsive Masonry: fewer columns on mobile for better layout
  const columns = isMobile ? 2 : 4;
  const singleColumnMaxWidth = isMobile ? '100%' : undefined;

  return (
    <section id="hero" style={sectionStyle}>
      <div style={{ width: '100%', maxWidth: 1400, padding: isMobile ? '12px' : '40px 24px' }}>
        {isMobile ? (
          // Plain stacked images on mobile (no Masonry) so each image shows fully
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {items.map((it) => (
              <a
                key={it.id}
                href={it.url}
                style={{
                  display: 'block',
                  borderRadius: 10,
                  overflow: 'hidden',
                  background: 'transparent',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                }}
              >
                <img
                  src={it.img}
                  alt=""
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    objectFit: 'contain', // ensure entire image is visible
                  }}
                />
              </a>
            ))}
          </div>
        ) : (
          <Masonry
            items={items}
            columns={columns}
            ease="power3.out"
            duration={1.6}
            stagger={0.06}
            animateFrom="top"
            scaleOnHover={true}
            hoverScale={0.98}
            blurToFocus={true}
            colorShiftOnHover={true}
            gap={12}
            style={{ maxWidth: singleColumnMaxWidth }}
          />
        )}
      </div>
    </section>
  );
}