'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Twitter, Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'Instagram', Icon: Instagram, url: '#' },
    { name: 'Facebook', Icon: Facebook, url: '#' },
    { name: 'Twitter', Icon: Twitter, url: '#' }
  ];

  const quickLinks = [
    { name: 'Menu', url: '/menu' },
    { name: 'Science', url: '/science' },
    { name: 'Franchise', url: '/franchise' },
    { name: 'Workshops', url: '/workshops' }
  ];

  const contactInfo = [
    { label: 'Phone', value: '+91 123 456 7890', Icon: Phone },
    { label: 'Email', value: 'hello@rabuste.com', Icon: Mail },
    { label: 'Address', value: 'Jodhpur, Rajasthan', Icon: MapPin }
  ];

  const hours = [
    { day: 'Monday - Friday', time: '7:00 AM - 10:00 PM' },
    { day: 'Saturday', time: '8:00 AM - 11:00 PM' },
    { day: 'Sunday', time: '8:00 AM - 9:00 PM' },
  ];

  return (
    <footer 
      className="relative z-30"
      style={{
        background: 'linear-gradient(180deg, #000000 0%, #1A1110 100%)',
        borderTop: '2px solid rgba(184, 115, 51, 0.3)',
        color: '#F5F1E8',
        marginTop: '0',
      }}
    >
      {/* Animated background glow */}
      <div
        className="absolute top-0 left-1/2 w-[600px] h-[400px] -translate-x-1/2 -translate-y-1/2 opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(184, 115, 51, 0.4) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      {/* Decorative top border */}
      <div 
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(184, 115, 51, 0.3), transparent)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Main Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 
              className="text-3xl font-light mb-4"
              style={{
                fontFamily: 'var(--font-heading)',
                color: '#FFFEF9',
                fontWeight: 400,
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                letterSpacing: '0.05em',
              }}
            >
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
              <span style={{ color: '#B87333' }}>COFFEE</span>
            </h2>
            
            <div 
              className="w-16 h-px mb-6"
              style={{ background: 'linear-gradient(90deg, #B87333, transparent)' }}
            />
            
            <p 
              className="text-sm mb-6"
              style={{
                color: 'rgba(255, 254, 249, 0.7)',
                lineHeight: 1.8,
              }}
            >
              Unapologetically bold. Premium Robusta with 2X caffeine power.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map(({ name, Icon, url }) => (
                <a
                  key={name}
                  href={url}
                  className="w-10 h-10 flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:border-[#B87333]"
                  style={{
                    background: 'rgba(184, 115, 51, 0.1)',
                    border: '2px solid rgba(184, 115, 51, 0.3)',
                  }}
                  aria-label={name}
                >
                  <Icon size={18} style={{ color: '#B87333' }} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 
              className="text-sm uppercase tracking-[0.2em] font-light mb-6"
              style={{
                color: '#B87333',
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                letterSpacing: '0.05em',
              }}
            >
              QUICK LINKS
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.url}
                    className="text-sm inline-block transition-all duration-300 hover:translate-x-2 hover:text-[#B87333]"
                    style={{
                      color: 'rgba(255, 254, 249, 0.7)',
                    }}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 
              className="text-sm uppercase tracking-[0.2em] font-light mb-6"
              style={{
                color: '#B87333',
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                letterSpacing: '0.05em',
              }}
            >
              CONTACT
            </h3>
            <div className="space-y-4">
              {contactInfo.map(({ label, value, Icon }) => (
                <div key={label} className="flex items-start gap-3">
                  <Icon size={18} style={{ color: '#B87333', marginTop: '2px' }} />
                  <div>
                    <div 
                      className="text-xs uppercase tracking-wider mb-1"
                      style={{
                        color: 'rgba(255, 254, 249, 0.6)',
                      }}
                    >
                      {label}
                    </div>
                    <div 
                      className="text-sm"
                      style={{ color: 'rgba(255, 254, 249, 0.8)' }}
                    >
                      {value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 
              className="text-sm uppercase tracking-[0.2em] font-light mb-6"
              style={{
                color: '#B87333',
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                letterSpacing: '0.05em',
              }}
            >
              HOURS
            </h3>
            <div className="space-y-4">
              {hours.map(({ day, time }) => (
                <div key={day} className="flex items-start gap-3">
                  <Clock size={18} style={{ color: '#B87333', marginTop: '2px' }} />
                  <div>
                    <div 
                      className="text-xs uppercase tracking-wider mb-1"
                      style={{
                        color: 'rgba(255, 254, 249, 0.6)',
                      }}
                    >
                      {day}
                    </div>
                    <div 
                      className="text-sm"
                      style={{ color: 'rgba(255, 254, 249, 0.8)' }}
                    >
                      {time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div 
          className="h-px mb-8"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(184, 115, 51, 0.2), transparent)',
          }}
        />

        {/* Bottom Bar */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div 
            className="text-sm"
            style={{ color: 'rgba(255, 254, 249, 0.6)' }}
          >
            © {currentYear} Rabuste Coffee. Unapologetically Bold.
          </div>
          
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Cookies'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm transition-colors duration-300 hover:text-[#B87333]"
                style={{ color: 'rgba(255, 254, 249, 0.5)' }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}