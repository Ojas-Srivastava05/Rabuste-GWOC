'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Zap, Award, Brain, Sparkles, ArrowRight, Coffee, TrendingUp } from 'lucide-react';
import Balatro from '../bg';

export default function HeroRevamped() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);

  useEffect(() => {
    // Ensure page starts at top on initial load
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

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

      {/* Premium Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Animated gradient orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(184, 115, 51, 0.4) 0%, transparent 70%)',
          }}
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, -60, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(205, 127, 50, 0.4) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Premium Decorative Lines */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-1/2 left-0 right-0 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(184, 115, 51, 0.3) 20%, rgba(212, 165, 116, 0.5) 50%, rgba(184, 115, 51, 0.3) 80%, transparent 100%)',
          }}
        />
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.5, delay: 1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-0 bottom-0 left-1/2 w-px"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, rgba(184, 115, 51, 0.2) 50%, transparent 100%)',
          }}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        style={{ opacity, y }}
        className="relative z-10 w-full flex justify-center items-center"
      >
        {/* INNER WRAPPER */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 xl:gap-24 max-w-[1400px] px-6 w-full">
          
          {/* CONTAINER 1: THE LOGO/CUP - Enhanced */}
          <div className="flex-shrink-0 flex items-center justify-center relative">
            {/* Glowing ring around logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(184, 115, 51, 0.3) 0%, transparent 70%)',
                filter: 'blur(40px)',
                width: '120%',
                height: '120%',
                margin: '-10%',
              }}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.8, rotate: isLoaded ? 0 : -10 }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.8 }}
              className="relative w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] lg:w-[480px] lg:h-[480px]"
            >
              {/* Pulsing glow effect */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(212, 165, 116, 0.4) 0%, transparent 70%)',
                  filter: 'blur(30px)',
                }}
              />
              
              <div
                aria-label="Rabuste Coffee"
                className="w-full h-full relative z-10"
                style={{
                  backgroundColor: '#D4A574',
                  WebkitMaskImage: 'url("/Rabuste%20logo.png")',
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  WebkitMaskSize: 'contain',
                  maskImage: 'url("/Rabuste%20logo.png")',
                  maskRepeat: 'no-repeat',
                  maskPosition: 'center',
                  maskSize: 'contain',
                  opacity: 1,
                  filter: 'drop-shadow(0 0 30px rgba(212, 165, 116, 0.6))',
                }}
              />
            </motion.div>
          </div>

          {/* CONTAINER 2: THE CONTENT - Premium Enhanced */}
          <div className="flex-shrink-0 max-w-[600px] w-full">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: isLoaded ? 1 : 0, x: isLoaded ? 0 : 30 }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
              className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 lg:space-y-10"
            >
              {/* Premium Badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                style={{
                  background: 'linear-gradient(135deg, rgba(184, 115, 51, 0.2), rgba(205, 127, 50, 0.2))',
                  border: '1px solid rgba(184, 115, 51, 0.4)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <TrendingUp size={16} style={{ color: '#D4A574' }} />
                <span style={{ 
                  fontFamily: 'var(--font-heading)', 
                  fontSize: '0.75rem', 
                  color: '#D4A574', 
                  letterSpacing: '0.15em',
                  fontWeight: 600,
                }}>
                  PREMIUM ROBUSTA
                </span>
              </motion.div>

              {/* Main Heading - Bold & Premium */}
              <div className="space-y-4">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 1 }}
                  style={{ 
                    fontFamily: 'var(--font-heading)', 
                    fontSize: 'clamp(5rem, 12vw, 9rem)', 
                    lineHeight: 0.85, 
                    letterSpacing: '0.02em', 
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #FFFEF9 0%, #D4A574 50%, #FFFEF9 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textShadow: '0 0 80px rgba(212, 165, 116, 0.3)',
                    position: 'relative',
                  }}
                >
                  RABUSTE
                  {/* Glow effect behind text */}
                  <motion.span
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 blur-2xl"
                    style={{
                      background: 'linear-gradient(135deg, #D4A574, #B87333)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      zIndex: -1,
                    }}
                  >
                    RABUSTE
                  </motion.span>
                </motion.h1>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  className="flex items-center gap-4"
                >
                  <div className="h-px flex-1" style={{
                    background: 'linear-gradient(90deg, transparent, rgba(184, 115, 51, 0.5), transparent)',
                  }} />
                  <motion.p 
                    style={{ 
                      fontFamily: 'var(--font-heading)', 
                      fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)', 
                      color: '#D4A574', 
                      letterSpacing: '0.25em',
                      fontWeight: 600,
                      textShadow: '0 0 20px rgba(212, 165, 116, 0.4)',
                    }}
                  >
                    UNAPOLOGETICALLY BOLD
                  </motion.p>
                  <div className="h-px flex-1" style={{
                    background: 'linear-gradient(90deg, transparent, rgba(184, 115, 51, 0.5), transparent)',
                  }} />
                </motion.div>
              </div>

              {/* Premium Description */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                style={{ 
                  fontSize: 'clamp(1.125rem, 1.5vw, 1.375rem)', 
                  color: 'rgba(255, 254, 249, 0.9)', 
                  lineHeight: 1.7, 
                  maxWidth: '520px',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 300,
                }}
              >
                <span style={{ color: '#D4A574', fontWeight: 600 }}>Double the caffeine.</span> Zero compromise. Premium robusta for those who demand more from every cup.
              </motion.p>

              {/* Enhanced Feature Badges */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.6 }}
                className="flex flex-wrap justify-center lg:justify-start gap-4 lg:gap-6"
              >
                {[
                  { icon: <Zap size={24} />, text: '2X CAFFEINE', color: '#FFB74D' },
                  { icon: <Award size={24} />, text: '100% ROBUSTA', color: '#D4A574' },
                  { icon: <Coffee size={24} />, text: 'PREMIUM QUALITY', color: '#CD7F32' }
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.7 + i * 0.1 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="flex items-center gap-3 group cursor-default"
                  >
                    <motion.div 
                      className="w-14 h-14 rounded-full flex items-center justify-center relative overflow-hidden"
                      style={{ 
                        background: `linear-gradient(135deg, rgba(184, 115, 51, 0.25), rgba(205, 127, 50, 0.25))`,
                        border: `2px solid ${stat.color}`,
                        boxShadow: `0 0 20px ${stat.color}40`,
                      }}
                      whileHover={{ 
                        boxShadow: `0 0 30px ${stat.color}60`,
                      }}
                    >
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 opacity-20"
                        style={{
                          background: `conic-gradient(from 0deg, transparent, ${stat.color}, transparent)`,
                        }}
                      />
                      <div className="relative z-10" style={{ color: stat.color }}>
                        {stat.icon}
                      </div>
                    </motion.div>
                    <span style={{ 
                      fontFamily: 'var(--font-heading)', 
                      fontSize: 'clamp(0.875rem, 1.2vw, 1rem)', 
                      color: '#FFFEF9', 
                      letterSpacing: '0.12em',
                      fontWeight: 600,
                    }}>
                      {stat.text}
                    </span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Premium CTA Buttons Container */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 2 }}
                className="flex flex-col gap-5 w-full max-w-[480px]"
              >
                {/* AI Feature Badge - Enhanced */}
                <motion.div
                  className="relative group cursor-pointer w-full"
                  onClick={() => {
                    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    className="relative overflow-hidden transition-all duration-300 w-full"
                    style={{
                      padding: '20px 32px',
                      background: 'linear-gradient(135deg, rgba(184, 115, 51, 0.25), rgba(205, 127, 50, 0.25))',
                      border: '2px solid rgba(184, 115, 51, 0.6)',
                      backdropFilter: 'blur(15px)',
                      boxShadow: '0 8px 32px rgba(184, 115, 51, 0.2)',
                    }}
                  >
                    {/* Animated gradient overlay */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: 'linear-gradient(135deg, rgba(184, 115, 51, 0.4), rgba(212, 165, 116, 0.4))',
                      }}
                    />
                    
                    {/* Shimmer Effect */}
                    <motion.div
                      className="absolute inset-0"
                      animate={{
                        x: ['-100%', '200%'],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                      style={{
                        background: 'linear-gradient(90deg, transparent, rgba(212, 165, 116, 0.4), transparent)',
                        width: '50%',
                      }}
                    />

                    <div className="flex items-center justify-center gap-3 relative z-10">
                      <motion.div
                        animate={{
                          rotate: [0, 360],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      >
                        <Brain size={24} style={{ color: '#D4A574' }} />
                      </motion.div>
                      <span
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: 'clamp(0.875rem, 1.2vw, 1rem)',
                          color: '#FFFEF9',
                          letterSpacing: '0.12em',
                          fontWeight: 600,
                        }}
                      >
                        AI-POWERED RECOMMENDATIONS
                      </span>
                      <motion.div
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.6, 1, 0.6],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      >
                        <Sparkles size={20} style={{ color: '#CD7F32' }} />
                      </motion.div>
                    </div>
                  </div>

                  {/* Enhanced Hover Glow */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-10"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(184, 115, 51, 0.4) 0%, transparent 70%)',
                      filter: 'blur(30px)',
                    }}
                  />
                </motion.div>

                {/* Premium Explore Menu Button */}
                <motion.div 
                  className="relative group w-full"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button
                    onClick={() => router.push('/menu')}
                    className="relative overflow-hidden transition-all duration-300 w-full"
                    style={{
                      padding: '20px 32px',
                      background: 'linear-gradient(135deg, #B87333 0%, #CD7F32 50%, #D4A574 100%)',
                      color: '#000000',
                      fontSize: 'clamp(0.875rem, 1.2vw, 1rem)',
                      letterSpacing: '0.15em',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      border: '2px solid rgba(212, 165, 116, 0.6)',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-heading)',
                      boxShadow: '0 8px 32px rgba(184, 115, 51, 0.4)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #CD7F32 0%, #D4A574 50%, #B87333 100%)';
                      e.currentTarget.style.boxShadow = '0 12px 40px rgba(184, 115, 51, 0.6)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #B87333 0%, #CD7F32 50%, #D4A574 100%)';
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(184, 115, 51, 0.4)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <span className="flex items-center justify-center gap-3">
                      EXPLORE MENU
                      <ArrowRight size={20} />
                    </span>
                    
                    {/* Button shimmer */}
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
                  </button>
                  
                  {/* Enhanced Glow effect */}
                  <motion.div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-10"
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{
                      background: 'radial-gradient(circle at center, rgba(184, 115, 51, 0.5) 0%, transparent 70%)',
                      filter: 'blur(40px)',
                    }}
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </motion.div>

      {/* Enhanced Grid Background */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute inset-0 pointer-events-none opacity-[0.03]" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(184, 115, 51, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(184, 115, 51, 0.4) 1px, transparent 1px)', 
          backgroundSize: '80px 80px' 
        }} 
      />
    </section>
  );
}