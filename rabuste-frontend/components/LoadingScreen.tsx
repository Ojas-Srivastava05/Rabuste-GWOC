'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ensure we're in browser environment
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    // Set a maximum timeout to ensure loading screen always hides
    const maxTimeout = setTimeout(() => {
      console.warn("LoadingScreen: Force hiding after maximum timeout");
      setIsLoading(false);
    }, 5000); // Maximum 5 seconds

    // Normal timeout
    const timeout = setTimeout(() => {
      setIsLoading(false);
      clearTimeout(maxTimeout);
    }, 2000);

    // Also hide when page is fully loaded
    const handleLoad = () => {
      setIsLoading(false);
      clearTimeout(timeout);
      clearTimeout(maxTimeout);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      clearTimeout(timeout);
      clearTimeout(maxTimeout);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center"
          style={{
            background: '#000000',
          }}
        >
          {/* Animated glow */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              background: 'radial-gradient(circle at center, rgba(184, 115, 51, 0.3) 0%, transparent 70%)',
              filter: 'blur(100px)',
            }}
          />

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Image
                src="/Rabuste logo.png"
                alt="Rabuste Coffee"
                width={200}
                height={200}
                priority
                onError={() => {
                  // If image fails to load, hide loading screen anyway
                  console.warn("LoadingScreen: Logo image failed to load");
                  setIsLoading(false);
                }}
                style={{
                  filter: 'drop-shadow(0 0 30px rgba(184, 115, 51, 0.5))',
                }}
              />
            </motion.div>
          </motion.div>

          {/* Loading bar */}
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: '200px' }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="relative h-1 bg-zinc-900/50 overflow-hidden mt-12"
          >
            <motion.div
              className="absolute inset-y-0 left-0"
              style={{
                background: 'linear-gradient(90deg, #B87333, #CD7F32)',
              }}
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}