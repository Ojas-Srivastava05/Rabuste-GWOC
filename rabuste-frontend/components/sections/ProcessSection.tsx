'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Sprout, Coffee, Flame, Package } from 'lucide-react';

export default function ProcessSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const steps = [
    {
      icon: Sprout,
      number: '01',
      title: 'SOURCING',
      desc: 'Hand-selected robusta beans from premium plantations across India and Vietnam',
      image: 'https://images.pexels.com/photos/3914189/pexels-photo-3914189.jpeg',
      color: '#B87333',
    },
    {
      icon: Coffee,
      number: '02',
      title: 'PROCESSING',
      desc: 'Careful processing to preserve the natural caffeine content and robust flavor profile',
      image: 'https://images.pexels.com/photos/25547393/pexels-photo-25547393.jpeg',
      color: '#CD7F32',
    },
    {
      icon: Flame,
      number: '03',
      title: 'ROASTING',
      desc: 'Small-batch roasting at optimal temperatures to unlock peak flavor and aroma',
      image: 'https://images.pexels.com/photos/31945549/pexels-photo-31945549.jpeg',
      color: '#D4A574',
    },
    {
      icon: Package,
      number: '04',
      title: 'DELIVERY',
      desc: 'Sealed fresh and delivered to your door within days of roasting',
      image: 'https://images.pexels.com/photos/6612601/pexels-photo-6612601.jpeg',
      color: '#B87333',
    },
  ];

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #000000 0%, #0a0a0a 100%)',
        padding: 'clamp(100px, 15vw, 160px) 0',
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p style={{
            color: '#B87333',
            fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
            letterSpacing: '0.3em',
            fontWeight: 700,
            marginBottom: '1.5rem',
          }}>
            OUR PROCESS
          </p>

          <h2 style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            lineHeight: 0.9,
            color: '#FFFEF9',
            marginBottom: '1.5rem',
          }}>
            FROM BEAN
            <br />
            TO
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #B87333 0%, #CD7F32 50%, #D4A574 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              YOUR CUP
            </span>
          </h2>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'rgba(255, 254, 249, 0.7)',
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            Every step perfected to deliver maximum caffeine and bold flavor
          </p>
        </motion.div>

        {/* Process Steps */}
        <div className="space-y-16 lg:space-y-24">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center ${isEven ? '' : 'lg:grid-flow-dense'}`}
              >
                {/* Image */}
                <div className={`relative ${isEven ? '' : 'lg:col-start-2'}`}>
                  <div
                    className="relative overflow-hidden"
                    style={{
                      border: `3px solid ${step.color}40`,
                      aspectRatio: '4/3',
                    }}
                  >
                    <img
                      src={step.image}
                      alt={`${step.title} process`}
                      className="w-full h-full object-cover"
                    />

                    {/* Number overlay */}
                    <div
                      className="absolute top-6 left-6"
                      style={{
                        background: step.color,
                        padding: '12px 24px',
                      }}
                    >
                      <span style={{
                        fontFamily: 'Bebas Neue, sans-serif',
                        fontSize: '2rem',
                        color: '#000',
                        letterSpacing: '0.05em',
                      }}>
                        {step.number}
                      </span>
                    </div>

                    {/* Corner accent */}
                    <div
                      className="absolute bottom-0 right-0 w-24 h-24"
                      style={{
                        background: `linear-gradient(135deg, transparent 50%, ${step.color} 50%)`,
                        opacity: 0.6,
                      }}
                    />
                  </div>
                </div>

                {/* Content */}
                <div className={isEven ? '' : 'lg:col-start-1 lg:row-start-1'}>
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      style={{
                        background: `${step.color}20`,
                        border: `3px solid ${step.color}`,
                        width: '80px',
                        height: '80px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={40} color={step.color} strokeWidth={2.5} />
                    </div>

                    <div
                      style={{
                        fontFamily: 'Bebas Neue, sans-serif',
                        fontSize: 'clamp(2.5rem, 6vw, 4rem)',
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
                  }}>
                    {step.title}
                  </h3>

                  <p style={{
                    fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                    color: 'rgba(255, 254, 249, 0.8)',
                    lineHeight: 1.8,
                  }}>
                    {step.desc}
                  </p>

                  {/* Decorative line */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={isInView ? { scaleX: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.3 + index * 0.2 }}
                    style={{
                      height: '3px',
                      background: step.color,
                      width: '120px',
                      marginTop: '2rem',
                      marginLeft: isEven ? '0' : 'auto',
                      marginRight: isEven ? 'auto' : '0',
                    }}
                    className={isEven ? '' : 'lg:ml-0'}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}