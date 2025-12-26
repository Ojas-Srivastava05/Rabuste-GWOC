'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Zap, Coffee, Award } from 'lucide-react';

export default function CinematicHero() {
  const router = useRouter();

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ 
        background: 'linear-gradient(180deg, #000000 0%, #0A0A0A 50%, #141414 100%)',
      }}
    >
      {/* Powerful background elements */}
      <div className="absolute inset-0 opacity-30">
        <div 
          className="absolute top-0 right-0 w-[800px] h-[800px]"
          style={{
            background: 'radial-gradient(circle, rgba(184, 115, 51, 0.2) 0%, transparent 70%)',
            filter: 'blur(120px)',
            animation: 'floatSlow 20s ease-in-out infinite',
          }}
        />
        <div 
          className="absolute bottom-0 left-0 w-[600px] h-[600px]"
          style={{
            background: 'radial-gradient(circle, rgba(115, 54, 53, 0.2) 0%, transparent 70%)',
            filter: 'blur(120px)',
            animation: 'floatSlow 25s ease-in-out infinite',
            animationDelay: '7s',
          }}
        />
      </div>

      {/* Brutal geometric pattern overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `repeating-linear-gradient(
          45deg,
          transparent,
          transparent 100px,
          rgba(184, 115, 51, 0.1) 100px,
          rgba(184, 115, 51, 0.1) 101px
        )`
      }} />

      <div className="container px-6 py-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Powerful stats bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-wrap justify-center gap-12 mb-16"
          >
            {[
              { icon: <Zap size={24} />, label: '2X CAFFEINE', value: 'TWICE THE POWER' },
              { icon: <Coffee size={24} />, label: '100% ROBUSTA', value: 'PURE STRENGTH' },
              { icon: <Award size={24} />, label: '15+ YEARS', value: 'UNMATCHED QUALITY' },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
                className="flex items-center gap-3"
              >
                <div className="text-copper-500" style={{ color: '#B87333' }}>
                  {stat.icon}
                </div>
                <div>
                  <div 
                    className="text-xs tracking-[0.2em] mb-1"
                    style={{ color: '#B87333', fontWeight: 600 }}
                  >
                    {stat.label}
                  </div>
                  <div 
                    className="text-sm"
                    style={{ 
                      color: '#D4A574',
                      fontFamily: 'var(--font-heading)',
                      letterSpacing: '0.1em',
                    }}
                  >
                    {stat.value}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Main powerful headline */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h1
              style={{
                fontWeight: 400,
                lineHeight: 0.85,
                textTransform: 'uppercase',
              }}
            >
              <span style={{ color: '#FFFEF9' }}>RABUSTE COFFEE</span>
              <br />
              <span className="gradient-copper" style={{
                fontSize: 'clamp(2.5rem, 10vw, 8rem)',
              }}>
                UNAPOLOGETICALLY
              </span>
              <br />
              <span style={{ color: '#FFFEF9' }}>BOLD</span>
            </h1>
          </motion.div>

          {/* Power statement */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-center mb-12"
          >
            <div 
              className="inline-block px-8 py-4 mb-6"
              style={{
                background: 'linear-gradient(135deg, rgba(184, 115, 51, 0.15), rgba(115, 54, 53, 0.15))',
                border: '2px solid rgba(184, 115, 51, 0.3)',
              }}
            >
              <p 
                className="text-xl md:text-3xl max-w-4xl"
                style={{
                  color: '#CD7F32',
                  fontFamily: 'var(--font-heading)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                2X THE CAFFEINE. TWICE THE POWER.
              </p>
            </div>
            
            <p 
              className="text-base md:text-lg max-w-3xl mx-auto"
              style={{
                color: '#8B6F47',
                lineHeight: 1.8,
              }}
            >
              While others settle for weak Arabica, we champion the superior Robusta bean.
              <br />
              <span style={{ color: '#B87333', fontWeight: 600 }}>
                Stronger. Bolder. Uncompromising.
              </span>
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex flex-wrap gap-6 justify-center mb-20"
          >
            <button
              onClick={() => router.push('/menu')}
              className="btn btn-primary group"
            >
              EXPERIENCE THE POWER
              <Zap size={18} className="transition-transform group-hover:scale-125" />
            </button>

            <button
              onClick={() => {
                const element = document.getElementById('robusta-superiority');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn btn-secondary"
            >
              WHY ROBUSTA WINS
            </button>
          </motion.div>

          {/* Image showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 1.4 }}
            className="max-w-5xl mx-auto"
          >
            <div 
              className="relative overflow-hidden"
              style={{
                aspectRatio: '21/9',
                border: '3px solid rgba(184, 115, 51, 0.3)',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1607098422659-7431f0811de8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw4fHxkYXJrJTIwcm9hc3RlZCUyMGNvZmZlZSUyMGJlYW5zJTIwY2xvc2V1cCUyQyUyMGRyYW1hdGljJTIwbGlnaHRpbmclMkMlMjByaWNoJTIwdGV4dHVyZSUyQyUyMHByZW1pdW0lMjBxdWFsaXR5JTJDJTIwaW50ZW5zZSUyMGFuZCUyMGJvbGR8ZW58MHwwfHxibGFja3wxNzY2NzU3NzQzfDA&ixlib=rb-4.1.0&q=85"
                alt="Dark roasted coffee beans - phil sheldon ABIPP on Unsplash"
                className="w-full h-full object-cover"
                style={{
                  filter: 'brightness(0.9) contrast(1.15)',
                }}
              />
              <div 
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.6) 100%)',
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator - industrial */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-3"
        >
          <div 
            className="w-px h-20"
            style={{
              background: 'linear-gradient(to bottom, #B87333, transparent)',
            }}
          />
          <span className="text-xs uppercase tracking-widest" style={{ color: '#B87333', fontWeight: 600 }}>
            SCROLL
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}