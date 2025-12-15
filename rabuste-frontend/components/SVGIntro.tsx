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
      transition={{ duration: 0.6 }}
      onAnimationComplete={() => {
        setTimeout(onFinish, 5500);
      }}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        <svg
          width="320"
          height="380"
          viewBox="0 0 470 510"
          xmlns="http://www.w3.org/2000/svg"
          style={{ 
            filter: "drop-shadow(0 20px 50px rgba(255, 116, 0, 0.3))",
          }}
        >
          <defs>
            <linearGradient id="coffeeGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#1f1108" />
              <stop offset="30%" stopColor="#2d1810" />
              <stop offset="60%" stopColor="#3d2317" />
              <stop offset="100%" stopColor="#5d3520" />
            </linearGradient>

            <linearGradient id="cupGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#f5f5f5" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>

            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* CUP OUTLINE - COMPLETE STRUCTURE */}
          <g>
            {/* Bottom base curve */}
            <motion.path
              d="M118.9,390 Q 145,405 235,405 Q 325,405 351.1,390"
              stroke="url(#cupGrad)"
              strokeWidth="3"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
              strokeLinecap="round"
            />

            {/* Left side */}
            <motion.path
              d="M118.9,390 L101.154,180"
              stroke="url(#cupGrad)"
              strokeWidth="3"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
              strokeLinecap="round"
            />

            {/* Right side */}
            <motion.path
              d="M351.1,390 L368.847,180"
              stroke="url(#cupGrad)"
              strokeWidth="3"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
              strokeLinecap="round"
            />

            {/* Top rim */}
            <motion.path
              d="M101.154,180 L368.847,180"
              stroke="url(#cupGrad)"
              strokeWidth="3"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.0, ease: "easeOut" }}
              strokeLinecap="round"
            />

            {/* Middle band sections */}
            <motion.path
              d="M99.886,165 L370.114,165"
              stroke="url(#cupGrad)"
              strokeWidth="1.5"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 1.3, ease: "easeOut" }}
              strokeLinecap="round"
            />

            {/* NECK STRUCTURE - THINNER STROKES */}
            {/* Left neck section */}
            <motion.path
              d="M96.645,60 L72.5,60 L72.5,115 L80.107,115"
              stroke="url(#cupGrad)"
              strokeWidth="1.5"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 1.6, ease: "easeOut" }}
              strokeLinecap="round"
            />

            {/* Right neck section */}
            <motion.path
              d="M373.355,60 L397.5,60 L397.5,115 L389.393,115"
              stroke="url(#cupGrad)"
              strokeWidth="1.5"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 1.6, ease: "easeOut" }}
              strokeLinecap="round"
            />

            {/* Neck bands */}
            <motion.path
              d="M80.107,115 L389.393,115"
              stroke="url(#cupGrad)"
              strokeWidth="1.5"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 1.8, ease: "easeOut" }}
              strokeLinecap="round"
            />

            {/* CONNECTING VERTICAL LINES - THINNER */}
            {/* Left vertical connector */}
            <motion.path
              d="M80.107,115 L101.154,180"
              stroke="url(#cupGrad)"
              strokeWidth="1.5"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 1.85, ease: "easeOut" }}
              strokeLinecap="round"
            />

            {/* Right vertical connector */}
            <motion.path
              d="M389.393,115 L368.847,180"
              stroke="url(#cupGrad)"
              strokeWidth="1.5"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 1.85, ease: "easeOut" }}
              strokeLinecap="round"
            />

            {/* Bottom section lines */}
            <motion.path
              d="M124.393,405 L345.608,405"
              stroke="url(#cupGrad)"
              strokeWidth="1.5"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 1.5, ease: "easeOut" }}
              strokeLinecap="round"
            />

            {/* Lid top structure - CLEANER */}
            <motion.path
              d="M359.776,5.681 L352.5,0 L117.5,0 L110.224,5.681 L96.645,60 L373.355,60"
              stroke="url(#cupGrad)"
              strokeWidth="2"
              fill="white"
              fillOpacity="0.95"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2, ease: "easeOut" }}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Top lid band details */}
            <motion.path
              d="M112.105,15 L357.895,15"
              stroke="url(#cupGrad)"
              strokeWidth="1.5"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 1.4, ease: "easeOut" }}
              strokeLinecap="round"
            />

            {/* Fill cup body */}
            <motion.path
              d="M101.154,180 L368.847,180 L351.1,390 Q 325,405 235,405 Q 145,405 118.9,390 Z"
              fill="white"
              fillOpacity="0"
              animate={{ fillOpacity: 0.95 }}
              transition={{ duration: 0.4, delay: 2.0 }}
            />
          </g>

          {/* COFFEE RISES - MATCHES CUP EXACTLY */}
          <motion.g>
            <motion.path
              d="M118.9,390 Q 145,405 235,405 Q 325,405 351.1,390 L351.1,390 L118.9,390 Z"
              fill="url(#coffeeGrad)"
              animate={{
                d: [
                  "M118.9,390 Q 145,405 235,405 Q 325,405 351.1,390 L351.1,390 L118.9,390 Z",
                  "M118.9,390 Q 145,405 235,405 Q 325,405 351.1,390 L368.847,285 Q 235,280 101.154,285 L118.9,390 Z",
                  "M118.9,390 Q 145,405 235,405 Q 325,405 351.1,390 L368.847,190 Q 235,187 101.154,190 L118.9,390 Z"
                ]
              }}
              transition={{
                duration: 2.0,
                delay: 2.2,
                ease: [0.19, 1, 0.22, 1],
                times: [0, 0.5, 1]
              }}
            />

            {/* Coffee surface shine */}
            <motion.ellipse
              cx="235"
              cy="190"
              rx="135"
              ry="6"
              fill="#8d6e46"
              fillOpacity="0"
              animate={{ 
                fillOpacity: [0, 0, 0.6],
                cy: [405, 285, 190]
              }}
              transition={{
                duration: 2.0,
                delay: 2.2,
                ease: [0.19, 1, 0.22, 1]
              }}
              filter="url(#glow)"
            />
          </motion.g>

          {/* LOGO + BRANDING - MORE SPACING */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 4.0 }}
          >
            <motion.image
              href="/logo.svg"
              x="210"
              y="205"
              width="50"
              height="50"
              initial={{ opacity: 0, scale: 0.7, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ 
                duration: 0.7, 
                delay: 4.1,
                ease: [0.34, 1.56, 0.64, 1]
              }}
            />

            <motion.text
              x="235"
              y="290"
              textAnchor="middle"
              fill="#FF7400"
              fontSize="30"
              fontWeight="700"
              letterSpacing="9"
              fontFamily="Helvetica Neue, Arial, sans-serif"
              initial={{ opacity: 0, letterSpacing: "20" }}
              animate={{ opacity: 1, letterSpacing: "9" }}
              transition={{ 
                duration: 0.8, 
                delay: 4.3,
                ease: [0.22, 1, 0.36, 1]
              }}
              filter="url(#glow)"
            >
              RABUSTE
            </motion.text>

            <motion.path
              d="M 180,303 Q 235,306 290,303"
              stroke="#FF7400"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.7 }}
              transition={{ 
                duration: 0.8, 
                delay: 4.5,
                ease: [0.22, 1, 0.36, 1]
              }}
            />
          </motion.g>
        </svg>
      </motion.div>

      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 2.5 }}
        style={{
          background: "radial-gradient(circle at center, rgba(255, 116, 0, 0.15), transparent 55%)",
        }}
      />
    </motion.div>
  );
}
