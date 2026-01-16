"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import DynamicBackground from "@/components/DynamicBackground";
import ArtGalleryHero from "@/components/ArtGalleryHero";
import ArtworkCarousel from "@/components/ArtworkCarousel";
import Footer from "@/components/sections/footer";
import { artworkData, carouselCategories } from "@/data/artworkData";
import { ArtworkItem } from "@/types/artwork";

export default function ArtGalleryLandingPage() {
  const [selectedArtwork, setSelectedArtwork] = useState<ArtworkItem>(artworkData[0]);

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
      <main className="relative min-h-screen" style={{ background: 'transparent', zIndex: 2 }}>
        <div className="container mx-auto px-4 md:px-6 py-12 lg:py-16">
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-start">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="sticky top-8 self-start"
            >
              <ArtGalleryHero artwork={selectedArtwork} />
            </motion.section>

            <section className="space-y-8 lg:space-y-10">
              {carouselCategories.map((category) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <ArtworkCarousel
                    artworks={category.artworks}
                    onArtworkHover={handleArtworkHover}
                    title={category.name}
                  />
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-md border border-[#B87333]/30 p-6 text-center"
                style={{ background: 'rgba(26, 17, 16, 0.6)', boxShadow: '0 10px 40px rgba(0,0,0,0.35)' }}
              >
                <h3
                  className="text-xl md:text-2xl mb-3"
                  style={{ fontFamily: 'var(--font-heading)', color: '#F5F1E8' }}
                >
                  Ready to start your collection?
                </h3>
                <p className="mb-4" style={{ color: '#B87333' }}>
                  Explore the full gallery, add favorites to your cart, and bring art home.
                </p>
                <a href="/art" className="btn btn-primary inline-flex">
                  View Full Gallery
                </a>
              </motion.div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
