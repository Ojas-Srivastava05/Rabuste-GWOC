'use client';

import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'Instagram', icon: '📷', url: '#' },
    { name: 'Facebook', icon: '👤', url: '#' },
    { name: 'Twitter', icon: '🐦', url: '#' }
  ];

  const quickLinks = [
    { name: 'Menu', url: '#menu' },
    { name: 'Gallery', url: '#gallery' },
    { name: 'Workshops', url: '#workshops' },
    { name: 'About', url: '#about' }
  ];

  const contactInfo = [
    { label: 'Phone', value: '+91 123 456 7890', icon: '📞' },
    { label: 'Email', value: 'hello@rabuste.com', icon: '✉️' },
    { label: 'Address', value: 'Jodhpur, Rajasthan', icon: '📍' }
  ];

  return (
    <footer style={{
      position: 'relative',
      background: 'linear-gradient(to bottom, transparent, rgba(10, 10, 10, 0.6))',
      borderTop: '1px solid rgba(196, 165, 116, 0.1)',
      overflow: 'hidden'
    }}>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .footer-link {
          transition: all 0.3s ease;
          position: relative;
          display: inline-block;
        }
        .footer-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1px;
          background: linear-gradient(90deg, #c4a574, #E6C9A8);
          transition: width 0.3s ease;
        }
        .footer-link:hover::after {
          width: 100%;
        }
        .footer-link:hover {
          color: #c4a574;
          transform: translateY(-2px);
        }
        .social-icon {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .social-icon:hover {
          transform: translateY(-4px) scale(1.1);
          box-shadow: 0 8px 24px rgba(196, 165, 116, 0.3);
        }
      `}</style>

      {/* Decorative top wave */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, #c4a574, transparent)',
        opacity: 0.5
      }} />

      {/* Decorative glow */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '300px',
        background: 'radial-gradient(ellipse, rgba(196, 165, 116, 0.08) 0%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '60px 20px 30px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '50px',
          marginBottom: '50px'
        }}>
          {/* Brand Section */}
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{
                fontSize: '2.5rem',
                fontWeight: 800,
                margin: '0 0 8px 0',
                background: 'linear-gradient(135deg, #FAD0C4 0%, #c4a574 50%, #E6C9A8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.02em'
              }}>
                Rabuste
              </h2>
              <div style={{
                width: '50px',
                height: '2px',
                background: 'linear-gradient(90deg, #c4a574, transparent)',
                marginBottom: '12px'
              }} />
            </div>
            <p style={{
              color: '#E6C9A8',
              fontSize: '0.95rem',
              lineHeight: 1.6,
              opacity: 0.9,
              margin: '0 0 20px 0'
            }}>
              Where every cup tells a story of passion, craft, and the bold character of Robusta.
            </p>
            
            {/* Social Links */}
            <div style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap'
            }}>
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="social-icon"
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'rgba(196, 165, 116, 0.1)',
                    border: '1px solid rgba(196, 165, 116, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    textDecoration: 'none',
                    backdropFilter: 'blur(10px)'
                  }}
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: '#FAD0C4',
              marginBottom: '20px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}>
              Quick Links
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.url}
                    className="footer-link"
                    style={{
                      color: '#E6C9A8',
                      textDecoration: 'none',
                      fontSize: '0.95rem',
                      opacity: 0.9
                    }}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: '#FAD0C4',
              marginBottom: '20px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}>
              Get in Touch
            </h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {contactInfo.map((contact) => (
                <div
                  key={contact.label}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px'
                  }}
                >
                  <span style={{ fontSize: '1.2rem', marginTop: '2px' }}>
                    {contact.icon}
                  </span>
                  <div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#c4a574',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '4px'
                    }}>
                      {contact.label}
                    </div>
                    <div style={{
                      color: '#E6C9A8',
                      fontSize: '0.95rem',
                      opacity: 0.9
                    }}>
                      {contact.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: '#FAD0C4',
              marginBottom: '20px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}>
              Stay Updated
            </h3>
            <p style={{
              color: '#E6C9A8',
              fontSize: '0.9rem',
              lineHeight: 1.6,
              opacity: 0.9,
              margin: '0 0 16px 0'
            }}>
              Subscribe to our newsletter for exclusive offers and updates.
            </p>
            <div style={{
              display: 'flex',
              gap: '8px'
            }}>
              <input
                type="email"
                placeholder="Your email"
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(196, 165, 116, 0.3)',
                  background: 'rgba(26, 26, 26, 0.5)',
                  color: '#FAD0C4',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#c4a574';
                  e.currentTarget.style.background = 'rgba(26, 26, 26, 0.7)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(196, 165, 116, 0.3)';
                  e.currentTarget.style.background = 'rgba(26, 26, 26, 0.5)';
                }}
              />
              <button
                style={{
                  padding: '12px 20px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #c4a574, #E6C9A8)',
                  border: 'none',
                  color: '#000',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(196, 165, 116, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(196, 165, 116, 0.2), transparent)',
          margin: '40px 0'
        }} />

        {/* Bottom Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div style={{
            color: '#E6C9A8',
            fontSize: '0.85rem',
            opacity: 0.7
          }}>
            © {currentYear} Rabuste. All rights reserved.
          </div>
          
          <div style={{
            display: 'flex',
            gap: '24px',
            flexWrap: 'wrap'
          }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <a
                key={item}
                href="#"
                className="footer-link"
                style={{
                  color: '#E6C9A8',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  opacity: 0.7
                }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        {/* Crafted with love */}
        <div style={{
          textAlign: 'center',
          marginTop: '30px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(196, 165, 116, 0.1)'
        }}>
          <p style={{
            color: '#c4a574',
            fontSize: '0.8rem',
            margin: 0,
            opacity: 0.8,
            letterSpacing: '0.05em'
          }}>
            Crafted with ☕ and passion in Jodhpur
          </p>
        </div>
      </div>
    </footer>
  );
}