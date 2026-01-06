"use client";

import Navbar from "@/components/Navbar";
import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Calendar,
  Coffee,
  Palette,
  Clock,
  User,
  MapPin,
  X,
  ArrowRight,
  Sparkles,
  Timer,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type Workshop = {
  _id: string;
  title: string;
  category: "coffee" | "painting";
  date: string;
  time: string;
  description: string;
  instructor: string;
  location: string;
  capacity: number;
  registrations: Array<{ name: string; email: string; registeredAt: Date }>;
  status: "upcoming" | "past";
};

export default function WorkshopsPage() {
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [registrationForm, setRegistrationForm] = useState({ name: "", email: "" });
  const [registrationMessage, setRegistrationMessage] = useState<string>("");
  const [nextWorkshop, setNextWorkshop] = useState<Workshop | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeTimelineIndex, setActiveTimelineIndex] = useState(0);

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const res = await fetch("/api/workshops");
        if (!res.ok) throw new Error("Failed to fetch workshops");
        const data = await res.json();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const processed = data.map((w: Workshop) => {
          const workshopDate = new Date(w.date);
          workshopDate.setHours(0, 0, 0, 0);

          return {
            ...w,
            status: workshopDate < today ? "past" : "upcoming",
          };
        });

        setWorkshops(processed);
        
        // Set next workshop
        const upcoming = processed.filter((w: Workshop) => w.status === "upcoming");
        if (upcoming.length > 0) {
          setNextWorkshop(upcoming[0]);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchWorkshops();
  }, []);

  // Countdown timer for next workshop
  useEffect(() => {
    if (!nextWorkshop) return;

    const updateCountdown = () => {
      const now = new Date();
      const workshopDate = new Date(nextWorkshop.date);
      const diff = workshopDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("Event Started");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${hours}h ${minutes}m`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [nextWorkshop]);

  // Scroll tracking for timeline
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || workshops.length === 0) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const scrollWidth = container.scrollWidth - container.clientWidth;
      const scrollProgress = scrollWidth > 0 ? scrollLeft / scrollWidth : 0;
      const newIndex = Math.round(scrollProgress * Math.max(0, workshops.length - 1));
      setActiveTimelineIndex(newIndex);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [workshops.length]);

  const upcomingWorkshops = workshops.filter((w) => w.status === "upcoming");
  const pastWorkshops = workshops.filter((w) => w.status === "past");

  const handleRegister = async () => {
    if (!selectedWorkshop || !registrationForm.name || !registrationForm.email) {
      setRegistrationMessage("Please fill in all fields");
      return;
    }

    try {
      const res = await fetch(`/api/workshops/${selectedWorkshop._id}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationForm),
      });

      const data = await res.json();

      if (!res.ok) {
        setRegistrationMessage(data.error || "Registration failed");
        return;
      }

      setRegistrationMessage("Successfully registered!");
      setRegistrationForm({ name: "", email: "" });
      setIsRegistering(false);

      // Refresh workshops
      const workshopsRes = await fetch("/api/workshops");
      const workshopsData = await workshopsRes.json();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const processed = workshopsData.map((w: Workshop) => {
        const workshopDate = new Date(w.date);
        workshopDate.setHours(0, 0, 0, 0);
        return {
          ...w,
          status: workshopDate < today ? "past" : "upcoming",
        };
      });

      setWorkshops(processed);
      const updatedWorkshop = processed.find((w: Workshop) => w._id === selectedWorkshop._id);
      if (updatedWorkshop) setSelectedWorkshop(updatedWorkshop);

      setTimeout(() => setRegistrationMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setRegistrationMessage("An error occurred. Please try again.");
    }
  };

  const isWorkshopFull = (workshop: Workshop) => {
    return workshop.capacity > 0 && workshop.registrations?.length >= workshop.capacity;
  };

  const scrollTimeline = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 400;
    const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount);
    scrollContainerRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
  };

  // Group workshops by month for timeline dots
  const timelineMonths = React.useMemo(() => {
    const months = new Map<string, number>();
    workshops.forEach((w, idx) => {
      const date = new Date(w.date);
      const key = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (!months.has(key)) {
        months.set(key, idx);
      }
    });
    return Array.from(months.entries());
  }, [workshops]);

  if (workshops.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#000000' }}>
          <div className="text-center">
            <Coffee size={64} className="mx-auto mb-6" style={{ color: '#B87333', opacity: 0.5 }} />
            <p style={{ color: '#B87333', fontSize: '1.25rem' }}>Loading workshops...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen relative overflow-hidden" style={{ background: '#000000' }}>
        {/* Animated Background */}
        <div
          className="fixed inset-0 pointer-events-none opacity-20"
          style={{
            background: `radial-gradient(circle at ${50 + activeTimelineIndex * 5}% 50%, rgba(184, 115, 51, 0.15) 0%, transparent 60%)`,
            transition: 'background 1s ease',
          }}
        />

        <div className="relative z-10 pt-32 pb-20">
          {/* Hero Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16 px-6"
          >
            <motion.div
              className="inline-flex items-center gap-4 mb-6"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles size={20} style={{ color: '#B87333' }} />
              <span
                style={{
                  color: '#B87333',
                  fontSize: '0.875rem',
                  letterSpacing: '0.3em',
                  fontWeight: 700,
                }}
              >
                POWER EXPERIENCES
              </span>
              <Sparkles size={20} style={{ color: '#B87333' }} />
            </motion.div>

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
                RABUSTE
              </span>{' '}
              WORKSHOPS
            </h1>

            <p
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                color: 'rgba(255, 254, 249, 0.7)',
                maxWidth: '600px',
                margin: '0 auto',
              }}
            >
              Master the art of bold coffee. Experience premium learning.
            </p>
          </motion.div>

          {/* NEXT WORKSHOP - Living Card */}
          {nextWorkshop && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-5xl mx-auto mb-20 px-6"
            >
              <div
                className="relative overflow-hidden group cursor-pointer"
                onClick={() => {
                  setSelectedWorkshop(nextWorkshop);
                  setIsModalOpen(true);
                }}
                style={{
                  background: 'linear-gradient(135deg, rgba(61, 43, 31, 0.95), rgba(26, 17, 16, 0.95))',
                  border: '3px solid rgba(184, 115, 51, 0.8)',
                  backdropFilter: 'blur(20px)',
                  padding: 'clamp(2rem, 4vw, 3rem)',
                  boxShadow: '0 20px 80px rgba(184, 115, 51, 0.4), 0 0 60px rgba(184, 115, 51, 0.2)',
                }}
              >
                {/* Breathing Animation */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  animate={{
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(184, 115, 51, 0.3) 0%, transparent 70%)',
                  }}
                />

                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                    <div className="flex items-center gap-4">
                      <span
                        className="uppercase text-xs tracking-[0.3em]"
                        style={{ color: '#CD7F32', fontFamily: 'Bebas Neue, sans-serif' }}
                      >
                        NEXT EXPERIENCE
                      </span>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Timer size={20} style={{ color: '#D4A574' }} />
                      </motion.div>
                    </div>

                    {/* Live Countdown */}
                    <motion.div
                      className="flex items-center gap-3 px-6 py-3"
                      style={{
                        background: 'rgba(184, 115, 51, 0.2)',
                        border: '2px solid rgba(184, 115, 51, 0.5)',
                      }}
                      animate={{
                        boxShadow: [
                          '0 0 20px rgba(184, 115, 51, 0.3)',
                          '0 0 40px rgba(184, 115, 51, 0.6)',
                          '0 0 20px rgba(184, 115, 51, 0.3)',
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Clock size={18} style={{ color: '#D4A574' }} />
                      <span
                        style={{
                          fontFamily: 'Bebas Neue, sans-serif',
                          fontSize: '1.125rem',
                          color: '#FFFEF9',
                          letterSpacing: '0.1em',
                        }}
                      >
                        {timeLeft}
                      </span>
                    </motion.div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Left: Info */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="w-14 h-14 flex items-center justify-center"
                          style={{
                            background: 'linear-gradient(135deg, rgba(184, 115, 51, 0.3), rgba(115, 54, 53, 0.3))',
                            border: '2px solid rgba(184, 115, 51, 0.6)',
                          }}
                        >
                          {nextWorkshop.category === "coffee" ? (
                            <Coffee size={28} style={{ color: '#D4A574' }} />
                          ) : (
                            <Palette size={28} style={{ color: '#D4A574' }} />
                          )}
                        </div>
                        <span
                          className="uppercase text-sm tracking-[0.2em]"
                          style={{ color: '#B87333', fontFamily: 'Bebas Neue, sans-serif' }}
                        >
                          {nextWorkshop.category} WORKSHOP
                        </span>
                      </div>

                      <h2
                        className="text-4xl md:text-5xl mb-4"
                        style={{
                          fontFamily: 'Bebas Neue, sans-serif',
                          color: '#FFFEF9',
                          lineHeight: 0.95,
                        }}
                      >
                        {nextWorkshop.title}
                      </h2>

                      <p
                        className="text-base mb-6"
                        style={{ color: 'rgba(255, 254, 249, 0.8)', lineHeight: 1.7 }}
                      >
                        {nextWorkshop.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4">
                        <div
                          className="p-4"
                          style={{
                            background: 'rgba(20, 20, 20, 0.6)',
                            border: '2px solid rgba(184, 115, 51, 0.3)',
                          }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar size={16} style={{ color: '#B87333' }} />
                            <span className="text-xs uppercase tracking-wider" style={{ color: '#8B6F47' }}>
                              Date
                            </span>
                          </div>
                          <p className="text-sm" style={{ color: '#FFFEF9' }}>
                            {new Date(nextWorkshop.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </div>

                        <div
                          className="p-4"
                          style={{
                            background: 'rgba(20, 20, 20, 0.6)',
                            border: '2px solid rgba(184, 115, 51, 0.3)',
                          }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Clock size={16} style={{ color: '#B87333' }} />
                            <span className="text-xs uppercase tracking-wider" style={{ color: '#8B6F47' }}>
                              Time
                            </span>
                          </div>
                          <p className="text-sm" style={{ color: '#FFFEF9' }}>
                            {nextWorkshop.time}
                          </p>
                        </div>

                        <div
                          className="p-4"
                          style={{
                            background: 'rgba(20, 20, 20, 0.6)',
                            border: '2px solid rgba(184, 115, 51, 0.3)',
                          }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <User size={16} style={{ color: '#B87333' }} />
                            <span className="text-xs uppercase tracking-wider" style={{ color: '#8B6F47' }}>
                              Instructor
                            </span>
                          </div>
                          <p className="text-sm" style={{ color: '#FFFEF9' }}>
                            {nextWorkshop.instructor}
                          </p>
                        </div>

                        <div
                          className="p-4"
                          style={{
                            background: 'rgba(20, 20, 20, 0.6)',
                            border: '2px solid rgba(184, 115, 51, 0.3)',
                          }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin size={16} style={{ color: '#B87333' }} />
                            <span className="text-xs uppercase tracking-wider" style={{ color: '#8B6F47' }}>
                              Location
                            </span>
                          </div>
                          <p className="text-sm" style={{ color: '#FFFEF9' }}>
                            {nextWorkshop.location}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right: CTA */}
                    <div className="flex flex-col justify-center">
                      <div
                        className="p-8 text-center"
                        style={{
                          background: 'rgba(20, 20, 20, 0.8)',
                          border: '2px solid rgba(184, 115, 51, 0.4)',
                        }}
                      >
                        {nextWorkshop.capacity > 0 && (
                          <div className="mb-6">
                            <p
                              className="text-3xl mb-2"
                              style={{
                                fontFamily: 'Bebas Neue, sans-serif',
                                color: isWorkshopFull(nextWorkshop) ? '#ff6b6b' : '#D4A574',
                              }}
                            >
                              {nextWorkshop.capacity - (nextWorkshop.registrations?.length || 0)}
                            </p>
                            <p className="text-sm uppercase tracking-wider" style={{ color: '#8B6F47' }}>
                              Seats Remaining
                            </p>
                          </div>
                        )}

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full py-4 flex items-center justify-center gap-3 transition-all"
                          style={{
                            background: isWorkshopFull(nextWorkshop)
                              ? 'rgba(139, 111, 71, 0.3)'
                              : 'linear-gradient(135deg, #B87333, #CD7F32)',
                            border: `2px solid ${isWorkshopFull(nextWorkshop) ? 'rgba(139, 111, 71, 0.5)' : 'rgba(184, 115, 51, 0.6)'}`,
                            color: isWorkshopFull(nextWorkshop) ? '#8B6F47' : '#000',
                            fontFamily: 'Bebas Neue, sans-serif',
                            fontSize: '1.25rem',
                            letterSpacing: '0.15em',
                            cursor: isWorkshopFull(nextWorkshop) ? 'not-allowed' : 'pointer',
                          }}
                          disabled={isWorkshopFull(nextWorkshop)}
                        >
                          {isWorkshopFull(nextWorkshop) ? 'FULLY BOOKED' : 'REGISTER NOW'}
                          {!isWorkshopFull(nextWorkshop) && <ArrowRight size={20} />}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Timeline Navigation */}
          {timelineMonths.length > 1 && (
            <div className="max-w-7xl mx-auto mb-8 px-6">
              <div className="flex items-center justify-center gap-8">
                {timelineMonths.map(([month, idx], i) => (
                  <motion.div
                    key={month}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex flex-col items-center cursor-pointer"
                    onClick={() => {
                      const container = scrollContainerRef.current;
                      if (container) {
                        const cardWidth = 450;
                        container.scrollTo({ left: idx * cardWidth, behavior: 'smooth' });
                      }
                    }}
                  >
                    <div
                      className="w-3 h-3 rounded-full mb-2 transition-all"
                      style={{
                        background: i <= Math.floor(activeTimelineIndex / (workshops.length / timelineMonths.length))
                          ? '#B87333'
                          : 'rgba(184, 115, 51, 0.3)',
                        boxShadow: i === Math.floor(activeTimelineIndex / (workshops.length / timelineMonths.length))
                          ? '0 0 20px rgba(184, 115, 51, 0.8)'
                          : 'none',
                      }}
                    />
                    <span
                      style={{
                        fontFamily: 'Bebas Neue, sans-serif',
                        fontSize: '0.875rem',
                        color: i <= Math.floor(activeTimelineIndex / (workshops.length / timelineMonths.length))
                          ? '#D4A574'
                          : 'rgba(184, 115, 51, 0.5)',
                        letterSpacing: '0.1em',
                      }}
                    >
                      {month}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Horizontal Timeline Ribbon */}
          <div className="relative max-w-7xl mx-auto mb-20">
            {/* Navigation Arrows */}
            <button
              onClick={() => scrollTimeline('left')}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-3 transition-all hover:scale-110"
              style={{
                background: 'rgba(0, 0, 0, 0.8)',
                border: '2px solid rgba(184, 115, 51, 0.6)',
                color: '#D4A574',
                backdropFilter: 'blur(10px)',
              }}
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={() => scrollTimeline('right')}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-3 transition-all hover:scale-110"
              style={{
                background: 'rgba(0, 0, 0, 0.8)',
                border: '2px solid rgba(184, 115, 51, 0.6)',
                color: '#D4A574',
                backdropFilter: 'blur(10px)',
              }}
            >
              <ChevronRight size={24} />
            </button>

            {/* Scrollable Container */}
            <div
              ref={scrollContainerRef}
              className="overflow-x-auto overflow-y-visible scrollbar-hide snap-x snap-mandatory px-6"
              style={{
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              <div className="flex gap-6 py-12 min-w-max">
                {workshops.map((workshop, index) => {
                  const isPast = workshop.status === "past";
                  const isFull = isWorkshopFull(workshop);
                  const isActive = activeTimelineIndex === index;

                  return (
                    <motion.div
                      key={workshop._id}
                      className="snap-center flex-shrink-0"
                      style={{ width: '420px' }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                    >
                      <motion.div
                        className="relative h-full cursor-pointer"
                        animate={{
                          scale: isActive ? 1.05 : 0.95,
                          opacity: isPast ? 0.5 : 1,
                        }}
                        whileHover={{ y: -12 }}
                        transition={{ duration: 0.4 }}
                        onClick={() => {
                          if (!isPast) {
                            setSelectedWorkshop(workshop);
                            setIsModalOpen(true);
                          }
                        }}
                        style={{
                          background: isPast
                            ? 'linear-gradient(135deg, rgba(61, 43, 31, 0.4), rgba(26, 17, 16, 0.4))'
                            : 'linear-gradient(135deg, rgba(61, 43, 31, 0.95), rgba(26, 17, 16, 0.95))',
                          border: `3px solid ${
                            isPast
                              ? 'rgba(139, 111, 71, 0.3)'
                              : isActive
                              ? 'rgba(184, 115, 51, 0.8)'
                              : 'rgba(184, 115, 51, 0.5)'
                          }`,
                          backdropFilter: 'blur(20px)',
                          boxShadow: isActive && !isPast
                            ? '0 20px 60px rgba(184, 115, 51, 0.4), 0 0 40px rgba(184, 115, 51, 0.2)'
                            : '0 8px 32px rgba(0, 0, 0, 0.6)',
                        }}
                      >
                        {/* Active Glow */}
                        {isActive && !isPast && (
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
                              workshop.category === 'coffee'
                                ? 'https://images.pexels.com/photos/3889742/pexels-photo-3889742.jpeg'
                                : 'https://images.pexels.com/photos/1445457/pexels-photo-1445457.jpeg'
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
                              background: 'rgba(0, 0, 0, 0.9)',
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
                              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
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
                              fontSize: '0.875rem',
                              color: isPast ? 'rgba(139, 111, 71, 0.8)' : 'rgba(255, 254, 249, 0.8)',
                              lineHeight: 1.6,
                            }}
                          >
                            {workshop.description}
                          </p>

                          {/* Details */}
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm">
                              <Clock size={16} style={{ color: isPast ? '#6B5B47' : '#B87333' }} />
                              <span style={{ color: isPast ? '#8B6F47' : '#FFFEF9' }}>{workshop.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <User size={16} style={{ color: isPast ? '#6B5B47' : '#B87333' }} />
                              <span style={{ color: isPast ? '#8B6F47' : '#FFFEF9' }}>{workshop.instructor}</span>
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

                          {/* CTA */}
                          {!isPast && (
                            <div
                              className="flex items-center gap-2 text-sm transition-all group-hover:gap-4"
                              style={{
                                color: '#B87333',
                                fontFamily: 'Bebas Neue, sans-serif',
                                letterSpacing: '0.1em',
                              }}
                            >
                              VIEW DETAILS
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
          </div>

          {/* Scroll Hint */}
          <motion.div
            className="text-center"
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
              ← SWIPE TO EXPLORE MORE →
            </p>
          </motion.div>
        </div>

        {/* Registration Modal */}
        {isModalOpen && selectedWorkshop && (
          <div
            className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-3xl p-10 relative max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'linear-gradient(135deg, rgba(61, 43, 31, 0.98), rgba(26, 17, 16, 0.98))',
                border: '3px solid rgba(184, 115, 51, 0.6)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 hover:bg-white/10 transition-all"
                style={{ color: '#B87333' }}
              >
                <X size={24} />
              </button>

              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-14 h-14 flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, rgba(184, 115, 51, 0.3), rgba(115, 54, 53, 0.3))',
                      border: '2px solid rgba(184, 115, 51, 0.4)',
                      color: '#B87333',
                    }}
                  >
                    {selectedWorkshop.category === "coffee" ? <Coffee size={28} /> : <Palette size={28} />}
                  </div>
                  <span
                    className="text-xs uppercase tracking-[0.2em]"
                    style={{
                      color: '#B87333',
                      fontFamily: 'Bebas Neue, sans-serif',
                    }}
                  >
                    {selectedWorkshop.category} WORKSHOP
                  </span>
                </div>

                <h3
                  className="text-4xl md:text-5xl mb-6"
                  style={{
                    fontFamily: 'Bebas Neue, sans-serif',
                    color: '#FFFEF9',
                  }}
                >
                  {selectedWorkshop.title}
                </h3>
              </div>

              <p
                className="text-base md:text-lg mb-10"
                style={{ color: '#B87333', lineHeight: 1.8 }}
              >
                {selectedWorkshop.description}
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div
                  className="p-6"
                  style={{
                    background: 'rgba(20, 20, 20, 0.6)',
                    border: '2px solid rgba(184, 115, 51, 0.2)',
                  }}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <Calendar size={20} style={{ color: '#B87333' }} />
                    <span
                      className="text-xs uppercase tracking-wider"
                      style={{ color: '#8B6F47', fontFamily: 'Bebas Neue, sans-serif' }}
                    >
                      DATE
                    </span>
                  </div>
                  <p className="text-lg" style={{ color: '#FFFEF9' }}>
                    {new Date(selectedWorkshop.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                <div
                  className="p-6"
                  style={{
                    background: 'rgba(20, 20, 20, 0.6)',
                    border: '2px solid rgba(184, 115, 51, 0.2)',
                  }}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <Clock size={20} style={{ color: '#B87333' }} />
                    <span
                      className="text-xs uppercase tracking-wider"
                      style={{ color: '#8B6F47', fontFamily: 'Bebas Neue, sans-serif' }}
                    >
                      TIME
                    </span>
                  </div>
                  <p className="text-lg" style={{ color: '#FFFEF9' }}>
                    {selectedWorkshop.time}
                  </p>
                </div>

                <div
                  className="p-6"
                  style={{
                    background: 'rgba(20, 20, 20, 0.6)',
                    border: '2px solid rgba(184, 115, 51, 0.2)',
                  }}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <User size={20} style={{ color: '#B87333' }} />
                    <span
                      className="text-xs uppercase tracking-wider"
                      style={{ color: '#8B6F47', fontFamily: 'Bebas Neue, sans-serif' }}
                    >
                      INSTRUCTOR
                    </span>
                  </div>
                  <p className="text-lg" style={{ color: '#FFFEF9' }}>
                    {selectedWorkshop.instructor}
                  </p>
                </div>

                <div
                  className="p-6"
                  style={{
                    background: 'rgba(20, 20, 20, 0.6)',
                    border: '2px solid rgba(184, 115, 51, 0.2)',
                  }}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <MapPin size={20} style={{ color: '#B87333' }} />
                    <span
                      className="text-xs uppercase tracking-wider"
                      style={{ color: '#8B6F47', fontFamily: 'Bebas Neue, sans-serif' }}
                    >
                      LOCATION
                    </span>
                  </div>
                  <p className="text-lg" style={{ color: '#FFFEF9' }}>
                    {selectedWorkshop.location}
                  </p>
                </div>
              </div>

              {/* Registration Section */}
              {selectedWorkshop.status === "upcoming" && (
                <div
                  className="p-6"
                  style={{
                    background: 'rgba(20, 20, 20, 0.6)',
                    border: '2px solid rgba(184, 115, 51, 0.2)',
                  }}
                >
                  {isWorkshopFull(selectedWorkshop) ? (
                    <div className="text-center">
                      <p
                        className="text-lg mb-2"
                        style={{ color: '#ff6b6b', fontFamily: 'Bebas Neue, sans-serif' }}
                      >
                        WORKSHOP IS FULL
                      </p>
                      <p style={{ color: '#8B6F47' }}>
                        All seats have been taken. Please check other workshops.
                      </p>
                    </div>
                  ) : (
                    <>
                      {!isRegistering ? (
                        <button
                          onClick={() => setIsRegistering(true)}
                          className="w-full py-4 text-lg uppercase tracking-wider transition-all hover:scale-105"
                          style={{
                            background: 'linear-gradient(135deg, #B87333, #CD7F32)',
                            border: '2px solid rgba(184, 115, 51, 0.4)',
                            color: '#000',
                            fontFamily: 'Bebas Neue, sans-serif',
                          }}
                        >
                          REGISTER FOR THIS WORKSHOP
                        </button>
                      ) : (
                        <div>
                          <h4
                            className="text-xl mb-4"
                            style={{
                              color: '#FFFEF9',
                              fontFamily: 'Bebas Neue, sans-serif',
                            }}
                          >
                            REGISTER NOW
                          </h4>
                          <div className="space-y-4">
                            <input
                              type="text"
                              placeholder="Your Name"
                              value={registrationForm.name}
                              onChange={(e) =>
                                setRegistrationForm({ ...registrationForm, name: e.target.value })
                              }
                              className="w-full p-3 bg-transparent border-2 border-[#B87333]/40 text-[#FFFEF9] placeholder-[#8B6F47]"
                              style={{ outline: 'none' }}
                            />
                            <input
                              type="email"
                              placeholder="Your Email"
                              value={registrationForm.email}
                              onChange={(e) =>
                                setRegistrationForm({ ...registrationForm, email: e.target.value })
                              }
                              className="w-full p-3 bg-transparent border-2 border-[#B87333]/40 text-[#FFFEF9] placeholder-[#8B6F47]"
                              style={{ outline: 'none' }}
                            />
                            {registrationMessage && (
                              <p
                                style={{
                                  color: registrationMessage.includes('Success') ? '#4ade80' : '#ff6b6b',
                                }}
                              >
                                {registrationMessage}
                              </p>
                            )}
                            <div className="flex gap-4">
                              <button
                                onClick={handleRegister}
                                className="flex-1 py-3 uppercase tracking-wider transition-all hover:scale-105"
                                style={{
                                  background: 'linear-gradient(135deg, #B87333, #CD7F32)',
                                  border: '2px solid rgba(184, 115, 51, 0.4)',
                                  color: '#000',
                                  fontFamily: 'Bebas Neue, sans-serif',
                                }}
                              >
                                CONFIRM
                              </button>
                              <button
                                onClick={() => {
                                  setIsRegistering(false);
                                  setRegistrationForm({ name: "", email: "" });
                                  setRegistrationMessage("");
                                }}
                                className="flex-1 py-3 uppercase tracking-wider transition-all hover:scale-105"
                                style={{
                                  background: 'rgba(139, 111, 71, 0.2)',
                                  border: '2px solid rgba(139, 111, 71, 0.4)',
                                  color: '#8B6F47',
                                  fontFamily: 'Bebas Neue, sans-serif',
                                }}
                              >
                                CANCEL
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}

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
      </div>
    </>
  );
}