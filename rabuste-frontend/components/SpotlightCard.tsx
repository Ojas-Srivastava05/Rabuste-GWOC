'use client';

import React from 'react';
import './SpotlightCard.css';

interface SpotlightCardProps extends React.PropsWithChildren {
  className?: string;
  spotlightColor?: string;
}

export default function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(250,208,196,0.06)',
}: SpotlightCardProps) {
  return (
    <div
      className={`card-spotlight ${className}`}
      style={
        {
          // expose color to CSS via custom property
          ['--spotlight-color' as any]: spotlightColor,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
