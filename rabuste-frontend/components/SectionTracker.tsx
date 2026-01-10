'use client';

import { useEffect, useRef } from 'react';
import { trackSectionView } from '@/lib/analytics';

interface SectionTrackerProps {
  sectionName: string;
  children: React.ReactNode;
}

/**
 * Component that tracks when a section comes into view
 * Uses Intersection Observer to detect when section is visible
 */
export default function SectionTracker({ sectionName, children }: SectionTrackerProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const hasTracked = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Track when section is 50% visible
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5 && !hasTracked.current) {
            trackSectionView(sectionName);
            hasTracked.current = true;
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% visible
        rootMargin: '0px',
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [sectionName]);

  return <div ref={sectionRef}>{children}</div>;
}
