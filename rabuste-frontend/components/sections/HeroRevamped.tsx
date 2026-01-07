'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Zap, Award, Brain, Sparkles } from 'lucide-react';
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

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'transparent' }}
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

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        style={{ opacity }}
        className="relative z-10 w-full flex justify-center items-center"
      >
        {/* INNER WRAPPER - This is the "Box" that holds both parts centered together */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 xl:gap-20 max-w-[1200px] px-6">
          
          {/* CONTAINER 1: THE LOGO/CUP */}
          <div className="flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: isLoaded ? 1 : 0, x: isLoaded ? 0 : -20 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.8 }}
              className="relative w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] lg:w-[450px] lg:h-[450px]"
            >
              <div
                aria-label="Rabuste Coffee"
                className="w-full h-full"
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
                }}
              />
            </motion.div>
          </div>

          {/* CONTAINER 2: THE CONTENT */}
          <div className="flex-shrink-0 max-w-[500px]">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, x: isLoaded ? 0 : 20 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
              className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 lg:space-y-8"
            >
              <div className="space-y-2">
                <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(4.5rem, 7vw, 7.5rem)', lineHeight: 0.85, letterSpacing: '0.02em', color: '#FFFEF9', fontWeight: 700 }}>RABUSTE</h1>
                <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(1.25rem, 2vw, 1.5rem)', color: '#D4A574', letterSpacing: '0.2em', marginTop: '0.5rem' }}>UNAPOLOGETICALLY BOLD</p>
              </div>

              <p style={{ fontSize: '1.125rem', color: 'rgba(255, 254, 249, 0.85)', lineHeight: 1.6, maxWidth: '400px' }}>
                Double the caffeine. Zero compromise. Premium robusta for those who demand more.
              </p>

              {/* Feature Badges - Horizontal on desktop */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6">
                {[{ icon: <Zap size={20} />, text: '2X CAFFEINE' }, { icon: <Award size={20} />, text: '100% ROBUSTA' }].map((stat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: 'rgba(184, 115, 51, 0.15)', border: '2px solid rgba(184, 115, 51, 0.4)' }}>
                      <div className="text-[#D4A574]">{stat.icon}</div>
                    </div>
                    <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.125rem', color: '#FFFEF9', letterSpacing: '0.05em' }}>{stat.text}</span>
                  </div>
                ))}
              </div>

              {/* AI Feature Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.2 }}
                className="relative group cursor-pointer"
                onClick={() => {
                  // Scroll down to trigger the BrewAI button
                  window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
                }}
              >
                <div
                  className="relative overflow-hidden transition-all duration-300 hover:scale-105"
                  style={{
                    padding: '16px 28px',
                    background: 'linear-gradient(135deg, rgba(184, 115, 51, 0.2), rgba(205, 127, 50, 0.2))',
                    border: '2px solid rgba(184, 115, 51, 0.5)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
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
                      background: 'linear-gradient(90deg, transparent, rgba(212, 165, 116, 0.3), transparent)',
                      width: '50%',
                    }}
                  />

                  <div className="flex items-center gap-3 relative z-10">
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
                      <Brain size={22} style={{ color: '#D4A574' }} />
                    </motion.div>
                    <span
                      style={{
                        fontFamily: 'Bebas Neue, sans-serif',
                        fontSize: '1rem',
                        color: '#FFFEF9',
                        letterSpacing: '0.15em',
                      }}
                    >
                      AI-POWERED RECOMMENDATIONS
                    </span>
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    >
                      <Sparkles size={18} style={{ color: '#CD7F32' }} />
                    </motion.div>
                  </div>
                </div>

                {/* Hover Tooltip - Positioned Above */}
                <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.95)',
                      border: '2px solid rgba(184, 115, 51, 0.6)',
                      padding: '10px 20px',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '0.875rem',
                        color: '#D4A574',
                        margin: 0,
                        fontWeight: 500,
                      }}
                    >
                      Click to discover our AI brew assistant
                    </p>
                  </div>
                  {/* Arrow pointing down */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      bottom: '-6px',
                      transform: 'translateX(-50%)',
                      width: '0',
                      height: '0',
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderTop: '6px solid rgba(184, 115, 51, 0.6)',
                    }}
                  />
                </div>
              </motion.div>

              <div className="relative group">
                <button
                  onClick={() => router.push('/menu')}
                  className="relative overflow-hidden transition-all duration-300 hover:scale-105"
                  style={{
                    padding: '16px 28px',
                    background: 'linear-gradient(135deg, rgba(184, 115, 51, 0.2), rgba(205, 127, 50, 0.2))',
                    color: '#FFFEF9',
                    fontSize: '1rem',
                    letterSpacing: '0.15em',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    border: '2px solid rgba(184, 115, 51, 0.5)',
                    cursor: 'pointer',
                    fontFamily: 'Bebas Neue, sans-serif',
                    backdropFilter: 'blur(10px)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #B87333 0%, #D4A574 100%)';
                    e.currentTarget.style.color = '#000000';
                    e.currentTarget.style.borderColor = '#D4A574';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(184, 115, 51, 0.2), rgba(205, 127, 50, 0.2))';
                    e.currentTarget.style.color = '#FFFEF9';
                    e.currentTarget.style.borderColor = 'rgba(184, 115, 51, 0.5)';
                  }}
                >
                  Explore Menu
                </button>
                {/* Glow effect on hover */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(184, 115, 51, 0.3) 0%, transparent 70%)',
                    filter: 'blur(20px)',
                  }}
                />
              </div>
            </motion.div>
          </div>

        </div>
      </motion.div>

      {/* Subtle Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(184, 115, 51, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(184, 115, 51, 0.4) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
    </section>
  );
}