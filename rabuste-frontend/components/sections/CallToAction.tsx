'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowRight, Zap } from 'lucide-react';

export default function CallToAction() {
  const router = useRouter();

  return (
    <section 
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1A1110 0%, #3D2B1F 50%, #592720 100%)',
        padding: '120px 20px',
      }}
    >
      {/* Animated background */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(https://images.pexels.com/photos/669162/pexels-photo-669162.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </div>

      <div className="container px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-5xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 24px',
              background: 'rgba(184, 115, 51, 0.2)',
              border: '2px solid #B87333',
              marginBottom: '2rem',
            }}
          >
            <Zap size={20} color="#B87333" />
            <span style={{
              color: '#B87333',
              fontSize: '0.875rem',
              letterSpacing: '0.2em',
              fontWeight: 700,
            }}>
              LIMITED TIME OFFER
            </span>
          </motion.div>

          {/* Headline */}
          <h2 style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 'clamp(3rem, 10vw, 8rem)',
            lineHeight: 0.9,
            color: '#FFFEF9',
            marginBottom: '1.5rem',
          }}>
            READY TO
            <br />
            <span className="gradient-text" style={{
              background: 'linear-gradient(135deg, #B87333 0%, #CD7F32 50%, #D4A574 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              UPGRADE
            </span>
            <br />
            YOUR BREW?
          </h2>

          <p style={{
            fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
            color: 'rgba(255, 254, 249, 0.8)',
            lineHeight: 1.6,
            marginBottom: '3rem',
            maxWidth: '700px',
            margin: '0 auto 3rem',
          }}>
            Experience the boldest coffee you've ever tasted. 
            <br />
            Order now and discover what real power tastes like.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={() => router.push('/menu')}
              className="btn btn-primary group"
              style={{
                background: 'linear-gradient(135deg, #B87333 0%, #CD7F32 50%, #D4A574 100%)',
                color: '#000000',
                padding: '28px 70px',
                fontSize: '1.5rem',
                fontFamily: 'Bebas Neue, sans-serif',
                letterSpacing: '0.15em',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 20px 60px rgba(184, 115, 51, 0.4)',
              }}
            >
              ORDER NOW
              <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-12 mt-16"
          >
            {[
              { value: '15+', label: 'Years Excellence' },
              { value: '2X', label: 'Caffeine Power' },
              { value: '100%', label: 'Premium Robusta' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  color: '#B87333',
                  lineHeight: 1,
                  marginBottom: '0.5rem',
                }}>
                  {stat.value}
                </div>
                <div style={{
                  color: 'rgba(255, 254, 249, 0.7)',
                  fontSize: '0.875rem',
                  letterSpacing: '0.1em',
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}