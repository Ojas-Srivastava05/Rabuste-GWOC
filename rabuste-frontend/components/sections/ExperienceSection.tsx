'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Coffee, Palette, Users, Wifi, ArrowRight } from 'lucide-react';

export default function ExperienceSection() {
  const router = useRouter();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const experiences = [
    {
      icon: Coffee,
      title: 'GRAB & GO',
      desc: 'Quick, bold coffee for your busy lifestyle',
      color: '#B87333',
      route: '/menu',
    },
    {
      icon: Palette,
      title: 'ART GALLERY',
      desc: 'Rotating exhibitions from local artists',
      color: '#B87333',
      route: '/art',
    },
    {
      icon: Users,
      title: 'WORKSHOPS',
      desc: 'Coffee tasting, art sessions & community events',
      color: '#B87333',
      route: '/workshops',
    },
    {
      icon: Wifi,
      title: 'WORK SPACE',
      desc: 'Cozy corner to create and collaborate',
      color: '#B87333',
      route: '/store',
    },
  ];

  return (
    <section
      id="experience-section"
      ref={ref}
      className="relative overflow-hidden z-20"
      style={{
        background: 'linear-gradient(180deg, #0a0a0a 0%, #1A1110 100%)',
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
            color: '#8B6F47',
            fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
            letterSpacing: '0.2em',
            fontWeight: 400,
            marginBottom: '1.5rem',
            textTransform: 'uppercase',
          }}>
            THE EXPERIENCE
          </p>

          <h2 style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 'clamp(3.5rem, 10vw, 7rem)',
            lineHeight: 0.9,
            color: '#F5F1E8',
            marginBottom: '1.5rem',
            fontWeight: 400,
            letterSpacing: '0.02em',
          }}>
            MORE THAN
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
              JUST COFFEE
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
                JUST COFFEE
              </motion.span>
            </span>
          </h2>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'rgba(245, 241, 232, 0.6)',
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: 1.7,
            fontWeight: 300,
          }}>
            A vibrant space where coffee culture, fine arts, and community converge
          </p>
        </motion.div>

        {/* Experience Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {experiences.map((exp, index) => {
            const Icon = exp.icon;
            return (
              <motion.div
                key={exp.title}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -12, scale: 1.03 }}
                onClick={() => router.push(exp.route)}
                className="group relative cursor-pointer"
                style={{
                  background: 'rgba(26, 17, 16, 0.6)',
                  border: `1px solid rgba(184, 115, 51, 0.2)`,
                  padding: 'clamp(32px, 5vw, 40px)',
                }}
              >
                {/* Glow effect */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at top, rgba(184, 115, 51, 0.1) 0%, transparent 70%)`,
                    pointerEvents: 'none',
                  }}
                />

                <div className="relative z-10 flex flex-col h-full">
                  {/* Icon with hover effect */}
                  <div
                    className="mb-6 relative overflow-hidden"
                    style={{
                      background: '#B87333',
                      width: 'clamp(60px, 15vw, 80px)',
                      height: 'clamp(60px, 15vw, 80px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={32} color="#000" strokeWidth={2.5} className="relative z-10 sm:w-10 sm:h-10" />
                  </div>

                  {/* Title with arrow */}
                  <h3 className="flex items-center justify-between mb-4" style={{
                    fontFamily: 'Bebas Neue, sans-serif',
                    fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
                    color: '#B87333',
                    letterSpacing: '0.05em',
                  }}>
                    {exp.title}
                    <ArrowRight 
                      size={24} 
                      color="#B87333"
                      strokeWidth={2}
                      className="opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300"
                    />
                  </h3>

                  {/* Description */}
                  <p style={{
                    fontSize: 'clamp(0.875rem, 2vw, 1.125rem)',
                    color: 'rgba(245, 241, 232, 0.7)',
                    lineHeight: 1.7,
                    flex: 1,
                    fontWeight: 300,
                  }}>
                    {exp.desc}
                  </p>

                  {/* Clickable hint */}
                  <div 
                    className="mt-6 flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity"
                    style={{
                      color: '#B87333',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      letterSpacing: '0.05em',
                      fontFamily: 'Bebas Neue, sans-serif',
                    }}
                  >
                    EXPLORE
                    <div className="w-8 h-px bg-current group-hover:w-12 transition-all duration-300" />
                  </div>

                  {/* Bottom accent line */}
                  <div
                    className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500"
                    style={{
                      background: '#B87333',
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Feature Image Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 sm:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8"
        >
          <div
            className="relative overflow-hidden"
            style={{
              border: '1px solid rgba(184, 115, 51, 0.3)',
              aspectRatio: '4/3',
            }}
          >
            <Image
              src="https://images.pexels.com/photos/1449773/pexels-photo-1449773.jpeg"
              alt="Cafe interior by Asad Photo Maldives on Pexels"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              loading="lazy"
              quality={85}
              unoptimized
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '2rem',
                background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)',
              }}
            >
              <p style={{
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                color: '#B87333',
                marginBottom: '0.5rem',
                letterSpacing: '0.05em',
              }}>
                COZY AMBIANCE
              </p>
              <p style={{
                fontSize: '1rem',
                color: 'rgba(255, 254, 249, 0.9)',
              }}>
                Designed for comfort and creativity
              </p>
            </div>
          </div>

          <div
            className="relative overflow-hidden"
            style={{
              border: '1px solid rgba(184, 115, 51, 0.3)',
              aspectRatio: '4/3',
            }}
          >
            <Image
              src="https://images.pexels.com/photos/6612601/pexels-photo-6612601.jpeg"
              alt="Coffee preparation by Pavel Danilyuk on Pexels"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              loading="lazy"
              quality={85}
              unoptimized
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '2rem',
                background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)',
              }}
            >
              <p style={{
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                color: '#B87333',
                marginBottom: '0.5rem',
                letterSpacing: '0.05em',
              }}>
                CRAFTED FRESH
              </p>
              <p style={{
                fontSize: '1rem',
                color: 'rgba(255, 254, 249, 0.9)',
              }}>
                Every cup made with precision
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}