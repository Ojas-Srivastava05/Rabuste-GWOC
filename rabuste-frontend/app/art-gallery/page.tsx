"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "@/components/Navbar";
import DynamicBackground from "@/components/DynamicBackground";
import ArtGalleryHero from "@/components/ArtGalleryHero";
import ArtworkCarousel from "@/components/ArtworkCarousel";
import Footer from "@/components/sections/footer";
import { artworkData, carouselCategories } from "@/data/artworkData";
import { ArtworkItem } from "@/types/artwork";

export default function ArtGalleryLandingPage() {
  const [selectedArtwork, setSelectedArtwork] = useState<ArtworkItem>(artworkData[0]);
  const carouselRef = useRef<HTMLElement>(null);
  
  // Track scroll position for wave animation
  const { scrollY } = useScroll();
  const waveOpacity = useTransform(scrollY, [0, 100], [0, 1]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const handleArtworkHover = (artwork: ArtworkItem) => {
    setSelectedArtwork(artwork);
  };

  return (
    <>
      <Navbar />
      <DynamicBackground />

      {/* Noise overlay */}
      <div className="noise-overlay" />
      
      {/* Premium copper accent line */}
      <div 
        className="fixed top-0 left-0 right-0 h-1 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, #B87333, #CD7F32, #D4A574, #CD7F32, #B87333, transparent)',
          zIndex: 100,
          boxShadow: '0 0 20px rgba(184, 115, 51, 0.5)',
        }}
      />

      <main style={{ background: 'transparent', position: 'relative', zIndex: 2, height: '100vh', overflow: 'hidden' }}>
        {/* Hero Section - Fixed top 2/3 */}
        <section 
          className="fixed top-0 left-0 right-0"
          style={{ 
            height: '66.67vh',
            zIndex: 10,
          }}
        >
          <ArtGalleryHero artwork={selectedArtwork} />
        </section>

        {/* Animated Wave Divider - appears on scroll */}
        <motion.div
          className="fixed left-0 right-0 pointer-events-none"
          style={{
            top: 'calc(66.67vh - 150px)',
            height: '150px',
            zIndex: 15,
            overflow: 'visible',
            opacity: waveOpacity,
          }}
        >
          <svg
            viewBox="0 0 1200 150"
            preserveAspectRatio="none"
            style={{
              width: '100%',
              height: '100%',
            }}
          >
            <defs>
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(26, 17, 16, 0)" />
                <stop offset="30%" stopColor="rgba(26, 17, 16, 0.3)" />
                <stop offset="60%" stopColor="rgba(26, 17, 16, 0.7)" />
                <stop offset="100%" stopColor="rgba(26, 17, 16, 0.95)" />
              </linearGradient>
            </defs>
            <motion.path
              d="M0,70 Q300,20 600,70 T1200,70 L1200,150 L0,150 Z"
              fill="url(#waveGradient)"
              initial={{ d: "M0,70 Q300,20 600,70 T1200,70 L1200,150 L0,150 Z" }}
              animate={{
                d: [
                  "M0,70 Q300,20 600,70 T1200,70 L1200,150 L0,150 Z",
                  "M0,70 Q300,120 600,70 T1200,70 L1200,150 L0,150 Z",
                  "M0,70 Q300,20 600,70 T1200,70 L1200,150 L0,150 Z",
                ],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.path
              d="M0,90 Q300,50 600,90 T1200,90 L1200,150 L0,150 Z"
              fill="rgba(184, 115, 51, 0.08)"
              initial={{ d: "M0,90 Q300,50 600,90 T1200,90 L1200,150 L0,150 Z" }}
              animate={{
                d: [
                  "M0,90 Q300,50 600,90 T1200,90 L1200,150 L0,150 Z",
                  "M0,90 Q300,130 600,90 T1200,90 L1200,150 L0,150 Z",
                  "M0,90 Q300,50 600,90 T1200,90 L1200,150 L0,150 Z",
                ],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />
          </svg>
        </motion.div>

        {/* Carousels Section - Bottom 1/3 with snap scroll */}
        <section 
          ref={carouselRef}
          className="fixed left-0 right-0 overflow-y-auto snap-y snap-mandatory"
          style={{
            top: '66.67vh',
            height: '33.33vh',
            background: 'transparent',
            zIndex: 20,
          }}
        >
          {/* Gradient overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, rgba(26, 17, 16, 0.7) 0%, rgba(26, 17, 16, 0.95) 20%, rgba(42, 24, 16, 0.98) 100%)',
              zIndex: -1,
            }}
          />
          {/* Multiple Carousels - each takes full container height */}
          {carouselCategories.map((category, index) => (
            <div
              key={category.id}
              className="snap-start"
              style={{
                height: '33.33vh',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div className="container mx-auto px-6 w-full">
                <ArtworkCarousel
                  artworks={category.artworks}
                  onArtworkHover={handleArtworkHover}
                  title={category.name}
                />
              </div>
            </div>
          ))}

          {/* Call to Action - Final snap section */}
          <div
            className="snap-start"
            style={{
              height: '33.33vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div className="text-center px-6">
              <h3 
                className="text-xl md:text-3xl mb-4"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: '#F5F1E8',
                }}
              >
                Ready to Start Your Collection?
              </h3>
              <a 
                href="/art"
                className="btn btn-primary inline-flex"
              >
                View Full Gallery
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
