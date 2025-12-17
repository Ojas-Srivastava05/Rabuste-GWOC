'use client';

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

export default function SpringCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [7, -7]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-7, 7]), springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        // visual / layout fixes so the card reads as a distinct component
        width: "100%",
        maxWidth: 920,              // constrain overly wide cards
        margin: "0 auto",          // center when constrained
        background: "rgba(10,10,10,0.45)",
        border: "1px solid rgba(255,116,0,0.06)",
        borderRadius: 16,
        overflow: "hidden",
        backdropFilter: "blur(6px)",
      }}
      whileHover={{ scale: 1.03 }}
      transition={{ scale: { duration: 0.2, ease: "easeOut" } }}
      className={`relative ${className}`}
    >
      <motion.div
        className="absolute -inset-1 rounded-2xl opacity-0 blur-2xl transition-opacity duration-300"
        style={{ background: "linear-gradient(135deg, rgba(239, 68, 68, 0.18), rgba(220, 38, 38, 0.08))" }}
        whileHover={{ opacity: 1 }}
      />

      <motion.div
        className="relative rounded-xl"
        style={{ transformStyle: "preserve-3d", padding: 20 }}
        whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(239, 68, 68, 0.12)" }}
        transition={{ boxShadow: { duration: 0.3, ease: "easeOut" } }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
