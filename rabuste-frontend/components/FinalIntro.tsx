"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function FinalIntro({ onFinish }: { onFinish: () => void }) {
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
        setTimeout(onFinish, 2400);
      }}
    >
      {/* ZOOM WRAPPER */}
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 6 }}
        transition={{
          delay: 1.6,
          duration: 0.8,
          ease: [0.19, 1, 0.22, 1],
        }}
      >
        {/* TAKEAWAY COFFEE CUP CONTAINER */}
        <div className="relative">
          
          {/* THE LID - THIS IS CRITICAL */}
          <div
            className="absolute -top-3 left-1/2 -translate-x-1/2 w-[150px] h-[20px] border border-white/50 bg-white/10 rounded-full backdrop-blur-sm z-10"
            style={{
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
            }}
          >
            {/* Sipping notch */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-6 h-2 bg-black/40 rounded-full" />
          </div>

          {/* CUP BODY - TAPERED */}
          <motion.div
            className="relative h-[220px] w-[140px] bg-white/5 border border-white/40 backdrop-blur-sm"
            style={{
              clipPath: "polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)",
              borderRadius: "0 0 18px 18px",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* COFFEE LIQUID - RESPECTS TAPER */}
            <motion.div
              className="absolute bottom-0 w-full bg-gradient-to-t from-[#2d1810] via-[#3d2317] to-[#4b2a1a]"
              style={{
                clipPath: "polygon(12% 0%, 88% 0%, 100% 100%, 0% 100%)",
              }}
              initial={{ height: "0%" }}
              animate={{ height: "85%" }}
              transition={{ 
                duration: 1.2, 
                delay: 0.4,
                ease: [0.19, 1, 0.22, 1]
              }}
            >
              {/* Coffee surface shine */}
              <div 
                className="absolute top-0 left-0 right-0 h-2 bg-[#5d3520]/60"
                style={{
                  boxShadow: "0 -1px 6px rgba(93, 53, 32, 0.4)"
                }}
              />
            </motion.div>

            {/* BRAND MARK - PRINTED ON CUP */}
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {/* Your actual logo - NO FILTER */}
              <Image
                src="/logo.svg"
                alt="Rabuste Logo"
                width={40}
                height={40}
                className="mb-1"
              />
              
              <span
                className="text-[#FF7400] font-bold tracking-[0.25em] text-sm"
                style={{
                  fontFamily: "'Helvetica Neue', sans-serif",
                  textShadow: "0 1px 3px rgba(0,0,0,0.3)"
                }}
              >
                RABUSTE
              </span>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* BRAND TEXT BELOW CUP */}
      <motion.div
        className="absolute bottom-24 left-1/2 -translate-x-1/2 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <h1 
          className="text-white font-bold text-6xl tracking-[0.3em] mb-2"
          style={{
            fontFamily: "'Helvetica Neue', sans-serif",
          }}
        >
          RABUSTE
        </h1>
        <motion.p
          className="text-white/60 text-sm tracking-[0.4em] font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          PREMIUM COFFEE
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
