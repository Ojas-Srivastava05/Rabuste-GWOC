'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import dynamic from 'next/dynamic';

// Dynamically import the WebGL background to avoid SSR issues
const Balatro = dynamic(() => import('@/components/bg'), { ssr: false });

export default function ArtisanExperience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const features = [
    {
      icon: '🌱',
      title: 'Single Origin',
      desc: 'Handpicked beans from premium estates',
    },
    {
      icon: '🔥',
      title: 'Expert Roasting',
      desc: 'Small-batch perfection in every roast',
    },
    {
      icon: '☕',
      title: 'Master Brewing',
      desc: 'Precision-crafted by skilled baristas',
    },
    {
      icon: '✨',
      title: 'Fresh Daily',
      desc: 'Roasted and brewed fresh every day',
    },
  ];

  return (
    <section
      id="artisan-experience"
      ref={ref}
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ 
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      {/* WebGL Background - The original coffee swirl effect */}
      <div className="absolute inset-0 z-0">
        <Balatro
          spinRotation={-2.0}
          spinSpeed={7.0}
          offset={[0.0, 0.0]}
          color1="#050505"
          color2="#2e211a"
          color3="#4a352a"
          contrast={2.6}
          lighting={0.15}
          spinAmount={0.15}
          pixelFilter={1970.0}
          spinEase={1.0}
          isRotate={false}
          mouseInteraction={true}
        />
        {/* Dark overlay to make text readable */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(10, 10, 10, 0.7) 0%, rgba(10, 10, 10, 0.5) 50%, rgba(10, 10, 10, 0.7) 100%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span 
            className="text-sm uppercase tracking-widest font-semibold mb-4 block"
            style={{ 
              color: '#C89B7B',
              fontFamily: 'var(--font-heading)',
            }}
          >
            The Artisan Way
          </span>
          <h2 
            className="text-4xl md:text-6xl font-bold mb-6"
            style={{
              fontFamily: 'var(--font-heading)',
            }}
          >
            <span className="gradient-text">Craftsmanship in Every Cup</span>
          </h2>
          <p 
            className="text-xl max-w-3xl mx-auto"
            style={{ 
              color: '#FAD0C4',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            }}
          >
            Experience the mesmerizing dance of coffee essence, where tradition meets innovation in every carefully crafted brew
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div 
                className="glass-morphism p-8 rounded-3xl hover-lift"
                style={{
                  background: 'rgba(26, 17, 16, 0.6)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(196, 165, 116, 0.2)',
                }}
              >
                <div 
                  className="text-5xl mb-4"
                  style={{
                    filter: 'drop-shadow(0 4px 8px rgba(196, 165, 116, 0.3))',
                  }}
                >
                  {feature.icon}
                </div>
                <h3 
                  className="text-xl font-bold mb-2"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: '#FAD0C4',
                  }}
                >
                  {feature.title}
                </h3>
                <p 
                  className="text-sm"
                  style={{ 
                    color: '#E6C9A8',
                    opacity: 0.9,
                  }}
                >
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div 
            className="glass-morphism p-12 rounded-3xl"
            style={{
              background: 'rgba(26, 17, 16, 0.5)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(196, 165, 116, 0.2)',
            }}
          >
            <div 
              className="text-6xl mb-6"
              style={{ color: '#C89B7B', opacity: 0.3 }}
            >
              "
            </div>
            <p 
              className="text-2xl md:text-3xl italic mb-6"
              style={{
                fontFamily: 'var(--font-body)',
                color: '#FAD0C4',
                lineHeight: 1.5,
                textShadow: '0 2px 10px rgba(0,0,0,0.5)',
              }}
            >
              Coffee is not just a beverage—it's an art form, a ritual, and a celebration of craftsmanship
            </p>
            <div 
              className="text-sm tracking-widest uppercase"
              style={{
                color: '#C89B7B',
                fontFamily: 'var(--font-heading)',
              }}
            >
              — Rabuste Philosophy
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}