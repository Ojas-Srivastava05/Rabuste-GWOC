'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Zap, Award } from 'lucide-react';

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
              <p style={{ color: '#D4A574', fontSize: '0.875rem', letterSpacing: '0.3em', fontWeight: 600, textTransform: 'uppercase' }}>
                Premium Robusta
              </p>

              <div className="space-y-0">
                <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(4rem, 6vw, 6.5rem)', lineHeight: 0.85, letterSpacing: '0.05em', color: '#FFFEF9', fontWeight: 700 }}>RABUSTE</h1>
                <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(2.5rem, 4.5vw, 4rem)', lineHeight: 0.9, letterSpacing: '0.1em', background: 'linear-gradient(135deg, #B87333 0%, #D4A574 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 400 }}>COFFEE</h2>
              </div>

              <div className="space-y-3">
                <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.25rem', color: '#D4A574', letterSpacing: '0.15em' }}>UNAPOLOGETICALLY BOLD</p>
                <p style={{ fontSize: '1rem', color: 'rgba(255, 254, 249, 0.8)', lineHeight: 1.5 }}>Premium Robusta. Double caffeine. Zero compromise.</p>
              </div>

              {/* Feature Badges - Horizontal on desktop */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6">
                {[{ icon: <Zap size={18} />, text: '2X CAFFEINE' }, { icon: <Award size={18} />, text: '100% ROBUSTA' }].map((stat, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(184, 115, 51, 0.1)', border: '1px solid rgba(184, 115, 51, 0.3)' }}>
                      <div className="text-[#D4A574]">{stat.icon}</div>
                    </div>
                    <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1rem', color: '#FFFEF9', letterSpacing: '0.05em' }}>{stat.text}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => router.push('/menu')}
                style={{
                  padding: '16px 45px',
                  background: 'linear-gradient(135deg, #B87333 0%, #D4A574 100%)',
                  color: '#000',
                  fontSize: '0.875rem',
                  letterSpacing: '0.15em',
                  fontWeight: 800,
                  borderRadius: '2px',
                  textTransform: 'uppercase',
                  marginTop: '10px'
                }}
              >
                View Selection
              </button>
            </motion.div>
          </div>

        </div>
      </motion.div>

      {/* Subtle Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(184, 115, 51, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(184, 115, 51, 0.4) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
    </section>
  );
}