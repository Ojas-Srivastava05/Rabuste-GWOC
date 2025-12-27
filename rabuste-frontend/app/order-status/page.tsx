"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Coffee, Clock, CheckCircle, Package, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import DynamicBackground from "@/components/DynamicBackground";
import Footer from "@/components/sections/footer";

export default function OrderStatusPage() {
  const router = useRouter();
  // 15 minutes = 900 seconds
  const [timeLeft, setTimeLeft] = useState(900);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  const progress = ((900 - timeLeft) / 900) * 100;
  const isReady = timeLeft <= 0;

  return (
    <>
      <Navbar />
      <DynamicBackground />

      <div className="min-h-screen" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
        <div className="container px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-4 mb-8">
              <div className="copper-line" />
              <span className="section-label">ORDER TRACKING</span>
              <div className="copper-line" style={{ transform: 'scaleX(-1)' }} />
            </div>

            <h1
              className="text-6xl md:text-8xl mb-6"
              style={{
                fontFamily: 'var(--font-heading)',
                lineHeight: 0.9,
                color: '#F5F1E8',
              }}
            >
              {isReady ? (
                <>
                  ORDER <span className="gradient-text">READY</span>
                </>
              ) : (
                <>
                  IN <span className="gradient-text">PROGRESS</span>
                </>
              )}
            </h1>

            <p className="text-xl" style={{ color: '#B87333' }}>
              {isReady 
                ? 'Your bold brew is ready for pickup'
                : 'Your order is being crafted with precision'
              }
            </p>
          </div>

          {/* Main Status Card */}
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="brutal-card p-8 md:p-12"
            >
              {/* Status Icon */}
              <div className="flex justify-center mb-8">
                <motion.div
                  className="relative"
                  animate={isReady ? { scale: [1, 1.1, 1] } : {}}
                  transition={isReady ? { 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut" 
                  } : {}}
                >
                  <div
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center"
                    style={{
                      background: isReady
                        ? 'linear-gradient(135deg, rgba(184, 115, 51, 0.3), rgba(205, 127, 50, 0.3))'
                        : 'linear-gradient(135deg, rgba(184, 115, 51, 0.2), rgba(205, 127, 50, 0.2))',
                      border: `3px solid ${isReady ? 'rgba(184, 115, 51, 0.6)' : 'rgba(184, 115, 51, 0.4)'}`,
                      boxShadow: isReady 
                        ? '0 0 60px rgba(184, 115, 51, 0.4)' 
                        : '0 0 40px rgba(184, 115, 51, 0.2)',
                    }}
                  >
                    {isReady ? (
                      <CheckCircle size={80} className="text-[#B87333]" />
                    ) : (
                      <Coffee size={80} className="text-[#B87333]" />
                    )}
                  </div>

                  {/* Animated ring for ready state */}
                  {isReady && (
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        border: '3px solid rgba(184, 115, 51, 0.3)',
                      }}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.6, 0, 0.6],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}
                </motion.div>
              </div>

              {/* Status Message */}
              <div className="text-center mb-8">
                <h2
                  className="text-4xl md:text-6xl mb-4"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: '#F5F1E8',
                    letterSpacing: '0.05em',
                  }}
                >
                  {isReady ? (
                    <>
                      <span className="gradient-text">READY</span> TO COLLECT
                    </>
                  ) : (
                    <>
                      BEING <span className="gradient-text">PREPARED</span>
                    </>
                  )}
                </h2>

                {!isReady && (
                  <div className="flex items-center justify-center gap-3 text-xl" style={{ color: '#8B6F47' }}>
                    <Clock size={24} className="text-[#B87333]" />
                    <span>Estimated time remaining</span>
                  </div>
                )}
              </div>

              {/* Timer/Ready State */}
              {isReady ? (
                <div className="text-center space-y-6">
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="text-8xl md:text-9xl gradient-text"
                    style={{
                      fontFamily: 'var(--font-heading)',
                    }}
                  >
                    ✓
                  </motion.div>

                  <p className="text-2xl" style={{ color: '#B87333', lineHeight: 1.6 }}>
                    Please collect your order at the counter
                  </p>

                  <div 
                    className="inline-flex items-center gap-2 px-6 py-3 text-sm"
                    style={{
                      background: 'rgba(184, 115, 51, 0.1)',
                      border: '2px solid rgba(184, 115, 51, 0.3)',
                      color: '#8B6F47',
                    }}
                  >
                    <Sparkles size={16} className="text-[#B87333]" />
                    <span>Your bold brew awaits</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Time Display */}
                  <div className="text-center">
                    <div
                      className="text-8xl md:text-9xl mb-4 gradient-text"
                      style={{
                        fontFamily: 'var(--font-heading)',
                        lineHeight: 1,
                      }}
                    >
                      {formatTime(timeLeft)}
                    </div>
                    <p className="text-lg" style={{ color: '#8B6F47' }}>
                      Minutes : Seconds
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-3">
                    <div
                      className="h-3 overflow-hidden"
                      style={{
                        background: 'rgba(61, 43, 31, 0.6)',
                        border: '2px solid rgba(184, 115, 51, 0.3)',
                      }}
                    >
                      <motion.div
                        className="h-full"
                        style={{
                          background: 'linear-gradient(90deg, #B87333, #CD7F32, #D4A574)',
                          boxShadow: '0 0 20px rgba(184, 115, 51, 0.6)',
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <div className="flex justify-between text-sm" style={{ color: '#8B6F47' }}>
                      <span>Started</span>
                      <span>{Math.round(progress)}% Complete</span>
                      <span>Ready</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Divider */}
              <div 
                className="h-px my-10"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(184, 115, 51, 0.3), transparent)',
                }}
              />

              {/* Order Details */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center space-y-2">
                  <div
                    className="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3"
                    style={{
                      background: 'rgba(184, 115, 51, 0.2)',
                      border: '2px solid rgba(184, 115, 51, 0.4)',
                    }}
                  >
                    <Package size={24} className="text-[#B87333]" />
                  </div>
                  <div
                    className="text-sm uppercase tracking-wider"
                    style={{ color: '#8B6F47' }}
                  >
                    Order Status
                  </div>
                  <div
                    className="text-xl gradient-text"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {isReady ? 'READY' : 'PREPARING'}
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <div
                    className="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3"
                    style={{
                      background: 'rgba(184, 115, 51, 0.2)',
                      border: '2px solid rgba(184, 115, 51, 0.4)',
                    }}
                  >
                    <Coffee size={24} className="text-[#B87333]" />
                  </div>
                  <div
                    className="text-sm uppercase tracking-wider"
                    style={{ color: '#8B6F47' }}
                  >
                    Preparation
                  </div>
                  <div
                    className="text-xl gradient-text"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    PREMIUM
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <div
                    className="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3"
                    style={{
                      background: 'rgba(184, 115, 51, 0.2)',
                      border: '2px solid rgba(184, 115, 51, 0.4)',
                    }}
                  >
                    <Sparkles size={24} className="text-[#B87333]" />
                  </div>
                  <div
                    className="text-sm uppercase tracking-wider"
                    style={{ color: '#8B6F47' }}
                  >
                    Quality
                  </div>
                  <div
                    className="text-xl gradient-text"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    BOLD
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push('/menu')}
                  className="btn btn-secondary"
                >
                  VIEW MENU
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="btn btn-secondary"
                >
                  BACK TO HOME
                </button>
              </div>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="brutal-card p-6 mt-6"
              style={{
                background: 'linear-gradient(135deg, rgba(61, 43, 31, 0.6), rgba(42, 24, 16, 0.6))',
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center"
                  style={{
                    background: 'rgba(184, 115, 51, 0.2)',
                    border: '2px solid rgba(184, 115, 51, 0.4)',
                  }}
                >
                  <Coffee size={20} className="text-[#B87333]" />
                </div>
                <div>
                  <h3
                    className="text-xl mb-2"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      color: '#F5F1E8',
                      letterSpacing: '0.05em',
                    }}
                  >
                    CRAFTED WITH PRECISION
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#8B6F47' }}>
                    Every cup is meticulously prepared using premium Robusta beans with 2X caffeine. 
                    Our baristas ensure each order meets our exacting standards of boldness and quality.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}