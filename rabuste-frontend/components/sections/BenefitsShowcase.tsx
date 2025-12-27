'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Zap, Brain, Dumbbell, Clock, TrendingUp, Award } from 'lucide-react';
import ComparisonSection from './ComparisonSection';

const benefits = [
  {
    icon: Zap,
    title: '2X CAFFEINE',
    value: '2.7%',
    comparison: 'vs 1.5% Arabica',
    desc: 'Double the energy for your day',
    color: '#B87333',
  },
  {
    icon: Brain,
    title: 'SHARP FOCUS',
    value: '4-6HRS',
    comparison: 'sustained energy',
    desc: 'Stay sharp throughout workday',
    color: '#CD7F32',
  },
  {
    icon: Dumbbell,
    title: 'PERFORMANCE',
    value: '+15%',
    comparison: 'athletic boost',
    desc: 'Perfect pre-workout fuel',
    color: '#D4A574',
  },
  {
    icon: Clock,
    title: 'LONG LASTING',
    value: '6-8HRS',
    comparison: 'energy duration',
    desc: 'No mid-day crashes',
    color: '#B87333',
  },
  {
    icon: TrendingUp,
    title: 'METABOLISM',
    value: '+11%',
    comparison: 'metabolic rate',
    desc: 'Burns more calories naturally',
    color: '#CD7F32',
  },
  {
    icon: Award,
    title: 'ANTIOXIDANTS',
    value: '7-10%',
    comparison: 'more CGA',
    desc: 'Superior health benefits',
    color: '#D4A574',
  },
];

export default function BenefitsShowcase() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section 
      ref={containerRef}
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #000000 0%, #1A1110 50%, #000000 100%)',
        padding: '120px 0',
      }}
    >
      {/* Parallax background */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 opacity-5"
      >
        <div
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/669162/pexels-photo-669162.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '100%',
            height: '120%',
          }}
        />
      </motion.div>

      <div className="container px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-20"
        >
          <p style={{
            color: '#B87333',
            fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
            letterSpacing: '0.3em',
            fontWeight: 700,
            marginBottom: '1.5rem',
          }}>
            WHY ROBUSTA DOMINATES
          </p>
          
          <h2 style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 'clamp(2.5rem, 8vw, 7rem)',
            lineHeight: 0.9,
            color: '#FFFEF9',
            marginBottom: '1rem',
          }}>
            SCIENCE
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #B87333 0%, #CD7F32 50%, #D4A574 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              BACKED
            </span>
            <br />
            POWER
          </h2>

          {/* See research button removed */}
        </motion.div>

        {/* Benefits Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -10 }}
                style={{
                  background: 'linear-gradient(135deg, rgba(61, 43, 31, 0.8), rgba(26, 17, 16, 0.8))',
                  border: `3px solid ${benefit.color}40`,
                  padding: 'clamp(20px, 4vw, 30px)',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
              >
                {/* Glow effect */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '150px',
                    height: '150px',
                    background: `radial-gradient(circle, ${benefit.color}20 0%, transparent 70%)`,
                    pointerEvents: 'none',
                  }}
                />

                {/* Icon */}
                <div style={{
                  background: benefit.color,
                  width: 'clamp(50px, 10vw, 70px)',
                  height: 'clamp(50px, 10vw, 70px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 'clamp(16px, 3vw, 24px)',
                }}>
                  <Icon size={32} color="#000000" strokeWidth={2.5} />
                </div>

                {/* Value */}
                <div style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                  lineHeight: 1,
                  color: benefit.color,
                  marginBottom: 'clamp(8px, 2vw, 12px)',
                }}>
                  {benefit.value}
                </div>

                {/* Comparison */}
                <div style={{
                  fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                  color: 'rgba(255, 254, 249, 0.6)',
                  letterSpacing: '0.05em',
                  marginBottom: 'clamp(12px, 2.5vw, 16px)',
                }}>
                  {benefit.comparison}
                </div>

                {/* Title */}
                <h3 style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
                  color: '#FFFEF9',
                  lineHeight: 1.2,
                  marginBottom: 'clamp(8px, 2vw, 12px)',
                  letterSpacing: '0.05em',
                }}>
                  {benefit.title}
                </h3>

                {/* Description */}
                <p style={{
                  color: 'rgba(255, 254, 249, 0.7)',
                  fontSize: 'clamp(0.875rem, 1.8vw, 1rem)',
                  lineHeight: 1.5,
                }}>
                  {benefit.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* ComparisonSection anchor - renders the ComparisonSection component so button can scroll to it */}
        <div id="comparison" className="mt-16">
          <ComparisonSection />
        </div>
      </div>
    </section>
  );
}