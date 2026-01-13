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
    color: '#B87333',
  },
  {
    name: 'Vikram Singh',
    role: 'Software Engineer',
    image: 'https://i.pravatar.cc/150?u=vikram',
    rating: 5,
    text: 'Was skeptical about Robusta. One cup and I was converted. Bold flavor and focus are game changers.',
    color: '#B87333',
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
            color: '#8B6F47',
            fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
            letterSpacing: '0.2em',
            fontWeight: 400,
            marginBottom: '1.5rem',
            textTransform: 'uppercase',
          }}>
            REAL RESULTS
          </p>

          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(3rem, 10vw, 8rem)',
            lineHeight: 0.9,
            color: '#F5F1E8',
            marginBottom: '1rem',
            fontWeight: 400,
            letterSpacing: '0.02em',
          }}>
            WHAT OUR
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #FFFEF9 0%, #D4A574 50%, #FFFEF9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 80px rgba(212, 165, 116, 0.3)',
              position: 'relative',
              display: 'inline-block',
            }}>
              CUSTOMERS
              {/* Glow effect behind text */}
              <motion.span
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 blur-2xl"
                style={{
                  background: 'linear-gradient(135deg, #D4A574, #B87333)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  zIndex: -1,
                }}
              >
                CUSTOMERS
              </motion.span>
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
                background: 'rgba(26, 17, 16, 0.6)',
                border: `1px solid rgba(184, 115, 51, 0.2)`,
                padding: 'clamp(24px, 4vw, 32px)',
                transition: 'all 0.3s ease',
              }}
            >
              {/* Quote Icon - Smaller and Subtle */}
              <Quote 
                size={32} 
                className="absolute top-4 right-4 opacity-5"
                style={{ color: '#B87333' }}
              />

              {/* Rating - Compact */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill="#B87333"
                    color="#B87333"
                  />
                ))}
              </div>

              {/* Text - More readable spacing */}
              <p style={{
                fontSize: 'clamp(0.9rem, 1.8vw, 1rem)',
                lineHeight: 1.7,
                color: 'rgba(245, 241, 232, 0.8)',
                marginBottom: '20px',
                position: 'relative',
                zIndex: 1,
                fontWeight: 300,
              }}>
                "{testimonial.text}"
              </p>

              {/* Author - Horizontal Layout, Compact */}
              <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: 'rgba(184, 115, 51, 0.2)' }}>
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: `2px solid rgba(184, 115, 51, 0.3)`,
                  }}
                />
                
                <div>
                  <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                    color: '#F5F1E8',
                    letterSpacing: '0.03em',
                    lineHeight: 1.2,
                    fontWeight: 400,
                  }}>
                    {testimonial.name}
                  </div>
                  <div style={{
                    fontSize: 'clamp(0.7rem, 1.4vw, 0.8rem)',
                    color: '#B87333',
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