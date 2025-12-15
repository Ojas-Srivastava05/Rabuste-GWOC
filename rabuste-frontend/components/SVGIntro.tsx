"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function SVGIntro({ onFinish }: { onFinish: () => void }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-[#0f0f0f] flex items-center justify-center z-50 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onAnimationComplete={() => {
        setTimeout(onFinish, 5500);
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-[300px] h-[350px]"
      >
        <svg
          width="300"
          height="350"
          viewBox="0 0 470 510"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0"
          style={{ 
            filter: "drop-shadow(0 15px 40px rgba(255, 116, 0, 0.25))",
          }}
        >
          <defs>
            <linearGradient id="coffeeGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#2d1810" />
              <stop offset="50%" stopColor="#3d2317" />
              <stop offset="100%" stopColor="#5d3520" />
            </linearGradient>

            <filter id="softGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <mask id="cupMask">
              <path
                d="M101.154,180h267.693L351.1,390H118.9L101.154,180z"
                fill="white"
              />
            </mask>
          </defs>

          {/* COFFEE FILL - DELAYED UNTIL CUP DRAWS */}
          <motion.path
            d="M101.154,180h267.693L351.1,390H118.9L101.154,180z"
            fill="url(#coffeeGrad)"
            mask="url(#cupMask)"
            initial={{ 
              d: "M101.154,390h267.693L351.1,390H118.9L101.154,390z"
            }}
            animate={{ 
              d: "M101.154,180h267.693L351.1,390H118.9L101.154,180z"
            }}
            transition={{
              duration: 2.5,
              delay: 1.8,
              ease: "linear"
            }}
          />

          {/* CUP OUTLINE - LINE DRAWING ANIMATION */}
          <motion.path
            d="M397.5,60h-24.145L359.776,5.681C358.941,2.342,355.941,0,352.5,0h-235c-3.441,0-6.441,2.342-7.276,5.681L96.645,60H72.5 c-4.143,0-7.5,3.358-7.5,7.5v40c0,4.142,3.357,7.5,7.5,7.5h8.107l13.156,155.685c0.331,3.913,3.608,6.869,7.465,6.869 c0.212,0,0.426-0.009,0.641-0.027c4.127-0.349,7.19-3.977,6.842-8.104L101.154,180h267.693L351.1,390H118.9l-7.663-90.685 c-0.35-4.128-3.984-7.202-8.105-6.842c-4.127,0.349-7.19,3.977-6.842,8.104l13.736,162.553c0.328,3.884,3.576,6.869,7.474,6.869 h235c3.897,0,7.146-2.985,7.474-6.869L389.393,115h8.107c4.143,0,7.5-3.358,7.5-7.5v-40C405,63.358,401.643,60,397.5,60z M124.393,455l-4.225-50h229.665l-4.225,50H124.393z M370.114,165H99.886l-4.225-50h278.678L370.114,165z M390,100h-7.631 C382.363,100,80,100,80,100V75h22.344c0.106,0.002,0.216,0.002,0.324,0H337.5c4.143,0,7.5-3.358,7.5-7.5s-3.357-7.5-7.5-7.5 H112.105l11.25-45h223.289l13.579,54.319C361.059,72.658,364.059,75,367.5,75H390V100z"
            fill="white"
            stroke="white"
            strokeWidth="2.5"
            initial={{ 
              pathLength: 0,
              opacity: 0
            }}
            animate={{ 
              pathLength: 1,
              opacity: 1
            }}
            transition={{
              pathLength: {
                duration: 1.5,
                delay: 0.5,
                ease: [0.22, 1, 0.36, 1]
              },
              opacity: {
                duration: 0.3,
                delay: 0.5
              }
            }}
            style={{
              strokeDasharray: "1",
              strokeDashoffset: "1"
            }}
          />

          {/* LOGO + TEXT - APPEARS AFTER FILL */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 3.5 }}
          >
            <motion.image
              href="/logo.svg"
              x="210"
              y="210"
              width="50"
              height="50"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.6, 
                delay: 3.6,
                ease: [0.34, 1.56, 0.64, 1]
              }}
            />

            <motion.text
              x="235"
              y="290"
              textAnchor="middle"
              fill="#FF7400"
              fontSize="32"
              fontWeight="700"
              letterSpacing="8"
              fontFamily="Helvetica Neue, Arial, sans-serif"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: 3.8,
                ease: [0.22, 1, 0.36, 1]
              }}
              filter="url(#softGlow)"
            >
              RABUSTE
            </motion.text>

            <motion.line
              x1="175"
              y1="305"
              x2="295"
              y2="305"
              stroke="#FF7400"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.8 }}
              transition={{ 
                duration: 0.6, 
                delay: 4.0,
                ease: [0.22, 1, 0.36, 1]
              }}
            />
          </motion.g>
        </svg>
      </motion.div>

      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.08 }}
        transition={{ duration: 2.0 }}
        style={{
          background: "radial-gradient(circle at center, rgba(255, 116, 0, 0.12), transparent 60%)",
        }}
      />
    </motion.div>
  );
}
