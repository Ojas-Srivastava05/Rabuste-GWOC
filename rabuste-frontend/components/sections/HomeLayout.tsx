'use client';

import React from 'react';
import ScrollReveal from '@/components/ScrollReveal';

export default function HomeLayout({ children }) {
  const defaultScrollRevealProps = {
    baseOpacity: 0,
    enableBlur: true,
    baseRotation: 5,
    blurStrength: 10,
    rotationEnd: 'bottom bottom',
    wordAnimationEnd: 'bottom bottom'
  };

  return (
    <div className="home-layout">
      {children}
    </div>
  );
}

export { defaultScrollRevealProps };
