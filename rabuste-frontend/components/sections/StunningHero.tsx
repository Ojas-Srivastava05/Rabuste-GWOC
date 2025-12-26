'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function StunningHero() {
  const router = useRouter();

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Full-screen background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1762657440642-e60095d29d93?w=1920&q=90"
          alt="Premium coffee being poured - Photo by Kaylee Stoll on Unsplash"
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.85) 0%, rgba(26, 17, 16, 0.7) 50%, rgba(61, 43, 31, 0.6) 100%)',
          }}
        />
      </div>

      {/* Floating coffee beans decoration */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 right-10 opacity-10"
        style={{ fontSize: '8rem' }}
      >
        ☕
      </motion.div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text content */}
            <div>
              {/* Award badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                style={{
                  background: 'rgba(146, 102, 68, 0.2)',
                  border: '1px solid rgba(146, 102, 68, 0.5)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Star size={16} fill="#926644" color="#926644" />
                <span style={{ color: '#E6C9A8', fontSize: '0.9rem', fontFamily: 'var(--font-heading)' }}>
                  Premium Robusta Coffee
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{
                  fontSize: 'clamp(3rem, 7vw, 5.5rem)',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  lineHeight: 1.1,
                  marginBottom: '1.5rem',
                }}
              >
                <span style={{ color: '#E6C9A8' }}>Experience</span>
                <br />
                <span className="gradient-text">Bold Perfection</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl md:text-2xl mb-8"
                style={{
                  color: '#D0B5A2',
                  lineHeight: 1.7,
                  maxWidth: '600px',
                }}
              >
                Where artisanal craftsmanship meets the rich intensity of premium Robusta beans. 
                Every cup tells a story of passion and excellence.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-wrap gap-4"
              >
                <button
                  onClick={() => router.push('/menu')}
                  className="group relative px-8 py-4 rounded-full font-semibold text-lg overflow-hidden transition-all hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #926644, #C89B7B)',
                    color: '#ffffff',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-heading)',
                    boxShadow: '0 8px 32px rgba(146, 102, 68, 0.4)',
                  }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Explore Menu
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>

                <button
                  onClick={() => {
                    const element = document.getElementById('features');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105"
                  style={{
                    background: 'rgba(146, 102, 68, 0.1)',
                    color: '#E6C9A8',
                    border: '2px solid rgba(146, 102, 68, 0.5)',
                    backdropFilter: 'blur(10px)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-heading)',
                  }}
                >
                  Learn More
                </button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="grid grid-cols-3 gap-6 mt-12 pt-8"
                style={{ borderTop: '1px solid rgba(146, 102, 68, 0.3)' }}
              >
                {[
                  { number: '15+', label: 'Years' },
                  { number: '50K+', label: 'Happy Customers' },
                  { number: '100%', label: 'Premium Beans' },
                ].map((stat, index) => (
                  <div key={stat.label}>
                    <div 
                      className="text-3xl md:text-4xl font-bold mb-1"
                      style={{ color: '#926644', fontFamily: 'var(--font-heading)' }}
                    >
                      {stat.number}
                    </div>
                    <div style={{ color: '#D0B5A2', fontSize: '0.9rem' }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right side - Floating product card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="hidden lg:block"
            >
              <div 
                className="relative rounded-3xl overflow-hidden"
                style={{
                  background: 'rgba(26, 26, 26, 0.6)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(146, 102, 68, 0.3)',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                  padding: '2rem',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1629991848910-2ab88d9cc52f?w=600&q=85"
                  alt="Cappuccino with latte art - Photo by Stephanie Morales on Unsplash"
                  className="w-full h-96 object-cover rounded-2xl mb-6"
                />
                <h3 
                  className="text-2xl font-bold mb-2"
                  style={{ color: '#E6C9A8', fontFamily: 'var(--font-heading)' }}
                >
                  Signature Cappuccino
                </h3>
                <p style={{ color: '#D0B5A2', marginBottom: '1.5rem' }}>
                  Handcrafted with precision, featuring our bold Robusta blend
                </p>
                <div className="flex items-center justify-between">
                  <span 
                    className="text-3xl font-bold"
                    style={{ color: '#926644' }}
                  >
                    ₹180
                  </span>
                  <button
                    className="px-6 py-3 rounded-full font-semibold transition-transform hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, #926644, #C89B7B)',
                      color: '#ffffff',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-heading)',
                    }}
                  >
                    Order Now
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}