"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, Minus } from "lucide-react";
import Image from "next/image";

type MenuItem = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
};

interface MenuCategoryCarouselProps {
  title: string;
  items: MenuItem[];
  getQuantity: (id: string) => number;
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  onHover: (item: MenuItem) => void;
  flags?: Record<string, any>;
  hasAIDiscount?: (id: string) => boolean;
  getDiscountedPrice?: (item: MenuItem) => number;
  getOriginalPrice?: (item: MenuItem) => number;
  discountPercent?: number;
}

export default function MenuCategoryCarousel({
  title,
  items,
  getQuantity,
  onAdd,
  onRemove,
  onHover,
  flags,
  hasAIDiscount,
  getDiscountedPrice,
  getOriginalPrice,
  discountPercent,
}: MenuCategoryCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const categoryImages: Record<string, string> = {
    Coffee: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
    Brew: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
    Espresso: "https://images.unsplash.com/photo-1510626176961-4b37d0b4e904?auto=format&fit=crop&w=800&q=80",
    Latte: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=800&q=80",
    Shake: "https://images.unsplash.com/photo-1481391032119-d89fee407e44?auto=format&fit=crop&w=800&q=80",
    Bakery: "https://images.unsplash.com/photo-1481391032119-d89fee407e44?auto=format&fit=crop&w=800&q=80",
    Dessert: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    Sandwich: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80",
    Default: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
  };

  const getFallbackImage = (category: string | undefined) => {
    if (!category) return categoryImages.Default;
    return categoryImages[category as keyof typeof categoryImages] || categoryImages.Default;
  };

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
    <div className="mb-8">
      {/* Category Header */}
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <div>
          <h2
            className="text-lg md:text-2xl mb-1"
            style={{
              fontFamily: 'var(--font-heading)',
              color: '#F5F1E8',
              letterSpacing: '0.05em',
            }}
          >
            {title}
          </h2>
          <div 
            className="w-16 h-px"
            style={{ background: 'linear-gradient(90deg, #B87333, transparent)' }}
          />
        </div>

        {/* Scroll Buttons */}
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

      {/* Carousel Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-2 md:gap-4 overflow-x-auto snap-x snap-mandatory pb-4"
        style={{
          scrollBehavior: 'smooth',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        } as React.CSSProperties & { scrollbarWidth?: string; msOverflowStyle?: string }}
      >
        {items.map((item) => {
          const quantity = getQuantity(item._id);
          const hasDiscount = hasAIDiscount?.(item._id);
          const discountedPrice = getDiscountedPrice?.(item);
          const originalPrice = getOriginalPrice?.(item);
          const fallbackImage = getFallbackImage(item.category);

          return (
            <motion.div
              key={item._id}
              className="flex-shrink-0 snap-center cursor-pointer"
              onMouseEnter={() => onHover(item)}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="group relative overflow-hidden"
                style={{
                  width: '140px',
                  height: '140px',
                  borderRadius: '50%',
                  border: '2px solid rgba(184, 115, 51, 0.3)',
                  background: 'rgba(61, 43, 31, 0.4)',
                }}
              >
                <Image
                  src={item.image || fallbackImage}
                  alt={item.name}
                  fill
                  sizes="140px"
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (target.src !== fallbackImage) {
                      target.src = fallbackImage;
                    }
                  }}
                />

                {/* Overlay on hover */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(184, 115, 51, 0.4), rgba(205, 127, 50, 0.4))',
                  }}
                >
                  {quantity > 0 ? (
                    <div
                      className="flex items-center gap-2"
                      style={{
                        background: 'rgba(184, 115, 51, 0.3)',
                        padding: '6px 12px',
                        border: '1px solid rgba(184, 115, 51, 0.6)',
                        borderRadius: '8px',
                      }}
                    >
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemove(item._id);
                        }} 
                        className="text-[#B87333] active:scale-95 transition-transform"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-sm font-bold gradient-text" style={{ minWidth: '20px', textAlign: 'center' }}>
                        {quantity}
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onAdd(item._id);
                        }} 
                        className="text-[#B87333] active:scale-95 transition-transform"
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
                        background: 'rgba(184, 115, 51, 0.3)',
                        border: '1px solid rgba(184, 115, 51, 0.6)',
                        color: '#D4A574',
                        fontFamily: 'var(--font-body)',
                        borderRadius: '8px',
                      }}
                    >
                      <Plus size={14} />
                      ADD
                    </button>
                  )}
                </div>
              </div>

              {/* Item Name Only */}
              <div className="mt-3">
                <p 
                  className="text-center text-xs font-medium truncate"
                  style={{ 
                    color: '#F5F1E8',
                    fontFamily: 'var(--font-heading)',
                    maxWidth: '140px',
                  }}
                  title={item.name}
                >
                  {item.name}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
