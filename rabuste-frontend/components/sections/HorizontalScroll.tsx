'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
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

const hashCode = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

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

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  if (isMobile) {
    return (
      <section 
        className="relative z-20 py-24"
        style={{
          background: '#000000',
          minHeight: '100vh',
        }}
      >
        <div className="px-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p style={{
              color: '#8B6F47',
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              fontWeight: 400,
              marginBottom: '1.5rem',
              textTransform: 'uppercase',
            }}>
              Signature Collection
            </p>
            
            <h2 style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(2.5rem, 10vw, 4rem)',
              lineHeight: 1.1,
              color: '#F5F1E8',
              fontWeight: 400,
              letterSpacing: '0.05em',
            }}>
              <span style={{
                background: 'linear-gradient(135deg, #FFFEF9 0%, #D4A574 50%, #FFFEF9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 0 80px rgba(212, 165, 116, 0.3)',
                position: 'relative',
                display: 'inline-block',
              }}>
                Featured Selections
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
                  Featured Selections
                </motion.span>
              </span>
            </h2>
          </motion.div>
        </div>

        <div 
          className="overflow-x-auto overflow-y-hidden scrollbar-hide"
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollSnapType: 'x mandatory',
            scrollBehavior: 'smooth',
          }}
        >
          <div className="flex gap-8 px-6 pb-6">
            {items.map((item, index) => (
              <div
                key={item._id}
                className="flex-shrink-0"
                style={{
                  width: 'min(85vw, 320px)',
                  scrollSnapAlign: 'start',
                }}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileTap={{ scale: 0.98 }}
                  className="group cursor-pointer"
                  style={{
                    background: 'rgba(26, 17, 16, 0.6)',
                    border: `1px solid rgba(184, 115, 51, 0.2)`,
                    overflow: 'hidden',
                    height: '480px',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                  onClick={() => handleItemClick(item._id)}
                >
                  <div style={{
                    position: 'relative',
                    height: '65%',
                    overflow: 'hidden',
                    background: '#1A1110',
                  }}>
                    <motion.img
                      src={item.image}
                      alt={item.name}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.6 }}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '40%',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                    }} />

                    {(item.isBestseller || item.isTrending) && (
                      <div style={{
                        position: 'absolute',
                        top: '16px',
                        left: '16px',
                        background: 'rgba(0, 0, 0, 0.7)',
                        padding: '6px 12px',
                        fontSize: '0.6875rem',
                        color: '#D4A574',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        fontFamily: 'Bebas Neue, sans-serif',
                      }}>
                        {item.isBestseller ? 'Bestseller' : 'Trending'}
                      </div>
                    )}

                    <div style={{
                      position: 'absolute',
                      bottom: '16px',
                      right: '16px',
                      fontFamily: 'Bebas Neue, sans-serif',
                      fontSize: '1.5rem',
                      color: '#F5F1E8',
                      letterSpacing: '0.05em',
                    }}>
                      ₹{item.price}
                    </div>
                  </div>

                  <div style={{
                    padding: '24px',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}>
                    <div>
                      <h3 style={{
                        fontFamily: 'Bebas Neue, sans-serif',
                        fontSize: '1.75rem',
                        lineHeight: 1.2,
                        color: '#F5F1E8',
                        marginBottom: '12px',
                        letterSpacing: '0.05em',
                        fontWeight: 400,
                      }}>
                        {item.name}
                      </h3>

                      <p style={{
                        color: 'rgba(245, 241, 232, 0.6)',
                        fontSize: '0.875rem',
                        lineHeight: 1.6,
                        fontWeight: 300,
                      }}>
                        {item.description.length > 100 
                          ? item.description.substring(0, 100) + '...' 
                          : item.description}
                      </p>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#B87333',
                      fontSize: '0.875rem',
                      letterSpacing: '0.1em',
                      marginTop: '20px',
                      textTransform: 'uppercase',
                      fontFamily: 'Bebas Neue, sans-serif',
                    }}>
                      View Details
                      <ArrowRight size={16} strokeWidth={1.5} />
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

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

  return <DesktopHorizontalScroll items={items} handleItemClick={handleItemClick} />;
}

function DesktopHorizontalScroll({ 
  items, 
  handleItemClick 
}: { 
  items: DisplayItem[];
  handleItemClick: (id: string) => void;
}) {
  const targetRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
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
        <div className="absolute top-24 left-0 right-0 z-20 px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p style={{
              color: '#8B6F47',
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              fontWeight: 400,
              marginBottom: '1.5rem',
              textTransform: 'uppercase',
            }}>
              Signature Collection
            </p>
            
            <h2 style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              lineHeight: 1.1,
              color: '#F5F1E8',
              fontWeight: 400,
              letterSpacing: '0.05em',
            }}>
              Featured Selections
            </h2>
          </motion.div>
        </div>

        <motion.div
          style={{ x }}
          className="flex gap-8 px-8 mt-80"
        >
          {items.map((item, index) => (
            <div
              key={item._id}
              className="flex-shrink-0"
              style={{
                width: 'min(90vw, 400px)',
              }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group cursor-pointer"
                style={{
                  background: 'rgba(26, 17, 16, 0.6)',
                  border: `1px solid rgba(184, 115, 51, 0.2)`,
                  overflow: 'hidden',
                  height: '520px',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                }}
                onClick={() => handleItemClick(item._id)}
              >
                <div style={{
                  position: 'relative',
                  height: '65%',
                  overflow: 'hidden',
                  background: '#1A1110',
                }}>
                  <motion.img
                    src={item.image}
                    alt={item.name}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6 }}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '40%',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                  }} />

                  {(item.isBestseller || item.isTrending) && (
                    <div style={{
                      position: 'absolute',
                      top: '20px',
                      left: '20px',
                      background: 'rgba(0, 0, 0, 0.7)',
                      padding: '8px 16px',
                      fontSize: '0.75rem',
                      color: '#D4A574',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      fontFamily: 'Bebas Neue, sans-serif',
                    }}>
                      {item.isBestseller ? 'Bestseller' : 'Trending'}
                    </div>
                  )}

                  <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    right: '20px',
                    fontFamily: 'Bebas Neue, sans-serif',
                    fontSize: '1.75rem',
                    color: '#F5F1E8',
                    letterSpacing: '0.05em',
                  }}>
                    ₹{item.price}
                  </div>
                </div>

                <div style={{
                  padding: '32px',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}>
                  <div>
                    <h3 style={{
                      fontFamily: 'Bebas Neue, sans-serif',
                      fontSize: 'clamp(1.875rem, 4vw, 2.25rem)',
                      lineHeight: 1.2,
                      color: '#F5F1E8',
                      marginBottom: '16px',
                      letterSpacing: '0.05em',
                      fontWeight: 400,
                    }}>
                      {item.name}
                    </h3>

                    <p style={{
                      color: 'rgba(245, 241, 232, 0.6)',
                      fontSize: 'clamp(0.9375rem, 2vw, 1.0625rem)',
                      lineHeight: 1.7,
                      fontWeight: 300,
                    }}>
                      {item.description}
                    </p>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: '#B87333',
                    fontSize: '0.9375rem',
                    letterSpacing: '0.1em',
                    marginTop: '24px',
                    textTransform: 'uppercase',
                    fontFamily: 'Bebas Neue, sans-serif',
                  }}>
                    View Details
                    <ArrowRight size={18} strokeWidth={1.5} />
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
