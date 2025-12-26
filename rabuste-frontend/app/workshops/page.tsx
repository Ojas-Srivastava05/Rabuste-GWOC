"use client";

import Navbar from "@/components/Navbar";
import DynamicBackground from "@/components/DynamicBackground";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Coffee,
  Palette,
  Clock,
  User,
  MapPin,
  X,
  ArrowRight,
} from "lucide-react";

type Workshop = {
  _id: number;
  title: string;
  category: "coffee" | "painting";
  date: string;
  time: string;
  description: string;
  instructor: string;
  location: string;
  status: "upcoming" | "past";
};

export default function WorkshopsPage() {
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const res = await fetch("/api/workshops");
        if (!res.ok) throw new Error("Failed to fetch workshops");
        const text = await res.text();
        const data = text ? JSON.parse(text) : [];
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
      } catch (err) {
        console.error(err);
      }
    };

    fetchWorkshops();
  }, []);

  const upcomingWorkshops = workshops.filter((w) => w.status === "upcoming");
  const pastWorkshops = workshops.filter((w) => w.status === "past");

  return (
    <>
      <Navbar />
      <div className="min-h-screen relative overflow-hidden" style={{ background: '#000000' }}>
        <DynamicBackground />

        {/* Content */}
        <div className="relative z-10">
          {/* Hero Section */}
          <div className="relative overflow-hidden pt-32 pb-20 px-6">
            <div className="max-w-6xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-8"
              >
                <div className="inline-flex items-center gap-4 mb-6">
                  <div className="copper-line" />
                  <span className="section-label">POWER SESSIONS</span>
                  <div className="copper-line" style={{ transform: 'scaleX(-1)' }} />
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="text-6xl md:text-7xl lg:text-8xl mb-8"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 400,
                  lineHeight: 0.9,
                }}
              >
                <span style={{ color: '#FFFEF9' }}>RABUSTE</span>
                <br />
                <span className="gradient-copper">WORKSHOPS</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="text-lg md:text-xl max-w-3xl mx-auto mb-6"
                style={{ color: '#B87333', lineHeight: 1.7 }}
              >
                Master the art of bold coffee. Learn from experts.
              </motion.p>
            </div>
          </div>

          {/* Upcoming Workshops */}
          <div className="max-w-7xl mx-auto px-6 pb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2
                className="text-4xl md:text-5xl mb-12"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: '#FFFEF9',
                  fontWeight: 400,
                  letterSpacing: '0.05em',
                }}
              >
                UPCOMING SESSIONS
              </h2>

              {upcomingWorkshops.length === 0 ? (
                <div className="brutal-card p-12 text-center">
                  <Coffee size={48} className="mx-auto mb-4" style={{ color: '#B87333', opacity: 0.5 }} />
                  <p style={{ color: '#8B6F47' }}>No upcoming workshops. Check back soon.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {upcomingWorkshops.map((workshop, index) => (
                    <motion.div
                      key={workshop._id}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -8 }}
                      onClick={() => {
                        setSelectedWorkshop(workshop);
                        setIsModalOpen(true);
                      }}
                      className="brutal-card p-8 cursor-pointer group"
                    >
                      {/* Category Badge */}
                      <div className="flex items-center gap-3 mb-6">
                        <div
                          className="w-12 h-12 flex items-center justify-center transition-transform group-hover:scale-110"
                          style={{
                            background: workshop.category === "coffee"
                              ? 'linear-gradient(135deg, rgba(184, 115, 51, 0.3), rgba(115, 54, 53, 0.3))'
                              : 'linear-gradient(135deg, rgba(205, 127, 50, 0.3), rgba(184, 115, 51, 0.3))',
                            border: '2px solid rgba(184, 115, 51, 0.4)',
                            color: '#B87333',
                          }}
                        >
                          {workshop.category === "coffee" ? (
                            <Coffee size={24} />
                          ) : (
                            <Palette size={24} />
                          )}
                        </div>
                        <span
                          className="text-xs uppercase tracking-[0.2em]"
                          style={{
                            color: '#B87333',
                            fontFamily: 'var(--font-heading)',
                            fontWeight: 400,
                          }}
                        >
                          {workshop.category}
                        </span>
                      </div>

                      {/* Title */}
                      <h3
                        className="text-2xl mb-4"
                        style={{
                          fontFamily: 'var(--font-heading)',
                          color: '#FFFEF9',
                          fontWeight: 400,
                          letterSpacing: '0.05em',
                        }}
                      >
                        {workshop.title}
                      </h3>

                      {/* Description */}
                      <p
                        className="text-sm mb-6 line-clamp-2"
                        style={{ color: '#8B6F47', lineHeight: 1.6 }}
                      >
                        {workshop.description}
                      </p>

                      {/* Details */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3">
                          <Calendar size={16} style={{ color: '#B87333' }} />
                          <span className="text-sm" style={{ color: '#FFFEF9' }}>
                            {new Date(workshop.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock size={16} style={{ color: '#B87333' }} />
                          <span className="text-sm" style={{ color: '#FFFEF9' }}>
                            {workshop.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <User size={16} style={{ color: '#B87333' }} />
                          <span className="text-sm" style={{ color: '#FFFEF9' }}>
                            {workshop.instructor}
                          </span>
                        </div>
                      </div>

                      {/* CTA */}
                      <div
                        className="flex items-center gap-2 text-xs uppercase tracking-wider transition-all group-hover:gap-4"
                        style={{
                          color: '#B87333',
                          fontFamily: 'var(--font-heading)',
                        }}
                      >
                        LEARN MORE
                        <ArrowRight size={14} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Past Workshops */}
            {pastWorkshops.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2
                  className="text-4xl md:text-5xl mb-12"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: '#FFFEF9',
                    fontWeight: 400,
                    letterSpacing: '0.05em',
                  }}
                >
                  PAST SESSIONS
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {pastWorkshops.map((workshop, index) => (
                    <motion.div
                      key={workshop._id}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="brutal-card p-8 opacity-60"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="w-10 h-10 flex items-center justify-center"
                          style={{
                            background: 'rgba(139, 111, 71, 0.2)',
                            border: '2px solid rgba(139, 111, 71, 0.3)',
                            color: '#8B6F47',
                          }}
                        >
                          {workshop.category === "coffee" ? <Coffee size={20} /> : <Palette size={20} />}
                        </div>
                        <span
                          className="text-xs uppercase tracking-wider px-3 py-1"
                          style={{
                            background: 'rgba(139, 111, 71, 0.2)',
                            border: '1px solid rgba(139, 111, 71, 0.3)',
                            color: '#8B6F47',
                          }}
                        >
                          PAST
                        </span>
                      </div>

                      <h3
                        className="text-xl mb-2"
                        style={{
                          fontFamily: 'var(--font-heading)',
                          color: '#8B6F47',
                          fontWeight: 400,
                        }}
                      >
                        {workshop.title}
                      </h3>

                      <p className="text-sm" style={{ color: '#6B5B47' }}>
                        {new Date(workshop.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && selectedWorkshop && (
          <div
            className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="brutal-card w-full max-w-3xl p-10 relative max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
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
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 400,
                    }}
                  >
                    {selectedWorkshop.category} WORKSHOP
                  </span>
                </div>

                <h3
                  className="text-4xl md:text-5xl mb-6"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: '#FFFEF9',
                    fontWeight: 400,
                  }}
                >
                  {selectedWorkshop.title}
                </h3>

                {selectedWorkshop.status === "past" && (
                  <span
                    className="inline-block px-4 py-2 mb-6"
                    style={{
                      background: 'rgba(139, 111, 71, 0.2)',
                      border: '2px solid rgba(139, 111, 71, 0.4)',
                      color: '#8B6F47',
                      fontSize: '12px',
                      letterSpacing: '0.15em',
                      fontFamily: 'var(--font-heading)',
                    }}
                  >
                    PAST WORKSHOP
                  </span>
                )}
              </div>

              <p
                className="text-base md:text-lg mb-10"
                style={{ color: '#B87333', lineHeight: 1.8 }}
              >
                {selectedWorkshop.description}
              </p>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
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
                        style={{ color: '#8B6F47', fontFamily: 'var(--font-heading)' }}
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
                        style={{ color: '#8B6F47', fontFamily: 'var(--font-heading)' }}
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
                        style={{ color: '#8B6F47', fontFamily: 'var(--font-heading)' }}
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
                        style={{ color: '#8B6F47', fontFamily: 'var(--font-heading)' }}
                      >
                        LOCATION
                      </span>
                    </div>
                    <p className="text-lg" style={{ color: '#FFFEF9' }}>
                      {selectedWorkshop.location}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
}