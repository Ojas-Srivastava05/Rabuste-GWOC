'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Zap, Brain, Dumbbell, Clock, TrendingUp, Award } from 'lucide-react';
import ComparisonSection from './ComparisonSection';
import Balatro from '../bg';

const benefits = [
  {
    icon: Zap,
    title: '2X CAFFEINE',
    value: '2.7%',
    comparison: 'vs 1.5% Arabica',
    desc: 'Double energy for your day',
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
      {/* Balatro Background Effect */}
      <Balatro />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-20"
        >
          <p style={{
            color: '#8B6F47',
            fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
            letterSpacing: '0.2em',
            fontWeight: 400,
            marginBottom: '1.5rem',
            textTransform: 'uppercase',
          }}>
            WHY ROBUSTA DOMINATES
          </p>
          
          <h2 style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 'clamp(3rem, 10vw, 8rem)',
            lineHeight: 0.9,
            color: '#F5F1E8',
            marginBottom: '1rem',
            fontWeight: 400,
            letterSpacing: '0.02em',
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
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, scale: 1.05 }}
            className="group relative overflow-hidden"
            style={{
              background: 'rgba(26, 17, 16, 0.6)',
              border: '1px solid rgba(184, 115, 51, 0.3)',
              padding: 'clamp(16px, 3vw, 24px)',
              minHeight: 'clamp(200px, 25vw, 280px)',
              cursor: 'pointer',
            }}
          >
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div style={{
                    background: '#B87333',
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Zap size={32} color="#000" strokeWidth={2} fill="#000" />
                  </div>
                  <div className="text-right">
                    <div style={{
                      fontFamily: 'Bebas Neue, sans-serif',
                      fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                      lineHeight: 0.9,
                      color: '#B87333',
                    }}>
                      2X
                    </div>
                    <div style={{
                      fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                      color: 'rgba(255, 254, 249, 0.6)',
                      letterSpacing: '0.1em',
                    }}>
                      vs Arabica
                    </div>
                  </div>
                </div>
                <h3 style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  color: '#FFFEF9',
                  marginBottom: '0.75rem',
                  letterSpacing: '0.05em',
                }}>
                  DOUBLE THE CAFFEINE
                </h3>
                <p style={{
                  fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
                  color: 'rgba(255, 254, 249, 0.85)',
                  lineHeight: 1.5,
                }}>
                  2.7% caffeine content delivers twice the energy
                </p>
              </div>
              <div className="h-1 w-0 group-hover:w-full transition-all duration-700" style={{
                background: '#B87333',
                marginTop: '1rem',
              }} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, scale: 1.05 }}
            className="group relative overflow-hidden"
            style={{
              background: 'rgba(26, 17, 16, 0.6)',
              border: '1px solid rgba(184, 115, 51, 0.3)',
              padding: 'clamp(16px, 3vw, 24px)',
              minHeight: 'clamp(200px, 25vw, 280px)',
              cursor: 'pointer',
            }}
          >
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div style={{
                    background: '#B87333',
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Brain size={32} color="#000" strokeWidth={2} fill="#000" />
                  </div>
                  <div className="text-right">
                    <div style={{
                      fontFamily: 'Bebas Neue, sans-serif',
                      fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                      lineHeight: 0.9,
                      color: '#B87333',
                    }}>
                      4-6HRS
                    </div>
                    <div style={{
                      fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                      color: 'rgba(255, 254, 249, 0.6)',
                      letterSpacing: '0.1em',
                    }}>
                      sustained
                    </div>
                  </div>
                </div>
                <h3 style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  color: '#FFFEF9',
                  marginBottom: '0.75rem',
                  letterSpacing: '0.05em',
                }}>
                  SHARP FOCUS
                </h3>
                <p style={{
                  fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
                  color: 'rgba(255, 254, 249, 0.85)',
                  lineHeight: 1.5,
                }}>
                  Sustained energy throughout workday
                </p>
              </div>
              <div className="h-1 w-0 group-hover:w-full transition-all duration-700" style={{
                background: '#B87333',
                marginTop: '1rem',
              }} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, scale: 1.05 }}
            className="group relative overflow-hidden"
            style={{
              background: 'rgba(26, 17, 16, 0.6)',
              border: '1px solid rgba(184, 115, 51, 0.3)',
              padding: 'clamp(16px, 3vw, 24px)',
              minHeight: 'clamp(200px, 25vw, 280px)',
              cursor: 'pointer',
            }}
          >
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div style={{
                    background: '#B87333',
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Dumbbell size={32} color="#000" strokeWidth={2} fill="#000" />
                  </div>
                  <div className="text-right">
                    <div style={{
                      fontFamily: 'Bebas Neue, sans-serif',
                      fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                      lineHeight: 0.9,
                      color: '#B87333',
                    }}>
                      +15%
                    </div>
                    <div style={{
                      fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                      color: 'rgba(255, 254, 249, 0.6)',
                      letterSpacing: '0.1em',
                    }}>
                      boost
                    </div>
                  </div>
                </div>
                <h3 style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  color: '#FFFEF9',
                  marginBottom: '0.75rem',
                  letterSpacing: '0.05em',
                }}>
                  PERFORMANCE
                </h3>
                <p style={{
                  fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
                  color: 'rgba(255, 254, 249, 0.85)',
                  lineHeight: 1.5,
                }}>
                  Perfect pre-workout fuel
                </p>
              </div>
              <div className="h-1 w-0 group-hover:w-full transition-all duration-700" style={{
                background: '#B87333',
                marginTop: '1rem',
              }} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, scale: 1.05 }}
            className="group relative overflow-hidden"
            style={{
              background: 'rgba(26, 17, 16, 0.6)',
              border: '1px solid rgba(184, 115, 51, 0.3)',
              padding: 'clamp(16px, 3vw, 24px)',
              minHeight: 'clamp(200px, 25vw, 280px)',
              cursor: 'pointer',
            }}
          >
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div style={{
                    background: '#B87333',
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Clock size={32} color="#000" strokeWidth={2} fill="#000" />
                  </div>
                  <div className="text-right">
                    <div style={{
                      fontFamily: 'Bebas Neue, sans-serif',
                      fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                      lineHeight: 0.9,
                      color: '#B87333',
                    }}>
                      6-8HRS
                    </div>
                    <div style={{
                      fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                      color: 'rgba(255, 254, 249, 0.6)',
                      letterSpacing: '0.1em',
                    }}>
                      duration
                    </div>
                  </div>
                </div>
                <h3 style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  color: '#FFFEF9',
                  marginBottom: '0.75rem',
                  letterSpacing: '0.05em',
                }}>
                  LONG LASTING
                </h3>
                <p style={{
                  fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
                  color: 'rgba(255, 254, 249, 0.85)',
                  lineHeight: 1.5,
                }}>
                  No mid-day crashes
                </p>
              </div>
              <div className="h-1 w-0 group-hover:w-full transition-all duration-700" style={{
                background: '#B87333',
                marginTop: '1rem',
              }} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, scale: 1.05 }}
            className="group relative overflow-hidden"
            style={{
              background: 'rgba(26, 17, 16, 0.6)',
              border: '1px solid rgba(184, 115, 51, 0.3)',
              padding: 'clamp(16px, 3vw, 24px)',
              minHeight: 'clamp(200px, 25vw, 280px)',
              cursor: 'pointer',
            }}
          >
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div style={{
                    background: '#B87333',
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <TrendingUp size={32} color="#000" strokeWidth={2} fill="#000" />
                  </div>
                  <div className="text-right">
                    <div style={{
                      fontFamily: 'Bebas Neue, sans-serif',
                      fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                      lineHeight: 0.9,
                      color: '#B87333',
                    }}>
                      +11%
                    </div>
                    <div style={{
                      fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                      color: 'rgba(255, 254, 249, 0.6)',
                      letterSpacing: '0.1em',
                    }}>
                      metabolic
                    </div>
                  </div>
                </div>
                <h3 style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  color: '#FFFEF9',
                  marginBottom: '0.75rem',
                  letterSpacing: '0.05em',
                }}>
                  METABOLISM
                </h3>
                <p style={{
                  fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
                  color: 'rgba(255, 254, 249, 0.85)',
                  lineHeight: 1.5,
                }}>
                  Burns calories naturally
                </p>
              </div>
              <div className="h-1 w-0 group-hover:w-full transition-all duration-700" style={{
                background: '#B87333',
                marginTop: '1rem',
              }} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, scale: 1.05 }}
            className="group relative overflow-hidden"
            style={{
              background: 'rgba(26, 17, 16, 0.6)',
              border: '1px solid rgba(184, 115, 51, 0.3)',
              padding: 'clamp(16px, 3vw, 24px)',
              minHeight: 'clamp(200px, 25vw, 280px)',
              cursor: 'pointer',
            }}
          >
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div style={{
                    background: '#B87333',
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Award size={32} color="#000" strokeWidth={2} fill="#000" />
                  </div>
                  <div className="text-right">
                    <div style={{
                      fontFamily: 'Bebas Neue, sans-serif',
                      fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                      lineHeight: 0.9,
                      color: '#B87333',
                    }}>
                      7-10%
                    </div>
                    <div style={{
                      fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                      color: 'rgba(255, 254, 249, 0.6)',
                      letterSpacing: '0.1em',
                    }}>
                      more CGA
                    </div>
                  </div>
                </div>
                <h3 style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  color: '#FFFEF9',
                  marginBottom: '0.75rem',
                  letterSpacing: '0.05em',
                }}>
                  ANTIOXIDANTS
                </h3>
                <p style={{
                  fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
                  color: 'rgba(255, 254, 249, 0.85)',
                  lineHeight: 1.5,
                }}>
                  Superior health benefits
                </p>
              </div>
              <div className="h-1 w-0 group-hover:w-full transition-all duration-700" style={{
                background: '#B87333',
                marginTop: '1rem',
              }} />
            </div>
          </motion.div>
        </div>

        <div id="comparison" className="mt-16">
          <ComparisonSection />
        </div>
      </div>
    </section>
  );
}
