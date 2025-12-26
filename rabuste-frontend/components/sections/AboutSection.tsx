'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      id="about"
      ref={ref}
      className="section"
      style={{ background: '#1E1E1E' }}
    >
      <div className="container px-6">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7"
          >
            <div 
              className="relative overflow-hidden"
              style={{
                aspectRatio: '16/10',
                border: '1px solid rgba(201, 168, 106, 0.2)',
                borderRadius: '4px',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&q=90"
                alt="Coffee roasting"
                className="w-full h-full object-cover"
              />
              <div 
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(180deg, transparent 0%, rgba(10, 10, 10, 0.3) 100%)',
                }}
              />
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 space-y-8"
          >
            <div className="flex items-center gap-4">
              <div className="gold-line" />
              <span className="section-label">Our Legacy</span>
            </div>

            <h2 
              style={{
                color: '#F5F1E8',
                fontWeight: 200,
              }}
            >
              Fifteen Years of
              <br />
              <span className="gradient-text">Excellence</span>
            </h2>
            
            <div className="space-y-6">
              <p 
                className="text-base md:text-lg"
                style={{ 
                  color: '#C9A86A',
                  lineHeight: 1.8,
                }}
              >
                What began as a passion for exceptional coffee has evolved into 
                a destination for connoisseurs who appreciate the bold, distinctive 
                character of premium Robusta beans.
              </p>
              
              <p 
                className="text-base"
                style={{ 
                  color: '#8B6F47',
                  lineHeight: 1.8,
                }}
              >
                Every bean is carefully sourced from the finest plantations, 
                roasted in small batches to perfection, and brewed with precision 
                by our expert baristas.
              </p>
            </div>

            {/* Features grid */}
            <div className="grid grid-cols-2 gap-6 pt-4">
              {[
                { label: 'Premium Beans' },
                { label: 'Expert Roasting' },
                { label: 'Artisan Craft' },
                { label: 'Daily Fresh' },
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div 
                    className="w-1 h-8"
                    style={{
                      background: 'linear-gradient(180deg, #C9A86A, transparent)',
                    }}
                  />
                  <span 
                    className="text-sm uppercase tracking-wide"
                    style={{
                      color: '#C9A86A',
                      fontFamily: 'var(--font-heading)',
                    }}
                  >
                    {feature.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}