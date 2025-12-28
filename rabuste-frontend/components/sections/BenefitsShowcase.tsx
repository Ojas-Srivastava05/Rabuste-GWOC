'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Zap, Brain, Dumbbell, Clock, TrendingUp, Award } from 'lucide-react';
import ComparisonSection from './ComparisonSection';

const benefits = [
  {
    icon: Zap,
    title: '2X CAFFEINE',
    value: '2.7%',
    comparison: 'vs 1.5% Arabica',
    desc: 'Double the energy for your day',
    color: '#B87333',
  },
  {
    icon: Brain,
    title: 'SHARP FOCUS',
    value: '4-6HRS',
    comparison: 'sustained energy',
    desc: 'Stay sharp throughout workday',
    color: '#CD7F32',
  },
  {
    icon: Dumbbell,
    title: 'PERFORMANCE',
    value: '+15%',
    comparison: 'athletic boost',
    desc: 'Perfect pre-workout fuel',
    color: '#D4A574',
  },
  {
    icon: Clock,
    title: 'LONG LASTING',
    value: '6-8HRS',
    comparison: 'energy duration',
    desc: 'No mid-day crashes',
    color: '#B87333',
  },
  {
    icon: TrendingUp,
    title: 'METABOLISM',
    value: '+11%',
    comparison: 'metabolic rate',
    desc: 'Burns more calories naturally',
    color: '#CD7F32',
  },
  {
    icon: Award,
    title: 'ANTIOXIDANTS',
    value: '7-10%',
    comparison: 'more CGA',
    desc: 'Superior health benefits',
    color: '#D4A574',
  },
];

export default function BenefitsShowcase() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section 
      ref={containerRef}
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #000000 0%, #1A1110 50%, #000000 100%)',
        padding: '120px 0',
      }}
    >
      {/* Parallax background */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 opacity-5"
      >
        <div
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/669162/pexels-photo-669162.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '100%',
            height: '120%',
          }}
        />
      </motion.div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-8">
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
            WHY ROBUSTA DOMINATES
          </p>
          
          <h2 style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 'clamp(2.5rem, 8vw, 7rem)',
            lineHeight: 0.9,
            color: '#FFFEF9',
            marginBottom: '1rem',
          }}>
            SCIENCE
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #B87333 0%, #CD7F32 50%, #D4A574 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              BACKED
            </span>
            <br />
            POWER
          </h2>

          {/* See research button removed */}
        </motion.div>

        {/* Premium Bento Grid Layout */}
        <div className="grid grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
          
          {/* Large Featured Card - 2X Caffeine (spans 8 cols on desktop) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            className="col-span-12 lg:col-span-8 group relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(184, 115, 51, 0.15), rgba(26, 17, 16, 0.9))',
              border: '3px solid rgba(184, 115, 51, 0.5)',
              padding: 'clamp(24px, 5vw, 60px)',
              minHeight: 'clamp(350px, 50vw, 400px)',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
            }}
          >
            {/* Background pattern */}
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: 'radial-gradient(circle, #B87333 1px, transparent 1px)',
                backgroundSize: '30px 30px',
              }}
            />

            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-start justify-between mb-8">
                  <div
                    style={{
                      background: '#B87333',
                      width: '100px',
                      height: '100px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Zap size={56} color="#000" strokeWidth={2.5} fill="#000" />
                  </div>

                  <div className="text-right">
                    <div style={{
                      fontFamily: 'Bebas Neue, sans-serif',
                      fontSize: 'clamp(4rem, 8vw, 7rem)',
                      lineHeight: 0.9,
                      color: '#B87333',
                    }}>
                      2X
                    </div>
                    <div style={{
                      fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                      color: 'rgba(255, 254, 249, 0.6)',
                      letterSpacing: '0.1em',
                    }}>
                      vs Arabica
                    </div>
                  </div>
                </div>

                <h3 style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                  color: '#FFFEF9',
                  marginBottom: '1rem',
                  letterSpacing: '0.05em',
                }}>
                  DOUBLE THE CAFFEINE
                </h3>

                <p style={{
                  fontSize: 'clamp(1rem, 2vw, 1.5rem)',
                  color: 'rgba(255, 254, 249, 0.85)',
                  lineHeight: 1.6,
                  maxWidth: '600px',
                }}>
                  2.7% caffeine content delivers twice the energy of arabica. 
                  Real power for your day, no compromise.
                </p>
              </div>

              {/* Bottom accent */}
              <div
                className="h-2 w-0 group-hover:w-full transition-all duration-700"
                style={{
                  background: 'linear-gradient(90deg, #B87333, #CD7F32, #D4A574)',
                  marginTop: '2rem',
                }}
              />
            </div>
          </motion.div>

          {/* Right Column - 2 stacked cards (spans 4 cols on desktop) */}
          <div className="col-span-12 lg:col-span-4 grid grid-rows-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Sharp Focus */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03 }}
              className="group relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(61, 43, 31, 0.8), rgba(26, 17, 16, 0.8))',
              border: '3px solid rgba(205, 127, 50, 0.4)',
              padding: 'clamp(20px, 4vw, 32px)',
                cursor: 'pointer',
              }}
            >
              <Brain size={40} color="#CD7F32" strokeWidth={2.5} className="mb-3 sm:mb-4 sm:w-12 sm:h-12" />
              <div style={{
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                color: '#CD7F32',
                marginBottom: '0.5rem',
              }}>
                4-6HRS
              </div>
              <h4 style={{
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                color: '#FFFEF9',
                marginBottom: '0.5rem',
                letterSpacing: '0.05em',
              }}>
                SHARP FOCUS
              </h4>
              <p style={{
                fontSize: 'clamp(0.875rem, 1.8vw, 1rem)',
                color: 'rgba(255, 254, 249, 0.7)',
                lineHeight: 1.5,
              }}>
                Sustained energy throughout workday
              </p>
            </motion.div>

            {/* Performance */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03 }}
              className="group relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(61, 43, 31, 0.8), rgba(26, 17, 16, 0.8))',
                border: '3px solid rgba(212, 165, 116, 0.4)',
                padding: 'clamp(24px, 4vw, 32px)',
                cursor: 'pointer',
              }}
            >
              <Dumbbell size={40} color="#D4A574" strokeWidth={2.5} className="mb-3 sm:mb-4 sm:w-12 sm:h-12" />
              <div style={{
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                color: '#D4A574',
                marginBottom: '0.5rem',
              }}>
                +15%
              </div>
              <h4 style={{
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                color: '#FFFEF9',
                marginBottom: '0.5rem',
                letterSpacing: '0.05em',
              }}>
                PERFORMANCE
              </h4>
              <p style={{
                fontSize: 'clamp(0.875rem, 1.8vw, 1rem)',
                color: 'rgba(255, 254, 249, 0.7)',
                lineHeight: 1.5,
              }}>
                Perfect pre-workout fuel
              </p>
            </motion.div>
          </div>

          {/* Bottom Row - 3 equal cards */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            className="col-span-12 sm:col-span-6 lg:col-span-4"
            style={{
              background: 'linear-gradient(135deg, rgba(61, 43, 31, 0.8), rgba(26, 17, 16, 0.8))',
              border: '3px solid rgba(184, 115, 51, 0.4)',
              padding: 'clamp(24px, 4vw, 32px)',
              cursor: 'pointer',
            }}
          >
            <Clock size={44} color="#B87333" strokeWidth={2.5} className="mb-4 sm:mb-6 sm:w-14 sm:h-14" />
            <div style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
              color: '#B87333',
              marginBottom: '0.5rem',
            }}>
              6-8HRS
            </div>
            <h4 style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              color: '#FFFEF9',
              marginBottom: '0.75rem',
              letterSpacing: '0.05em',
            }}>
              LONG LASTING
            </h4>
            <p style={{
              fontSize: 'clamp(0.875rem, 1.8vw, 1rem)',
              color: 'rgba(255, 254, 249, 0.75)',
              lineHeight: 1.6,
            }}>
              No mid-day crashes
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            className="col-span-12 sm:col-span-6 lg:col-span-4"
            style={{
              background: 'linear-gradient(135deg, rgba(61, 43, 31, 0.8), rgba(26, 17, 16, 0.8))',
              border: '3px solid rgba(205, 127, 50, 0.4)',
              padding: 'clamp(24px, 4vw, 32px)',
              cursor: 'pointer',
            }}
          >
            <TrendingUp size={44} color="#CD7F32" strokeWidth={2.5} className="mb-4 sm:mb-6 sm:w-14 sm:h-14" />
            <div style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
              color: '#CD7F32',
              marginBottom: '0.5rem',
            }}>
              +11%
            </div>
            <h4 style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              color: '#FFFEF9',
              marginBottom: '0.75rem',
              letterSpacing: '0.05em',
            }}>
              METABOLISM
            </h4>
            <p style={{
              fontSize: 'clamp(0.875rem, 1.8vw, 1rem)',
              color: 'rgba(255, 254, 249, 0.75)',
              lineHeight: 1.6,
            }}>
              Burns calories naturally
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            className="col-span-12 sm:col-span-12 lg:col-span-4"
            style={{
              background: 'linear-gradient(135deg, rgba(61, 43, 31, 0.8), rgba(26, 17, 16, 0.8))',
              border: '3px solid rgba(212, 165, 116, 0.4)',
              padding: 'clamp(24px, 4vw, 32px)',
              cursor: 'pointer',
            }}
          >
            <Award size={44} color="#D4A574" strokeWidth={2.5} className="mb-4 sm:mb-6 sm:w-14 sm:h-14" />
            <div style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
              color: '#D4A574',
              marginBottom: '0.5rem',
            }}>
              7-10%
            </div>
            <h4 style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              color: '#FFFEF9',
              marginBottom: '0.75rem',
              letterSpacing: '0.05em',
            }}>
              ANTIOXIDANTS
            </h4>
            <p style={{
              fontSize: 'clamp(0.875rem, 1.8vw, 1rem)',
              color: 'rgba(255, 254, 249, 0.75)',
              lineHeight: 1.6,
            }}>
              Superior health benefits
            </p>
          </motion.div>
        </div>

        {/* ComparisonSection anchor - renders the ComparisonSection component so button can scroll to it */}
        <div id="comparison" className="mt-16">
          <ComparisonSection />
        </div>
      </div>
    </section>
  );
}