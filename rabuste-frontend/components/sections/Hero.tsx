'use client';

import React from 'react';
import Masonry from '../Masonry';

const items = [
  { id: '1', img: '../hero/img1.jpeg', url: '#', height: 400 },
  { id: '2', img: '../hero/img2.jpeg', url: '#', height: 750 },
  { id: '3', img: '../hero/img3.jpeg', url: '#', height: 600 },
  { id: '4', img: '../hero/img4.jpeg', url: '#', height: 750 },
  { id: '5', img: '../hero/img5.jpeg', url: '#', height: 400 },
  { id: '6', img: '../hero/img6.jpeg', url: '#', height: 600 },
  { id: '7', img: '../hero/img7.jpeg', url: '#', height: 600 },
  { id: '8', img: '../hero/img8.jpeg', url: '#', height: 400 },
  { id: '9', img: '../hero/img9.jpeg', url: '#', height: 750 },
  { id: '10', img: '../hero/img10.jpeg', url: '#', height: 750 },
  // add more items as needed
];

export default function Hero() {
  return (
    <section
      id="hero"
      style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'flex-start', // move content toward the top
        justifyContent: 'center',
        paddingTop: '100px',       // extra space from the very top, adjust as needed
        background: '#0a0a0a',
        overflow: 'hidden',
      }}
    >
      <div style={{ width: '100%', maxWidth: 1400, padding: '40px 24px' }}>
        <Masonry
          items={items}
          ease="power3.out"
          duration={2.0}
          stagger={0.1}
          animateFrom="top"
          scaleOnHover={true}
          hoverScale={0.95}
          blurToFocus={true}
          colorShiftOnHover={true}
        />
      </div>
    </section>
  );
}