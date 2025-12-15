"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function PremiumIntro2D({ onFinish }: { onFinish: () => void }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => onFinish(), 6000); // 6 seconds - elongated
    return () => clearTimeout(timer);
  }, [onFinish]);

  if (!mounted) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-[#FFFBD6] z-50 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ 
          scale: [0.7, 1, 1, 1.8],
          opacity: [0, 1, 1, 0]
        }}
        transition={{
          duration: 6,
          times: [0, 0.12, 0.82, 1],
          ease: [0.16, 1, 0.3, 1]
        }}
        className="relative w-[450px] h-[550px]"
      >
        <svg
          viewBox="0 0 200 320"
          className="w-full h-full"
          style={{ filter: "drop-shadow(0 15px 50px rgba(255, 116, 0, 0.25))" }}
        >
          <defs>
            {/* Rich brown coffee gradient */}
            <linearGradient id="coffeeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4a2c1a" />
              <stop offset="50%" stopColor="#3d2317" />
              <stop offset="100%" stopColor="#2d1810" />
            </linearGradient>

            {/* Glass cup gradient */}
            <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.15" />
            </linearGradient>

            {/* Orange glow filter */}
            <filter id="orangeGlow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            {/* Wave animation for coffee */}
            <clipPath id="coffeeClip">
              <motion.path
                d="M 68 260 L 132 260 L 130 150 L 70 150 Z"
                initial={{ d: "M 68 260 L 132 260 L 130 260 L 70 260 Z" }}
                animate={{ 
                  d: [
                    "M 68 260 L 132 260 L 130 260 L 70 260 Z",
                    "M 68 260 L 132 260 L 130 150 L 70 150 Z"
                  ]
                }}
                transition={{
                  duration: 3.5,
                  delay: 0.8,
                  ease: [0.19, 1, 0.22, 1]
                }}
              />
            </clipPath>
          </defs>

          {/* GRAB-AND-GO CUP BODY - Proper taper */}
          <motion.path
            d="M 75 70 L 68 260 Q 68 265 73 265 L 127 265 Q 132 265 132 260 L 125 70 Z"
            fill="url(#glassGradient)"
            stroke="#c0c0c0"
            strokeWidth="2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          />

          {/* BLACK DOME LID */}
          <motion.g
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <ellipse cx="100" cy="68" rx="26" ry="5" fill="#0a0a0a" />
            <ellipse cx="100" cy="65" rx="26" ry="7" fill="#1a1a1a" />
            <ellipse cx="100" cy="62" rx="26" ry="8" fill="#2a2a2a" />
            <ellipse cx="112" cy="60" rx="5" ry="3" fill="#0a0a0a" />
          </motion.g>

          {/* WAVY COFFEE FILL WITH CLIP PATH */}
          <g clipPath="url(#coffeeClip)">
            {/* Coffee body */}
            <rect
              x="68"
              y="150"
              width="64"
              height="110"
              fill="url(#coffeeGradient)"
            />
            
            {/* Animated wave effect on coffee surface */}
            <motion.path
              d="M 68 150 Q 80 145, 100 150 T 132 150 L 132 160 L 68 160 Z"
              fill="#4a2c1a"
              opacity="0.6"
              animate={{
                d: [
                  "M 68 150 Q 80 145, 100 150 T 132 150 L 132 160 L 68 160 Z",
                  "M 68 150 Q 80 155, 100 150 T 132 150 L 132 160 L 68 160 Z",
                  "M 68 150 Q 80 145, 100 150 T 132 150 L 132 160 L 68 160 Z"
                ]
              }}
              transition={{
                duration: 2,
                delay: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </g>

          {/* Coffee surface shine */}
          <motion.ellipse
            cx="100"
            cy="150"
            rx="30"
            ry="5"
            fill="#5d3520"
            opacity="0"
            animate={{ 
              opacity: [0, 0, 0.7],
              cy: [260, 260, 150]
            }}
            transition={{
              duration: 3.5,
              delay: 0.8,
              ease: [0.19, 1, 0.22, 1]
            }}
          />

          {/* RABUSTE text - ELEGANT FONT */}
          <motion.text
            x="100"
            y="190"
            textAnchor="middle"
            fill="#FF7400"
            fontSize="28"
            fontWeight="600"
            letterSpacing="6"
            fontFamily="Georgia, serif"
            filter="url(#orangeGlow)"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1.8 }}
          >
            RABUSTE
          </motion.text>

          {/* Decorative line under text */}
          <motion.line
            x1="75"
            y1="175"
            x2="125"
            y2="175"
            stroke="#FF7400"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 2.2 }}
          />
        </svg>

        {/* Elegant steam wisps */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-full flex justify-center gap-6">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-12 bg-gradient-to-t from-gray-400/40 to-transparent rounded-full blur-[2px]"
              initial={{ opacity: 0, y: 0 }}
              animate={{ 
                opacity: [0, 0.65, 0],
                y: [0, -50, -100],
              }}
              transition={{
                duration: 3,
                delay: 3 + i * 0.5,
                repeat: Infinity,
                repeatDelay: 2,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Brand text - IMPROVED FONT */}
      <motion.div
        className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 2 }}
      >
        <h1 
          className="text-[#FF7400] font-bold text-8xl tracking-[0.25em]"
          style={{
            fontFamily: "'Playfair Display', 'Georgia', serif",
            textShadow: "0 6px 35px rgba(255, 116, 0, 0.5)",
            fontWeight: 700
          }}
        >
          RABUSTE
        </h1>
        <motion.p
          className="text-[#FF7400]/75 mt-4 text-lg tracking-[0.35em] font-light"
          style={{ fontFamily: "'Lato', sans-serif" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.8 }}
        >
          PREMIUM COFFEE
        </motion.p>
      </motion.div>

      {/* Subtle radial gradient background */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, rgba(255, 116, 0, 0.05) 0%, transparent 70%)"
        }}
      />
    </motion.div>
  );
}
