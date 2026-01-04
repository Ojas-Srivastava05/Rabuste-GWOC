'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

const items = [
  { id: '1', img: '/hero/img1.jpeg', title: 'Morning Ritual', category: 'Espresso' },
  { id: '2', img: '/hero/img2.jpeg', title: 'Artisan Space', category: 'Ambiance' },
  { id: '3', img: '/hero/img3.jpeg', title: 'Perfect Pour', category: 'Craft' },
  { id: '4', img: '/hero/img4.jpeg', title: 'Fresh Roast', category: 'Process' },
  { id: '5', img: '/hero/img5.jpeg', title: 'Latte Art', category: 'Craft' },
  { id: '6', img: '/hero/img6.jpeg', title: 'Bean Selection', category: 'Process' },
  { id: '7', img: '/hero/img7.jpeg', title: 'Artisan Craft', category: 'Craft' },
  { id: '8', img: '/hero/img8.jpeg', title: 'Sweet Pairings', category: 'Menu' },
  { id: '9', img: '/hero/img9.jpeg', title: 'Cafe Vibes', category: 'Ambiance' },
  { id: '10', img: '/hero/img10.jpeg', title: 'Golden Hour', category: 'Ambiance' }
];

export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(1);
  const sectionRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
    setIsAutoPlaying(false);
  };

  const nextSlide = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % items.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
    setIsAutoPlaying(false);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <section 
      ref={sectionRef}
      className="section"
      style={{
        background: 'linear-gradient(180deg, #0A0A0A 0%, #141414 100%)',
      }}
    >
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div 
              className="w-12 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, #C9A86A)' }}
            />
            <span 
              className="text-xs uppercase tracking-[0.2em] font-light"
              style={{ color: '#A67C52' }}
            >
              Visual Journey
            </span>
            <div 
              className="w-12 h-px"
              style={{ background: 'linear-gradient(90deg, #C9A86A, transparent)' }}
            />
          </div>

          <h2 
            className="mb-4"
            style={{
              color: '#F5F1E8',
              fontFamily: 'var(--font-heading)',
              fontWeight: 200,
            }}
          >
            Moments
            <br />
            <span className="gradient-text">Captured</span>
          </h2>
        </motion.div>

        {/* Main Carousel */}
        <div className="mb-12">
          {/* Large Image */}
          <div 
            className="relative overflow-hidden rounded-sm premium-border mb-8"
            style={{
              height: 'clamp(400px, 60vh, 700px)',
              background: '#1E1E1E',
              border: '1px solid rgba(201, 168, 106, 0.15)',
            }}
          >
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.4 },
                  scale: { duration: 0.4 },
                }}
                className="absolute inset-0"
              >
                <img
                  src={items[activeIndex].img}
                  alt={items[activeIndex].title}
                  className="w-full h-full object-cover"
                  style={{
                    filter: 'brightness(0.98) contrast(1.05)',
                  }}
                />
                
                {/* Elegant gradient overlay */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(44,24,16,0.4) 100%)',
                  }}
                />

                {/* Info overlay */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="absolute bottom-0 left-0 right-0 p-8 md:p-12"
                >
                  <div className="max-w-4xl">
                    <span 
                      className="text-xs uppercase tracking-[0.2em] mb-3 block"
                      style={{
                        color: '#C9A86A',
                        fontFamily: 'var(--font-accent)',
                      }}
                    >
                      {items[activeIndex].category}
                    </span>
                    <h3 
                      className="text-3xl md:text-5xl font-light"
                      style={{
                        color: '#FFFEF9',
                        fontFamily: 'var(--font-heading)',
                        textShadow: '0 2px 20px rgba(0,0,0,0.5)',
                      }}
                    >
                      {items[activeIndex].title}
                    </h3>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation buttons - elegant */}
            <button
              onClick={prevSlide}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-sm flex items-center justify-center transition-all duration-300 hover:scale-110"
              style={{
                background: 'rgba(10, 10, 10, 0.9)',
                backdropFilter: 'blur(10px)',
                color: '#C9A86A',
                border: '1px solid rgba(201, 168, 106, 0.2)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/>
              </svg>
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-sm flex items-center justify-center transition-all duration-300 hover:scale-110"
              style={{
                background: 'rgba(10, 10, 10, 0.9)',
                backdropFilter: 'blur(10px)',
                color: '#C9A86A',
                border: '1px solid rgba(201, 168, 106, 0.2)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M8 4L14 10L8 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/>
              </svg>
            </button>

            {/* Counter */}
            <div 
              className="absolute top-6 right-6 px-4 py-2 rounded-sm"
              style={{
                background: 'rgba(10, 10, 10, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(201, 168, 106, 0.2)',
              }}
            >
              <span 
                className="text-sm font-light"
                style={{ 
                  color: '#C9A86A',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                {String(activeIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Thumbnails - Premium Grid */}
          <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
            {items.map((item, index) => (
              <motion.button
                key={item.id}
                onClick={() => goToSlide(index)}
                className="relative overflow-hidden rounded-sm premium-border aspect-square"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                style={{
                  background: '#1E1E1E',
                  border: '1px solid rgba(201, 168, 106, 0.1)',
                }}
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover transition-all duration-500"
                  style={{
                    opacity: activeIndex === index ? 1 : 0.4,
                    filter: activeIndex === index ? 'brightness(1) contrast(1.05)' : 'brightness(0.8) grayscale(0.3)',
                  }}
                />
                
                {/* Active indicator */}
                {activeIndex === index && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute inset-0 border-2 rounded-sm"
                    style={{
                      borderColor: '#C9A86A',
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center gap-8">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="btn btn-secondary"
            style={{ minWidth: '160px' }}
          >
            {isAutoPlaying ? (
              <>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="2" y="2" width="4" height="10" fill="currentColor"/>
                  <rect x="8" y="2" width="4" height="10" fill="currentColor"/>
                </svg>
                Pause
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 2L12 7L3 12V2Z" fill="currentColor"/>
                </svg>
                Play
              </>
            )}
          </button>

          <button
            onClick={() => router.push('/art')}
            className="btn btn-primary"
          >
            View Full Gallery
          </button>
        </div>
      </div>
    </section>
  );
}