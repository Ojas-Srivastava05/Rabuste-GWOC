'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowRight, Coffee, Sparkles, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Balatro from '../bg';

export default function HeroRevamped() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
    const timer = setTimeout(() => setIsLoaded(true), 100);
    
    // Image carousel
    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % 9);
    }, 4000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(imageInterval);
    };
  }, []);

  const heroImages = Array.from({ length: 9 }, (_, i) => `/hero/img${i + 1}.jpeg`);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ 
        background: 'transparent',
        paddingTop: '0',
        marginTop: '0',
        scrollMarginTop: '0'
      }}
    >
      {/* Balatro Background Effect */}
      <Balatro />
      
      {/* Curtain Reveal */}
      <motion.div
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(180deg, #000000 0%, #0a0a0a 100%)',
          transformOrigin: 'top', zIndex: 100, pointerEvents: 'none',
        }}
      />

      {/* Modern Split Background with Coffee Images */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Left side - Coffee Image Carousel */}
        <motion.div
          className="absolute left-0 top-0 bottom-0 w-full lg:w-1/2"
          style={{ scale }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0"
            >
              <div className="relative w-full h-full">
                <Image
                  src={heroImages[currentImageIndex]}
                  alt="Rabuste Coffee"
                  fill
                  className="object-cover"
                  priority={currentImageIndex === 0}
                  quality={90}
                />
                {/* Gradient overlay for text readability */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.6) 100%)',
                  }}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Right side - Gradient Background */}
        <div 
          className="absolute right-0 top-0 bottom-0 w-full lg:w-1/2 hidden lg:block"
          style={{
            background: 'linear-gradient(135deg, #1A1110 0%, #2B1810 50%, #1A1110 100%)',
          }}
        />

        {/* Subtle animated gradient orbs */}
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl hidden lg:block"
          style={{
            background: 'radial-gradient(circle, rgba(184, 115, 51, 0.6) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Content Container */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        style={{ opacity, y }}
        className="relative z-10 w-full max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-16"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center min-h-screen py-12 lg:py-20">
          
          {/* Left Column - Content */}
          <div className="lg:order-2 flex flex-col justify-center space-y-6 sm:space-y-8 lg:space-y-10">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full w-fit"
              style={{
                background: 'rgba(184, 115, 51, 0.15)',
                border: '1px solid rgba(212, 165, 116, 0.3)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Coffee size={16} style={{ color: '#D4A574' }} />
              <span style={{ 
                fontFamily: 'var(--font-heading)', 
                fontSize: '0.75rem', 
                color: '#D4A574', 
                letterSpacing: '0.2em',
                fontWeight: 600,
              }}>
                PREMIUM ROBUSTA
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4"
            >
              <h1 
                style={{ 
                  fontFamily: 'var(--font-heading)', 
                  fontSize: 'clamp(4rem, 10vw, 8rem)', 
                  lineHeight: 0.9, 
                  letterSpacing: '-0.02em', 
                  fontWeight: 400,
                  color: '#FFFEF9',
                  textTransform: 'uppercase',
                }}
              >
                <span style={{ 
                  display: 'block',
                  background: 'linear-gradient(135deg, #FFFEF9 0%, #D4A574 50%, #FFFEF9 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  RABUSTE
                </span>
              </h1>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.1 }}
                className="flex items-center gap-3"
              >
                <div className="h-px w-12" style={{
                  background: 'linear-gradient(90deg, #D4A574, transparent)',
                }} />
                <p 
                  style={{ 
                    fontFamily: 'var(--font-heading)', 
                    fontSize: 'clamp(1rem, 2vw, 1.5rem)', 
                    color: '#D4A574', 
                    letterSpacing: '0.2em',
                    fontWeight: 400,
                  }}
                >
                  UNAPOLOGETICALLY BOLD
                </p>
              </motion.div>
            </motion.div>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ 
                fontSize: 'clamp(1rem, 1.5vw, 1.25rem)', 
                color: 'rgba(255, 254, 249, 0.85)', 
                lineHeight: 1.8, 
                maxWidth: '540px',
                fontFamily: 'var(--font-body)',
                fontWeight: 300,
              }}
            >
              <span style={{ color: '#D4A574', fontWeight: 500 }}>Double the caffeine.</span> Zero compromise. 
              Premium robusta for those who demand more from every cup.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              {/* Primary CTA */}
              <motion.button
                onClick={() => router.push('/menu')}
                className="group relative overflow-hidden"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: '18px 40px',
                  background: 'linear-gradient(135deg, #B87333 0%, #CD7F32 50%, #D4A574 100%)',
                  color: '#000000',
                  fontSize: 'clamp(0.875rem, 1.2vw, 1rem)',
                  letterSpacing: '0.15em',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-heading)',
                  boxShadow: '0 8px 32px rgba(184, 115, 51, 0.4)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 12px 48px rgba(184, 115, 51, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(184, 115, 51, 0.4)';
                }}
              >
                <span className="flex items-center justify-center gap-3 relative z-10">
                  Explore Menu
                  <ArrowRight size={18} />
                </span>
                
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    x: ['-100%', '200%'],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                    width: '50%',
                  }}
                />
              </motion.button>

              {/* Secondary CTA */}
              <motion.button
                onClick={() => {
                  window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
                }}
                className="group relative overflow-hidden"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: '18px 40px',
                  background: 'rgba(184, 115, 51, 0.1)',
                  color: '#FFFEF9',
                  fontSize: 'clamp(0.875rem, 1.2vw, 1rem)',
                  letterSpacing: '0.15em',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  border: '1px solid rgba(212, 165, 116, 0.4)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-heading)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(184, 115, 51, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(212, 165, 116, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(184, 115, 51, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(212, 165, 116, 0.4)';
                }}
              >
                <span className="flex items-center justify-center gap-3 relative z-10">
                  Learn More
                  <Sparkles size={18} style={{ color: '#D4A574' }} />
                </span>
              </motion.button>
            </motion.div>

            {/* Stats/Features */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap gap-8 pt-4"
            >
              {[
                { label: '2X', sublabel: 'Caffeine' },
                { label: '100%', sublabel: 'Robusta' },
                { label: 'Premium', sublabel: 'Quality' }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.8 + i * 0.1 }}
                  className="flex flex-col"
                >
                  <span style={{ 
                    fontFamily: 'var(--font-heading)', 
                    fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', 
                    color: '#D4A574', 
                    fontWeight: 400,
                    lineHeight: 1,
                  }}>
                    {stat.label}
                  </span>
                  <span style={{ 
                    fontFamily: 'var(--font-body)', 
                    fontSize: 'clamp(0.75rem, 1vw, 0.875rem)', 
                    color: 'rgba(255, 254, 249, 0.6)', 
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginTop: '4px',
                  }}>
                    {stat.sublabel}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right Column - Coffee Image (Desktop) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:order-1 relative h-[400px] sm:h-[500px] lg:h-[600px] xl:h-[700px] rounded-2xl lg:rounded-3xl overflow-hidden hidden lg:block"
            style={{
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(212, 165, 116, 0.1)',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={heroImages[currentImageIndex]}
                  alt="Rabuste Coffee"
                  fill
                  className="object-cover"
                  priority={currentImageIndex === 0}
                  quality={90}
                />
                {/* Subtle overlay */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.1) 100%)',
                  }}
                />
              </motion.div>
            </AnimatePresence>
            
            {/* Image indicator dots */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
              {heroImages.slice(0, 3).map((_, i) => (
                <motion.button
                  key={i}
                  className="w-2 h-2 rounded-full cursor-pointer focus:outline-none transition-all"
                  style={{
                    background: currentImageIndex % 3 === i ? '#D4A574' : 'rgba(255, 255, 255, 0.3)',
                  }}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentImageIndex(i)}
                  aria-label={`View image ${i + 1}`}
                />
              ))}
            </div>
          </motion.div>

          {/* Mobile Image Display */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-[350px] sm:h-[450px] rounded-2xl overflow-hidden lg:hidden order-first"
            style={{
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(212, 165, 116, 0.1)',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={heroImages[currentImageIndex]}
                  alt="Rabuste Coffee"
                  fill
                  className="object-cover"
                  priority={currentImageIndex === 0}
                  quality={90}
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 hidden lg:block"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 cursor-pointer"
          onClick={() => {
            window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
          }}
        >
          <span style={{ 
            fontFamily: 'var(--font-body)', 
            fontSize: '0.75rem', 
            color: 'rgba(255, 254, 249, 0.6)', 
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}>
            Scroll
          </span>
          <ChevronDown size={20} style={{ color: 'rgba(212, 165, 116, 0.6)' }} />
        </motion.div>
      </motion.div>

      {/* Subtle grid overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute inset-0 pointer-events-none opacity-[0.02] hidden lg:block" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(184, 115, 51, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(184, 115, 51, 0.3) 1px, transparent 1px)', 
          backgroundSize: '60px 60px' 
        }} 
      />
    </section>
  );
}