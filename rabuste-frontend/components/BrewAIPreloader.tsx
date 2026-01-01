"use client";

import { useEffect } from "react";

export default function BrewAIPreloader() {
  useEffect(() => {
    // Preload the BrewAI API in the background to reduce latency
    const preloadBrewAI = async () => {
      try {
        const brewAIUrl = process.env.NEXT_PUBLIC_API_URL_BREWAI || 'https://moodbrewer-60wb.onrender.com';
        // Make a lightweight request to wake up the Render service
        await fetch(`${brewAIUrl}/health`, { 
          method: 'GET',
          mode: 'no-cors' // Avoid CORS issues for preload
        }).catch(() => {
          // Silently fail if the endpoint doesn't exist
        });
        console.log('BrewAI service preloaded');
      } catch (error) {
        // Silently fail - this is just a preload optimization
      }
    };

    // Start preloading after a short delay to not block initial page load
    const timer = setTimeout(preloadBrewAI, 2000);
    return () => clearTimeout(timer);
  }, []);

  return null;
}