'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const contactInfo = [
    {
      icon: <MapPin size={20} />,
      title: 'Visit Us',
      details: ['123 Coffee Street', 'Downtown District', 'City, State 12345'],
    },
    {
      icon: <Phone size={20} />,
      title: 'Call Us',
      details: ['+1 (555) 123-4567', 'Mon-Sat: 7AM - 9PM', 'Sunday: 8AM - 8PM'],
    },
    {
      icon: <Mail size={20} />,
      title: 'Email Us',
      details: ['hello@rabuste.com', 'support@rabuste.com', 'Response within 24hrs'],
    },
    {
      icon: <Clock size={20} />,
      title: 'Hours',
      details: ['Mon-Fri: 7:00 AM - 9:00 PM', 'Sat-Sun: 8:00 AM - 10:00 PM', 'Holidays: 9:00 AM - 6:00 PM'],
    },
  ];

  return (
    <section
      ref={ref}
      className="section"
      style={{ background: 'linear-gradient(180deg, #0A0A0A 0%, #000000 100%)' }}
    >
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="copper-line" />
            <span className="section-label">
              CONNECT WITH US
            </span>
            <div className="copper-line" style={{ transform: 'scaleX(-1)' }} />
          </div>

          <h2 
            className="mb-6"
            style={{
              color: '#FFFEF9',
              fontFamily: 'var(--font-heading)',
              fontWeight: 400,
            }}
          >
            VISIT THE
            <br />
            <span className="gradient-copper">POWERHOUSE</span>
          </h2>
        </motion.div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => (
            <motion.div
              key={info.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="brutal-card p-6"
            >
              <div 
                className="w-10 h-10 rounded-sm flex items-center justify-center mb-4"
                style={{
                  background: 'linear-gradient(135deg, rgba(184, 115, 51, 0.2), rgba(115, 54, 53, 0.2))',
                  border: '2px solid rgba(184, 115, 51, 0.3)',
                  color: '#B87333',
                }}
              >
                {info.icon}
              </div>
              
              <h3 
                className="text-lg mb-3"
                style={{
                  color: '#FFFEF9',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 400,
                  letterSpacing: '0.08em',
                }}
              >
                {info.title}
              </h3>
              
              <div className="space-y-1">
                {info.details.map((detail, i) => (
                  <p 
                    key={i}
                    className="text-sm"
                    style={{ 
                      color: '#8B6F47',
                    }}
                  >
                    {detail}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Map placeholder with premium styling */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="rounded-sm overflow-hidden"
          style={{
            border: '1px solid rgba(201, 168, 106, 0.15)',
          }}
        >
          <div 
            className="w-full h-96 flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #141414 0%, #1E1E1E 100%)',
            }}
          >
            <div className="text-center">
              <MapPin size={40} color="#C9A86A" className="mx-auto mb-4 opacity-40" />
              <p 
                className="text-lg font-light mb-2"
                style={{ 
                  color: '#F5F1E8',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                Map Integration
              </p>
              <p style={{ color: '#8B6F47', fontSize: '0.9rem' }}>
                123 Coffee Street, Downtown District
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}