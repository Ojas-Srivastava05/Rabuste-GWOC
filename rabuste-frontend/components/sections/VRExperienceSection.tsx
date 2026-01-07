'use client';

import React, { useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Glasses, Eye, Zap } from 'lucide-react';
import dynamic from 'next/dynamic';

const VRViewer = dynamic(() => import('../VRViewer'), { ssr: false });

export default function VRExperienceSection() {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [isVROpen, setIsVROpen] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #000000 0%, #1A1110 50%, #000000 100%)',
        padding: 'clamp(60px, 10vw, 100px) 0',
      }}
    >
      {/* Premium Diagonal Lines Background */}
      <motion.div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 50px,
            rgba(184, 115, 51, 0.5) 50px,
            rgba(184, 115, 51, 0.5) 52px
          )`,
          y,
        }}
      />

      {/* Radial Gradient Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(184, 115, 51, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div ref={ref} className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Compact Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12 lg:mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <div 
              style={{
                width: '50px',
                height: '2px',
                background: 'linear-gradient(90deg, transparent, #B87333)',
              }}
            />
            <div className="flex items-center gap-2">
              <Zap style={{ width: 16, height: 16, color: '#B87333' }} />
              <span style={{
                color: '#B87333',
                fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                letterSpacing: '0.3em',
                fontWeight: 700,
              }}>
                EXPLORE VIRTUALLY
              </span>
            </div>
            <div 
              style={{
                width: '50px',
                height: '2px',
                background: 'linear-gradient(90deg, #B87333, transparent)',
              }}
            />
          </div>

          <h2 style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            lineHeight: 0.9,
            color: '#FFFEF9',
            marginBottom: '1rem',
            letterSpacing: '-0.02em',
          }}>
            360° VR
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #B87333 0%, #CD7F32 30%, #D4A574 60%, #CD7F32 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              EXPERIENCE
            </span>
          </h2>

          <p style={{
            fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
            color: 'rgba(255, 254, 249, 0.7)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.5,
            fontWeight: 300,
          }}>
            Take a virtual tour of our coffee shop from anywhere
          </p>
        </motion.div>

        {/* Compact Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-5xl mx-auto">
          {/* Left Side - VR Preview */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative group cursor-pointer"
            onClick={() => setIsVROpen(true)}
          >
            {/* Glow Effect */}
            <div 
              className="absolute -inset-3 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              style={{
                background: 'linear-gradient(135deg, rgba(184, 115, 51, 0.3), rgba(205, 127, 50, 0.3))',
                filter: 'blur(30px)',
              }}
            />

            <div className="relative overflow-hidden">
              <div 
                className="absolute inset-0 bg-gradient-to-br from-copper/20 to-bronze/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 mix-blend-overlay"
              />
              
              <img
                src="https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&q=80"
                alt="Virtual reality coffee shop experience"
                style={{
                  width: '100%',
                  height: 'auto',
                  aspectRatio: '4/3',
                  objectFit: 'cover',
                  backgroundColor: '#2A1810',
                  transform: 'scale(1)',
                  transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                  border: '3px solid',
                  borderImage: 'linear-gradient(135deg, #B87333, #CD7F32, #D4A574) 1',
                }}
                className="group-hover:scale-105"
              />
              
              {/* VR Badge */}
              <div 
                className="absolute top-6 left-6 px-6 py-3 backdrop-blur-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(26, 17, 16, 0.8))',
                  border: '2px solid rgba(184, 115, 51, 0.6)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
                }}
              >
                <div className="flex items-center gap-2">
                  <Glasses style={{ width: 20, height: 20, color: '#B87333' }} />
                  <span style={{
                    fontFamily: 'Bebas Neue, sans-serif',
                    fontSize: '1rem',
                    color: '#FFFEF9',
                    letterSpacing: '0.1em',
                  }}>
                    360° VR
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Feature Highlights */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            {[
              { icon: Glasses, title: 'Immersive Tour', desc: 'Explore every corner in 360° virtual reality' },
              { icon: Eye, title: 'Interactive Spots', desc: 'Click to navigate through different areas' },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-start gap-4 p-4"
                style={{
                  background: 'linear-gradient(135deg, rgba(26, 17, 16, 0.6), rgba(42, 24, 16, 0.6))',
                  border: '2px solid rgba(184, 115, 51, 0.2)',
                }}
              >
                <div 
                  className="flex-shrink-0 p-3"
                  style={{
                    background: 'linear-gradient(135deg, rgba(184, 115, 51, 0.2), rgba(205, 127, 50, 0.2))',
                    border: '1px solid rgba(184, 115, 51, 0.3)',
                  }}
                >
                  <feature.icon style={{ width: 24, height: 24, color: '#B87333' }} />
                </div>
                <div>
                  <h3 style={{
                    fontFamily: 'Bebas Neue, sans-serif',
                    fontSize: '1.25rem',
                    color: '#FFFEF9',
                    marginBottom: '0.25rem',
                    letterSpacing: '0.05em',
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{
                    fontSize: '0.875rem',
                    color: 'rgba(255, 254, 249, 0.7)',
                    lineHeight: 1.5,
                  }}>
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* CTA Button */}
            <motion.button
              onClick={() => setIsVROpen(true)}
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="group relative overflow-hidden w-full"
              style={{
                padding: '16px 32px',
                background: 'linear-gradient(135deg, #B87333 0%, #CD7F32 50%, #D4A574 100%)',
                border: 'none',
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: '1.125rem',
                letterSpacing: '0.15em',
                color: '#000000',
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(184, 115, 51, 0.5)',
              }}
            >
              <div className="flex items-center justify-center gap-3">
                <Glasses style={{ width: 22, height: 22 }} />
                <span>LAUNCH VR TOUR</span>
              </div>
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* VR Modal */}
      <VRViewer isOpen={isVROpen} onClose={() => setIsVROpen(false)} />
    </section>
  );
}