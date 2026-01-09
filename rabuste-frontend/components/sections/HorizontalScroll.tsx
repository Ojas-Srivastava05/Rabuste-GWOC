'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

type MenuItem = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
};

type DisplayItem = MenuItem & {
  color: string;
  isBestseller?: boolean;
  isTrending?: boolean;
};

// Consistent hash function for flags
const hashCode = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

// Generate consistent flags based on item name
const getItemFlags = (item: MenuItem) => {
  const hash = hashCode(item.name);
  const flags: {
    isBestseller?: boolean;
    isTrending?: boolean;
  } = {};
  
  if (hash % 10 < 3) {
    flags.isBestseller = true;
  }
  
  if (hash % 11 < 2 && !flags.isBestseller) {
    flags.isTrending = true;
  }
  
  return flags;
};

// Get color for item based on category
const getItemColor = (category: string, index: number): string => {
  const colors = ['#B87333', '#D4A574'];
  return colors[index % colors.length];
};

export default function HorizontalScroll() {
  const router = useRouter();
  const targetRef = useRef<HTMLElement>(null);
  const [items, setItems] = useState<DisplayItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Wait for component to mount before initializing scroll
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetchFeaturedItems();
  }, []);

  async function fetchFeaturedItems() {
    try {
      const res = await fetch('/api/menu');
      
      if (!res.ok) {
        console.error('Menu API error:', res.status, res.statusText);
        setLoading(false);
        return;
      }
      
      const data = await res.json();
      
      if (!Array.isArray(data)) {
        console.error('Invalid response from menu API:', data);
        setLoading(false);
        return;
      }
      
      const featured = data
        .map(item => ({
          ...item,
          ...getItemFlags(item),
        }))
        .filter(item => item.isBestseller || item.isTrending)
        .slice(0, 6)
        .map((item, index) => ({
          ...item,
          color: getItemColor(item.category, index),
        }));
      
      setItems(featured);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch featured items', err);
      setLoading(false);
    }
  }

  const handleItemClick = (itemId: string) => {
    router.push(`/menu#item-${itemId}`);
  };

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <section 
        className="relative z-20"
        style={{
          height: '100vh',
          background: '#000000',
        }}
      >
        <div className="h-screen flex items-center justify-center">
          <p style={{ color: '#B87333', fontSize: '1.125rem' }}>Loading featured items...</p>
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  // Mobile version with touch scroll
  if (isMobile) {
    return (
      <section 
        className="relative z-20 py-16"
        style={{
          background: '#000000',
          minHeight: '100vh',
        }}
      >
        {/* Header */}
        <div className="px-4 mb-8">
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
              SWIPE TO EXPLORE
            </p>
            
            <h2 style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(2.5rem, 10vw, 4rem)',
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

        {/* Touch scrollable container */}
        <div 
          className="overflow-x-auto overflow-y-hidden scrollbar-hide"
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollSnapType: 'x mandatory',
            scrollBehavior: 'smooth',
          }}
        >
          <div className="flex gap-4 px-4 pb-4">
            {items.map((item, index) => (
              <div
                key={item._id}
                className="flex-shrink-0"
                style={{
                  width: 'min(85vw, 350px)',
                  scrollSnapAlign: 'start',
                }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: 'linear-gradient(135deg, rgba(61, 43, 31, 0.9), rgba(26, 17, 16, 0.9))',
                    border: `3px solid ${item.color}`,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    height: '420px',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                  onClick={() => handleItemClick(item._id)}
                >
                  {/* Image */}
                  <div style={{
                    position: 'relative',
                    height: '55%',
                    overflow: 'hidden',
                  }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: `linear-gradient(180deg, transparent 0%, ${item.color}30 100%)`,
                    }} />

                    {(item.isBestseller || item.isTrending) && (
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        background: item.isBestseller ? '#B87333' : '#CD7F32',
                        padding: '6px 12px',
                        fontFamily: 'Bebas Neue, sans-serif',
                        fontSize: '0.75rem',
                        color: '#000000',
                        letterSpacing: '0.1em',
                      }}>
                        {item.isBestseller ? '⭐ BESTSELLER' : '🔥 TRENDING'}
                      </div>
                    )}

                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: item.color,
                      padding: '8px 16px',
                      fontFamily: 'Bebas Neue, sans-serif',
                      fontSize: '1.5rem',
                      color: '#000000',
                      letterSpacing: '0.05em',
                    }}>
                      ₹{item.price}
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{
                    padding: '20px',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}>
                    <div>
                      <h3 style={{
                        fontFamily: 'Bebas Neue, sans-serif',
                        fontSize: '1.75rem',
                        lineHeight: 0.9,
                        color: '#FFFEF9',
                        marginBottom: '8px',
                      }}>
                        {item.name.split(' ')[0]}
                        <br />
                        <span style={{ color: item.color }}>
                          {item.name.split(' ').slice(1).join(' ')}
                        </span>
                      </h3>

                      <p style={{
                        color: 'rgba(255, 254, 249, 0.7)',
                        fontSize: '0.875rem',
                        lineHeight: 1.5,
                      }}>
                        {item.description.length > 80 
                          ? item.description.substring(0, 80) + '...' 
                          : item.description}
                      </p>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: item.color,
                      fontFamily: 'Bebas Neue, sans-serif',
                      fontSize: '1rem',
                      letterSpacing: '0.1em',
                      marginTop: '12px',
                    }}>
                      TAP TO ORDER
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Hide scrollbar */}
        <style jsx global>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </section>
    );
  }

  // Desktop version - separate component to avoid hydration issues
  return <DesktopHorizontalScroll items={items} handleItemClick={handleItemClick} />;
}

// Separate desktop component that only renders on client
function DesktopHorizontalScroll({ 
  items, 
  handleItemClick 
}: { 
  items: DisplayItem[];
  handleItemClick: (id: string) => void;
}) {
  const targetRef = useRef<HTMLElement>(null);

  // Only call useScroll in desktop component after mount
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
    layoutEffect: false,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-83.33%"]);

  return (
    <section 
      ref={targetRef} 
      className="relative z-20"
      style={{
        height: '300vh',
        background: '#000000',
      }}
    >
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        {/* Header - Fixed */}
        <div className="absolute top-16 sm:top-24 left-0 right-0 z-20 px-4 sm:px-6">
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
          className="flex gap-4 sm:gap-8 px-4 sm:px-6 mt-64 sm:mt-72"
        >
          {items.map((item, index) => (
            <div
              key={item._id}
              className="flex-shrink-0"
              style={{
                width: 'min(85vw, 350px)',
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
                  height: '420px',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                }}
                onClick={() => handleItemClick(item._id)}
              >
                {/* Image */}
                <div style={{
                  position: 'relative',
                  height: '55%',
                  overflow: 'hidden',
                }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: `linear-gradient(180deg, transparent 0%, ${item.color}30 100%)`,
                  }} />

                  {(item.isBestseller || item.isTrending) && (
                    <div style={{
                      position: 'absolute',
                      top: '16px',
                      left: '16px',
                      background: item.isBestseller ? '#B87333' : '#CD7F32',
                      padding: '8px 16px',
                      fontFamily: 'Bebas Neue, sans-serif',
                      fontSize: '0.875rem',
                      color: '#000000',
                      letterSpacing: '0.1em',
                    }}>
                      {item.isBestseller ? '⭐ BESTSELLER' : '🔥 TRENDING'}
                    </div>
                  )}

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
                    ₹{item.price}
                  </div>
                </div>

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
                      fontSize: 'clamp(1.75rem, 4vw, 2.6rem)',
                      lineHeight: 0.9,
                      color: '#FFFEF9',
                      marginBottom: 'clamp(8px, 2vw, 12px)',
                    }}>
                      {item.name.split(' ')[0]}
                      <br />
                      <span style={{ color: item.color }}>
                        {item.name.split(' ').slice(1).join(' ')}
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