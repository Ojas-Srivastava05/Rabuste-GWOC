'use client';

import { useEffect } from 'react';

/**
 * BackendWarmer component
 * Wakes up backend servers (Render free tier) as soon as the app loads
 * to prevent cold start delays when users interact with the app
 */
export default function BackendWarmer() {
  useEffect(() => {
    const warmBackends = async () => {
      const backends = [
        {
          name: 'Main Backend',
          url: process.env.NEXT_PUBLIC_API_URL,
          endpoint: '/health', // Health check endpoint
        },
        {
          name: 'BrewAI Backend',
          url: process.env.NEXT_PUBLIC_API_URL_BREWAI,
          endpoint: '/', // Root endpoint (no /health available)
        },
      ];

      // Ping all backends in parallel
      const warmupPromises = backends.map(async (backend) => {
        if (!backend.url) return;

        try {
          console.log(`🔥 Warming up ${backend.name}...`);
          const startTime = Date.now();
          
          // Use fetch with a timeout to avoid hanging
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

          const response = await fetch(`${backend.url}${backend.endpoint}`, {
            method: 'GET',
            signal: controller.signal,
            // Use no-cache to ensure we actually hit the server
            cache: 'no-store',
          });

          clearTimeout(timeoutId);
          const duration = Date.now() - startTime;

          // Accept both 200 OK and 404 Not Found as success for warming purposes
          // (404 still wakes up the server even if endpoint doesn't exist)
          if (response.ok || response.status === 404) {
            console.log(`✅ ${backend.name} warmed up successfully (${duration}ms)`);
          } else {
            console.log(`⚠️ ${backend.name} responded with status ${response.status} (${duration}ms)`);
          }
        } catch (error) {
          if (error instanceof Error && error.name === 'AbortError') {
            console.log(`⏱️ ${backend.name} warmup timed out`);
          } else {
            console.log(`❌ Failed to warm up ${backend.name}:`, error);
          }
        }
      });

      await Promise.allSettled(warmupPromises);
      console.log('🎯 Backend warmup complete');
    };

    // Start warming up backends immediately
    warmBackends();

    // Optional: Set up periodic pings to keep backends warm
    // Uncomment if you want to ping backends every 10 minutes
    // const intervalId = setInterval(warmBackends, 10 * 60 * 1000);
    // return () => clearInterval(intervalId);
  }, []);

  // This component doesn't render anything
  return null;
}