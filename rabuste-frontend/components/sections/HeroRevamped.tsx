'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, 
  Sparkles, 
  ChevronDown,
  Zap,
  Coffee,
  TrendingUp
} from 'lucide-react';
import Balatro from '../bg';

export default function HeroRevamped() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
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
    
    // Ensure video plays after mount
    if (isMounted && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay was prevented, user interaction required
      });
    }
    
    return () => {
      clearTimeout(timer);
    };
  }, [isMounted]);

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

      {/* Video Background - Full Width */}
      {isMounted && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="relative w-full h-full"
            style={{ scale }}
          >
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                filter: 'brightness(0.85) contrast(1.1)',
              }}
            >
              <source src="/gallery/herocafe.mp4" type="video/mp4" />
            </video>
            
            {/* Premium gradient overlays */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 30%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.6) 100%)',
              }}
            />
            
            {/* Copper accent gradient overlay */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                background: 'linear-gradient(135deg, rgba(184, 115, 51, 0.1) 0%, transparent 50%, rgba(184, 115, 51, 0.15) 100%)',
              }}
            />
          </motion.div>
        </div>
      )}

      {/* Fallback background for SSR */}
      {!isMounted && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, #1A1110 0%, #2B1810 50%, #1A1110 100%)',
          }}
        />
      )}

      {/* Animated gradient orbs */}
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
          <div className="flex flex-col justify-center space-y-6 sm:space-y-8 lg:space-y-10">
            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4"
            >
              <h1 
                style={{ 
                  fontFamily: 'var(--font-heading)', 
                  fontSize: 'clamp(4rem, 12vw, 10rem)', 
                  lineHeight: 0.85, 
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
                  textShadow: '0 0 80px rgba(212, 165, 116, 0.3)',
                }}>
                  RABUSTE
                </span>
              </h1>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="flex items-center gap-3"
              >
                <div className="h-px w-16" style={{
                  background: 'linear-gradient(90deg, #D4A574, transparent)',
                }} />
                <p 
                  style={{ 
                    fontFamily: 'var(--font-heading)', 
                    fontSize: 'clamp(1.25rem, 2.5vw, 2rem)', 
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
              transition={{ duration: 0.8, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
              style={{ 
                fontSize: 'clamp(1.125rem, 2vw, 1.5rem)', 
                color: 'rgba(255, 254, 249, 0.9)', 
                lineHeight: 1.8, 
                maxWidth: '600px',
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
              transition={{ duration: 0.8, delay: 1.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              {/* Primary CTA */}
              <motion.button
                onClick={() => router.push('/menu')}
                className="group relative overflow-hidden"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: '20px 48px',
                  background: 'linear-gradient(135deg, #B87333 0%, #CD7F32 50%, #D4A574 100%)',
                  color: '#000000',
                  fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
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
                  <ArrowRight size={20} />
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
                  padding: '20px 48px',
                  background: 'rgba(184, 115, 51, 0.15)',
                  color: '#FFFEF9',
                  fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
                  letterSpacing: '0.15em',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  border: '2px solid rgba(212, 165, 116, 0.5)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-heading)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(184, 115, 51, 0.25)';
                  e.currentTarget.style.borderColor = 'rgba(212, 165, 116, 0.8)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(184, 115, 51, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(212, 165, 116, 0.5)';
                }}
              >
                <span className="flex items-center justify-center gap-3 relative z-10">
                  Learn More
                  <Sparkles size={20} style={{ color: '#D4A574' }} />
                </span>
              </motion.button>
            </motion.div>

            {/* Stats/Features */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap gap-8 pt-4"
            >
              {[
                { label: '2X', sublabel: 'Caffeine', icon: Zap },
                { label: '100%', sublabel: 'Robusta', icon: Coffee },
                { label: 'Premium', sublabel: 'Quality', icon: TrendingUp }
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.6 + i * 0.1 }}
                    className="flex items-center gap-3 group"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div 
                      className="p-3 rounded-xl transition-all duration-300"
                      style={{
                        background: 'rgba(184, 115, 51, 0.2)',
                        border: '1px solid rgba(212, 165, 116, 0.3)',
                      }}
                    >
                      <Icon size={24} style={{ color: '#D4A574' }} />
                    </div>
                    <div className="flex flex-col">
                      <span style={{ 
                        fontFamily: 'var(--font-heading)', 
                        fontSize: 'clamp(1.75rem, 4vw, 3rem)', 
                        color: '#D4A574', 
                        fontWeight: 400,
                        lineHeight: 1,
                      }}>
                        {stat.label}
                      </span>
                      <span style={{ 
                        fontFamily: 'var(--font-body)', 
                        fontSize: 'clamp(0.75rem, 1.2vw, 0.875rem)', 
                        color: 'rgba(255, 254, 249, 0.7)', 
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        marginTop: '4px',
                      }}>
                        {stat.sublabel}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Right Column - Video */}
          {isMounted && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-[400px] sm:h-[500px] lg:h-[600px] xl:h-[700px] rounded-2xl lg:rounded-3xl overflow-hidden hidden lg:block"
              style={{
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(212, 165, 116, 0.1)',
              }}
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  filter: 'brightness(0.9) contrast(1.05)',
                }}
              >
                <source src="/gallery/Screen Recording 2026-01-16 at 11.18.48 PM.mov" type="video/quicktime" />
              </video>
              
              {/* Subtle overlay for depth */}
              <div 
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.1) 100%)',
                }}
              />
              
              {/* Copper accent border glow */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  boxShadow: 'inset 0 0 0 2px rgba(184, 115, 51, 0.2)',
                  borderRadius: 'inherit',
                }}
              />
            </motion.div>
          )}
          
          {/* Fallback for SSR */}
          {!isMounted && (
            <div 
              className="relative h-[400px] sm:h-[500px] lg:h-[600px] xl:h-[700px] rounded-2xl lg:rounded-3xl overflow-hidden hidden lg:block"
              style={{
                background: 'linear-gradient(135deg, rgba(26, 17, 16, 0.8), rgba(43, 24, 16, 0.6))',
                border: '2px solid rgba(184, 115, 51, 0.3)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
              }}
            />
          )}
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
