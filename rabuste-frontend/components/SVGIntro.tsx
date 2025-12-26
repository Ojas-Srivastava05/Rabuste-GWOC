"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Squares from "./Squares";

export default function SVGIntro({ onFinish }: { onFinish: () => void }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex: 50, backgroundColor: '#0a0a0a' }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Squares Grid Background */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <Squares
          speed={0.5}
          squareSize={60}
          direction="diagonal"
          borderColor="#6b3a2e"
          hoverFillColor="#3d2317"
          className="opacity-60"
        />
      </div>

      {/* SVG Content */}
      <div className="relative" style={{ zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          onAnimationComplete={() => {
            setTimeout(onFinish, 3500);
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <svg
              width="360"
              height="480"
              viewBox="0 0 470 560"
              xmlns="http://www.w3.org/2000/svg"
              style={{ 
                filter: "drop-shadow(0 30px 70px rgba(255, 116, 0, 0.4))",
              }}
            >
              <defs>
                <linearGradient id="coffeeGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#1a0f08" />
                  <stop offset="30%" stopColor="#3d2317" />
                  <stop offset="60%" stopColor="#6b3e2e" />
                  <stop offset="100%" stopColor="#9d6b4f" />
                </linearGradient>

                <linearGradient id="cupGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#f8f8f8" />
                </linearGradient>

                <linearGradient id="thinLidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1f1f1f" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#0f0f0f" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0.28" />
                </linearGradient>

                <filter id="glow">
                  <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>

                <filter id="strongGlow">
                  <feGaussianBlur stdDeviation="15" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>

                <radialGradient id="cupShine" cx="30%" cy="30%">
                  <stop offset="0%" stopColor="white" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="white" stopOpacity="0"/>
                </radialGradient>
              </defs>

              {/* CUP BODY */}
              <g>
                <motion.path
                  d="M 95,160 L 108,460 Q 135,480 235,480 Q 335,480 362,460 L 375,160 Z"
                  fill="url(#cupGrad)"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                />

                <motion.path
                  d="M 105,180 L 115,450 Q 140,468 235,468 L 235,180 Z"
                  fill="url(#cupShine)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />

                {/* PERFECT PROPORTIONED LID - 60px tall (from y=100 to y=160) */}
                <motion.g
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                >
                  {/* Thin lid top */}
                  <ellipse cx="235" cy="100" rx="115" ry="6" fill="url(#thinLidGrad)" fillOpacity="0.75" />
                  
                  {/* Thin highlight */}
                  <ellipse cx="235" cy="99" rx="105" ry="5" fill="white" fillOpacity="0.08" />

                  {/* Drinking hole */}
                  <ellipse cx="235" cy="100" rx="11" ry="5" fill="#000000" fillOpacity="0.35" />

                  {/* Lid body - gentle taper from y=100 to y=160 (60px total) */}
                  <path d="M 122,100 L 117,120 L 110,140 L 95,160 L 375,160 L 360,140 L 353,120 L 348,100 Z" fill="url(#thinLidGrad)" fillOpacity="0.55" />

                  {/* Thin rim at cup connection */}
                  <ellipse cx="235" cy="160" rx="140" ry="2" fill="#0a0a0a" fillOpacity="0.4" />
                </motion.g>

                <motion.ellipse cx="235" cy="478" rx="130" ry="6" fill="#000000" fillOpacity="0" initial={{ opacity: 0 }} animate={{ opacity: 0.2 }} transition={{ duration: 0.6, delay: 1.0 }} style={{ filter: "blur(8px)" }} />
              </g>

              {/* COFFEE FILL */}
              <motion.g>
                <motion.path
                  d="M 108,460 Q 135,480 235,480 Q 335,480 362,460 L 362,460 L 108,460 Z"
                  fill="url(#coffeeGrad)"
                  initial={{ opacity: 0 }}
                  animate={{
                    d: [
                      "M 108,460 Q 135,480 235,480 Q 335,480 362,460 L 362,460 L 108,460 Z",
                      "M 108,460 Q 135,480 235,480 Q 335,480 362,460 L 370,320 Q 235,318 100,320 L 108,460 Z",
                      "M 108,460 Q 135,480 235,480 Q 335,480 362,460 L 375,175 Q 235,173 95,175 L 108,460 Z"
                    ],
                    opacity: [0, 1, 1]
                  }}
                  transition={{
                    duration: 2.8,
                    delay: 1.5,
                    ease: [0.34, 1.56, 0.64, 1],
                    times: [0, 0.5, 1]
                  }}
                />

                <motion.ellipse 
                  cx="235" 
                  cy={175}
                  rx={140}
                  ry="5" 
                  fill="white" 
                  fillOpacity="0" 
                  animate={{ fillOpacity: [0, 0, 0.3] }} 
                  transition={{ duration: 2.8, delay: 1.5, ease: [0.34, 1.56, 0.64, 1] }} 
                  filter="url(#glow)" 
                />

                {/* Steam */}
                {[...Array(8)].map((_, i) => {
                  const baseX = 190 + i * 12;
                  return (
                    <motion.path 
                      key={i} 
                      d={`M ${baseX},165 Q ${baseX + 5},130 ${baseX},95 Q ${baseX - 5},60 ${baseX},25`} 
                      stroke="white" 
                      strokeWidth={1.5}
                      fill="none" 
                      strokeLinecap="round" 
                      opacity={0}
                      animate={{ 
                        opacity: [0, 0, 0.4, 0.25, 0], 
                        y: [0, 0, -15, -30, -50]
                      }} 
                      transition={{ 
                        duration: 2.5, 
                        delay: 3.0 + i * 0.1, 
                        ease: [0.22, 1, 0.36, 1] 
                      }} 
                      style={{ filter: "blur(1.5px)" }} 
                    />
                  );
                })}
              </motion.g>

              {/* LOGO + BRANDING - USING EXACT POSITIONING FROM REFERENCE CODE */}
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.0, delay: 4.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.image
                  href="/Rabuste logo.png"
                  x="170"
                  y="220"
                  width="135"
                  height="135"
                  initial={{ opacity: 0, scale: 0.7, rotate: -15 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ 
                    duration: 0.9, 
                    delay: 4.6,
                    ease: [0.34, 1.56, 0.64, 1]
                  }}
                />
              </motion.g>
            </svg>
          </motion.div>

          {/* Ambient effects */}
          <motion.div className="absolute inset-0 pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: [0, 0.18, 0.15, 0.18, 0.12], scale: [1, 1.08, 1.04, 1.08, 1] }} transition={{ duration: 7, times: [0, 0.3, 0.5, 0.7, 1], ease: [0.16, 1, 0.3, 1] }} style={{ background: "radial-gradient(circle at center, rgba(255, 116, 0, 0.3), rgba(255, 116, 0, 0.1) 35%, transparent 65%)" }} />
          <motion.div className="absolute inset-0 pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ duration: 2, delay: 1 }} style={{ background: "radial-gradient(ellipse at center, transparent 25%, rgba(0, 0, 0, 0.7) 100%)" }} />
        </motion.div>
      </div>
    </motion.div>
  );
}
