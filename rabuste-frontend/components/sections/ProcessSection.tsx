'use client';

import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { Sprout, Coffee, Flame, Package, ChevronDown } from 'lucide-react';

export default function ProcessSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  
  // Scroll tracking for this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Update active step based on scroll position
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const newStep = Math.min(Math.floor(latest * 4), 3);
    setActiveStep(newStep);
  });

  const steps = [
    {
      icon: Sprout,
      number: '01',
      title: 'SOURCING',
      desc: 'Hand-selected robusta beans from premium plantations across India and Vietnam',
      image: 'https://images.pexels.com/photos/3914189/pexels-photo-3914189.jpeg',
      imageAlt: 'Coffee plantation by Quang Nguyen Vinh on Pexels',
      color: '#B87333',
    },
    {
      icon: Coffee,
      number: '02',
      title: 'PROCESSING',
      desc: 'Careful processing to preserve the natural caffeine content and robust flavor profile',
      image: 'https://images.pexels.com/photos/25547393/pexels-photo-25547393.jpeg',
      imageAlt: 'Coffee processing by Nati on Pexels',
      color: '#CD7F32',
    },
    {
      icon: Flame,
      number: '03',
      title: 'ROASTING',
      desc: 'Small-batch roasting at optimal temperatures to unlock peak flavor and aroma',
      image: 'https://images.pexels.com/photos/31945549/pexels-photo-31945549.jpeg',
      imageAlt: 'Coffee roasting by Ksenia Yakovleva on Pexels',
      color: '#D4A574',
    },
    {
      icon: Package,
      number: '04',
      title: 'DELIVERY',
      desc: 'Sealed fresh and delivered to your door within days of roasting',
      image: 'https://images.pexels.com/photos/6612601/pexels-photo-6612601.jpeg',
      imageAlt: 'Coffee packaging by Pavel Danilyuk on Pexels',
      color: '#B87333',
    },
  ];

  // Scroll indicator opacity
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{
        background: 'linear-gradient(180deg, #000000 0%, #0a0a0a 100%)',
        minHeight: '400vh',
      }}
    >
      {/* Sticky Container */}
      <div 
        className="sticky top-0 h-screen flex items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #000000 0%, #0a0a0a 100%)',
        }}
      >
        <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-8 lg:mb-12">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                color: '#B87333',
                fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                letterSpacing: '0.3em',
                fontWeight: 700,
                marginBottom: '1rem',
              }}
            >
              OUR PROCESS
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: 'clamp(2.5rem, 7vw, 6rem)',
                lineHeight: 0.9,
                color: '#FFFEF9',
                marginBottom: '1rem',
              }}
            >
              FROM BEAN TO{' '}
              <span style={{
                background: 'linear-gradient(135deg, #B87333 0%, #CD7F32 50%, #D4A574 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                YOUR CUP
              </span>
            </motion.h2>
          </div>

          {/* Process Content */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            
            {/* LEFT - Process Image */}
            <div className="relative min-h-[400px] lg:min-h-[500px]">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{
                    opacity: activeStep === index ? 1 : 0,
                    scale: activeStep === index ? 1 : 0.95,
                    pointerEvents: activeStep === index ? 'auto' : 'none',
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <div
                    className="relative overflow-hidden h-full"
                    style={{
                      border: `4px solid ${step.color}66`,
                      aspectRatio: '4/3',
                      boxShadow: `0 0 40px ${step.color}33`,
                    }}
                  >
                    <img
                      src={step.image}
                      alt={step.imageAlt}
                      className="w-full h-full object-cover"
                      style={{
                        filter: 'contrast(1.1) brightness(0.95)',
                      }}
                    />

                    {/* Number overlay */}
                    <div
                      className="absolute top-4 left-4 lg:top-6 lg:left-6"
                      style={{
                        background: step.color,
                        padding: '8px 20px',
                      }}
                    >
                      <span style={{
                        fontFamily: 'Bebas Neue, sans-serif',
                        fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                        color: '#000',
                        letterSpacing: '0.05em',
                      }}>
                        {step.number}
                      </span>
                    </div>

                    {/* Overlay gradient */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: `linear-gradient(to top, ${step.color}dd 0%, transparent 50%)`,
                      }}
                    />

                    {/* Corner accent */}
                    <div
                      className="absolute bottom-0 right-0 w-16 h-16 lg:w-24 lg:h-24"
                      style={{
                        background: `linear-gradient(135deg, transparent 50%, ${step.color} 50%)`,
                        opacity: 0.6,
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* RIGHT - Process Description */}
            <div className="relative min-h-[400px]">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.number}
                    className="absolute inset-0"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{
                      opacity: activeStep === index ? 1 : 0,
                      x: activeStep === index ? 0 : 30,
                      pointerEvents: activeStep === index ? 'auto' : 'none',
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex items-center gap-3 sm:gap-4 mb-5">
                      <div
                        style={{
                          background: `${step.color}20`,
                          border: `3px solid ${step.color}`,
                          width: 'clamp(60px, 12vw, 80px)',
                          height: 'clamp(60px, 12vw, 80px)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon 
                          size={32} 
                          color={step.color} 
                          strokeWidth={2.5} 
                          className="w-6 h-6 sm:w-8 sm:h-8"
                        />
                      </div>

                      <div
                        style={{
                          fontFamily: 'Bebas Neue, sans-serif',
                          fontSize: 'clamp(2rem, 5vw, 4rem)',
                          color: step.color,
                          letterSpacing: '0.05em',
                          lineHeight: 1,
                        }}
                      >
                        {step.number}
                      </div>
                    </div>

                    <h3 style={{
                      fontFamily: 'Bebas Neue, sans-serif',
                      fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                      color: '#FFFEF9',
                      letterSpacing: '0.05em',
                      marginBottom: '1.5rem',
                      lineHeight: 1,
                    }}>
                      {step.title}
                    </h3>

                    <p style={{
                      fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                      color: 'rgba(255, 254, 249, 0.8)',
                      lineHeight: 1.8,
                      marginBottom: '2rem',
                    }}>
                      {step.desc}
                    </p>

                    {/* Progress Indicator */}
                    <div className="flex items-center gap-2">
                      {steps.map((_, i) => (
                        <div
                          key={i}
                          style={{
                            width: i === activeStep ? '40px' : '12px',
                            height: '4px',
                            background: i <= activeStep 
                              ? step.color
                              : 'rgba(184, 115, 51, 0.3)',
                            transition: 'all 0.3s ease',
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center hidden lg:block"
            style={{ opacity: scrollIndicatorOpacity }}
          >
            <p className="text-sm mb-2" style={{ color: '#B87333', letterSpacing: '0.2em' }}>
              SCROLL THROUGH PROCESS
            </p>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronDown size={32} className="text-[#B87333] mx-auto" />
            </motion.div>
          </motion.div>
        </div>

        {/* Custom Scrollbar - Visual Progress */}
        <div className="fixed right-4 lg:right-8 top-1/2 transform -translate-y-1/2 z-50 hidden lg:block">
          <div className="w-1 h-48 lg:h-64 bg-[#B87333]/20 rounded-full overflow-hidden">
            <motion.div
              className="w-full bg-gradient-to-b from-[#B87333] via-[#CD7F32] to-[#D4A574]"
              style={{
                height: useTransform(scrollYProgress, [0, 1], ['0%', '100%']),
              }}
            />
          </div>
          
          {/* Step indicators on scrollbar */}
          <div className="absolute inset-0 flex flex-col justify-between py-1">
            {steps.map((step, i) => (
              <div
                key={i}
                className="w-3 h-3 -ml-1 rounded-full transition-all duration-300"
                style={{
                  background: activeStep >= i ? step.color : 'rgba(184, 115, 51, 0.3)',
                  boxShadow: activeStep === i ? `0 0 12px ${step.color}` : 'none',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Spacer for scroll effect */}
      <div style={{ height: '100vh' }} />
    </section>
  );
}