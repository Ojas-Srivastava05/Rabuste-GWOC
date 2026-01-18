'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/sections/footer';
import Image from 'next/image';
import { 
  Lightbulb, 
  Target, 
  Award, 
  Coffee, 
  Users, 
  Zap, 
  Heart, 
  Palette, 
  TrendingUp,
  Sparkles,
  Flame,
  ArrowRight,
} from 'lucide-react';

const AboutPage = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <>
      <Navbar />
      
      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Premium copper accent line */}
      <div 
        className="fixed top-0 left-0 right-0 h-1 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, #B87333, #CD7F32, #D4A574, #CD7F32, #B87333, transparent)',
          zIndex: 100,
          boxShadow: '0 0 20px rgba(184, 115, 51, 0.5)',
        }}
      />

      <main ref={containerRef} style={{ background: '#000000' }}>
        
        {/* MASSIVE HERO SECTION */}
        <section
          className="relative overflow-hidden"
          style={{
            minHeight: '100dvh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(180deg, #000000 0%, #1A1110 100%)',
            padding: '0 1rem',
          }}
        >
          {/* Animated Gradient Orbs */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-0 right-0 rounded-full blur-3xl"
            style={{
              width: 'clamp(300px, 50vw, 600px)',
              height: 'clamp(300px, 50vw, 600px)',
              background: 'radial-gradient(circle, rgba(184, 115, 51, 0.4) 0%, transparent 70%)',
            }}
          />

          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute bottom-0 left-0 rounded-full blur-3xl"
            style={{
              width: 'clamp(350px, 60vw, 700px)',
              height: 'clamp(350px, 60vw, 700px)',
              background: 'radial-gradient(circle, rgba(205, 127, 50, 0.3) 0%, transparent 70%)',
            }}
          />

          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="relative z-10 text-center w-full px-4 sm:px-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Massive Title - Responsive */}
              <h1 
                style={{ 
                  fontFamily: 'var(--font-heading)', 
                  fontSize: 'clamp(3.5rem, 15vw, 16rem)', 
                  lineHeight: 0.85, 
                  letterSpacing: '-0.03em', 
                  fontWeight: 400,
                  color: '#FFFEF9',
                  textTransform: 'uppercase',
                  marginBottom: 'clamp(2rem, 5vw, 3rem)',
                }}
              >
                <motion.span
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  style={{ display: 'block' }}
                >
                  BOLD
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  style={{ 
                    display: 'block',
                    background: 'linear-gradient(135deg, #D4A574 0%, #FFFEF9 50%, #B87333 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    position: 'relative',
                  }}
                >
                  ROBUSTA
                  {/* Animated Glow */}
                  <motion.span
                    animate={{
                      opacity: [0.2, 0.5, 0.2],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 blur-3xl hidden sm:block"
                    style={{
                      background: 'linear-gradient(135deg, #D4A574, #B87333)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      zIndex: -1,
                    }}
                  >
                    ROBUSTA
                  </motion.span>
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  style={{ display: 'block' }}
                >
                  COFFEE
                </motion.span>
              </h1>

              {/* Tagline - Responsive */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                style={{ 
                  fontSize: 'clamp(1rem, 3.5vw, 3rem)', 
                  color: '#B87333',
                  fontWeight: 300,
                  letterSpacing: '0.1em',
                  marginBottom: 'clamp(2rem, 6vw, 4rem)',
                  padding: '0 1rem',
                }}
              >
                UNAPOLOGETICALLY STRONG
              </motion.p>

              {/* Scroll Indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.5 }}
                className="hidden sm:flex flex-col items-center gap-3"
              >
                <motion.div
                  animate={{ y: [0, 15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    width: '2px',
                    height: 'clamp(40px, 8vw, 60px)',
                    background: 'linear-gradient(to bottom, #B87333, transparent)',
                  }}
                />
                <span style={{
                  color: '#B87333',
                  fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                  letterSpacing: '0.3em',
                  fontFamily: 'var(--font-heading)',
                }}>
                  SCROLL
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* VISUAL JOURNEY SECTION */}
        <section
          className="relative"
          style={{
            background: '#000000',
          }}
        >
          {/* Vision Block - Full Screen Image with Overlay */}
          <VisionBlock 
            image="https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg"
            icon={Lightbulb}
            title="THE VISION"
            text="Premium Robusta. Bold & Uncompromising."
            side="left"
          />

          {/* Stats Bar */}
          <StatsBar />

          {/* Mission Block */}
          <VisionBlock 
            image="https://images.unsplash.com/photo-1695191383473-b9d4cbbd1e85?crop=entropy&cs=srgb&fm=jpg&q=85"
            icon={Target}
            title="THE MISSION"
            text="2X Caffeine. Intense Flavor. Zero Compromise."
            side="right"
          />

          {/* Craft Block */}
          <VisionBlock 
            image="https://images.pexels.com/photos/2074127/pexels-photo-2074127.jpeg"
            icon={Coffee}
            title="THE CRAFT"
            text="Mastered Brewing. Trained Baristas. Perfect Extraction."
            side="left"
          />

          {/* Community Block */}
          <VisionBlock 
            image="https://images.pexels.com/photos/6340798/pexels-photo-6340798.jpeg"
            icon={Users}
            title="THE COMMUNITY"
            text="Bold Thinkers. Creative Souls. Coffee Enthusiasts."
            side="right"
          />
        </section>

        {/* PHILOSOPHY GRID - BOLD ICONS - Responsive */}
        <section
          className="relative overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, #000000 0%, #1A1110 100%)',
            padding: 'clamp(60px, 15vw, 200px) 0',
          }}
        >
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Title - Responsive */}
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(3rem, 10vw, 10rem)',
                lineHeight: 0.9,
                color: '#F5F1E8',
                textAlign: 'center',
                marginBottom: 'clamp(40px, 10vw, 120px)',
                fontWeight: 400,
                letterSpacing: '0.02em',
              }}
            >
              OUR{' '}
              <span style={{
                background: 'linear-gradient(135deg, #D4A574 0%, #FFFEF9 50%, #B87333 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                ESSENCE
              </span>
            </motion.h2>

            {/* Grid of Philosophy Icons - Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              <PhilosophyCard 
                icon={Zap}
                title="SPEED"
                subtitle="Grab & Go"
                delay={0}
              />
              <PhilosophyCard 
                icon={Heart}
                title="COZY"
                subtitle="Bold Warmth"
                delay={0.1}
              />
              <PhilosophyCard 
                icon={Palette}
                title="ART"
                subtitle="Creative Hub"
                delay={0.2}
              />
              <PhilosophyCard 
                icon={Sparkles}
                title="CULTURE"
                subtitle="Authentic"
                delay={0.3}
              />
            </div>
          </div>
        </section>

        {/* FINAL IMAGE CTA - Responsive */}
        <section
          className="relative overflow-hidden"
          style={{
            minHeight: '100dvh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="https://images.pexels.com/photos/1235706/pexels-photo-1235706.jpeg"
              alt="Coffee cup with steam by Lood Goosen on Pexels"
              fill
              className="object-cover"
              loading="lazy"
              quality={90}
              unoptimized
            />
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(26,17,16,0.75) 100%)',
              }}
            />
          </div>

          {/* CTA Content - Responsive */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative z-10 text-center px-4 sm:px-6"
          >
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.5rem, 10vw, 9rem)',
              lineHeight: 0.9,
              color: '#FFFEF9',
              marginBottom: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 400,
              letterSpacing: '0.02em',
            }}>
              EXPERIENCE
              <br />
              <span style={{
                background: 'linear-gradient(135deg, #D4A574 0%, #FFFEF9 50%, #B87333 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                THE BOLD
              </span>
            </h2>

            {/* CTA Buttons - Responsive & Touch-Friendly */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center max-w-2xl mx-auto">
              <motion.a
                href="/menu"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group inline-flex items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto"
                style={{
                  background: 'linear-gradient(135deg, #B87333 0%, #D4A574 100%)',
                  color: '#000000',
                  fontSize: 'clamp(1rem, 2.5vw, 1.75rem)',
                  letterSpacing: '0.15em',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-heading)',
                  boxShadow: '0 20px 60px rgba(184, 115, 51, 0.6)',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none',
                  padding: 'clamp(1rem, 3vw, 1.5rem) clamp(2rem, 5vw, 3rem)',
                  minHeight: '48px', // Touch-friendly
                }}
              >
                MENU
                <ArrowRight 
                  size={24} 
                  className="group-hover:translate-x-2 transition-transform w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7"
                />
              </motion.a>

              <motion.a
                href="/contact"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group inline-flex items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto"
                style={{
                  background: 'rgba(184, 115, 51, 0.2)',
                  color: '#FFFEF9',
                  fontSize: 'clamp(1rem, 2.5vw, 1.75rem)',
                  letterSpacing: '0.15em',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  border: '2px solid #B87333',
                  fontFamily: 'var(--font-heading)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none',
                  padding: 'clamp(1rem, 3vw, 1.5rem) clamp(2rem, 5vw, 3rem)',
                  minHeight: '48px', // Touch-friendly
                }}
              >
                VISIT
                <Users 
                  size={24}
                  className="group-hover:scale-110 transition-transform w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7"
                />
              </motion.a>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </>
  );
};

// Vision Block Component - Fully Responsive
const VisionBlock = ({ image, icon: Icon, title, text, side }: {
  image: string;
  icon: any;
  title: string;
  text: string;
  side: 'left' | 'right';
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div
      ref={ref}
      className="relative"
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          loading="lazy"
          quality={85}
          unoptimized
          priority={false}
        />
        {/* Responsive Gradient Overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: side === 'left' 
              ? 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 100%)' // Mobile: top to bottom
              : 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 100%)',
          }}
        />
        {/* Desktop Gradient (hidden on mobile) */}
        <div 
          className="absolute inset-0 hidden lg:block"
          style={{
            background: side === 'left' 
              ? 'linear-gradient(90deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.3) 100%)'
              : 'linear-gradient(90deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.95) 100%)',
          }}
        />
      </div>

      {/* Content - Responsive */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, x: side === 'left' ? -100 : 100 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className={`max-w-2xl lg:${side === 'right' ? 'ml-auto text-right' : ''} text-center lg:text-left`}
        >
          {/* Icon - Responsive Size */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="inline-flex items-center justify-center mb-6 sm:mb-8"
            style={{
              width: 'clamp(80px, 18vw, 150px)',
              height: 'clamp(80px, 18vw, 150px)',
              background: 'linear-gradient(135deg, #B87333 0%, #D4A574 100%)',
            }}
          >
            <Icon 
              size={60} 
              color="#000" 
              strokeWidth={2} 
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20" 
            />
          </motion.div>

          {/* Title - Responsive */}
          <h3 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.5rem, 8vw, 7rem)',
            lineHeight: 0.9,
            color: '#D4A574',
            marginBottom: 'clamp(1rem, 3vw, 2rem)',
            fontWeight: 400,
            letterSpacing: '0.05em',
          }}>
            {title}
          </h3>

          {/* Text - Responsive */}
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 2rem)',
            color: 'rgba(255, 254, 249, 0.9)',
            lineHeight: 1.6,
            fontWeight: 300,
            maxWidth: '100%',
            margin: '0 auto',
          }}>
            {text}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

// Stats Bar Component - Fully Responsive
const StatsBar = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="relative"
      style={{
        background: 'linear-gradient(135deg, #B87333 0%, #CD7F32 100%)',
        padding: 'clamp(40px, 10vw, 100px) 0',
      }}
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
          <StatItem number="2.7%" label="CAFFEINE" delay={0} />
          <StatItem number="100%" label="ROBUSTA" delay={0.2} />
          <StatItem number="∞" label="BOLDNESS" delay={0.4} />
        </div>
      </div>
    </motion.div>
  );
};

const StatItem = ({ number, label, delay }: { number: string; label: string; delay: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      className="text-center"
    >
      <div style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'clamp(3rem, 10vw, 8rem)',
        lineHeight: 1,
        color: '#000000',
        marginBottom: 'clamp(0.5rem, 2vw, 1rem)',
        fontWeight: 400,
      }}>
        {number}
      </div>
      <div style={{
        fontSize: 'clamp(0.875rem, 2vw, 1.5rem)',
        color: '#000000',
        letterSpacing: '0.3em',
        fontFamily: 'var(--font-heading)',
        opacity: 0.8,
      }}>
        {label}
      </div>
    </motion.div>
  );
};

// Philosophy Card Component - Fully Responsive
const PhilosophyCard = ({ icon: Icon, title, subtitle, delay }: {
  icon: any;
  title: string;
  subtitle: string;
  delay: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      whileHover={{ 
        scale: 1.05, 
        y: -10,
        transition: { duration: 0.3 }
      }}
      className="group relative text-center"
      style={{
        background: 'rgba(26, 17, 16, 0.6)',
        border: '2px solid rgba(184, 115, 51, 0.3)',
        padding: 'clamp(30px, 6vw, 80px) clamp(20px, 4vw, 40px)',
        cursor: 'pointer',
        minHeight: '280px', // Consistent height
      }}
    >
      {/* Hover Glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'radial-gradient(circle at center, rgba(184, 115, 51, 0.3) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="relative z-10">
        {/* Icon - Responsive */}
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center justify-center mb-4 sm:mb-6"
          style={{
            width: 'clamp(70px, 14vw, 120px)',
            height: 'clamp(70px, 14vw, 120px)',
            background: 'linear-gradient(135deg, #B87333 0%, #D4A574 100%)',
          }}
        >
          <Icon 
            size={50} 
            color="#000" 
            strokeWidth={2.5} 
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14" 
          />
        </motion.div>

        {/* Title - Responsive */}
        <h4 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(2rem, 5vw, 4rem)',
          color: '#D4A574',
          marginBottom: 'clamp(0.5rem, 1.5vw, 1rem)',
          lineHeight: 1,
          fontWeight: 400,
        }}>
          {title}
        </h4>

        {/* Subtitle - Responsive */}
        <p style={{
          fontSize: 'clamp(0.875rem, 1.8vw, 1.25rem)',
          color: 'rgba(245, 241, 232, 0.7)',
          fontWeight: 300,
          letterSpacing: '0.05em',
        }}>
          {subtitle}
        </p>
      </div>
    </motion.div>
  );
};

export default AboutPage;
