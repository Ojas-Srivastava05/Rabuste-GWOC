'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'Instagram', icon: '📷', url: '#' },
    { name: 'Facebook', icon: '👤', url: '#' },
    { name: 'Twitter', icon: '🐦', url: '#' }
  ];

  const quickLinks = [
    { name: 'Menu', url: '/menu' },
    { name: 'Science', url: '/science' },
    { name: 'Franchise', url: '/franchise' },
    { name: 'Workshops', url: '/workshops' }
  ];

  const contactInfo = [
    { label: 'Phone', value: '+91 123 456 7890', icon: '📞' },
    { label: 'Email', value: 'hello@rabuste.com', icon: '✉️' },
    { label: 'Address', value: 'Jodhpur, Rajasthan', icon: '📍' }
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
                fontFamily: 'Bebas Neue, sans-serif',
                color: '#FFFEF9',
                fontWeight: 400,
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                letterSpacing: '0.05em',
              }}
            >
              RABUSTE
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
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="w-10 h-10 rounded-sm flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: 'rgba(184, 115, 51, 0.1)',
                    border: '2px solid rgba(184, 115, 51, 0.3)',
                  }}
                  aria-label={social.name}
                >
                  {social.icon}
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
                fontFamily: 'Bebas Neue, sans-serif',
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
                    className="text-sm inline-block transition-all duration-300 hover:translate-x-2"
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
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                letterSpacing: '0.05em',
              }}
            >
              CONTACT
            </h3>
            <div className="space-y-4">
              {contactInfo.map((contact) => (
                <div key={contact.label} className="flex items-start gap-3">
                  <span className="text-lg" style={{ color: '#B87333' }}>{contact.icon}</span>
                  <div>
                    <div 
                      className="text-xs uppercase tracking-wider mb-1"
                      style={{
                        color: 'rgba(255, 254, 249, 0.6)',
                      }}
                    >
                      {contact.label}
                    </div>
                    <div 
                      className="text-sm"
                      style={{ color: 'rgba(255, 254, 249, 0.8)' }}
                    >
                      {contact.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Newsletter */}
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
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                letterSpacing: '0.05em',
              }}
            >
              NEWSLETTER
            </h3>
            <p 
              className="text-sm mb-4"
              style={{
                color: 'rgba(255, 254, 249, 0.7)',
                lineHeight: 1.6,
              }}
            >
              Subscribe for exclusive offers and updates.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 text-sm"
                style={{
                  background: 'rgba(61, 43, 31, 0.6)',
                  border: '2px solid rgba(184, 115, 51, 0.3)',
                  color: '#FFFEF9',
                  outline: 'none',
                  borderRadius: '0',
                }}
              />
              <button
                className="px-4 py-2 text-sm font-light transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #B87333 0%, #CD7F32 100%)',
                  color: '#000000',
                  fontFamily: 'Bebas Neue, sans-serif',
                  letterSpacing: '0.1em',
                  borderRadius: '0',
                  border: 'none',
                }}
              >
                →
              </button>
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
                className="text-sm transition-colors duration-300"
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