"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Star } from "lucide-react";
import { ArtworkItem } from "@/types/artwork";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface ArtGalleryHeroProps {
  artwork: ArtworkItem;
}

export default function ArtGalleryHero({ artwork }: ArtGalleryHeroProps) {
  const router = useRouter();

  const handleBuyNow = () => {
    // Add to cart logic would go here
    router.push('/cart');
  };

  return (
    <div className="h-full flex items-center relative overflow-hidden pt-24 md:pt-28 lg:pt-32">
      {/* Background gradient with splash effect */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(circle at 70% 50%, rgba(184, 115, 51, 0.2) 0%, transparent 50%)',
        }}
      />
      
      <div className="container mx-auto px-6 py-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.p
              className="section-label mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Discover Art
            </motion.p>

            <motion.h1
              className="mb-3"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2rem, 6vw, 4rem)',
                lineHeight: '0.9',
                color: '#F5F1E8',
                textTransform: 'uppercase',
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Order your
            </motion.h1>

            <AnimatePresence mode="wait">
              <motion.h2
                key={artwork.id}
                className="mb-4 gradient-text"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
                  lineHeight: '0.9',
                  textTransform: 'uppercase',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                Favourite Artworks
              </motion.h2>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.p
                key={`desc-${artwork.id}`}
                className="text-sm md:text-base mb-4"
                style={{
                  color: '#F5F1E8',
                  fontFamily: 'var(--font-body)',
                  lineHeight: '1.6',
                  maxWidth: '450px',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {artwork.description}
              </motion.p>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={`offer-${artwork.id}`}
                className="mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
              >
                <p 
                  className="text-lg md:text-xl"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: '#F5F1E8',
                  }}
                >
                  Today&apos;s Special:{' '}
                  <span style={{ color: '#B87333' }}>20% Off</span> on all{' '}
                  <span 
                    className="gradient-text"
                    style={{ 
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.1em',
                    }}
                  >
                    {artwork.category}s!
                  </span>
                </p>
              </motion.div>
            </AnimatePresence>

            <motion.button
              className="btn btn-primary group"
              onClick={handleBuyNow}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <ShoppingBag style={{ width: 20, height: 20 }} />
              <span>Buy now</span>
            </motion.button>

            {/* Artist Info */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`artist-${artwork.id}`}
                className="mt-4 pt-4"
                style={{ borderTop: '1px solid rgba(184, 115, 51, 0.2)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p 
                  className="text-xs mb-1"
                  style={{ 
                    color: '#B87333',
                    fontFamily: 'var(--font-body)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}
                >
                  Artist
                </p>
                <p 
                  className="text-base"
                  style={{ 
                    color: '#F5F1E8',
                    fontFamily: 'var(--font-heading)',
                  }}
                >
                  {artwork.artist}
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Right Side - Artwork Display */}
          <motion.div
            className="relative flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={artwork.id}
                className="relative"
                initial={{ opacity: 0, rotate: -5, scale: 0.9 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 5, scale: 0.9 }}
                transition={{ duration: 0.6 }}
              >
                {/* Circular frame with glow */}
                <div 
                  className="relative"
                  style={{
                    width: 'clamp(250px, 35vw, 350px)',
                    height: 'clamp(250px, 35vw, 350px)',
                  }}
                >
                  {/* Outer glow */}
                  <div
                    className="absolute inset-0"
                    style={{
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(184, 115, 51, 0.3) 0%, transparent 70%)',
                      filter: 'blur(20px)',
                      transform: 'scale(1.1)',
                    }}
                  />
                  
                  {/* Main circular image */}
                  <div
                    className="relative overflow-hidden"
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      border: '4px solid rgba(184, 115, 51, 0.4)',
                      boxShadow: '0 15px 45px rgba(0, 0, 0, 0.6)',
                    }}
                  >
                    <Image
                      src={artwork.imageUrl}
                      alt={artwork.title}
                      fill
                      sizes="(max-width: 768px) 250px, 350px"
                      className="object-cover"
                      priority
                    />
                  </div>

                  {/* Price tag */}
                  <motion.div
                    className="absolute bottom-0 right-0"
                    style={{
                      background: 'linear-gradient(135deg, #B87333 0%, #CD7F32 50%, #D4A574 100%)',
                      borderRadius: '16px',
                      padding: '12px 20px',
                      boxShadow: '0 8px 24px rgba(184, 115, 51, 0.4)',
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                  >
                    <p 
                      className="text-base font-bold mb-1"
                      style={{ 
                        color: '#000000',
                        fontFamily: 'var(--font-heading)',
                      }}
                    >
                      {artwork.title}
                    </p>
                    <div className="flex items-center justify-between gap-3">
                      <p 
                        className="text-xl font-bold"
                        style={{ 
                          color: '#000000',
                          fontFamily: 'var(--font-heading)',
                        }}
                      >
                        ${artwork.price}
                      </p>
                      <div className="flex items-center gap-1">
                        <Star 
                          style={{ 
                            width: 14, 
                            height: 14, 
                            fill: '#000000',
                            color: '#000000',
                          }} 
                        />
                        <span 
                          className="text-xs font-bold"
                          style={{ color: '#000000' }}
                        >
                          {artwork.rating}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
