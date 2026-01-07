'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Zap, Award, ArrowRight, Sparkles } from 'lucide-react';
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
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'transparent' }}
    >
      {/* Balatro Background Effect */}
      <Balatro />
      
      {/* Dramatic Radial Gradient Overlays */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(184, 115, 51, 0.4) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(205, 127, 50, 0.3) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

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
        style={{ opacity, scale }}
        className="relative z-10 w-full max-w-[1400px] mx-auto px-6 py-20"
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* LEFT: CONTENT - Now First on Mobile */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 40 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
            className="space-y-8 lg:space-y-10 order-2 lg:order-1"
          >
            {/* Overline */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: isLoaded ? 1 : 0, x: isLoaded ? 0 : -20 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex items-center gap-3"
            >
              <div className="h-px w-12 bg-gradient-to-r from-[#B87333] to-transparent" />
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.75rem',
                letterSpacing: '0.25em',
                color: '#B87333',
                fontWeight: 600,
                textTransform: 'uppercase',
              }}>
                Premium Robusta Coffee
              </span>
            </motion.div>

            {/* Main Heading - MASSIVE */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
                transition={{ duration: 1, delay: 0.7 }}
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(3.5rem, 12vw, 9rem)',
                  lineHeight: 0.85,
                  letterSpacing: '0.02em',
                  color: '#FFFEF9',
                  fontWeight: 400,
                  textTransform: 'uppercase',
                }}
              >
                RABUSTE
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: isLoaded ? 1 : 0, width: isLoaded ? '100%' : 0 }}
                transition={{ duration: 1.2, delay: 1 }}
                className="h-1"
                style={{
                  background: 'linear-gradient(90deg, #B87333, #CD7F32, #D4A574)',
                  maxWidth: '200px',
                }}
              />
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoaded ? 1 : 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.25rem, 3vw, 2rem)',
                  color: '#D4A574',
                  letterSpacing: '0.15em',
                  fontWeight: 400,
                }}
              >
                UNAPOLOGETICALLY BOLD
              </motion.p>
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 1.3 }}
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                color: 'rgba(255, 254, 249, 0.8)',
                lineHeight: 1.7,
                maxWidth: '540px',
                fontFamily: 'var(--font-body)',
                fontWeight: 300,
              }}
            >
              Double the caffeine. Zero compromise. Premium robusta engineered for those who refuse to settle.
            </motion.p>

            {/* Stats - More Prominent */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="flex flex-wrap gap-6"
            >
              {[
                { icon: <Zap size={24} />, value: '2X', label: 'CAFFEINE' },
                { icon: <Award size={24} />, value: '100%', label: 'ROBUSTA' }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="flex items-center gap-4 px-5 py-4 group cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, rgba(184, 115, 51, 0.15), rgba(205, 127, 50, 0.1))',
                    border: '2px solid rgba(184, 115, 51, 0.4)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div 
                    className="p-2 transition-transform group-hover:scale-110"
                    style={{
                      background: 'rgba(184, 115, 51, 0.2)',
                      border: '1px solid rgba(184, 115, 51, 0.3)',
                    }}
                  >
                    <div style={{ color: '#D4A574' }}>{stat.icon}</div>
                  </div>
                  <div>
                    <div style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.75rem',
                      color: '#B87333',
                      lineHeight: 1,
                      letterSpacing: '0.05em',
                    }}>
                      {stat.value}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '0.75rem',
                      color: 'rgba(255, 254, 249, 0.6)',
                      letterSpacing: '0.15em',
                      marginTop: '2px',
                    }}>
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTAs - Redesigned */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 1.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              {/* Primary CTA */}
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/menu')}
                className="group relative overflow-hidden px-8 py-4 flex items-center justify-center gap-3"
                style={{
                  background: 'linear-gradient(135deg, #B87333 0%, #CD7F32 50%, #D4A574 100%)',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 10px 40px rgba(184, 115, 51, 0.4)',
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1rem',
                  color: '#000000',
                  letterSpacing: '0.1em',
                  fontWeight: 600,
                }}>
                  EXPLORE MENU
                </span>
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" style={{ color: '#000000' }} />
                
                {/* Shine Effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                    animation: 'shine 1.5s infinite',
                  }}
                />
              </motion.button>

              {/* Secondary CTA - AI */}
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                className="group relative overflow-hidden px-8 py-4 flex items-center justify-center gap-3"
                style={{
                  background: 'rgba(184, 115, 51, 0.1)',
                  border: '2px solid rgba(184, 115, 51, 0.5)',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles size={18} style={{ color: '#D4A574' }} />
                </motion.div>
                <span style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1rem',
                  color: '#FFFEF9',
                  letterSpacing: '0.1em',
                }}>
                  AI BREW ASSISTANT
                </span>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* RIGHT: LOGO - Dramatic Presentation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.8 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.8 }}
            className="relative flex items-center justify-center order-1 lg:order-2"
          >
            {/* Glow Effect Behind Logo */}
            <div 
              className="absolute inset-0 opacity-60"
              style={{
                background: 'radial-gradient(circle, rgba(184, 115, 51, 0.3) 0%, transparent 70%)',
                filter: 'blur(60px)',
              }}
            />
            
            {/* Rotating Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[350px] h-[350px] sm:w-[450px] sm:h-[450px]"
              style={{
                border: '1px solid rgba(184, 115, 51, 0.2)',
                borderRadius: '50%',
              }}
            />

            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] lg:w-[450px] lg:h-[450px]"
              style={{
                filter: 'drop-shadow(0 20px 60px rgba(184, 115, 51, 0.4))',
              }}
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
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Animated Grid Pattern */}
      <motion.div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(184, 115, 51, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(184, 115, 51, 0.5) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
        animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />

      <style jsx>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </section>
  );
}