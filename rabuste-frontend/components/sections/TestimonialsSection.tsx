'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Arjun Mehta',
    role: 'Startup Founder',
    image: 'https://i.pravatar.cc/150?u=arjun',
    rating: 5,
    text: 'Switched from Arabica 3 months ago. The energy boost is real - no more 3 PM crashes. My productivity has literally doubled.',
  },
  {
    name: 'Priya Sharma',
    role: 'Fitness Coach',
    image: 'https://i.pravatar.cc/150?u=priya',
    rating: 5,
    text: 'I recommend Rabuste to all my clients. Perfect pre-workout drink. The sustained energy helps them push harder, longer.',
  },
  {
    name: 'Vikram Singh',
    role: 'Software Engineer',
    image: 'https://i.pravatar.cc/150?u=vikram',
    rating: 5,
    text: 'Was skeptical about Robusta. One cup and I was converted. The bold flavor and long-lasting focus are game changers for coding sessions.',
  },
  {
    name: 'Ananya Reddy',
    role: 'Medical Student',
    image: 'https://i.pravatar.cc/150?u=ananya',
    rating: 5,
    text: 'Studying for 18+ hours needed something stronger. Rabuste delivers. No jitters, just pure focus. Worth every rupee.',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="section relative">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-4 mb-8">
            <div className="copper-line" />
            <span className="section-label">REAL RESULTS</span>
            <div className="copper-line" style={{ transform: 'scaleX(-1)' }} />
          </div>

          <h2
            className="text-5xl md:text-7xl mb-6"
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 400,
              lineHeight: 1,
              color: '#FFFEF9',
            }}
          >
            WHAT OUR
            <br />
            <span className="gradient-copper">CUSTOMERS SAY</span>
          </h2>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="brutal-card p-8 hover:scale-105 transition-all duration-300"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    fill="#B87333"
                    stroke="#B87333"
                  />
                ))}
              </div>

              {/* Quote */}
              <p
                className="text-lg mb-8 leading-relaxed"
                style={{ color: '#D4A574' }}
              >
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full"
                  style={{
                    border: '2px solid rgba(184, 115, 51, 0.3)',
                  }}
                />
                <div>
                  <div
                    className="font-bold"
                    style={{
                      color: '#FFFEF9',
                      fontFamily: 'var(--font-heading)',
                    }}
                  >
                    {testimonial.name}
                  </div>
                  <div
                    className="text-sm"
                    style={{ color: '#8B6F47' }}
                  >
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto"
        >
          {[
            { value: '50K+', label: 'Happy Customers' },
            { value: '4.9/5', label: 'Average Rating' },
            { value: '95%', label: 'Reorder Rate' },
            { value: '100K+', label: 'Cups Served' },
          ].map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div
                className="text-4xl md:text-5xl font-bold mb-2"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: '#B87333',
                }}
              >
                {stat.value}
              </div>
              <div
                className="text-sm uppercase tracking-wider"
                style={{ color: '#8B6F47' }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}