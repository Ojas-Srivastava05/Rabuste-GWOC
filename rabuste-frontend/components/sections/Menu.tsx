'use client';

import React, { useState } from 'react';
import DomeGallery from '../DomeGallery';

export default function Menu() {
  const [selectedName, setSelectedName] = useState<string>('');

  const images = [
    { src: 'https://images.unsplash.com/photo-1755331039789-7e5680e26e8f?q=80&w=774&auto=format&fit=crop', alt: 'Abstract art' },
    { src: 'https://images.unsplash.com/photo-1755569309049-98410b94f66d?q=80&w=772&auto=format&fit=crop', alt: 'Modern sculpture' },
    { src: 'https://images.unsplash.com/photo-1755497595318-7e5e3523854f?q=80&w=774&auto=format&fit=crop', alt: 'Digital artwork' },
    // add more images with meaningful alt names as needed
  ];

  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <div style={{ marginBottom: 18, color: '#F6EDE9', textAlign: 'center' }}>
        <div style={{ fontSize: 12, opacity: 0.8 }}>Clicked item name:</div>
        <div style={{ fontSize: 18, fontWeight: 600 }}>{selectedName || '—'}</div>
      </div>

      <div style={{ width: '100%', height: '720px', maxWidth: 1200 }}>
        <DomeGallery
          images={images}
          segments={28}
          fit={0.65}
          overlayBlurColor="#060010"
          onItemOpen={(name) => setSelectedName(name)}
        />
      </div>
    </div>
  );
}