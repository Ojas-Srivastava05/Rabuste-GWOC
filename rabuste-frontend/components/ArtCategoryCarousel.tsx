"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, Minus } from "lucide-react";
import Image from "next/image";

type ArtItem = {
  _id: string;
  title: string;
  artist: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  medium?: string;
  dimensions?: string;
  year?: number;
  stock: number;
};

interface ArtCategoryCarouselProps {
  title: string;
  items: ArtItem[];
  getQuantity: (id: string) => number;
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  onView: (item: ArtItem) => void;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=60";

export default function ArtCategoryCarousel({
  title,
  items,
  getQuantity,
  onAdd,
  onRemove,
  onView,
}: ArtCategoryCarouselProps) {
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
    <div className="mb-6 md:mb-8 lg:mb-10">
      {/* Category Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2
            className="text-xl md:text-2xl mb-1"
            style={{
              fontFamily: "var(--font-heading)",
              color: "#F5F1E8",
              letterSpacing: "0.05em",
            }}
          >
            {title}
          </h2>
          <div
            className="w-16 h-px"
            style={{ background: "linear-gradient(90deg, #B87333, transparent)" }}
          />
        </div>

        {/* Scroll Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full border-2 transition-all"
            style={{
              borderColor: "rgba(184, 115, 51, 0.4)",
              background: "rgba(61, 43, 31, 0.6)",
              backdropFilter: "blur(10px)",
            }}
            aria-label="Scroll left"
          >
            <ChevronLeft style={{ width: 18, height: 18, color: "#B87333" }} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full border-2 transition-all"
            style={{
              borderColor: "rgba(184, 115, 51, 0.4)",
              background: "rgba(61, 43, 31, 0.6)",
              backdropFilter: "blur(10px)",
            }}
            aria-label="Scroll right"
          >
            <ChevronRight style={{ width: 18, height: 18, color: "#B87333" }} />
          </button>
        </div>
      </div>

      {/* Carousel Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-2 md:gap-4 overflow-x-auto snap-x snap-mandatory pb-4"
        style={{
          scrollBehavior: "smooth",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        } as React.CSSProperties & { scrollbarWidth?: string; msOverflowStyle?: string }}
      >
        {items.map((item) => {
          const quantity = getQuantity(item._id);
          const coverImage = item.images?.[0] || FALLBACK_IMAGE;

          return (
            <motion.div
              key={item._id}
              className="flex-shrink-0 snap-center cursor-pointer"
              onClick={() => onView(item)}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="group relative overflow-hidden"
                style={{
                  width: "140px",
                  height: "140px",
                  borderRadius: "50%",
                  border: "2px solid rgba(184, 115, 51, 0.3)",
                  background: "rgba(61, 43, 31, 0.4)",
                }}
              >
                <Image
                  src={coverImage}
                  alt={item.title}
                  fill
                  sizes="140px"
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (target.src !== FALLBACK_IMAGE) {
                      target.src = FALLBACK_IMAGE;
                    }
                  }}
                />

                {/* Overlay on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, rgba(184, 115, 51, 0.4), rgba(205, 127, 50, 0.4))",
                  }}
                >
                  {item.stock > 0 ? (
                    quantity > 0 ? (
                      <div
                        className="flex items-center gap-2"
                        style={{
                          background: "rgba(184, 115, 51, 0.3)",
                          padding: "6px 12px",
                          border: "1px solid rgba(184, 115, 51, 0.6)",
                          borderRadius: "8px",
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => onRemove(item._id)}
                          className="text-[#B87333] active:scale-95 transition-transform"
                          aria-label="Remove"
                        >
                          <Minus size={16} />
                        </button>
                        <span
                          className="text-sm font-bold gradient-text"
                          style={{ minWidth: "20px", textAlign: "center" }}
                        >
                          {quantity}
                        </span>
                        <button
                          onClick={() => onAdd(item._id)}
                          className="text-[#B87333] active:scale-95 transition-transform"
                          aria-label="Add"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAdd(item._id);
                        }}
                        className="px-4 py-2 text-sm flex items-center gap-2"
                        style={{
                          background: "rgba(184, 115, 51, 0.3)",
                          border: "1px solid rgba(184, 115, 51, 0.6)",
                          color: "#D4A574",
                          fontFamily: "var(--font-body)",
                          borderRadius: "8px",
                        }}
                      >
                        <Plus size={14} />
                        ADD
                      </button>
                    )
                  ) : (
                    <span
                      className="text-xs px-3 py-1 uppercase tracking-wider"
                      style={{
                        color: "#FF6B6B",
                        background: "rgba(220, 38, 38, 0.15)",
                        border: "1px solid rgba(220, 38, 38, 0.4)",
                        borderRadius: "8px",
                      }}
                    >
                      Sold Out
                    </span>
                  )}
                </div>
              </div>

              {/* Item Name */}
              <div className="mt-3">
                <p
                  className="text-center text-xs font-medium truncate"
                  style={{
                    color: "#F5F1E8",
                    fontFamily: "var(--font-heading)",
                    maxWidth: "140px",
                  }}
                  title={item.title}
                >
                  {item.title}
                </p>
                <p
                  className="text-center text-[11px] text-[#B87333] truncate"
                  style={{ maxWidth: "140px" }}
                  title={item.artist}
                >
                  {item.artist}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
