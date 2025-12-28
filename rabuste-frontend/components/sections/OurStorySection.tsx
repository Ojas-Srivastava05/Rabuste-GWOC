'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, Heart, TrendingUp, Users } from 'lucide-react';

export default function OurStorySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const values = [
    {
      icon: Award,
      title: 'EXCELLENCE',
      desc: 'Premium quality in every bean',
      color: '#B87333',
    },
    {
      icon: Heart,
      title: 'PASSION',
      desc: 'Coffee is our life work',
      color: '#CD7F32',
    },
    {
      icon: TrendingUp,
      title: 'INNOVATION',
      desc: 'Pushing robusta boundaries',
      color: '#D4A574',
    },
    {
      icon: Users,
      title: 'COMMUNITY',
      desc: 'Building coffee culture',
      color: '#B87333',
    },
  ];

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0a0a0a 0%, #1A1110 100%)',
        padding: 'clamp(100px, 15vw, 160px) 0',
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center">
          
          {/* LEFT - Story Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <p style={{
              color: '#B87333',
              fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
              letterSpacing: '0.3em',
              fontWeight: 700,
              marginBottom: '1.5rem',
            }}>
              OPENING 2025
            </p>

            <h2 style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              lineHeight: 0.9,
              color: '#FFFEF9',
              marginBottom: '2rem',
            }}>
              THE
              <br />
              <span style={{
                background: 'linear-gradient(135deg, #B87333 0%, #CD7F32 50%, #D4A574 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                RABUSTE
              </span>
              <br />
              STORY
            </h2>

            <div className="space-y-6 mb-8">
              <p style={{
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                color: 'rgba(255, 254, 249, 0.9)',
                lineHeight: 1.8,
              }}>
                More than just a café, Rabuste is where <strong style={{ color: '#D4A574' }}>coffee meets creativity</strong>. 
                We're a bold new space dedicated to the finest Robusta coffee, micro art exhibitions, 
                and community workshops.
              </p>

              <p style={{
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                color: 'rgba(255, 254, 249, 0.8)',
                lineHeight: 1.8,
              }}>
                In our cozy grab-and-go café, every cup tells a story. We celebrate Robusta—the 
                bold, high-caffeine coffee that powers your day—while creating a vibrant hub for 
                art lovers, creators, and coffee enthusiasts.
              </p>

              <p style={{
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                color: 'rgba(255, 254, 249, 0.7)',
                lineHeight: 1.8,
              }}>
                Experience the intersection of coffee culture, fine arts, and community. 
                This isn't just your morning coffee—it's an experience.
              </p>
            </div>

            {/* Values Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div
                      style={{
                        background: `${value.color}20`,
                        border: `2px solid ${value.color}40`,
                        width: 'clamp(40px, 10vw, 48px)',
                        height: 'clamp(40px, 10vw, 48px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={20} color={value.color} strokeWidth={2.5} className="sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <div style={{
                        fontFamily: 'Bebas Neue, sans-serif',
                        fontSize: '1.125rem',
                        color: value.color,
                        letterSpacing: '0.05em',
                        marginBottom: '0.25rem',
                      }}>
                        {value.title}
                      </div>
                      <div style={{
                        fontSize: '0.875rem',
                        color: 'rgba(255, 254, 249, 0.7)',
                      }}>
                        {value.desc}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* RIGHT - Visual Element */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative order-first lg:order-last"
          >
            {/* Main Image */}
            <div
              className="relative overflow-hidden"
              style={{
                border: '4px solid rgba(184, 115, 51, 0.4)',
                aspectRatio: '3/4',
              }}
            >
              <img
                src="https://images.pexels.com/photos/6612601/pexels-photo-6612601.jpeg"
                alt="Espresso machine by Pavel Danilyuk on Pexels"
                className="w-full h-full object-cover"
              />

              {/* Overlay gradient */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)',
                }}
              />

              {/* Bottom text overlay */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '2rem',
                }}
              >
                <p style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                  color: '#B87333',
                  letterSpacing: '0.05em',
                  marginBottom: '0.5rem',
                }}>
                  NEW SPACE
                </p>
                <p style={{
                  fontSize: '1rem',
                  color: 'rgba(255, 254, 249, 0.9)',
                }}>
                  Coffee • Art • Community
                </p>
              </div>
            </div>

            {/* Corner accent */}
            <div
              className="absolute -top-4 -right-4 w-20 h-20"
              style={{
                background: 'linear-gradient(135deg, transparent 50%, #D4A574 50%)',
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}