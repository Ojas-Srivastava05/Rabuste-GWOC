'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Flame, Zap, Award, ArrowRight } from 'lucide-react';

export default function BoldProducts() {
  const router = useRouter();

  const products = [
    {
      name: 'SIGNATURE ESPRESSO',
      tagline: 'Pure Power',
      description: '100% Premium Robusta. Maximum caffeine. Zero compromise.',
      image: 'https://pixabay.com/get/gab0f9ca3bd914f865e2d3b9a63c73aca31e9cf0d2e4c80672c6795df3036f108c1a965b5e711c3d3491e896d9f68cd7a.png',
      attribution: 'Clker-Free-Vector-Images on Pixabay',
      stats: ['2X Caffeine', 'Bold Roast', 'Rich Crema'],
      color: '#FF6B35',
    },
    {
      name: 'DARK ROAST',
      tagline: 'Intense Experience',
      description: 'Deep, smoky notes with an unapologetically bold finish.',
      image: 'https://images.pexels.com/photos/17516404/pexels-photo-17516404.jpeg',
      attribution: 'Wojtek Pacześ on Pexels',
      stats: ['Premium Beans', 'Dark Roast', 'Full Body'],
      color: '#E63946',
    },
    {
      name: 'COLD BREW',
      tagline: 'Smooth Power',
      description: 'Slow-brewed for 24 hours. Maximum flavor, zero bitterness.',
      image: 'https://images.pexels.com/photos/7736770/pexels-photo-7736770.jpeg',
      attribution: 'Kei Scampa on Pexels',
      stats: ['24hr Brew', 'Smooth', 'Energizing'],
      color: '#B87333',
    },
  ];

  return (
    <section 
      className="section relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #000000 0%, #1A1110 50%, #000000 100%)',
      }}
    >
      {/* Section header */}
      <div className="container px-6 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <p style={{
            color: '#FF6B35',
            fontSize: '0.875rem',
            letterSpacing: '0.3em',
            fontWeight: 700,
            marginBottom: '1rem',
          }}>
            OUR SIGNATURE SELECTION
          </p>
          
          <h2 style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 'clamp(3rem, 10vw, 8rem)',
            lineHeight: 0.9,
            color: '#FFFEF9',
            marginBottom: '1.5rem',
          }}>
            BOLD BY
            <br />
            <span className="gradient-text" style={{
              background: 'linear-gradient(135deg, #FF6B35 0%, #E63946 50%, #B87333 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              DESIGN
            </span>
          </h2>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'rgba(255, 254, 249, 0.7)',
            lineHeight: 1.6,
          }}>
            Crafted for those who refuse to settle. Each blend is a testament to premium quality and uncompromising strength.
          </p>
        </motion.div>
      </div>

      {/* Product grid - Bento style */}
      <div className="container px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {products.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="brutal-card group cursor-pointer"
              onClick={() => router.push('/menu')}
              style={{
                background: 'linear-gradient(135deg, rgba(61, 43, 31, 0.8), rgba(26, 17, 16, 0.8))',
                border: `3px solid ${product.color}40`,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {/* Image */}
              <div style={{
                position: 'relative',
                aspectRatio: '4/3',
                overflow: 'hidden',
              }}>
                <img
                  src={product.image}
                  alt={`${product.name} - Photo by ${product.attribution}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  className="group-hover:scale-110"
                />
                
                {/* Gradient overlay */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(180deg, transparent 0%, ${product.color}20 100%)`,
                }} />

                {/* Floating icon */}
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: product.color,
                  padding: '12px',
                  borderRadius: '50%',
                }}>
                  <Flame size={24} color="#000000" />
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '30px' }}>
                <p style={{
                  color: product.color,
                  fontSize: '0.75rem',
                  letterSpacing: '0.2em',
                  fontWeight: 700,
                  marginBottom: '0.5rem',
                }}>
                  {product.tagline}
                </p>

                <h3 style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  lineHeight: 1,
                  color: '#FFFEF9',
                  marginBottom: '1rem',
                }}>
                  {product.name}
                </h3>

                <p style={{
                  color: 'rgba(255, 254, 249, 0.7)',
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  marginBottom: '1.5rem',
                }}>
                  {product.description}
                </p>

                {/* Stats */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '12px',
                  marginBottom: '1.5rem',
                }}>
                  {product.stats.map((stat, i) => (
                    <span
                      key={i}
                      style={{
                        padding: '8px 16px',
                        background: `${product.color}20`,
                        border: `2px solid ${product.color}40`,
                        color: product.color,
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                      }}
                    >
                      {stat}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: product.color,
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: '1.125rem',
                  letterSpacing: '0.1em',
                  transition: 'gap 0.3s',
                }}
                className="group-hover:gap-4"
                >
                  ORDER NOW
                  <ArrowRight size={20} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <button
            onClick={() => router.push('/menu')}
            className="btn btn-primary group"
            style={{
              background: 'linear-gradient(135deg, #FF6B35 0%, #E63946 50%, #B87333 100%)',
              color: '#000000',
              padding: '24px 60px',
              fontSize: '1.25rem',
              fontFamily: 'Bebas Neue, sans-serif',
              letterSpacing: '0.15em',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            VIEW FULL MENU
            <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}