'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Sprout, Coffee, Flame, Package, ChevronRight } from 'lucide-react';

export default function ProcessSectionRevamped() {
  const [activeStep, setActiveStep] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const steps = [
    {
      icon: Sprout,
      number: '01',
      title: 'SOURCING',
      subtitle: 'Premium Selection',
      desc: 'Hand-selected robusta beans from premium plantations across India and Vietnam. Each batch is carefully chosen for its exceptional caffeine content and bold flavor profile.',
      image: 'https://images.pexels.com/photos/3914189/pexels-photo-3914189.jpeg',
      imageAlt: 'Coffee plantation by Quang Nguyen Vinh on Pexels',
      color: '#B87333',
      features: ['Direct Trade', 'Sustainable Farms', 'Quality Tested'],
    },
    {
      icon: Coffee,
      number: '02',
      title: 'PROCESSING',
      subtitle: 'Precision Method',
      desc: 'Careful processing using advanced techniques to preserve the natural caffeine content and robust flavor profile. Every bean undergoes rigorous quality control.',
      image: 'https://images.pexels.com/photos/25547393/pexels-photo-25547393.jpeg',
      imageAlt: 'Coffee processing by Nati on Pexels',
      color: '#B87333',
      features: ['Natural Process', 'No Chemicals', 'Hand Sorted'],
    },
    {
      icon: Flame,
      number: '03',
      title: 'ROASTING',
      subtitle: 'Artisan Craft',
      desc: 'Small-batch roasting at optimal temperatures to unlock peak flavor and aroma. Our master roasters monitor every batch for perfection.',
      image: 'https://images.pexels.com/photos/31945549/pexels-photo-31945549.jpeg',
      imageAlt: 'Coffee roasting by Ksenia Yakovleva on Pexels',
      color: '#B87333',
      features: ['Small Batches', 'Expert Roasters', 'Perfect Temperature'],
    },
    {
      icon: Package,
      number: '04',
      title: 'DELIVERY',
      subtitle: 'Fresh to Door',
      desc: 'Sealed fresh and delivered to your door within days of roasting. We ensure maximum freshness with premium packaging and rapid delivery.',
      image: 'https://images.pexels.com/photos/6612601/pexels-photo-6612601.jpeg',
      imageAlt: 'Coffee packaging by Pavel Danilyuk on Pexels',
      color: '#B87333',
      features: ['Fast Shipping', 'Premium Packaging', 'Track Order'],
    },
  ];

  const currentStep = steps[activeStep];

  return (
    <section
      className="relative py-32 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #000000 0%, #0a0a0a 50%, #000000 100%)',
      }}
    >
      {/* Animated Background Elements */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-20"
        animate={{
          background: `radial-gradient(circle at ${50 + activeStep * 15}% ${50 - activeStep * 10}%, rgba(184, 115, 51, 0.2) 0%, transparent 60%)`,
        }}
        transition={{ duration: 0.8 }}
      />

      <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p
            style={{
              color: '#8B6F47',
              fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
              letterSpacing: '0.2em',
              fontWeight: 400,
              marginBottom: '1.5rem',
              textTransform: 'uppercase',
            }}
          >
            OUR JOURNEY
          </p>

          <h2
            style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(3.5rem, 10vw, 7rem)',
              lineHeight: 0.9,
              color: '#F5F1E8',
              marginBottom: '1.5rem',
              fontWeight: 400,
              letterSpacing: '0.02em',
            }}
          >
            FROM BEAN TO{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #FFFEF9 0%, #D4A574 50%, #FFFEF9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 0 80px rgba(212, 165, 116, 0.3)',
                position: 'relative',
                display: 'inline-block',
              }}
            >
              YOUR CUP
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
                YOUR CUP
              </motion.span>
            </span>
          </h2>

          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: 'rgba(245, 241, 232, 0.6)',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: 1.7,
              fontWeight: 300,
            }}
          >
            Click each step to explore our meticulous process
          </p>
        </motion.div>

        {/* Interactive Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = activeStep === index;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onHoverStart={() => setIsHovering(true)}
                onHoverEnd={() => setIsHovering(false)}
                onClick={() => setActiveStep(index)}
                className="cursor-pointer relative group"
                style={{
                  background: isActive
                    ? 'rgba(26, 17, 16, 0.8)'
                    : 'rgba(26, 17, 16, 0.6)',
                  border: `1px solid ${isActive ? 'rgba(184, 115, 51, 0.4)' : 'rgba(184, 115, 51, 0.2)'}`,
                  padding: 'clamp(1.5rem, 3vw, 2rem)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {/* Active Glow */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{
                      opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                    style={{
                      background: `radial-gradient(circle at 50% 0%, ${step.color}30 0%, transparent 70%)`,
                      filter: 'blur(20px)',
                    }}
                  />
                )}

                {/* Number Badge */}
                <div
                  className="absolute -top-3 -left-3 w-12 h-12 flex items-center justify-center"
                  style={{
                    background: isActive ? '#B87333' : 'rgba(184, 115, 51, 0.3)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'Bebas Neue, sans-serif',
                      fontSize: '1.25rem',
                      color: isActive ? '#000' : '#F5F1E8',
                      fontWeight: 400,
                    }}
                  >
                    {step.number}
                  </span>
                </div>

                {/* Icon */}
                <div
                  className="mb-4 relative"
                  style={{
                    background: isActive ? 'rgba(184, 115, 51, 0.2)' : 'rgba(184, 115, 51, 0.1)',
                    width: 'clamp(60px, 12vw, 80px)',
                    height: 'clamp(60px, 12vw, 80px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${isActive ? 'rgba(184, 115, 51, 0.4)' : 'rgba(184, 115, 51, 0.2)'}`,
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Icon
                    size={32}
                    color="#B87333"
                    strokeWidth={2.5}
                    className="w-6 h-6 sm:w-8 sm:h-8"
                  />
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontFamily: 'Bebas Neue, sans-serif',
                    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                    color: isActive ? '#B87333' : '#F5F1E8',
                    marginBottom: '0.5rem',
                    lineHeight: 1,
                    transition: 'color 0.3s ease',
                    fontWeight: 400,
                  }}
                >
                  {step.title}
                </h3>

                {/* Subtitle */}
                <p
                  style={{
                    fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                    color: isActive ? 'rgba(245, 241, 232, 0.7)' : 'rgba(245, 241, 232, 0.5)',
                    letterSpacing: '0.05em',
                    fontWeight: 300,
                  }}
                >
                  {step.subtitle}
                </p>

                {/* Bottom accent */}
                <motion.div
                  className="absolute bottom-0 left-0 h-1"
                  initial={{ width: 0 }}
                  animate={{ width: isActive ? '100%' : '0%' }}
                  transition={{ duration: 0.4 }}
                  style={{
                    background: '#B87333',
                  }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Expanded Content Section */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center"
          >
            {/* Image */}
            <motion.div
              className="relative overflow-hidden order-2 lg:order-1"
              style={{
                border: `1px solid rgba(184, 115, 51, 0.3)`,
                aspectRatio: '4/3',
              }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={currentStep.image}
                alt={currentStep.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                style={{
                  filter: 'contrast(1.1) brightness(0.95)',
                }}
                loading="lazy"
                quality={85}
              />

              {/* Gradient overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, transparent 50%)`,
                }}
              />

              {/* Number watermark */}
              <div
                className="absolute bottom-6 right-6"
                style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: 'clamp(4rem, 10vw, 8rem)',
                  color: 'rgba(0, 0, 0, 0.3)',
                  lineHeight: 1,
                  fontWeight: 700,
                }}
              >
                {currentStep.number}
              </div>
            </motion.div>

            {/* Description */}
            <div className="order-1 lg:order-2">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div
                    style={{
                      background: 'rgba(184, 115, 51, 0.2)',
                      border: `1px solid rgba(184, 115, 51, 0.4)`,
                      width: 'clamp(70px, 15vw, 90px)',
                      height: 'clamp(70px, 15vw, 90px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {React.createElement(currentStep.icon, {
                      size: 40,
                      color: '#B87333',
                      strokeWidth: 2.5,
                      className: 'w-8 h-8 sm:w-10 sm:h-10',
                    })}
                  </div>

                  <div>
                    <div
                      style={{
                        fontFamily: 'Bebas Neue, sans-serif',
                        fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                        color: '#B87333',
                        lineHeight: 1,
                        fontWeight: 400,
                      }}
                    >
                      {currentStep.number}
                    </div>
                  </div>
                </div>

                <h3
                  style={{
                    fontFamily: 'Bebas Neue, sans-serif',
                    fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                    color: '#F5F1E8',
                    letterSpacing: '0.02em',
                    marginBottom: '1rem',
                    lineHeight: 0.9,
                    fontWeight: 400,
                  }}
                >
                  {currentStep.title}
                </h3>

                <p
                  style={{
                    fontSize: 'clamp(1.125rem, 2vw, 1.375rem)',
                    color: '#B87333',
                    marginBottom: '1.5rem',
                    fontWeight: 400,
                    letterSpacing: '0.05em',
                  }}
                >
                  {currentStep.subtitle}
                </p>

                <p
                  style={{
                    fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                    color: 'rgba(245, 241, 232, 0.7)',
                    lineHeight: 1.8,
                    marginBottom: '2rem',
                    fontWeight: 300,
                  }}
                >
                  {currentStep.desc}
                </p>

                {/* Features List */}
                <div className="space-y-3">
                  {currentStep.features.map((feature, idx) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          background: '#B87333',
                        }}
                      />
                      <span
                        style={{
                          fontSize: '1.125rem',
                          color: 'rgba(245, 241, 232, 0.8)',
                          fontWeight: 300,
                        }}
                      >
                        {feature}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Dots */}
        <div className="flex items-center justify-center gap-4 mt-16">
          {steps.map((step, index) => (
            <button
              key={step.number}
              onClick={() => setActiveStep(index)}
              className="transition-all duration-300"
              style={{
                width: activeStep === index ? '48px' : '12px',
                height: '12px',
                background: activeStep === index ? '#B87333' : 'rgba(184, 115, 51, 0.3)',
                border: 'none',
                cursor: 'pointer',
              }}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>

        {/* Next Step CTA */}
        {activeStep < steps.length - 1 && (
          <motion.div
            className="flex justify-center mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <button
              onClick={() => setActiveStep(activeStep + 1)}
              className="flex items-center gap-3 px-8 py-4 transition-all hover:scale-105"
              style={{
                background: 'rgba(26, 17, 16, 0.6)',
                border: `1px solid rgba(184, 115, 51, 0.4)`,
                color: '#B87333',
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: '1.25rem',
                letterSpacing: '0.1em',
                fontWeight: 400,
              }}
            >
              NEXT STEP
              <ChevronRight size={24} />
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}