"use client";

import { motion } from "framer-motion";

export default function IntroLoader({
  onFinish,
}: {
  onFinish: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 bg-[#1a1a1a] flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Mug container with scale-up transition */}
      <motion.div
        initial={{ opacity: 0, scale: 1 }}
        animate={{ 
          opacity: [0, 1, 1, 1],
          scale: [1, 1, 1, 6]
        }}
        transition={{ 
          opacity: { times: [0, 0.1, 0.95, 1], duration: 2.2 },
          scale: { times: [0, 0.1, 0.75, 1], duration: 2.2, ease: "easeInOut" }
        }}
        onAnimationComplete={onFinish}
        className="relative"
      >
        {/* Mug outline */}
        <div className="relative w-32 h-40 border-[3px] border-white/90 rounded-b-3xl overflow-hidden">
          {/* Mug handle */}
          <div className="absolute -right-8 top-8 w-10 h-16 border-[3px] border-white/90 border-l-0 rounded-r-full" />
          
          {/* Coffee liquid fill */}
          <motion.div
            className="absolute bottom-0 w-full bg-[#3d2317]"
            initial={{ height: "0%" }}
            animate={{ height: "82%" }}
            transition={{ 
              delay: 0.2,
              duration: 1.2, 
              ease: [0.45, 0.05, 0.55, 0.95]
            }}
          />

          {/* Brand text - stays visible throughout */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white font-bold text-[0.95rem] tracking-[0.35em] select-none">
              RABUSTE
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
