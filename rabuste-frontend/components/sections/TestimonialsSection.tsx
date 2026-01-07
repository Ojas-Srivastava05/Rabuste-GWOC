'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Arjun Mehta',
    role: 'Startup Founder',
    image: 'https://i.pravatar.cc/150?u=arjun',
    rating: 5,
    text: 'Switched from Arabica 3 months ago. The energy boost is real - no more 3 PM crashes. Productivity doubled.',
    color: '#B87333',
  },
  {
    name: 'Priya Sharma',
    role: 'Fitness Coach',
    image: 'https://i.pravatar.cc/150?u=priya',
    rating: 5,
    text: 'I recommend Rabuste to all my clients. Perfect pre-workout. The sustained energy helps them push harder.',
    color: '#CD7F32',
  },
  {
    name: 'Vikram Singh',
    role: 'Software Engineer',
    image: 'https://i.pravatar.cc/150?u=vikram',
    rating: 5,
    text: 'Was skeptical about Robusta. One cup and I was converted. Bold flavor and focus are game changers.',
    color: '#D4A574',
  },
  {
    name: 'Ananya Reddy',
    role: 'Medical Student',
    image: 'https://i.pravatar.cc/150?u=ananya',
    rating: 5,
    text: 'Studying 18+ hours needed something stronger. Rabuste delivers. No jitters, just pure focus.',
    color: '#B87333',
  },
];

export default function TestimonialsSection() {
  return (
    <section 
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #000000 0%, #1A1110 50%, #000000 100%)',
        padding: 'clamp(80px, 15vw, 120px) 0',
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p style={{
            color: '#B87333',
            fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
            letterSpacing: '0.3em',
            fontWeight: 700,
            marginBottom: '1.5rem',
          }}>
            REAL RESULTS
          </p>

          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.5rem, 8vw, 7rem)',
            lineHeight: 0.9,
            color: '#FFFEF9',
            marginBottom: '1rem',
            letterSpacing: '0.05em',
          }}>
            WHAT OUR
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #B87333 0%, #CD7F32 50%, #D4A574 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              CUSTOMERS
            </span>
            <br />
            SAY
          </h2>
        </motion.div>

        {/* Testimonials Grid - Sleeker Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="group relative"
              style={{
                background: 'linear-gradient(135deg, rgba(26, 17, 16, 0.6), rgba(42, 24, 16, 0.5))',
                border: `1px solid ${testimonial.color}30`,
                padding: 'clamp(20px, 4vw, 28px)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
              }}
            >
              {/* Subtle Corner Accent */}
              <div 
                className="absolute top-0 left-0 w-12 h-12 opacity-20"
                style={{
                  background: `linear-gradient(135deg, ${testimonial.color}, transparent)`,
                }}
              />

              {/* Quote Icon - Smaller and Subtle */}
              <Quote 
                size={32} 
                className="absolute top-4 right-4 opacity-10"
                style={{ color: testimonial.color }}
              />

              {/* Rating - Compact */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={testimonial.color}
                    color={testimonial.color}
                  />
                ))}
              </div>

              {/* Text - More readable spacing */}
              <p style={{
                fontSize: 'clamp(0.9rem, 1.8vw, 1rem)',
                lineHeight: 1.7,
                color: 'rgba(255, 254, 249, 0.85)',
                marginBottom: '20px',
                position: 'relative',
                zIndex: 1,
              }}>
                "{testimonial.text}"
              </p>

              {/* Author - Horizontal Layout, Compact */}
              <div className="flex items-center gap-3 pt-4 border-t border-[rgba(184,115,51,0.15)]">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: `2px solid ${testimonial.color}`,
                  }}
                />
                
                <div>
                  <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                    color: '#FFFEF9',
                    letterSpacing: '0.03em',
                    lineHeight: 1.2,
                  }}>
                    {testimonial.name}
                  </div>
                  <div style={{
                    fontSize: 'clamp(0.7rem, 1.4vw, 0.8rem)',
                    color: testimonial.color,
                    letterSpacing: '0.03em',
                  }}>
                    {testimonial.role}
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