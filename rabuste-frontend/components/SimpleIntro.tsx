"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function SimpleIntro({ onFinish }: { onFinish: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 3000; // 3 seconds
    const steps = 60;
    const interval = duration / steps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onFinish, 500);
          return 100;
        }
        return prev + (100 / steps);
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-[#FFFBD6] z-50 flex flex-col items-center justify-center overflow-hidden">
      {/* Simple Coffee Cup */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
        className="relative w-64 h-80 mb-12"
      >
        {/* Cup Container */}
        <div className="relative w-full h-full flex items-center justify-center">
          {/* The Cup */}
          <div 
            className="relative w-48 h-64 rounded-b-[2.5rem] overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))",
              border: "3px solid rgba(200,200,200,0.6)",
              clipPath: "polygon(15% 0%, 85% 0%, 92% 100%, 8% 100%)"
            }}
          >
            {/* Coffee Fill */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#2d1810] via-[#3d2317] to-[#4a2c1a]"
              style={{
                height: `${progress}%`,
                transition: "height 0.05s linear"
              }}
            >
              {/* Coffee surface shine */}
              <div 
                className="absolute top-0 left-0 right-0 h-3 bg-[#5d3520] opacity-70"
                style={{
                  boxShadow: "0 -2px 10px rgba(93, 53, 32, 0.5)"
                }}
              />
            </motion.div>

            {/* RABUSTE Text on Cup */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-[#FF7400] font-bold text-3xl tracking-[0.3em]"
                style={{
                  textShadow: "0 2px 15px rgba(255, 116, 0, 0.4), 0 0 30px rgba(255, 116, 0, 0.2)",
                  fontFamily: "'Playfair Display', 'Georgia', serif"
                }}
              >
                RABUSTE
              </motion.span>
            </div>
          </div>

          {/* Black Lid */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="absolute top-0 w-48 h-8 rounded-full"
            style={{
              background: "linear-gradient(to bottom, #2a2a2a, #0a0a0a)",
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
            }}
          >
            {/* Lid details */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-black rounded-full" />
          </motion.div>

          {/* Steam */}
          {progress > 70 && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex gap-4">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 h-16 bg-gradient-to-t from-gray-400/30 to-transparent rounded-full blur-sm"
                  animate={{
                    opacity: [0, 0.6, 0],
                    y: [0, -30, -60],
                  }}
                  transition={{
                    duration: 2.5,
                    delay: i * 0.4,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Brand Name */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="text-center"
      >
        <h1 
          className="text-[#FF7400] font-bold text-7xl tracking-[0.25em] mb-3"
          style={{
            fontFamily: "'Playfair Display', 'Georgia', serif",
            textShadow: "0 4px 30px rgba(255, 116, 0, 0.4)"
          }}
        >
          RABUSTE
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="text-[#FF7400]/70 text-lg tracking-[0.3em] font-light"
        >
          PREMIUM COFFEE
        </motion.p>
      </motion.div>

      {/* Subtle gradient overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, rgba(255, 116, 0, 0.03), transparent 70%)"
        }}
      />
    </div>
  );
}
