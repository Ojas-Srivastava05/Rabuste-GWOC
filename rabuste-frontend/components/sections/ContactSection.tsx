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
      color: '#B87333',
    },
    {
      icon: Mail,
      title: 'EMAIL',
      primary: 'hello@rabuste.com',
      secondary: 'support@rabuste.com',
      tertiary: '24hr response time',
      color: '#B87333',
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
        padding: 'clamp(60px, 10vw, 100px) 0',
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
          className="text-center mb-12"
        >
          <p style={{
            color: '#8B6F47',
            fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
            letterSpacing: '0.2em',
            fontWeight: 400,
            marginBottom: '1.5rem',
            textTransform: 'uppercase',
          }}>
            GET IN TOUCH
          </p>

          <h2 style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 'clamp(2.5rem, 8vw, 5rem)',
            lineHeight: 0.9,
            color: '#F5F1E8',
            marginBottom: '1rem',
            fontWeight: 400,
            letterSpacing: '0.02em',
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
            color: 'rgba(245, 241, 232, 0.6)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.7,
            fontWeight: 300,
          }}>
            Experience premium coffee in person. We're here to serve excellence.
          </p>
        </motion.div>

        {/* Main Content - Left/Right Split */}
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 items-start">
          
          {/* LEFT SIDE - Large Visual Map/Location */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Main map container */}
            <div
              className="relative overflow-hidden rounded-sm"
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(184, 115, 51, 0.3)',
                height: 'clamp(300px, 40vw, 450px)',
                minHeight: '300px',
              }}
            >
              {/* Map iframe */}
              <div className="absolute inset-0 rounded-sm overflow-hidden">
                <iframe
                  title="Rabuste Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d232.54830003341274!2d72.77109710957428!3d21.16143814884428!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04d00111b19b5%3A0xba45eb84da00c79f!2sRABUSTE!5e0!3m2!1sen!2sin!4v1767290158905!5m2!1sen!2sin"
                  style={{ 
                    border: 0, 
                    width: "100%", 
                    height: "100%",
                    display: 'block',
                  }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>

              {/* Decorative corner accents - non-blocking */}
              <div 
                className="absolute top-0 left-0 w-16 h-16 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(184, 115, 51, 0.6) 50%, transparent 50%)',
                }}
              />
              <div 
                className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, transparent 50%, rgba(205, 127, 50, 0.6) 50%)',
                }}
              />
            </div>

            {/* Opening hours banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-4 flex items-center justify-between gap-4 p-4"
              style={{
                background: 'rgba(26, 17, 16, 0.6)',
                border: '1px solid rgba(184, 115, 51, 0.2)',
              }}
            >
              <div className="flex items-center gap-3">
                <Clock size={20} color="#B87333" strokeWidth={2} />
                <div>
                  <div style={{
                    fontFamily: 'Bebas Neue, sans-serif',
                    fontSize: '1rem',
                    color: '#B87333',
                    letterSpacing: '0.05em',
                    fontWeight: 400,
                  }}>
                    OPEN NOW
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: 'rgba(245, 241, 232, 0.6)',
                    fontWeight: 300,
                  }}>
                    Closes at 9:00 PM
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT SIDE - Contact Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-4"
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
                    background: 'rgba(26, 17, 16, 0.6)',
                    border: `1px solid rgba(184, 115, 51, 0.2)`,
                    padding: 'clamp(20px, 3vw, 24px)',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer',
                  }}
                >
                  <div className="relative z-10 flex items-start gap-6">
                    {/* Icon */}
                    <div 
                      className="flex-shrink-0"
                      style={{
                        background: '#B87333',
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
                        color: '#B87333',
                        marginBottom: '0.75rem',
                        letterSpacing: '0.05em',
                        fontWeight: 400,
                      }}>
                        {info.title}
                      </h3>

                      <div className="space-y-2">
                        <div style={{
                          fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                          color: 'rgba(245, 241, 232, 0.9)',
                          fontWeight: 400,
                          lineHeight: 1.5,
                        }}>
                          {info.primary}
                        </div>
                        <div style={{
                          fontSize: 'clamp(0.875rem, 1.8vw, 1rem)',
                          color: 'rgba(245, 241, 232, 0.6)',
                          lineHeight: 1.6,
                          fontWeight: 300,
                        }}>
                          {info.secondary}
                        </div>
                        <div style={{
                          fontSize: 'clamp(0.875rem, 1.8vw, 1rem)',
                          color: 'rgba(245, 241, 232, 0.5)',
                          lineHeight: 1.6,
                          fontWeight: 300,
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
                      background: '#B87333',
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
                background: 'rgba(26, 17, 16, 0.6)',
                border: '1px solid rgba(184, 115, 51, 0.2)',
              }}
            >
              <h4 style={{
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                color: '#B87333',
                marginBottom: '0.5rem',
                letterSpacing: '0.05em',
                fontWeight: 400,
              }}>
                QUESTIONS?
              </h4>
              <p style={{
                fontSize: '1rem',
                color: 'rgba(245, 241, 232, 0.7)',
                marginBottom: '1.5rem',
                fontWeight: 300,
              }}>
                We're here to help you find your perfect brew
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3"
                style={{
                  background: '#B87333',
                  border: 'none',
                  color: '#000',
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: '1rem',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  fontWeight: 400,
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