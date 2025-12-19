'use client';

import React, { useRef, useState } from 'react';
import DomeGallery from '../DomeGallery';
import SpringCard from '../SpringCard';

export default function Menu() {
  const [selectedName, setSelectedName] = useState<string>('');
  const galleryRef = useRef<HTMLDivElement | null>(null);

  const images = [
    { src: 'https://images.unsplash.com/photo-1755331039789-7e5680e26e8f?q=80&w=774&auto=format&fit=crop', alt: 'Abstract art' },
    { src: 'https://images.unsplash.com/photo-1755569309049-98410b94f66d?q=80&w=772&auto=format&fit=crop', alt: 'Modern sculpture' },
    { src: 'https://images.unsplash.com/photo-1755497595318-7e5e3523854f?q=80&w=774&auto=format&fit=crop', alt: 'Digital artwork' },
    // add more images with meaningful alt names as needed
  ];

  const openFullMenu = () => {
    // smooth-scroll the gallery into view inside the same section
    if (galleryRef.current) {
      galleryRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'grid', placeItems: 'start center', padding: 24, gap: 18 }}>
      {/* Top action button */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <SpringCard className="px-2" onClick={openFullMenu}>
          <div
            style={{
              padding: '10px 18px',
              borderRadius: 12,
              background: 'linear-gradient(180deg, rgba(250,210,196,0.06), rgba(250,210,196,0.03))',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              userSelect: 'none',
            }}
            aria-label="Open full menu"
          >
            <span style={{ fontSize: 14, fontWeight: 700, color: '#F6EDE9' }}>Full menu</span>
          </div>
        </SpringCard>
      </div>

      {/* Display selected clicked item name */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#F6EDE9' }}>
          <div style={{ fontSize: 12, opacity: 0.8 }}>Clicked item name:</div>
          <div style={{ fontSize: 18, fontWeight: 600 }}>{selectedName || '—'}</div>
        </div>
      </div>

      {/* Dome gallery area */}
      <div ref={galleryRef} style={{ width: '100%', height: '720px', maxWidth: 1200 }}>
        <DomeGallery
          images={images}
          segments={28}
          fit={0.65}
          overlayBlurColor="#060010"
          onItemOpen={(name) => setSelectedName(name)}
          grayscale={false}
        />
      </div>
    </div>
  );
}