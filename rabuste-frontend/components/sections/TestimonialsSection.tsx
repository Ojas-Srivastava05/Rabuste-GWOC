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
          className="text-center mb-12 sm:mb-20"
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
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 'clamp(2.5rem, 8vw, 7rem)',
            lineHeight: 0.9,
            color: '#FFFEF9',
            marginBottom: '1rem',
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

        {/* Testimonials Grid - Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03, y: -8 }}
              style={{
                background: 'linear-gradient(135deg, rgba(61, 43, 31, 0.8), rgba(26, 17, 16, 0.8))',
                border: `3px solid ${testimonial.color}40`,
                padding: 'clamp(24px, 5vw, 32px)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Quote icon */}
              <Quote 
                size={60} 
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  color: `${testimonial.color}20`,
                }}
              />

              {/* Rating */}
              <div style={{
                display: 'flex',
                gap: '4px',
                marginBottom: 'clamp(16px, 3vw, 20px)',
              }}>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    fill={testimonial.color}
                    color={testimonial.color}
                  />
                ))}
              </div>

              {/* Text */}
              <p style={{
                fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                lineHeight: 1.7,
                color: 'rgba(255, 254, 249, 0.9)',
                marginBottom: 'clamp(20px, 4vw, 24px)',
                position: 'relative',
                zIndex: 1,
              }}>
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(12px, 3vw, 16px)',
              }}>
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  style={{
                    width: 'clamp(50px, 10vw, 60px)',
                    height: 'clamp(50px, 10vw, 60px)',
                    borderRadius: '50%',
                    border: `3px solid ${testimonial.color}`,
                  }}
                />
                
                <div>
                  <div style={{
                    fontFamily: 'Bebas Neue, sans-serif',
                    fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)',
                    color: '#FFFEF9',
                    letterSpacing: '0.05em',
                  }}>
                    {testimonial.name}
                  </div>
                  <div style={{
                    fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                    color: testimonial.color,
                    letterSpacing: '0.05em',
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