"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ArtworkItem } from "@/types/artwork";
import Image from "next/image";

interface ArtworkCarouselProps {
  artworks: ArtworkItem[];
  onArtworkHover: (artwork: ArtworkItem) => void;
  title: string;
}

export default function ArtworkCarousel({ artworks, onArtworkHover, title }: ArtworkCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 
          className="text-xl md:text-2xl uppercase tracking-wider"
          style={{ 
            fontFamily: 'var(--font-heading)',
            color: '#F5F1E8'
          }}
        >
          {title}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full border-2 transition-all"
            style={{
              borderColor: 'rgba(184, 115, 51, 0.4)',
              background: 'rgba(61, 43, 31, 0.6)',
              backdropFilter: 'blur(10px)',
            }}
            aria-label="Scroll left"
          >
            <ChevronLeft style={{ width: 18, height: 18, color: '#B87333' }} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full border-2 transition-all"
            style={{
              borderColor: 'rgba(184, 115, 51, 0.4)',
              background: 'rgba(61, 43, 31, 0.6)',
              backdropFilter: 'blur(10px)',
            }}
            aria-label="Scroll right"
          >
            <ChevronRight style={{ width: 18, height: 18, color: '#B87333' }} />
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2"
        style={{
          scrollBehavior: 'smooth',
        }}
      >
        {artworks.map((artwork) => (
          <motion.div
            key={artwork.id}
            className="flex-shrink-0 snap-center cursor-pointer"
            onMouseEnter={() => onArtworkHover(artwork)}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="relative overflow-hidden"
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                border: '3px solid rgba(184, 115, 51, 0.3)',
                background: 'rgba(61, 43, 31, 0.4)',
              }}
            >
              <Image
                src={artwork.imageUrl}
                alt={artwork.title}
                fill
                sizes="100px"
                className="object-cover"
                style={{ borderRadius: '50%' }}
              />
              <div 
                className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(184, 115, 51, 0.3), rgba(205, 127, 50, 0.3))',
                  borderRadius: '50%',
                }}
              />
            </div>
            <p 
              className="text-center mt-2 text-xs"
              style={{ 
                color: '#F5F1E8',
                fontFamily: 'var(--font-body)',
              }}
            >
              {artwork.title}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
