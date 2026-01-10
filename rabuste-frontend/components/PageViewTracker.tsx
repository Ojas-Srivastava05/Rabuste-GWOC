'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@/lib/analytics';

/**
 * Component that tracks page views automatically
 * Add this to your layout or individual pages
 */
export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      // Get page name from pathname
      const pageName = pathname === '/' 
        ? 'Home' 
        : pathname.split('/').pop()?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Page';
      
      trackPageView(pageName, pathname);
    }
  }, [pathname]);

  return null; // This component doesn't render anything
}
