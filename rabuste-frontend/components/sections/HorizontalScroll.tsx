'use client';

import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export default function HorizontalScroll() {
  const router = useRouter();
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-83.33%"]);

  const items = [
    {
      title: 'SIGNATURE',
      subtitle: 'ESPRESSO',
      image: 'https://images.pexels.com/photos/7736770/pexels-photo-7736770.jpeg',
      attribution: 'Kei Scampa on Pexels',
      description: 'Pure robusta power. Maximum caffeine. Zero compromise.',
      price: '₹249',
      color: '#B87333',
    },
    {
      title: 'DARK',
      subtitle: 'ROAST',
      image: 'https://images.pexels.com/photos/11283537/pexels-photo-11283537.jpeg',
      attribution: 'hello aesthe on Pexels',
      description: 'Deep, smoky notes with unapologetically bold finish.',
      price: '₹299',
      color: '#CD7F32',
    },
    {
      title: 'COLD',
      subtitle: 'BREW',
      image: 'https://images.unsplash.com/photo-1607945610157-80d15752e761?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyNHx8RXNwcmVzc28lMjBjdXAlMjBwb3VyJTIwc2hvdCUyMGFjdGlvbiUyMGRhcmslMjBtb29keSUyMHByb2Zlc3Npb25hbCUyMGRhcmslMjBhY3Rpb258ZW58MHwyfHx8MTc2NjgyNDI3NHww&ixlib=rb-4.1.0&q=85',
      attribution: 'Kris Gerhard on Unsplash',
      description: 'Slow-brewed 24 hours. Maximum flavor, zero bitterness.',
      price: '₹349',
      color: '#B87333',
    },
    {
      title: 'PREMIUM',
      subtitle: 'BLEND',
      image: 'https://pixabay.com/get/gd7b28743502b5f72e709f51953615a9b3d86e7637adc56367e99e56afc344803e6fa8997948fb608b2771828c571f3e5.jpg',
      attribution: 'StockSnap on Pixabay',
      description: 'Expertly crafted blend. Balanced and powerful.',
      price: '₹399',
      color: '#D4A574',
    },
    {
      title: 'MORNING',
      subtitle: 'KICK',
      image: 'https://images.pexels.com/photos/5427150/pexels-photo-5427150.jpeg',
      attribution: 'Karola G on Pexels',
      description: 'Start your day right. Maximum energy boost.',
      price: '₹279',
      color: '#B87333',
    },
    {
      title: 'INTENSE',
      subtitle: 'SHOT',
      image: 'https://pixabay.com/get/g3ffe8791def6c0fec529bb473baf23e47e8f2e1a4e19658edfb942be6c044cddf6a9e888e7bba66f1cbff32f0fea590b.jpg',
      attribution: 'poedynchuk on Pixabay',
      description: 'Double shot intensity. For serious coffee lovers.',
      price: '₹329',
      color: '#B87333',
    },
  ];

  return (
    <section 
      ref={targetRef} 
      className="relative"
      style={{
        height: '300vh',
        background: '#000000',
      }}
    >
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        {/* Header - Fixed */}
        <div 
          className="absolute top-16 sm:top-24 left-0 right-0 z-20 px-4 sm:px-6"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p style={{
              color: '#B87333',
              fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
              letterSpacing: '0.3em',
              fontWeight: 700,
              marginBottom: '1rem',
            }}>
              SCROLL TO EXPLORE
            </p>
            
            <h2 style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(2.5rem, 8vw, 6rem)',
              lineHeight: 0.9,
              color: '#FFFEF9',
            }}>
              <span style={{
                background: 'linear-gradient(135deg, #B87333 0%, #CD7F32 50%, #D4A574 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                SIGNATURE
              </span>
              {' '}COLLECTION
            </h2>
          </motion.div>
        </div>

        {/* Horizontal scrolling container */}
        <motion.div
          style={{ x }}
          className="flex gap-4 sm:gap-8 px-4 sm:px-6 mt-32 sm:mt-48"
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0"
              style={{
                width: 'min(90vw, 500px)',
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ scale: 1.05, y: -10 }}
                style={{
                  background: 'linear-gradient(135deg, rgba(61, 43, 31, 0.9), rgba(26, 17, 16, 0.9))',
                  border: `3px solid ${item.color}`,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  height: '70vh',
                  maxHeight: '600px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onClick={() => router.push('/menu')}
              >
                {/* Image */}
                <div style={{
                  position: 'relative',
                  height: '60%',
                  overflow: 'hidden',
                }}>
                  <img
                    src={item.image}
                    alt={`${item.title} ${item.subtitle} - Photo by ${item.attribution}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  
                  {/* Gradient overlay */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: `linear-gradient(180deg, transparent 0%, ${item.color}30 100%)`,
                  }} />

                  {/* Price tag */}
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: item.color,
                    padding: '12px 24px',
                    fontFamily: 'Bebas Neue, sans-serif',
                    fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                    color: '#000000',
                    letterSpacing: '0.05em',
                  }}>
                    {item.price}
                  </div>
                </div>

                {/* Content */}
                <div style={{
                  padding: 'clamp(20px, 4vw, 32px)',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}>
                  <div>
                    <h3 style={{
                      fontFamily: 'Bebas Neue, sans-serif',
                      fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                      lineHeight: 0.9,
                      color: '#FFFEF9',
                      marginBottom: 'clamp(8px, 2vw, 12px)',
                    }}>
                      {item.title}
                      <br />
                      <span style={{ color: item.color }}>
                        {item.subtitle}
                      </span>
                    </h3>

                    <p style={{
                      color: 'rgba(255, 254, 249, 0.7)',
                      fontSize: 'clamp(0.875rem, 2vw, 1.125rem)',
                      lineHeight: 1.6,
                    }}>
                      {item.description}
                    </p>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: item.color,
                    fontFamily: 'Bebas Neue, sans-serif',
                    fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                    letterSpacing: '0.1em',
                    marginTop: '16px',
                  }}>
                    ORDER NOW
                    <ArrowRight size={20} />
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}