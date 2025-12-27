'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const contactInfo = [
    {
      icon: MapPin,
      title: 'VISIT US',
      details: ['123 Coffee Street', 'Downtown District', 'City, State 12345'],
      color: '#B87333',
    },
    {
      icon: Phone,
      title: 'CALL US',
      details: ['+1 (555) 123-4567', 'Mon-Sat: 7AM - 9PM', 'Sunday: 8AM - 8PM'],
      color: '#CD7F32',
    },
    {
      icon: Mail,
      title: 'EMAIL US',
      details: ['hello@rabuste.com', 'support@rabuste.com', 'Response within 24hrs'],
      color: '#D4A574',
    },
    {
      icon: Clock,
      title: 'HOURS',
      details: ['Mon-Fri: 7AM - 9PM', 'Sat-Sun: 8AM - 10PM', 'Holidays: 9AM - 6PM'],
      color: '#B87333',
    },
  ];

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ 
        background: 'linear-gradient(180deg, #000000 0%, #1A1110 100%)',
        padding: 'clamp(80px, 15vw, 120px) 0',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16"
        >
          <p style={{
            color: '#B87333',
            fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
            letterSpacing: '0.3em',
            fontWeight: 700,
            marginBottom: '1.5rem',
          }}>
            CONNECT WITH US
          </p>

          <h2 style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 'clamp(2.5rem, 8vw, 6rem)',
            lineHeight: 0.9,
            color: '#FFFEF9',
          }}>
            VISIT THE
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #B87333 0%, #CD7F32 50%, #D4A574 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              POWERHOUSE
            </span>
          </h2>
        </motion.div>

        {/* Contact Cards - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.03 }}
                style={{
                  background: 'linear-gradient(135deg, rgba(61, 43, 31, 0.8), rgba(26, 17, 16, 0.8))',
                  border: `3px solid ${info.color}40`,
                  padding: 'clamp(20px, 4vw, 24px)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Icon */}
                <div style={{
                  background: info.color,
                  width: 'clamp(50px, 10vw, 60px)',
                  height: 'clamp(50px, 10vw, 60px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 'clamp(16px, 3vw, 20px)',
                }}>
                  <Icon size={24} color="#000000" strokeWidth={2.5} />
                </div>

                {/* Title */}
                <h3 style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                  color: info.color,
                  marginBottom: 'clamp(12px, 2.5vw, 16px)',
                  letterSpacing: '0.05em',
                }}>
                  {info.title}
                </h3>

                {/* Details */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'clamp(6px, 1.5vw, 8px)',
                }}>
                  {info.details.map((detail, i) => (
                    <div
                      key={i}
                      style={{
                        fontSize: 'clamp(0.875rem, 1.8vw, 1rem)',
                        color: 'rgba(255, 254, 249, 0.7)',
                        lineHeight: 1.5,
                      }}
                    >
                      {detail}
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Map Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            background: 'linear-gradient(135deg, rgba(61, 43, 31, 0.6), rgba(26, 17, 16, 0.6))',
            border: '3px solid rgba(255, 107, 53, 0.3)',
            height: 'clamp(250px, 40vw, 400px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{
            textAlign: 'center',
            padding: '20px',
          }}>
            <MapPin size={48} color="#B87333" style={{ margin: '0 auto 16px' }} />
            <p style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              color: '#FFFEF9',
              letterSpacing: '0.05em',
            }}>
              FIND US HERE
            </p>
            <p style={{
              color: 'rgba(255, 254, 249, 0.7)',
              fontSize: 'clamp(0.875rem, 2vw, 1rem)',
              marginTop: '8px',
            }}>
              Interactive map coming soon
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}