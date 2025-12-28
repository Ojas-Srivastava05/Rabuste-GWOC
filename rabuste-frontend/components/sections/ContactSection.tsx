'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

export default function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const contactInfo = [
    {
      icon: MapPin,
      title: 'LOCATION',
      primary: '123 Coffee Street',
      secondary: 'Downtown District, City',
      tertiary: 'State 12345',
      color: '#B87333',
    },
    {
      icon: Phone,
      title: 'PHONE',
      primary: '+1 (555) 123-4567',
      secondary: 'Mon-Sat: 7AM - 9PM',
      tertiary: 'Sunday: 8AM - 8PM',
      color: '#CD7F32',
    },
    {
      icon: Mail,
      title: 'EMAIL',
      primary: 'hello@rabuste.com',
      secondary: 'support@rabuste.com',
      tertiary: '24hr response time',
      color: '#D4A574',
    },
    {
      icon: Clock,
      title: 'HOURS',
      primary: 'Mon-Fri: 7AM - 9PM',
      secondary: 'Sat-Sun: 8AM - 10PM',
      tertiary: 'Holidays: 9AM - 6PM',
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
      {/* Subtle background pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(184, 115, 51, 0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-8">
        {/* Header - Centered */}
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
            GET IN TOUCH
          </p>

          <h2 style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 'clamp(3.5rem, 10vw, 7rem)',
            lineHeight: 0.9,
            color: '#FFFEF9',
            marginBottom: '1.5rem',
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

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'rgba(255, 254, 249, 0.7)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            Experience premium coffee in person. We're here to serve excellence.
          </p>
        </motion.div>

        {/* Main Content - Left/Right Split */}
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-start">
          
          {/* LEFT SIDE - Large Visual Map/Location */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Main map container */}
            <div
              className="relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(61, 43, 31, 0.9), rgba(26, 17, 16, 0.9))',
                border: '3px solid rgba(184, 115, 51, 0.4)',
                height: 'clamp(350px, 50vw, 600px)',
                minHeight: '350px',
              }}
            >
              {/* Map placeholder with centered content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.5, type: 'spring' }}
                  className="mb-8"
                >
                  <MapPin size={80} color="#B87333" strokeWidth={2} />
                </motion.div>
                
                <h3 style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                  color: '#FFFEF9',
                  letterSpacing: '0.05em',
                  marginBottom: '1rem',
                  textAlign: 'center',
                }}>
                  FIND US HERE
                </h3>
                
                <p style={{
                  color: 'rgba(255, 254, 249, 0.8)',
                  fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                  textAlign: 'center',
                  maxWidth: '500px',
                  lineHeight: 1.6,
                  marginBottom: '2rem',
                }}>
                  123 Coffee Street, Downtown District
                  <br />
                  City, State 12345
                </p>

              {/* Get Directions Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 transition-all w-full sm:w-auto"
                  style={{
                    background: 'linear-gradient(135deg, #B87333, #CD7F32)',
                    border: 'none',
                    color: '#000',
                    fontFamily: 'Bebas Neue, sans-serif',
                    fontSize: '1.25rem',
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                    boxShadow: '0 8px 24px rgba(184, 115, 51, 0.3)',
                  }}
                >
                  <Send size={20} />
                  GET DIRECTIONS
                </motion.button>

                {/* Decorative copper line */}
                <div className="flex gap-3 mt-8">
                  {[1, 2, 3].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scaleX: 0 }}
                      animate={isInView ? { scaleX: 1 } : {}}
                      transition={{ duration: 0.6, delay: 0.8 + i * 0.1 }}
                      style={{
                        width: '50px',
                        height: '2px',
                        background: i === 1 ? '#B87333' : 'rgba(184, 115, 51, 0.3)',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Corner accent - top left */}
              <div 
                className="absolute top-0 left-0 w-20 h-20"
                style={{
                  background: 'linear-gradient(135deg, #B87333 50%, transparent 50%)',
                  opacity: 0.4,
                }}
              />

              {/* Corner accent - bottom right */}
              <div 
                className="absolute bottom-0 right-0 w-24 h-24"
                style={{
                  background: 'linear-gradient(135deg, transparent 50%, #CD7F32 50%)',
                  opacity: 0.4,
                }}
              />
            </div>

            {/* Opening hours banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 sm:p-6"
              style={{
                background: 'rgba(184, 115, 51, 0.1)',
                border: '2px solid rgba(184, 115, 51, 0.3)',
              }}
            >
              <div className="flex items-center gap-4">
                <Clock size={32} color="#B87333" strokeWidth={2.5} />
                <div>
                  <div style={{
                    fontFamily: 'Bebas Neue, sans-serif',
                    fontSize: '1.25rem',
                    color: '#B87333',
                    letterSpacing: '0.05em',
                  }}>
                    OPEN NOW
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    color: 'rgba(255, 254, 249, 0.7)',
                  }}>
                    Closes at 9:00 PM
                  </div>
                </div>
              </div>
              <div style={{
                fontSize: '2rem',
                color: '#B87333',
              }}>
                •
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT SIDE - Contact Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-5 sm:space-y-6"
          >
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  whileHover={{ x: 8, scale: 1.02 }}
                  className="group"
                  style={{
                    background: 'linear-gradient(135deg, rgba(61, 43, 31, 0.6), rgba(26, 17, 16, 0.6))',
                    border: `2px solid ${info.color}40`,
                    padding: 'clamp(24px, 4vw, 32px)',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer',
                  }}
                >
                  {/* Subtle hover glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(135deg, ${info.color}10 0%, transparent 100%)`,
                      pointerEvents: 'none',
                    }}
                  />

                  <div className="relative z-10 flex items-start gap-6">
                    {/* Icon */}
                    <div 
                      className="flex-shrink-0"
                      style={{
                        background: info.color,
                        width: '64px',
                        height: '64px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={32} color="#000000" strokeWidth={2.5} />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 style={{
                        fontFamily: 'Bebas Neue, sans-serif',
                        fontSize: 'clamp(1.5rem, 3vw, 1.75rem)',
                        color: info.color,
                        marginBottom: '0.75rem',
                        letterSpacing: '0.05em',
                      }}>
                        {info.title}
                      </h3>

                      <div className="space-y-2">
                        <div style={{
                          fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                          color: 'rgba(255, 254, 249, 0.95)',
                          fontWeight: 600,
                          lineHeight: 1.4,
                        }}>
                          {info.primary}
                        </div>
                        <div style={{
                          fontSize: 'clamp(0.875rem, 1.8vw, 1rem)',
                          color: 'rgba(255, 254, 249, 0.7)',
                          lineHeight: 1.5,
                        }}>
                          {info.secondary}
                        </div>
                        <div style={{
                          fontSize: 'clamp(0.875rem, 1.8vw, 1rem)',
                          color: 'rgba(255, 254, 249, 0.6)',
                          lineHeight: 1.5,
                        }}>
                          {info.tertiary}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom accent line */}
                  <div 
                    className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500"
                    style={{
                      background: info.color,
                    }}
                  />
                </motion.div>
              );
            })}

            {/* CTA Box */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-8 p-8 text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(184, 115, 51, 0.15), rgba(205, 127, 50, 0.15))',
                border: '2px solid rgba(184, 115, 51, 0.4)',
              }}
            >
              <h4 style={{
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                color: '#B87333',
                marginBottom: '0.5rem',
                letterSpacing: '0.05em',
              }}>
                QUESTIONS?
              </h4>
              <p style={{
                fontSize: '1rem',
                color: 'rgba(255, 254, 249, 0.8)',
                marginBottom: '1.5rem',
              }}>
                We're here to help you find your perfect brew
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3"
                style={{
                  background: 'linear-gradient(135deg, #B87333, #CD7F32)',
                  border: 'none',
                  color: '#000',
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: '1rem',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(184, 115, 51, 0.3)',
                }}
              >
                SEND MESSAGE
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}