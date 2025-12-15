"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

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
      transition={{ duration: 0.5 }}
      onAnimationComplete={() => {
        setTimeout(onFinish, 5000);
      }}
    >
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 4 }}
        transition={{
          delay: 3.5,
          duration: 1.5,
          ease: [0.19, 1, 0.22, 1],
        }}
      >
        <svg
          width="350"
          height="400"
          viewBox="0 0 470 470"
          xmlns="http://www.w3.org/2000/svg"
          style={{ filter: "drop-shadow(0 15px 50px rgba(255, 116, 0, 0.4))" }}
        >
          <defs>
            <linearGradient id="coffeeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6d4423" />
              <stop offset="50%" stopColor="#5d3520" />
              <stop offset="100%" stopColor="#3d2317" />
            </linearGradient>

            <clipPath id="mugClip">
              <path d="M397.5,60h-24.145L359.776,5.681C358.941,2.342,355.941,0,352.5,0h-235c-3.441,0-6.441,2.342-7.276,5.681L96.645,60H72.5 c-4.143,0-7.5,3.358-7.5,7.5v40c0,4.142,3.357,7.5,7.5,7.5h8.107l13.156,155.685c0.331,3.913,3.608,6.869,7.465,6.869 c0.212,0,0.426-0.009,0.641-0.027c4.127-0.349,7.19-3.977,6.842-8.104L101.154,180h267.693L351.1,390H118.9l-7.663-90.685 c-0.35-4.128-3.984-7.202-8.105-6.842c-4.127,0.349-7.19,3.977-6.842,8.104l13.736,162.553c0.328,3.884,3.576,6.869,7.474,6.869 h235c3.897,0,7.146-2.985,7.474-6.869L389.393,115h8.107c4.143,0,7.5-3.358,7.5-7.5v-40C405,63.358,401.643,60,397.5,60z M124.393,455l-4.225-50h229.665l-4.225,50H124.393z M370.114,165H99.886l-4.225-50h278.678L370.114,165z M390,100h-7.631 C382.363,100,80,100,80,100V75h22.344c0.106,0.002,0.216,0.002,0.324,0H337.5c4.143,0,7.5-3.358,7.5-7.5s-3.357-7.5-7.5-7.5 H112.105l11.25-45h223.289l13.579,54.319C361.059,72.658,364.059,75,367.5,75H390V100z" />
            </clipPath>
          </defs>

          {/* COFFEE FILL - STEADY AND SMOOTH - 3 SECONDS */}
          <motion.rect
            x="80"
            y="60"
            width="310"
            height="395"
            fill="url(#coffeeGrad)"
            clipPath="url(#mugClip)"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{
              duration: 3.0,
              delay: 0.5,
              ease: "linear"
            }}
            style={{ transformOrigin: "bottom" }}
          />

          {/* YOUR MUG OUTLINE - DRAWS IN */}
          <motion.g
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <path
              d="M397.5,60h-24.145L359.776,5.681C358.941,2.342,355.941,0,352.5,0h-235c-3.441,0-6.441,2.342-7.276,5.681L96.645,60H72.5 c-4.143,0-7.5,3.358-7.5,7.5v40c0,4.142,3.357,7.5,7.5,7.5h8.107l13.156,155.685c0.331,3.913,3.608,6.869,7.465,6.869 c0.212,0,0.426-0.009,0.641-0.027c4.127-0.349,7.19-3.977,6.842-8.104L101.154,180h267.693L351.1,390H118.9l-7.663-90.685 c-0.35-4.128-3.984-7.202-8.105-6.842c-4.127,0.349-7.19,3.977-6.842,8.104l13.736,162.553c0.328,3.884,3.576,6.869,7.474,6.869 h235c3.897,0,7.146-2.985,7.474-6.869L389.393,115h8.107c4.143,0,7.5-3.358,7.5-7.5v-40C405,63.358,401.643,60,397.5,60z M124.393,455l-4.225-50h229.665l-4.225,50H124.393z M370.114,165H99.886l-4.225-50h278.678L370.114,165z M390,100h-7.631 C382.363,100,80,100,80,100V75h22.344c0.106,0.002,0.216,0.002,0.324,0H337.5c4.143,0,7.5-3.358,7.5-7.5s-3.357-7.5-7.5-7.5 H112.105l11.25-45h223.289l13.579,54.319C361.059,72.658,364.059,75,367.5,75H390V100z"
              fill="white"
              stroke="none"
            />
          </motion.g>

          {/* LOGO + TEXT */}
          <motion.g
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 2.0 }}
          >
            <foreignObject x="185" y="180" width="100" height="100">
              <div className="flex items-center justify-center w-full h-full">
                <Image
                  src="/logo.svg"
                  alt="Rabuste"
                  width={80}
                  height={80}
                  className="brightness-0 invert"
                  style={{ filter: "drop-shadow(0 3px 10px rgba(255,255,255,0.4))" }}
                />
              </div>
            </foreignObject>

            <text
              x="235"
              y="310"
              textAnchor="middle"
              fill="white"
              fontSize="52"
              fontWeight="700"
              letterSpacing="12"
              fontFamily="Helvetica, Arial, sans-serif"
              style={{ textShadow: "0 3px 15px rgba(255,255,255,0.5)" }}
            >
              RABUSTE
            </text>
          </motion.g>
        </svg>
      </motion.div>

      {/* BRAND TEXT BELOW */}
      <motion.div
        className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <h1 
          className="text-white font-bold text-7xl tracking-[0.35em] mb-3"
          style={{
            fontFamily: "'Helvetica Neue', sans-serif",
            textShadow: "0 4px 30px rgba(255,255,255,0.2)"
          }}
        >
          RABUSTE
        </h1>
        <motion.p
          className="text-white/60 text-base tracking-[0.45em] font-light uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.0 }}
        >
          Premium Coffee
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
