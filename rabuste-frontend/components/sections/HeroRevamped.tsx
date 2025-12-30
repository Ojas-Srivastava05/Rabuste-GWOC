'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Zap, Award } from 'lucide-react';

export default function HeroRevamped() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<Array<{ left: number; top: number; duration: number; delay: number }>>([]);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Generate particle positions after mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    const generatedParticles = [...Array(15)].map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 4 + Math.random() * 3,
      delay: 1.2 + Math.random() * 2,
    }));
    setParticles(generatedParticles);
  }, []);

  // Trigger elegant load animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Elegant Curtain Reveal Animation */}
      <motion.div
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(180deg, #000000 0%, #0a0a0a 100%)',
          transformOrigin: 'top',
          zIndex: 100,
          pointerEvents: 'none',
        }}
      />

      {/* Premium Coffee Beans Background with Parallax */}
      <motion.div 
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ y }}
        className="absolute inset-0"
      >
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/33682396/pexels-photo-33682396.jpeg"
            alt="Premium dark roasted coffee beans - Photo by indra projects on Pexels"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay for contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/70 to-black/90" />
          
          {/* Radial gradient for depth */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.8) 100%)',
            }}
          />
        </div>
      </motion.div>

      {/* Subtle grain texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
        }}
      />

      {/* Floating particles effect - only render after mount */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((particle, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ 
                y: [0, -120, 0],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: "easeInOut",
              }}
              className="absolute w-1 h-1 rounded-full bg-[#D4A574]"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
              }}
            />
          ))}
        </div>
      )}

      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        style={{ opacity }}
        className="container px-6 py-20 relative z-10"
      >
        <div className="max-w-5xl mx-auto">
          
          {/* Elegant Content Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 50 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
            className="relative"
          >
            {/* Decorative top border */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isLoaded ? 1 : 0 }}
              transition={{ duration: 1.4, delay: 1, ease: [0.22, 1, 0.36, 1] }}
              className="h-[1px] w-24 mx-auto mb-14"
              style={{
                background: 'linear-gradient(90deg, transparent, #B87333, transparent)',
              }}
            />

            {/* Main Content Container */}
            <div className="relative">
              {/* Ambient glow effect */}
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(184, 115, 51, 0.15) 0%, transparent 70%)',
                  filter: 'blur(100px)',
                }}
              />

              <div className="relative z-10 text-center px-4 md:px-8">
                {/* Welcome Eyebrow */}
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
                  transition={{ duration: 0.9, delay: 1.1 }}
                  className="mb-10"
                  style={{
                    color: '#D4A574',
                    fontSize: '0.813rem',
                    letterSpacing: '0.3em',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                  }}
                >
                  Welcome to Premium Robusta
                </motion.p>

                {/* Main Brand Title */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 50 }}
                  transition={{ duration: 1.1, delay: 1.3 }}
                  className="mb-12"
                >
                  <h1
                    style={{
                      fontFamily: 'Bebas Neue, sans-serif',
                      fontSize: 'clamp(4rem, 10vw, 8.5rem)',
                      lineHeight: 0.9,
                      letterSpacing: '0.12em',
                      color: '#FFFEF9',
                      textTransform: 'uppercase',
                      textShadow: '0 0 60px rgba(184, 115, 51, 0.3), 0 4px 20px rgba(0,0,0,0.5)',
                      marginBottom: '0.2em',
                    }}
                  >
                    RABUSTE
                  </h1>
                  <h1
                    style={{
                      fontFamily: 'Bebas Neue, sans-serif',
                      fontSize: 'clamp(4rem, 10vw, 8.5rem)',
                      lineHeight: 0.9,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      background: 'linear-gradient(135deg, #B87333 0%, #CD7F32 40%, #D4A574 70%, #E8C39E 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      filter: 'drop-shadow(0 0 30px rgba(184, 115, 51, 0.4))',
                    }}
                  >
                    COFFEE
                  </h1>
                </motion.div>

                {/* Feature Badges */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 40 }}
                  transition={{ duration: 1, delay: 1.5 }}
                  className="flex flex-wrap justify-center gap-12 md:gap-20 mb-14"
                >
                  {[
                    { icon: <Zap size={28} strokeWidth={2.5} />, text: '2X CAFFEINE', subtext: 'Double Strength' },
                    { icon: <Award size={28} strokeWidth={2.5} />, text: '100% ROBUSTA', subtext: 'Premium Beans' },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.8 }}
                      transition={{ duration: 0.8, delay: 1.6 + i * 0.15 }}
                      whileHover={{ scale: 1.08, y: -8 }}
                      className="flex flex-col items-center gap-4"
                    >
                      <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center relative group"
                        style={{
                          background: 'rgba(184, 115, 51, 0.08)',
                          border: '2px solid rgba(184, 115, 51, 0.3)',
                          backdropFilter: 'blur(10px)',
                          boxShadow: '0 8px 32px rgba(184, 115, 51, 0.15)',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <div className="text-[#D4A574]">{stat.icon}</div>
                        
                        {/* Hover glow */}
                        <div 
                          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            background: 'radial-gradient(circle, rgba(184, 115, 51, 0.2), transparent)',
                            filter: 'blur(15px)',
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <div 
                          style={{ 
                            fontFamily: 'Bebas Neue, sans-serif',
                            fontSize: '1.375rem',
                            color: '#FFFEF9',
                            letterSpacing: '0.1em',
                          }}
                        >
                          {stat.text}
                        </div>
                        <div
                          style={{
                            fontSize: '0.75rem',
                            color: 'rgba(212, 165, 116, 0.7)',
                            letterSpacing: '0.05em',
                          }}
                        >
                          {stat.subtext}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.85 }}
                  transition={{ duration: 0.9, delay: 1.9 }}
                  className="mb-16"
                >
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(184, 115, 51, 0.4)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push('/menu')}
                    className="group relative overflow-hidden"
                    style={{
                      padding: '20px 60px',
                      border: '2px solid rgba(184, 115, 51, 0.4)',
                      background: 'rgba(0, 0, 0, 0.3)',
                      backdropFilter: 'blur(20px)',
                      color: '#FFFEF9',
                      fontSize: '0.875rem',
                      letterSpacing: '0.25em',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                      borderRadius: '2px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                    }}
                  >
                    <span className="relative z-10">VIEW OUR SELECTION</span>
                    
                    {/* Animated gradient on hover */}
                    <motion.div
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(135deg, #B87333 0%, #CD7F32 100%)',
                        opacity: 0,
                      }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    />
                    
                    {/* Shine effect */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100"
                      style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                      }}
                      animate={{
                        x: ['-200%', '200%'],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 1,
                      }}
                    />
                  </motion.button>
                </motion.div>

                {/* Tagline Section */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isLoaded ? 1 : 0 }}
                  transition={{ duration: 1.1, delay: 2.1 }}
                  className="space-y-6"
                >
                  <p
                    style={{
                      fontFamily: 'Bebas Neue, sans-serif',
                      fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                      color: '#D4A574',
                      letterSpacing: '0.15em',
                      lineHeight: 1.2,
                    }}
                  >
                    UNAPOLOGETICALLY BOLD
                  </p>

                  <div 
                    className="h-[1px] w-24 mx-auto"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(184, 115, 51, 0.5), transparent)',
                    }}
                  />

                  <p
                    style={{
                      fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
                      color: 'rgba(255, 254, 249, 0.75)',
                      maxWidth: '580px',
                      margin: '0 auto',
                      lineHeight: 1.7,
                      fontWeight: 300,
                    }}
                  >
                    Experience the raw power of premium Robusta. 
                    Twice the caffeine. Zero compromises.
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Decorative bottom border */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isLoaded ? 1 : 0 }}
              transition={{ duration: 1.4, delay: 2.3, ease: [0.22, 1, 0.36, 1] }}
              className="h-[1px] w-24 mx-auto mt-16"
              style={{
                background: 'linear-gradient(90deg, transparent, #B87333, transparent)',
              }}
            />
          </motion.div>

        </div>
      </motion.div>

      {/* Subtle grid overlay for texture */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(rgba(184, 115, 51, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(184, 115, 51, 0.4) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
    </section>
  );
}