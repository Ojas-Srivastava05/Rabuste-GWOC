'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Coffee } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NewHero() {
  const router = useRouter();

  return (
    <section
      className="relative w-full h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1110 100%)',
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(146, 102, 68, 0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(89, 39, 32, 0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Coffee bean icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
          className="flex justify-center mb-8"
        >
          <div 
            className="p-6 rounded-full"
            style={{
              background: 'linear-gradient(135deg, rgba(146, 102, 68, 0.2), rgba(200, 155, 123, 0.2))',
              border: '2px solid rgba(146, 102, 68, 0.3)',
            }}
          >
            <Coffee size={48} color="#926644" strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 
            className="mb-6"
            style={{
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            <span className="gradient-text">Bold Coffee.</span>
            <br />
            <span style={{ color: '#E6C9A8' }}>Bolder Experience.</span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto"
          style={{
            color: '#D0B5A2',
            fontFamily: 'var(--font-body)',
            lineHeight: 1.6,
          }}
        >
          Discover the rich intensity of premium Robusta coffee. 
          <br className="hidden md:block" />
          Crafted with passion, served with excellence.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={() => router.push('/menu')}
            className="group relative px-8 py-4 rounded-full font-semibold text-lg overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #926644, #C89B7B)',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-heading)',
            }}
          >
            <span className="relative z-10 flex items-center gap-2">
              Explore Menu
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#C89B7B] to-[#926644]"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </button>

          <button
            onClick={() => {
              const element = document.getElementById('about-section');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-4 rounded-full font-semibold text-lg transition-all"
            style={{
              background: 'transparent',
              color: '#E6C9A8',
              border: '2px solid rgba(146, 102, 68, 0.5)',
              cursor: 'pointer',
              fontFamily: 'var(--font-heading)',
            }}
          >
            Our Story
          </button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-sm" style={{ color: '#926644', fontFamily: 'var(--font-heading)' }}>
              Scroll to explore
            </span>
            <div className="w-6 h-10 rounded-full border-2 flex justify-center pt-2"
              style={{ borderColor: 'rgba(146, 102, 68, 0.5)' }}
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: '#926644' }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}