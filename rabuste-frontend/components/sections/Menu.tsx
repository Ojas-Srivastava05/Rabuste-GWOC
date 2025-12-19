'use client';

import React, { useRef, useState } from 'react';
import DomeGallery from '../DomeGallery';

export default function Menu() {
  const [selectedItem, setSelectedItem] = useState<string>('');
  const galleryRef = useRef<HTMLDivElement | null>(null);

  // Coffee menu images with names
  const menuImages = [
    { src: '/menu/espresso.jpg', alt: 'Rabuste Robusta Espresso' },
    { src: '/menu/coldBrew.jpg', alt: 'Cold Brew Supreme' },
    { src: '/menu/macchiato.jpg', alt: 'Caramel Macchiato' },
    { src: '/menu/mocha.jpg', alt: 'Mocha Delight' },
    { src: '/menu/vietnamese.jpg', alt: 'Vietnamese Robusta' },
    { src: '/menu/affogato.jpg', alt: 'Affogato' },
    { src: '/menu/nitro.jpg', alt: 'Nitro Coffee' },
    { src: '/menu/cortado.jpg', alt: 'Cortado' },
    { src: '/menu/americano.jpg', alt: 'Americano' },
    { src: '/menu/cappuccino.jpg', alt: 'Cappuccino' },
    { src: '/menu/latte.jpg', alt: 'Latte' },
    { src: '/menu/flatWhite.jpg', alt: 'Flat White' }
  ];

  const scrollToGallery = () => {
    if (galleryRef.current) {
      galleryRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section style={{
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '30px 20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative glow */}
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '15%',
        width: '250px',
        height: '250px',
        background: 'radial-gradient(circle, rgba(196, 165, 116, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(50px)',
        pointerEvents: 'none'
      }} />

      <div style={{
        maxWidth: '1400px',
        width: '100%',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1 style={{
            margin: '0 0 8px 0',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #FAD0C4 0%, #c4a574 50%, #E6C9A8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.02em'
          }}>
            Our Menu
          </h1>
          <p style={{
            color: '#E6C9A8',
            fontSize: '0.9rem',
            opacity: 0.9,
            margin: 0
          }}>
            Explore our signature brews in 360° • Drag to rotate • Click to view
          </p>
        </div>

        {/* Selected item display */}
        {selectedItem && (
          <div style={{
            textAlign: 'center',
            marginBottom: '20px',
            background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.6) 0%, rgba(42, 42, 42, 0.4) 100%)',
            border: '1px solid rgba(196, 165, 116, 0.3)',
            borderRadius: '12px',
            padding: '12px 20px',
            backdropFilter: 'blur(20px)',
            display: 'inline-block',
            margin: '0 auto 20px',
            position: 'relative',
            left: '50%',
            transform: 'translateX(-50%)'
          }}>
            <div style={{ fontSize: '0.7rem', color: '#c4a574', marginBottom: '4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Now Viewing
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FAD0C4' }}>
              {selectedItem}
            </div>
          </div>
        )}

        {/* Dome Gallery Container */}
        <div ref={galleryRef} style={{
          width: '100%',
          height: '650px',
          position: 'relative',
          background: 'rgba(10, 10, 10, 0.4)',
          borderRadius: '24px',
          border: '1px solid rgba(42, 42, 42, 0.8)',
          overflow: 'hidden',
          backdropFilter: 'blur(10px)'
        }}>
           <DomeGallery /*images={menuImages} */
  segments={28}
  fit={0.65}
  overlayBlurColor="#060010"
  onItemOpen={(name) => setSelectedItem(name)}
  grayscale={false}/>
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#c4a574',
            fontSize: '1.2rem',
            fontWeight: 600
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>☕</div>
              <div>Interactive 3D Menu Gallery</div>
              <div style={{ fontSize: '0.9rem', color: '#E6C9A8', marginTop: '8px', opacity: 0.8 }}>
                Drag to explore • Click to view details
              </div>
            </div>
          </div>
        </div>


      </div>
    </section>
  );
}