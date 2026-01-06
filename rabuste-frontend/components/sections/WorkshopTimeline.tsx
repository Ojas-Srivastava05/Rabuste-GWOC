'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { Calendar, Clock, User, MapPin, Coffee, Palette, ArrowRight, Sparkles } from 'lucide-react';

type Workshop = {
  _id: string;
  title: string;
  category: 'coffee' | 'painting';
  date: string;
  time: string;
  description: string;
  instructor: string;
  location: string;
  capacity: number;
  image?: string;
  registrations: Array<{ name: string; email: string; registeredAt: Date }>;
  status: 'upcoming' | 'past';
};

export default function WorkshopTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationForm, setRegistrationForm] = useState({ name: '', email: '' });
  const [registrationMessage, setRegistrationMessage] = useState('');

  useEffect(() => {
    fetchWorkshops();
  }, []);

  // Handle scroll tracking with native scroll events to avoid hydration issues
  useEffect(() => {
    const container = containerRef.current;
    if (!container || workshops.length === 0) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const scrollWidth = container.scrollWidth - container.clientWidth;
      const scrollProgress = scrollWidth > 0 ? scrollLeft / scrollWidth : 0;
      const newIndex = Math.round(scrollProgress * Math.max(0, workshops.length - 1));
      setActiveIndex(newIndex);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [workshops.length]);

  async function fetchWorkshops() {
    try {
      const res = await fetch('/api/workshops');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const processed = data.map((w: Workshop) => {
        const workshopDate = new Date(w.date);
        workshopDate.setHours(0, 0, 0, 0);
        return {
          ...w,
          status: workshopDate < today ? 'past' : 'upcoming',
        };
      });

      setWorkshops(processed);
    } catch (err) {
      console.error('Failed to fetch workshops', err);
    }
  }


  const handleRegister = async (workshopId: string) => {
    if (!registrationForm.name || !registrationForm.email) {
      setRegistrationMessage('Please fill in all fields');
      return;
    }

    try {
      const res = await fetch(`/api/workshops/${workshopId}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationForm),
      });

      const data = await res.json();

      if (!res.ok) {
        setRegistrationMessage(data.error || 'Registration failed');
        return;
      }

      setRegistrationMessage('Successfully registered!');
      setRegistrationForm({ name: '', email: '' });
      setIsRegistering(false);
      fetchWorkshops();

      setTimeout(() => {
        setRegistrationMessage('');
        setExpandedCard(null);
      }, 2000);
    } catch (err) {
      console.error(err);
      setRegistrationMessage('An error occurred');
    }
  };

  const isWorkshopFull = (workshop: Workshop) => {
    return workshop.capacity > 0 && workshop.registrations?.length >= workshop.capacity;
  };

  // Group workshops by month for timeline
  const timelineMonths = React.useMemo(() => {
    const months = new Set<string>();
    workshops.forEach((w) => {
      const date = new Date(w.date);
      months.add(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
    });
    return Array.from(months);
  }, [workshops]);

  if (workshops.length === 0) {
    return (
      <section className="min-h-screen flex items-center justify-center" style={{ background: '#000000' }}>
        <div className="text-center">
          <Coffee size={64} className="mx-auto mb-6" style={{ color: '#B87333', opacity: 0.5 }} />
          <p style={{ color: '#B87333', fontSize: '1.25rem' }}>Loading workshops...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen" style={{ background: 'linear-gradient(180deg, #000000 0%, #0a0a0a 100%)' }}>
      {/* Animated Background Glow */}
      <div
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{
          background: `radial-gradient(circle at ${50 + activeIndex * 10}% 50%, rgba(184, 115, 51, 0.15) 0%, transparent 50%)`,
          transition: 'background 0.8s ease',
        }}
      />

      <div className="relative z-10 py-20 px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-4 mb-6">
            <Sparkles size={20} style={{ color: '#B87333' }} />
            <span
              style={{
                color: '#B87333',
                fontSize: '0.875rem',
                letterSpacing: '0.3em',
                fontWeight: 700,
              }}
            >
              SCROLL TO EXPLORE
            </span>
            <Sparkles size={20} style={{ color: '#B87333' }} />
          </div>

          <h1
            style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(3rem, 10vw, 7rem)',
              lineHeight: 0.9,
              color: '#FFFEF9',
              marginBottom: '1rem',
            }}
          >
            <span
              style={{
                background: 'linear-gradient(135deg, #B87333 0%, #CD7F32 50%, #D4A574 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              WORKSHOP
            </span>{' '}
            TIMELINE
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: 'rgba(255, 254, 249, 0.7)',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            Swipe through our curated sessions and register instantly
          </p>
        </motion.div>

        {/* Timeline Navigation Bar */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="relative h-20 overflow-hidden">
            <div
              className="absolute inset-0 flex items-center justify-center gap-8"
              style={{
                background: 'linear-gradient(90deg, #000000 0%, transparent 10%, transparent 90%, #000000 100%)',
              }}
            >
              {timelineMonths.map((month, idx) => (
                <motion.div
                  key={month}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex flex-col items-center"
                >
                  <div
                    className="w-3 h-3 rounded-full mb-2"
                    style={{
                      background: idx <= activeIndex ? '#B87333' : 'rgba(184, 115, 51, 0.3)',
                      boxShadow: idx === activeIndex ? '0 0 20px rgba(184, 115, 51, 0.8)' : 'none',
                      transition: 'all 0.3s ease',
                    }}
                  />
                  <span
                    style={{
                      fontFamily: 'Bebas Neue, sans-serif',
                      fontSize: '1rem',
                      color: idx <= activeIndex ? '#D4A574' : 'rgba(184, 115, 51, 0.5)',
                      letterSpacing: '0.1em',
                    }}
                  >
                    {month}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Horizontal Scrolling Container */}
        <div
          ref={containerRef}
          className="overflow-x-auto overflow-y-visible scrollbar-hide snap-x snap-mandatory"
          style={{
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <div className="flex gap-8 px-8 py-12 min-w-max">
            {workshops.map((workshop, index) => {
              const isPast = workshop.status === 'past';
              const isExpanded = expandedCard === workshop._id;
              const isFull = isWorkshopFull(workshop);

              return (
                <motion.div
                  key={workshop._id}
                  className="snap-center flex-shrink-0"
                  style={{
                    width: isExpanded ? '600px' : '420px',
                    transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <motion.div
                    className="relative h-full"
                    animate={{
                      scale: activeIndex === index ? 1.05 : 0.95,
                      opacity: isPast ? 0.5 : 1,
                    }}
                    whileHover={{ y: -12 }}
                    transition={{ duration: 0.4 }}
                    style={{
                      background: isPast
                        ? 'linear-gradient(135deg, rgba(61, 43, 31, 0.4), rgba(26, 17, 16, 0.4))'
                        : 'linear-gradient(135deg, rgba(61, 43, 31, 0.95), rgba(26, 17, 16, 0.95))',
                      border: `3px solid ${isPast ? 'rgba(139, 111, 71, 0.3)' : 'rgba(184, 115, 51, 0.6)'}`,
                      backdropFilter: 'blur(20px)',
                      boxShadow: activeIndex === index && !isPast
                        ? '0 20px 60px rgba(184, 115, 51, 0.4), 0 0 40px rgba(184, 115, 51, 0.2)'
                        : '0 8px 32px rgba(0, 0, 0, 0.6)',
                    }}
                    onClick={() => !isPast && setExpandedCard(isExpanded ? null : workshop._id)}
                  >
                    {/* Glow Effect for Active Card */}
                    {activeIndex === index && !isPast && (
                      <motion.div
                        className="absolute inset-0 pointer-events-none"
                        animate={{
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                        style={{
                          background: 'radial-gradient(circle at 50% 0%, rgba(184, 115, 51, 0.3) 0%, transparent 70%)',
                          filter: 'blur(20px)',
                        }}
                      />
                    )}

                    {/* Image Section */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={
                          workshop.image ||
                          (workshop.category === 'coffee'
                            ? 'https://images.pexels.com/photos/3889742/pexels-photo-3889742.jpeg'
                            : 'https://images.pexels.com/photos/1445457/pexels-photo-1445457.jpeg')
                        }
                        alt={workshop.title}
                        className="w-full h-full object-cover"
                        style={{
                          filter: isPast ? 'grayscale(80%)' : 'none',
                        }}
                      />

                      {/* Gradient Overlay */}
                      <div
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(180deg, transparent 0%, ${
                            isPast ? 'rgba(139, 111, 71, 0.8)' : 'rgba(184, 115, 51, 0.6)'
                          } 100%)`,
                        }}
                      />

                      {/* Status Badge */}
                      <div
                        className="absolute top-4 left-4 px-4 py-2 flex items-center gap-2"
                        style={{
                          background: isPast ? 'rgba(139, 111, 71, 0.9)' : 'rgba(184, 115, 51, 0.9)',
                          backdropFilter: 'blur(10px)',
                        }}
                      >
                        {workshop.category === 'coffee' ? <Coffee size={18} /> : <Palette size={18} />}
                        <span
                          style={{
                            fontFamily: 'Bebas Neue, sans-serif',
                            fontSize: '0.875rem',
                            color: '#000',
                            letterSpacing: '0.1em',
                          }}
                        >
                          {isPast ? 'PAST' : workshop.category.toUpperCase()}
                        </span>
                      </div>

                      {/* Date Tag */}
                      <div
                        className="absolute top-4 right-4 px-4 py-2"
                        style={{
                          background: isPast ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.9)',
                          backdropFilter: 'blur(10px)',
                        }}
                      >
                        <p
                          style={{
                            fontFamily: 'Bebas Neue, sans-serif',
                            fontSize: '1.5rem',
                            color: isPast ? '#8B6F47' : '#D4A574',
                            lineHeight: 1,
                          }}
                        >
                          {new Date(workshop.date).getDate()}
                        </p>
                        <p
                          style={{
                            fontSize: '0.75rem',
                            color: isPast ? '#6B5B47' : '#B87333',
                            letterSpacing: '0.1em',
                          }}
                        >
                          {new Date(workshop.date).toLocaleDateString('en-US', { month: 'short' })}
                        </p>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3
                        style={{
                          fontFamily: 'Bebas Neue, sans-serif',
                          fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                          color: isPast ? '#8B6F47' : '#FFFEF9',
                          marginBottom: '0.75rem',
                          lineHeight: 1,
                        }}
                      >
                        {workshop.title}
                      </h3>

                      <p
                        className="mb-4 line-clamp-2"
                        style={{
                          fontSize: '1rem',
                          color: isPast ? 'rgba(139, 111, 71, 0.8)' : 'rgba(255, 254, 249, 0.8)',
                          lineHeight: 1.6,
                        }}
                      >
                        {workshop.description}
                      </p>

                      {/* Details Grid */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock size={16} style={{ color: isPast ? '#6B5B47' : '#B87333' }} />
                          <span style={{ color: isPast ? '#8B6F47' : '#FFFEF9' }}>{workshop.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <User size={16} style={{ color: isPast ? '#6B5B47' : '#B87333' }} />
                          <span style={{ color: isPast ? '#8B6F47' : '#FFFEF9' }}>{workshop.instructor}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin size={16} style={{ color: isPast ? '#6B5B47' : '#B87333' }} />
                          <span style={{ color: isPast ? '#8B6F47' : '#FFFEF9' }}>{workshop.location}</span>
                        </div>
                        {workshop.capacity > 0 && (
                          <div className="flex items-center gap-2 text-sm">
                            <User size={16} style={{ color: isFull ? '#ff6b6b' : isPast ? '#6B5B47' : '#B87333' }} />
                            <span style={{ color: isFull ? '#ff6b6b' : isPast ? '#8B6F47' : '#FFFEF9' }}>
                              {workshop.registrations?.length || 0} / {workshop.capacity} seats
                              {isFull && ' (FULL)'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Expanded Registration Form */}
                      {isExpanded && !isPast && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-6 pt-6 border-t-2"
                          style={{ borderColor: 'rgba(184, 115, 51, 0.3)' }}
                        >
                          {isFull ? (
                            <div className="text-center py-4">
                              <p style={{ color: '#ff6b6b', fontWeight: 600 }}>Workshop is full</p>
                            </div>
                          ) : !isRegistering ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsRegistering(true);
                              }}
                              className="w-full py-3 flex items-center justify-center gap-2 transition-all hover:scale-105"
                              style={{
                                background: 'linear-gradient(135deg, #B87333, #CD7F32)',
                                color: '#000',
                                fontFamily: 'Bebas Neue, sans-serif',
                                fontSize: '1.125rem',
                                letterSpacing: '0.1em',
                              }}
                            >
                              REGISTER NOW
                              <ArrowRight size={20} />
                            </button>
                          ) : (
                            <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="text"
                                placeholder="Your Name"
                                value={registrationForm.name}
                                onChange={(e) => setRegistrationForm({ ...registrationForm, name: e.target.value })}
                                className="w-full p-3 bg-transparent border-2 text-white placeholder-gray-500"
                                style={{
                                  borderColor: 'rgba(184, 115, 51, 0.4)',
                                  outline: 'none',
                                }}
                              />
                              <input
                                type="email"
                                placeholder="Your Email"
                                value={registrationForm.email}
                                onChange={(e) => setRegistrationForm({ ...registrationForm, email: e.target.value })}
                                className="w-full p-3 bg-transparent border-2 text-white placeholder-gray-500"
                                style={{
                                  borderColor: 'rgba(184, 115, 51, 0.4)',
                                  outline: 'none',
                                }}
                              />
                              {registrationMessage && (
                                <p
                                  style={{
                                    color: registrationMessage.includes('Success') ? '#4ade80' : '#ff6b6b',
                                    fontSize: '0.875rem',
                                  }}
                                >
                                  {registrationMessage}
                                </p>
                              )}
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleRegister(workshop._id)}
                                  className="flex-1 py-2 transition-all hover:scale-105"
                                  style={{
                                    background: 'linear-gradient(135deg, #B87333, #CD7F32)',
                                    color: '#000',
                                    fontFamily: 'Bebas Neue, sans-serif',
                                    letterSpacing: '0.1em',
                                  }}
                                >
                                  CONFIRM
                                </button>
                                <button
                                  onClick={() => {
                                    setIsRegistering(false);
                                    setRegistrationForm({ name: '', email: '' });
                                    setRegistrationMessage('');
                                  }}
                                  className="flex-1 py-2 transition-all hover:scale-105"
                                  style={{
                                    background: 'rgba(139, 111, 71, 0.2)',
                                    border: '2px solid rgba(139, 111, 71, 0.4)',
                                    color: '#8B6F47',
                                    fontFamily: 'Bebas Neue, sans-serif',
                                    letterSpacing: '0.1em',
                                  }}
                                >
                                  CANCEL
                                </button>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {/* CTA when not expanded */}
                      {!isExpanded && !isPast && (
                        <div
                          className="flex items-center gap-2 text-sm mt-4 cursor-pointer"
                          style={{
                            color: '#B87333',
                            fontFamily: 'Bebas Neue, sans-serif',
                            letterSpacing: '0.1em',
                          }}
                        >
                          TAP TO REGISTER
                          <ArrowRight size={16} />
                        </div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Scroll Hint */}
        <motion.div
          className="text-center mt-12"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <p
            style={{
              color: '#B87333',
              fontSize: '0.875rem',
              letterSpacing: '0.2em',
            }}
          >
            ← SWIPE TO EXPLORE →
          </p>
        </motion.div>
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