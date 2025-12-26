'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Flame, Zap, Shield, Trophy } from 'lucide-react';

export default function RobustaSuperioritySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const superiorities = [
    {
      icon: <Zap size={32} />,
      title: '2X CAFFEINE',
      description: 'Robusta contains twice the caffeine of Arabica. Real power for real people.',
      stat: '2.7%',
      label: 'Caffeine content',
    },
    {
      icon: <Flame size={32} />,
      title: 'INTENSE FLAVOR',
      description: 'Bold, earthy, and unapologetically strong. No weak floral notes here.',
      stat: '100%',
      label: 'Pure intensity',
    },
    {
      icon: <Shield size={32} />,
      title: 'RESILIENT BEANS',
      description: 'Grown at lower altitudes. Tougher, stronger, more resistant to disease.',
      stat: '40%',
      label: 'More antioxidants',
    },
    {
      icon: <Trophy size={32} />,
      title: 'SUPERIOR CREMA',
      description: 'Higher oil content creates thicker, richer crema. The mark of excellence.',
      stat: '50%',
      label: 'More body',
    },
  ];

  return (
    <section
      id="robusta-superiority"
      ref={ref}
      className="section"
      style={{ background: 'linear-gradient(180deg, #0A0A0A 0%, #000000 100%)' }}
    >
      <div className="container px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="copper-line" />
            <span className="section-label">THE TRUTH</span>
            <div className="copper-line" style={{ transform: 'scaleX(-1)' }} />
          </div>
          
          <h2 
            className="mb-8"
            style={{
              color: '#FFFEF9',
              fontWeight: 400,
            }}
          >
            WHY ROBUSTA
            <br />
            <span className="gradient-copper">DOMINATES</span>
          </h2>
          
          <p 
            className="text-lg md:text-xl max-w-3xl mx-auto mb-6"
            style={{ color: '#B87333', lineHeight: 1.7, fontWeight: 500 }}
          >
            The coffee industry has lied to you. Arabica isn't "premium" — it's weak.
          </p>
          <p 
            className="text-base max-w-2xl mx-auto"
            style={{ color: '#8B6F47', lineHeight: 1.8 }}
          >
            Robusta is scientifically superior in caffeine, antioxidants, and flavor intensity.
            We're here to set the record straight.
          </p>
        </motion.div>

        {/* Superiority grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {superiorities.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              className="brutal-card p-8 group"
            >
              <div 
                className="w-16 h-16 flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
                style={{
                  background: 'linear-gradient(135deg, rgba(184, 115, 51, 0.2), rgba(115, 54, 53, 0.2))',
                  border: '2px solid rgba(184, 115, 51, 0.3)',
                  color: '#B87333',
                }}
              >
                {item.icon}
              </div>
              
              <h3 
                className="text-xl mb-4"
                style={{
                  color: '#FFFEF9',
                  fontFamily: 'var(--font-heading)',
                  letterSpacing: '0.08em',
                }}
              >
                {item.title}
              </h3>
              
              <p 
                className="text-sm mb-6"
                style={{
                  color: '#8B6F47',
                  lineHeight: 1.8,
                }}
              >
                {item.description}
              </p>

              <div 
                className="pt-4"
                style={{
                  borderTop: '1px solid rgba(184, 115, 51, 0.2)',
                }}
              >
                <div 
                  className="text-3xl mb-1 gradient-copper"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {item.stat}
                </div>
                <div 
                  className="text-xs uppercase tracking-wider"
                  style={{ color: '#8B6F47' }}
                >
                  {item.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Comparison visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div 
            className="p-12 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(184, 115, 51, 0.1), rgba(115, 54, 53, 0.1))',
              border: '3px solid rgba(184, 115, 51, 0.3)',
            }}
          >
            <p 
              className="text-2xl md:text-4xl mb-4"
              style={{
                color: '#FFFEF9',
                fontFamily: 'var(--font-heading)',
                letterSpacing: '0.05em',
              }}
            >
              ARABICA: 1.2% CAFFEINE
            </p>
            <div 
              className="text-6xl md:text-8xl my-6"
              style={{ color: '#B87333' }}
            >
              VS
            </div>
            <p 
              className="text-3xl md:text-5xl gradient-copper"
              style={{
                fontFamily: 'var(--font-heading)',
                letterSpacing: '0.05em',
              }}
            >
              ROBUSTA: 2.7% CAFFEINE
            </p>
            
            <p 
              className="mt-8 text-lg"
              style={{
                color: '#CD7F32',
                fontWeight: 600,
              }}
            >
              THE CHOICE IS OBVIOUS
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}