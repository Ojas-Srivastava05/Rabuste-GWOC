'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Zap, Award, ArrowRight } from 'lucide-react';

export default function HeroRevamped() {
  const router = useRouter();

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ 
        background: 'linear-gradient(135deg, #1A1110 0%, #000000 50%, #1A1110 100%)',
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-0 right-0 w-[800px] h-[800px]"
          style={{
            background: 'radial-gradient(circle, rgba(255,107,53,0.2) 0%, transparent 70%)',
          }}
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-0 left-0 w-[600px] h-[600px]"
          style={{
            background: 'radial-gradient(circle, rgba(184,115,51,0.2) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="container px-6 py-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          
          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-wrap justify-center gap-8 md:gap-16 mb-12"
          >
            {[
              { icon: <Zap size={28} strokeWidth={2.5} />, value: '2X', label: 'CAFFEINE' },
              { icon: <Award size={28} strokeWidth={2.5} />, value: '100%', label: 'ROBUSTA' },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
                className="flex items-center gap-4"
              >
                <div style={{ color: '#B87333' }}>
                  {stat.icon}
                </div>
                <div>
                  <div 
                    style={{ 
                      fontFamily: 'Bebas Neue, sans-serif',
                      fontSize: '2rem',
                      lineHeight: 1,
                      color: '#FFFEF9',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {stat.value}
                  </div>
                  <div 
                    style={{ 
                      color: '#D4A574',
                      fontSize: '0.75rem',
                      letterSpacing: '0.2em',
                      fontWeight: 600,
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Massive headline */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-center mb-16"
          >
            <h1
              style={{
                fontFamily: 'Bebas Neue, sans-serif',
                fontWeight: 400,
                lineHeight: 0.8,
                textTransform: 'uppercase',
                marginBottom: '0.5em',
              }}
            >
              <motion.span 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                style={{ 
                  color: '#FFFEF9', 
                  fontSize: 'clamp(4rem, 16vw, 14rem)',
                  display: 'block',
                }}
              >
                RABUSTE
              </motion.span>
              
              <motion.span 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="gradient-text" 
                style={{
                  fontSize: 'clamp(4rem, 16vw, 14rem)',
                  display: 'block',
                  background: 'linear-gradient(135deg, #B87333 0%, #CD7F32 50%, #D4A574 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                COFFEE
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              style={{
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: 'clamp(1.5rem, 4vw, 3rem)',
                color: '#D4A574',
                letterSpacing: '0.15em',
                marginBottom: '1em',
              }}
            >
              UNAPOLOGETICALLY BOLD
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                color: 'rgba(255, 254, 249, 0.7)',
                maxWidth: '600px',
                margin: '0 auto 3em',
                lineHeight: 1.6,
                fontWeight: 400,
              }}
            >
              Experience the raw power of premium Robusta. 
              Twice the caffeine. Zero compromises.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <button
                onClick={() => router.push('/menu')}
                className="btn btn-primary group"
                style={{
                  background: 'linear-gradient(135deg, #B87333 0%, #CD7F32 50%, #D4A574 100%)',
                  color: '#000000',
                  padding: '24px 60px',
                  fontSize: '1.25rem',
                  fontFamily: 'Bebas Neue, sans-serif',
                  letterSpacing: '0.15em',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 10px 40px rgba(184, 115, 51, 0.4)',
                }}
              >
                ORDER NOW
                <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
              </button>
              
              <button
                onClick={() => router.push('/menu')}
                className="btn btn-secondary"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#FFFEF9',
                  padding: '24px 60px',
                  fontSize: '1.25rem',
                  fontFamily: 'Bebas Neue, sans-serif',
                  letterSpacing: '0.15em',
                  border: '3px solid rgba(184, 115, 51, 0.6)',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                VIEW MENU
              </button>
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.6, duration: 1 }}
            className="relative"
            style={{
              maxWidth: '1000px',
              margin: '0 auto',
            }}
          >
            <div
              style={{
                position: 'relative',
                aspectRatio: '16/9',
                borderRadius: '0',
                overflow: 'hidden',
                border: '3px solid rgba(184, 115, 51, 0.3)',
                boxShadow: '0 30px 90px rgba(0, 0, 0, 0.8), 0 0 60px rgba(184, 115, 51, 0.3)',
              }}
            >
              <img
                src="https://pixabay.com/get/gd7b28743502b5f72e709f51953615a9b3d86e7637adc56367e99e56afc344803e6fa8997948fb608b2771828c571f3e5.jpg"
                alt="Professional coffee cup with steam - Photo by StockSnap on Pixabay"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              
              {/* Overlay gradient */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(45deg, rgba(184,115,51,0.15) 0%, transparent 50%, rgba(205,127,50,0.15) 100%)',
                  mixBlendMode: 'overlay',
                }}
              />
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                background: 'linear-gradient(135deg, #B87333 0%, #CD7F32 100%)',
                padding: '20px 30px',
                border: '3px solid #000000',
                boxShadow: '0 10px 40px rgba(184, 115, 51, 0.5)',
              }}
            >
              <div style={{
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: '2rem',
                color: '#000000',
                lineHeight: 1,
                letterSpacing: '0.05em',
              }}>
                15+ YEARS
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#000000',
                letterSpacing: '0.2em',
                fontWeight: 700,
              }}>
                EXCELLENCE
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}