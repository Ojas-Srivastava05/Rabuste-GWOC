'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export default function CinematicHero() {
  const router = useRouter();

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ 
        background: 'linear-gradient(180deg, #0A0A0A 0%, #141414 100%)',
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(201, 168, 106, 0.3) 0%, transparent 70%)',
            filter: 'blur(100px)',
            animation: 'floatSlow 15s ease-in-out infinite',
          }}
        />
        <div 
          className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(139, 111, 71, 0.3) 0%, transparent 70%)',
            filter: 'blur(100px)',
            animation: 'floatSlow 20s ease-in-out infinite',
            animationDelay: '5s',
          }}
        />
      </div>

      <div className="container px-6 py-20 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          {/* Small label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-4 mb-4">
              <div className="gold-line" />
              <span className="section-label">Premium Robusta Since 2010</span>
              <div className="gold-line" style={{ transform: 'scaleX(-1)' }} />
            </div>
          </motion.div>

          {/* Main title - HUGE */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mb-8"
            style={{
              fontWeight: 200,
              lineHeight: 0.95,
            }}
          >
            <span style={{ color: '#F5F1E8' }}>Rabuste</span>
            <br />
            <span className="gradient-text">Coffee</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto"
            style={{
              color: '#C9A86A',
              lineHeight: 1.6,
              fontWeight: 300,
            }}
          >
            Bold. Intense. Unapologetically Premium.
            <br />
            <span style={{ color: '#8B6F47', fontSize: '1rem' }}>
              Experience the finest Robusta coffee, crafted for those who demand excellence
            </span>
          </motion.p>

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
              Explore Menu
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => {
                const element = document.getElementById('about');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn btn-secondary"
            >
              Our Story
            </button>
          </motion.div>

          {/* Stats - Modern minimalist */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.4 }}
            className="grid grid-cols-3 gap-8 md:gap-16 max-w-4xl mx-auto"
          >
            {[
              { value: '15+', label: 'Years of Excellence' },
              { value: '50K+', label: 'Satisfied Customers' },
              { value: '100%', label: 'Pure Robusta' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div 
                  className="text-4xl md:text-6xl mb-2 gradient-text"
                  style={{ fontFamily: 'var(--font-heading)', fontWeight: 200 }}
                >
                  {stat.value}
                </div>
                <div 
                  className="text-xs md:text-sm uppercase tracking-wider"
                  style={{ color: '#8B6F47' }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-3"
        >
          <span className="text-xs uppercase tracking-widest" style={{ color: '#8B6F47' }}>
            Scroll
          </span>
          <div 
            className="w-px h-16"
            style={{
              background: 'linear-gradient(to bottom, #C9A86A, transparent)',
            }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}