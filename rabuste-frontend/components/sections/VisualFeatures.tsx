'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function VisualFeatures() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const features = [
    {
      title: 'Artisan Roasting',
      description: 'Every bean is carefully roasted to unlock its full potential and bold character',
      image: 'https://pixabay.com/get/ga76991737142f21e052cb9b889056489166329f0c99bc9d12867d26e72d6ea2f396fcde1fbf95ef246f4607ac0f9c7eb.jpg',
      attribution: 'cloudhoreca on Pixabay',
    },
    {
      title: 'Master Baristas',
      description: 'Our skilled team brings years of expertise to craft your perfect cup',
      image: 'https://images.pexels.com/photos/29516134/pexels-photo-29516134.jpeg?w=800&q=85',
      attribution: 'Enisa Halidi on Pexels',
    },
    {
      title: 'Cozy Atmosphere',
      description: 'A warm, inviting space designed for coffee lovers to relax and connect',
      image: 'https://images.pexels.com/photos/996219/pexels-photo-996219.jpeg?w=800&q=85',
      attribution: 'Arnon Suksumran on Pexels',
    },
  ];

  return (
    <section
      id="features"
      ref={ref}
      className="relative py-24 md:py-32"
      style={{ background: '#0a0a0a' }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span 
            className="text-sm uppercase tracking-widest font-semibold mb-4 block"
            style={{ 
              color: '#926644',
              fontFamily: 'var(--font-heading)',
            }}
          >
            Why Choose Us
          </span>
          <h2 
            className="text-4xl md:text-5xl font-bold"
            style={{
              fontFamily: 'var(--font-heading)',
            }}
          >
            <span className="gradient-text">The Rabuste Difference</span>
          </h2>
        </motion.div>

        {/* Features */}
        <div className="space-y-24">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`grid md:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Image */}
              <div 
                className={`relative ${index % 2 === 1 ? 'md:order-2' : ''}`}
              >
                <div 
                  className="relative rounded-3xl overflow-hidden"
                  style={{
                    boxShadow: '0 20px 60px rgba(146, 102, 68, 0.3)',
                  }}
                >
                  <img
                    src={feature.image}
                    alt={`${feature.title} - ${feature.attribution}`}
                    className="w-full h-96 object-cover"
                  />
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(180deg, transparent 0%, rgba(10, 10, 10, 0.3) 100%)',
                    }}
                  />
                </div>

                {/* Floating number */}
                <div 
                  className="absolute -top-8 -right-8 w-24 h-24 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #926644, #C89B7B)',
                    boxShadow: '0 8px 32px rgba(146, 102, 68, 0.4)',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '2.5rem',
                    fontWeight: 700,
                    color: '#ffffff',
                  }}
                >
                  {index + 1}
                </div>
              </div>

              {/* Content */}
              <div className={index % 2 === 1 ? 'md:order-1' : ''}>
                <h3 
                  className="text-3xl md:text-4xl font-bold mb-4"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: '#E6C9A8',
                  }}
                >
                  {feature.title}
                </h3>
                <p 
                  className="text-xl mb-6"
                  style={{
                    color: '#D0B5A2',
                    lineHeight: 1.8,
                  }}
                >
                  {feature.description}
                </p>
                
                <div className="flex gap-4">
                  <div 
                    className="px-6 py-3 rounded-full"
                    style={{
                      background: 'rgba(146, 102, 68, 0.1)',
                      border: '1px solid rgba(146, 102, 68, 0.3)',
                      color: '#926644',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 600,
                    }}
                  >
                    ✓ Premium Quality
                  </div>
                  <div 
                    className="px-6 py-3 rounded-full"
                    style={{
                      background: 'rgba(146, 102, 68, 0.1)',
                      border: '1px solid rgba(146, 102, 68, 0.3)',
                      color: '#926644',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 600,
                    }}
                  >
                    ✓ Expert Craft
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}