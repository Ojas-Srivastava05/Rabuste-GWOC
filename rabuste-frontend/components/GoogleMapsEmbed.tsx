'use client';

import React from 'react';
import { MapPin, Navigation, Phone, Clock } from 'lucide-react';

export default function GoogleMapsEmbed() {
  // Replace with your actual business location
  const businessInfo = {
    name: 'Rabuste Coffee',
    address: '123 Coffee Street, San Francisco, CA 94102',
    phone: '+1 (234) 567-8900',
    hours: 'Mon-Fri: 7AM-8PM, Sat-Sun: 8AM-9PM',
    coordinates: {
      lat: 37.7749,
      lng: -122.4194
    }
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(61, 43, 31, 0.8), rgba(42, 24, 16, 0.8))',
        border: '2px solid rgba(184, 115, 51, 0.3)',
        overflow: 'hidden',
      }}
    >
      <div className="grid lg:grid-cols-5 gap-0">
        {/* Map */}
        <div className="lg:col-span-3 relative" style={{ minHeight: '400px' }}>
          <iframe
            src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0197573856264!2d${businessInfo.coordinates.lng}!3d${businessInfo.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDQ2JzI5LjYiTiAxMjLCsDI1JzA5LjgiVw!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus`}
            width="100%"
            height="100%"
            style={{
              border: 0,
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              filter: 'grayscale(0.2) contrast(1.1)',
            }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          
          {/* Map Overlay */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 100%)',
              padding: '20px',
              pointerEvents: 'none',
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <div
                style={{
                  background: 'linear-gradient(135deg, #B87333, #CD7F32)',
                  padding: '8px',
                }}
              >
                <MapPin style={{ width: 20, height: 20, color: '#000000' }} />
              </div>
              <div>
                <div style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: '1.125rem',
                  color: '#FFFEF9',
                  letterSpacing: '0.05em',
                }}>
                  Find Us Here
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: 'rgba(255, 254, 249, 0.7)',
                }}>
                  Click map for directions
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="lg:col-span-2 p-8 lg:p-10" style={{
          background: 'rgba(26, 17, 16, 0.6)',
        }}>
          <h3 style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            color: '#FFFEF9',
            marginBottom: '24px',
            letterSpacing: '0.05em',
          }}>
            Visit Us
          </h3>

          <div className="space-y-6">
            {/* Address */}
            <div style={{ display: 'flex', gap: '16px' }}>
              <div
                style={{
                  background: 'rgba(184, 115, 51, 0.2)',
                  padding: '12px',
                  height: 'fit-content',
                }}
              >
                <MapPin style={{ width: 20, height: 20, color: '#B87333' }} />
              </div>
              <div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#B87333',
                  letterSpacing: '0.1em',
                  marginBottom: '4px',
                  fontWeight: 600,
                }}>
                  ADDRESS
                </div>
                <div style={{
                  fontSize: '1rem',
                  color: '#FFFEF9',
                  lineHeight: 1.6,
                }}>
                  {businessInfo.address}
                </div>
              </div>
            </div>

            {/* Phone */}
            <div style={{ display: 'flex', gap: '16px' }}>
              <div
                style={{
                  background: 'rgba(184, 115, 51, 0.2)',
                  padding: '12px',
                  height: 'fit-content',
                }}
              >
                <Phone style={{ width: 20, height: 20, color: '#B87333' }} />
              </div>
              <div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#B87333',
                  letterSpacing: '0.1em',
                  marginBottom: '4px',
                  fontWeight: 600,
                }}>
                  PHONE
                </div>
                <a
                  href={`tel:${businessInfo.phone.replace(/[^0-9+]/g, '')}`}
                  style={{
                    fontSize: '1rem',
                    color: '#FFFEF9',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#B87333'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#FFFEF9'}
                >
                  {businessInfo.phone}
                </a>
              </div>
            </div>

            {/* Hours */}
            <div style={{ display: 'flex', gap: '16px' }}>
              <div
                style={{
                  background: 'rgba(184, 115, 51, 0.2)',
                  padding: '12px',
                  height: 'fit-content',
                }}
              >
                <Clock style={{ width: 20, height: 20, color: '#B87333' }} />
              </div>
              <div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#B87333',
                  letterSpacing: '0.1em',
                  marginBottom: '4px',
                  fontWeight: 600,
                }}>
                  HOURS
                </div>
                <div style={{
                  fontSize: '1rem',
                  color: '#FFFEF9',
                  lineHeight: 1.6,
                }}>
                  {businessInfo.hours}
                </div>
              </div>
            </div>
          </div>

          {/* Get Directions Button */}
          <button
            onClick={() => {
              window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${businessInfo.coordinates.lat},${businessInfo.coordinates.lng}`,
                '_blank'
              );
            }}
            style={{
              marginTop: '32px',
              width: '100%',
              padding: '16px',
              background: 'linear-gradient(135deg, #B87333, #CD7F32)',
              border: 'none',
              color: '#000000',
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: '1.125rem',
              letterSpacing: '0.05em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(184, 115, 51, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Navigation style={{ width: 20, height: 20 }} />
            <span>Get Directions</span>
          </button>
        </div>
      </div>
    </div>
  );
}