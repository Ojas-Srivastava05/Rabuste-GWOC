"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Coffee, X, Sparkles, Zap, Brain } from "lucide-react";
import MoodBrewerChat from "./MoodBrewerChat";
import Image from "next/image";

export default function FloatingMoodBrewer() {
  const [open, setOpen] = useState(false);
  const [showFloating, setShowFloating] = useState(false);
  const [hasAutoHidden, setHasAutoHidden] = useState(false);
  const botRef = useRef<HTMLDivElement>(null);
  const autoHideTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { scrollY } = useScroll();

  // Show floating button after scrolling past hero (viewport height)
  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      const shouldShow = latest > window.innerHeight * 0.7;
      
      if (shouldShow && !showFloating && !hasAutoHidden) {
        // First time showing - set auto-hide timer
        setShowFloating(true);
        
        // Auto-hide after 5 seconds
        if (autoHideTimerRef.current) {
          clearTimeout(autoHideTimerRef.current);
        }
        autoHideTimerRef.current = setTimeout(() => {
          setShowFloating(false);
          setHasAutoHidden(true);
        }, 5000);
      } else if (shouldShow && hasAutoHidden) {
        // User scrolled again after auto-hide - show it again
        setShowFloating(true);
      } else if (!shouldShow) {
        setShowFloating(false);
        // Clear timer if user scrolls back up
        if (autoHideTimerRef.current) {
          clearTimeout(autoHideTimerRef.current);
        }
      }
    });

    return () => {
      unsubscribe();
      if (autoHideTimerRef.current) {
        clearTimeout(autoHideTimerRef.current);
      }
    };
  }, [scrollY, showFloating, hasAutoHidden]);

  // Close bot when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (botRef.current && !botRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <>
      {/* Innovative Floating Button - Appears after scrolling */}
      <AnimatePresence>
        {showFloating && !open && (
          <motion.div
            initial={{ opacity: 0, x: -100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed left-6 z-50"
            style={{
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            {/* Outer Glow Ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0.2, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                background: "radial-gradient(circle, rgba(184, 115, 51, 0.6) 0%, transparent 70%)",
                filter: "blur(20px)",
                width: "140px",
                height: "140px",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />

            {/* Main Button */}
            <motion.button
              onClick={() => {
                setOpen(true);
                // Clear auto-hide timer when user clicks
                if (autoHideTimerRef.current) {
                  clearTimeout(autoHideTimerRef.current);
                }
              }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #B87333 0%, #CD7F32 50%, #D4A574 100%)",
                border: "3px solid rgba(212, 165, 116, 0.8)",
                boxShadow: "0 10px 40px rgba(184, 115, 51, 0.6), 0 0 60px rgba(184, 115, 51, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Shimmer Effect */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  x: ["-100%", "200%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)",
                  width: "50%",
                }}
              />

              {/* Icon */}
              <Brain size={32} style={{ color: "#000000", position: "relative", zIndex: 1 }} />

              {/* Floating Sparkles */}
              <motion.div
                className="absolute"
                animate={{
                  y: [-10, -20],
                  x: [5, 15],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: 0,
                }}
              >
                <Sparkles size={16} style={{ color: "#D4A574" }} />
              </motion.div>

              <motion.div
                className="absolute"
                animate={{
                  y: [-10, -20],
                  x: [-5, -15],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: 0.5,
                }}
              >
                <Sparkles size={12} style={{ color: "#CD7F32" }} />
              </motion.div>
            </motion.button>

            {/* Tooltip Label */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute left-full ml-4 top-1/2 -translate-y-1/2 pointer-events-none whitespace-nowrap"
            >
              <div
                style={{
                  background: "rgba(0, 0, 0, 0.9)",
                  border: "2px solid rgba(184, 115, 51, 0.6)",
                  padding: "8px 16px",
                  backdropFilter: "blur(10px)",
                }}
              >
                <p
                  style={{
                    fontFamily: "Bebas Neue, sans-serif",
                    fontSize: "0.875rem",
                    color: "#D4A574",
                    letterSpacing: "0.15em",
                    margin: 0,
                  }}
                >
                  AI BREW ASSISTANT
                </p>
              </div>

              {/* Arrow */}
              <div
                style={{
                  position: "absolute",
                  left: "-8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "0",
                  height: "0",
                  borderTop: "6px solid transparent",
                  borderBottom: "6px solid transparent",
                  borderRight: "8px solid rgba(184, 115, 51, 0.6)",
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bot Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -100 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -100 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed left-24 z-50 w-[420px] max-h-[75vh] flex flex-col"
            style={{
              top: "50%",
              transform: "translateY(-50%)",
            }}
            ref={botRef}
          >
            <div
              className="relative flex flex-col h-full overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(26, 17, 16, 0.98), rgba(42, 24, 16, 0.98))",
                border: "2px solid rgba(184, 115, 51, 0.6)",
                borderRadius: "16px",
                backdropFilter: "blur(20px)",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8), 0 0 80px rgba(184, 115, 51, 0.3)",
              }}
            >
              {/* Header */}
              <div
                className="relative p-4 border-b"
                style={{
                  borderColor: "rgba(184, 115, 51, 0.3)",
                  background: "linear-gradient(90deg, rgba(184, 115, 51, 0.1), transparent)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, #B87333, #CD7F32)",
                      boxShadow: "0 0 20px rgba(184, 115, 51, 0.5)",
                    }}
                  >
                    <Brain size={20} style={{ color: "#000000" }} />
                  </div>
                  <div>
                    <h3
                      style={{
                        fontFamily: "Bebas Neue, sans-serif",
                        fontSize: "1.25rem",
                        color: "#FFFEF9",
                        letterSpacing: "0.1em",
                        margin: 0,
                      }}
                    >
                      BREW AI
                    </h3>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "#B87333",
                        margin: 0,
                      }}
                    >
                      Your AI Coffee Sommelier
                    </p>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-full transition-all hover:scale-110"
                  style={{
                    background: "rgba(184, 115, 51, 0.2)",
                    border: "1px solid rgba(184, 115, 51, 0.4)",
                  }}
                >
                  <X className="w-4 h-4" style={{ color: "#D4A574" }} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto p-4 flex-1">
                <MoodBrewerChat />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}