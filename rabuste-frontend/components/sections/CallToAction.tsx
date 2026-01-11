'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowRight, Zap, TrendingUp, Award } from 'lucide-react';

export default function CallToAction() {
  const router = useRouter();
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  return (
    <section 
      ref={ref}
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #000000 0%, #1A1110 50%, #2B1810 100%)',
        padding: '0',
        minHeight: '100vh',
      }}
    >
      {/* Diagonal Divider Top */}
      <div 
        className="absolute top-0 left-0 w-full h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, #000000 0%, transparent 100%)',
          transform: 'skewY(-2deg)',
          transformOrigin: 'top left',
          zIndex: 2,
        }}
      />

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* LEFT SIDE - POWERFUL GRAPHICS (60%) */}
        <motion.div 
          style={{ scale }}
          className="relative w-full lg:w-[60%] min-h-[60vh] lg:min-h-screen flex items-center justify-center p-6 sm:p-8 lg:p-16"
        >
          {/* Background Pattern */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'url(https://images.pexels.com/photos/3914189/pexels-photo-3914189.jpeg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />

          <div className="relative z-10 w-full max-w-2xl">
            {/* Main Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative mb-8"
            >
              <div 
                className="relative overflow-hidden"
                style={{
                  border: '4px solid rgba(184, 115, 51, 0.6)',
                  boxShadow: '0 30px 90px rgba(184, 115, 51, 0.3)',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1749104028313-a175107a5052?crop=entropy&cs=srgb&fm=jpg&q=85"
                  alt="Coffee being poured by Gaia&Co on Unsplash"
                  className="w-full h-auto aspect-[4/3] object-cover"
                />
                
                {/* Copper Overlay Corner */}
                <div 
                  className="absolute bottom-0 right-0 w-32 h-32"
                  style={{
                    background: 'linear-gradient(135deg, transparent 50%, rgba(184, 115, 51, 0.8) 50%)',
                  }}
                />
              </div>

              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="absolute -bottom-6 -right-6 flex items-center gap-3 px-8 py-5"
                style={{
                  background: 'linear-gradient(135deg, #B87333, #CD7F32)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
                }}
              >
                <Zap size={32} color="#000" strokeWidth={3} />
                <div>
                  <div style={{
                    fontFamily: 'Bebas Neue, sans-serif',
                    fontSize: '2rem',
                    color: '#000',
                    lineHeight: 1,
                  }}>
                    2.7%
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#000',
                    opacity: 0.8,
                    fontWeight: 600,
                  }}>
                    CAFFEINE
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Secondary Images Grid */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative overflow-hidden"
                style={{
                  border: '3px solid rgba(184, 115, 51, 0.3)',
                }}
              >
                <img
                  src="https://images.pexels.com/photos/6278746/pexels-photo-6278746.jpeg"
                  alt="Hand holding coffee by Artem Podrez on Pexels"
                  className="w-full h-48 object-cover hover:scale-110 transition-transform duration-700"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative overflow-hidden"
                style={{
                  border: '3px solid rgba(184, 115, 51, 0.3)',
                }}
              >
                <img
                  src="https://images.pexels.com/photos/25547393/pexels-photo-25547393.jpeg"
                  alt="Coffee beans by Yunus Kılıç on Pexels"
                  className="w-full h-48 object-cover hover:scale-110 transition-transform duration-700"
                />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* RIGHT SIDE - PUNCHY TEXT & CTA (40%) */}
        <div className="relative w-full lg:w-[40%] min-h-[60vh] lg:min-h-screen flex items-center justify-center p-6 sm:p-8 lg:p-12 xl:p-16">
          {/* Copper Gradient Background */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              background: 'radial-gradient(circle at top right, #B87333, transparent)',
            }}
          />

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative z-10 w-full max-w-xl"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-3 px-6 py-3 mb-8"
              style={{
                background: 'rgba(26, 17, 16, 0.6)',
                border: '1px solid rgba(184, 115, 51, 0.3)',
              }}
            >
              <Zap size={20} color="#B87333" />
              <span style={{
                color: '#B87333',
                fontSize: '0.875rem',
                letterSpacing: '0.2em',
                fontWeight: 400,
                fontFamily: 'Bebas Neue, sans-serif',
              }}>
                OPENING 2025
              </span>
            </motion.div>

            {/* Headline */}
            <h2 style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(4rem, 10vw, 8rem)',
              lineHeight: 0.9,
              color: '#F5F1E8',
              marginBottom: '1.5rem',
              fontWeight: 400,
              letterSpacing: '0.02em',
            }}>
              VISIT
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
                RABUSTE
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
                  RABUSTE
                </motion.span>
              </span>
              <br />
              COFFEE
            </h2>

            <p style={{
              fontSize: 'clamp(1.125rem, 2vw, 1.375rem)',
              color: 'rgba(245, 241, 232, 0.7)',
              lineHeight: 1.7,
              marginBottom: '3rem',
              fontWeight: 300,
            }}>
              Experience bold Robusta coffee in a space where art meets community. 
              Grab your cup, explore the gallery, join a workshop.
            </p>

            {/* Stats */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 mb-8">
              {[
                { icon: TrendingUp, value: '+15%', label: 'Performance' },
                { icon: Award, value: '6-8hrs', label: 'Energy' },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <Icon size={32} color="#B87333" strokeWidth={2.5} />
                    <div>
                      <div style={{
                        fontFamily: 'Bebas Neue, sans-serif',
                        fontSize: '1.75rem',
                        color: '#B87333',
                        lineHeight: 1,
                        fontWeight: 400,
                      }}>
                        {stat.value}
                      </div>
                      <div style={{
                        fontSize: '0.875rem',
                        color: 'rgba(245, 241, 232, 0.6)',
                        fontWeight: 300,
                      }}>
                        {stat.label}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA Button */}
            <motion.button
              onClick={() => router.push('/menu')}
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              className="group inline-flex items-center justify-center gap-3 sm:gap-4 px-8 sm:px-12 py-5 sm:py-6 text-lg sm:text-xl lg:text-2xl transition-all w-full sm:w-auto"
              style={{
                background: '#B87333',
                color: '#000000',
                fontFamily: 'Bebas Neue, sans-serif',
                letterSpacing: '0.15em',
                fontWeight: 400,
                border: 'none',
              }}
            >
              EXPLORE MENU
              <ArrowRight 
                size={32} 
                className="group-hover:translate-x-2 transition-transform" 
                strokeWidth={2.5}
              />
            </motion.button>

            {/* Trust Badge */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              style={{
                marginTop: '2rem',
                fontSize: '0.875rem',
                color: 'rgba(255, 254, 249, 0.5)',
                letterSpacing: '0.05em',
              }}
            >
              Coffee • Art • Workshops • Community
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Diagonal Divider Bottom */}
      <div 
        className="absolute bottom-0 left-0 w-full h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, transparent 0%, #000000 100%)',
          transform: 'skewY(-2deg)',
          transformOrigin: 'bottom right',
          zIndex: 2,
        }}
      />
    </section>
  );
}