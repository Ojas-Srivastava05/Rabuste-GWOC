'use client';

import React from 'react';
import Masonry from '../Masonry';

const items = [
  { id: '1', img: '../hero/img1.jpeg', url: '#', height: 400 },
  { id: '2', img: '../hero/img2.jpeg', url: '#', height: 250 },
  { id: '3', img: '../hero/img3.jpeg', url: '#', height: 600 },
  { id: '4', img: '../hero/img4.jpeg', url: '#', height: 250 },
  { id: '5', img: '../hero/img5.jpeg', url: '#', height: 400 },
  { id: '6', img: '../hero/img6.jpeg', url: '#', height: 600 },
  { id: '7', img: '../hero/img7.jpeg', url: '#', height: 600 },
  { id: '8', img: '../hero/img8.jpeg', url: '#', height: 400 },
  { id: '9', img: '../hero/img9.jpeg', url: '#', height: 250 },
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
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0a',
        overflow: 'hidden',
      }}
    >
      <div style={{ width: '100%', maxWidth: 1400, padding: '40px 24px' }}>
        <Masonry
          items={items}
          ease="power3.out"
          duration={0.6}
          stagger={0.05}
          animateFrom="bottom"
          scaleOnHover={true}
          hoverScale={0.95}
          blurToFocus={true}
          colorShiftOnHover={false}
        />
      </div>
    </section>
  );
}