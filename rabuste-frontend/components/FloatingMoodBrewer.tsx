"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { X, Sparkles, Brain } from "lucide-react";
import MoodBrewerChat from "./MoodBrewerChat";

export default function FloatingMoodBrewer() {
  const [open, setOpen] = useState(false);
  const [showFloating, setShowFloating] = useState(false);
  const [showLabel, setShowLabel] = useState(false);
  const botRef = useRef<HTMLDivElement>(null);
  const hasShownOnce = useRef(false);

  const { scrollY } = useScroll();

  // Show button when scrolling down
  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      const shouldShow = latest > window.innerHeight * 0.7;
      
      if (shouldShow && !hasShownOnce.current) {
        // First time showing
        hasShownOnce.current = true;
        setShowFloating(true);
        setShowLabel(true);
        
        // Hide label after 3 seconds - NO MATTER WHAT
        const labelTimer = setTimeout(() => {
          setShowLabel(false);
        }, 3000);
        
        // Hide button after 10 seconds
        const hideTimer = setTimeout(() => {
          setShowFloating(false);
        }, 10000);
        
        return () => {
          clearTimeout(labelTimer);
          clearTimeout(hideTimer);
        };
      } else if (shouldShow && hasShownOnce.current && !showFloating) {
        // Show again (without label) if user scrolls after auto-hide
        setShowFloating(true);
      } else if (!shouldShow) {
        // Hide if scrolled back to top
        setShowFloating(false);
      }
    });

    return () => unsubscribe();
  }, [scrollY, showFloating]);

  // Close when clicking outside (works on both desktop and mobile)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (botRef.current && !botRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      // Add both mouse and touch events for mobile support
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [open]);

  return (
    <>
      {/* Floating Button - Bottom Right */}
      <AnimatePresence>
        {showFloating && !open && (
          <motion.div
            initial={{ opacity: 0, x: 100, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, y: 100, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed right-4 sm:right-6 bottom-6 sm:bottom-8 z-50"
          >
            {/* Glow */}
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

            {/* Button */}
            <motion.button
              onClick={() => setOpen(true)}
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
              {/* Shimmer */}
              <motion.div
                className="absolute inset-0"
                animate={{ x: ["-100%", "200%"] }}
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

              <Brain size={32} style={{ color: "#000000", position: "relative", zIndex: 1 }} />

              {/* Sparkles */}
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

            {/* Label - Shows ONLY for 3 seconds - positioned to the left of button */}
            <AnimatePresence>
              {showLabel && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                  className="absolute right-full mr-4 top-1/2 -translate-y-1/2 pointer-events-none whitespace-nowrap"
                >
                  <div
                    className="md:block hidden"
                    style={{
                      background: "rgba(0, 0, 0, 0.95)",
                      border: "2px solid rgba(184, 115, 51, 0.6)",
                      padding: "8px 16px",
                      backdropFilter: "blur(10px)",
                      borderRadius: "4px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.8)",
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
                  <div
                    style={{
                      position: "absolute",
                      right: "-8px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "0",
                      height: "0",
                      borderTop: "6px solid transparent",
                      borderBottom: "6px solid transparent",
                      borderLeft: "8px solid rgba(184, 115, 51, 0.6)",
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop Overlay - tap to close on mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            onTouchStart={(e) => {
              e.preventDefault();
              setOpen(false);
            }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            style={{ touchAction: "none" }}
          />
        )}
      </AnimatePresence>

      {/* Bot Window - Bottom Right */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: "100%", y: "100%" }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: "100%", y: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="fixed right-4 bottom-4 sm:right-6 sm:bottom-6 z-50 w-[calc(100%-2rem)] sm:w-[450px] md:w-[480px] lg:w-[500px] flex flex-col"
            style={{
              height: "calc(100vh - 150px)",
              maxHeight: "650px",
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
              {/* Enhanced Header with better visual hierarchy */}
              <div
                className="relative border-b"
                style={{
                  borderColor: "rgba(184, 115, 51, 0.4)",
                  background: "linear-gradient(135deg, rgba(184, 115, 51, 0.15), rgba(184, 115, 51, 0.05))",
                  padding: "16px 20px",
                }}
              >
                {/* Decorative accent line at top */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "2px",
                    background: "linear-gradient(90deg, transparent, #B87333, #CD7F32, #D4A574, #CD7F32, #B87333, transparent)",
                  }}
                />

                <div className="flex items-center gap-3 pr-10">
                  {/* Icon with better styling */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #B87333, #CD7F32)",
                      boxShadow: "0 4px 12px rgba(184, 115, 51, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                      border: "1px solid rgba(212, 165, 116, 0.5)",
                    }}
                  >
                    <Brain size={20} style={{ color: "#000000" }} />
                  </div>

                  {/* Title section with better spacing */}
                  <div className="flex-1 min-w-0">
                    <h3
                      style={{
                        fontFamily: "Bebas Neue, sans-serif",
                        fontSize: "1.25rem",
                        color: "#FFFEF9",
                        letterSpacing: "0.12em",
                        margin: 0,
                        lineHeight: "1",
                        textShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                      }}
                    >
                      BREW AI
                    </h3>
                    <p 
                      style={{ 
                        fontSize: "0.7rem", 
                        color: "#D4A574", 
                        margin: "4px 0 0 0", 
                        lineHeight: "1.2",
                        fontWeight: 500,
                      }}
                    >
                      Your AI Coffee Sommelier
                    </p>
                  </div>
                </div>

                {/* Enhanced close button with better visual feedback */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpen(false);
                  }}
                  onTouchStart={(e) => {
                    e.stopPropagation();
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpen(false);
                  }}
                  className="absolute top-4 right-4 rounded-full transition-all hover:scale-110 active:scale-95 touch-manipulation"
                  style={{
                    background: "linear-gradient(135deg, rgba(184, 115, 51, 0.9), rgba(205, 127, 50, 0.9))",
                    border: "1px solid rgba(212, 165, 116, 0.8)",
                    padding: "8px",
                    minWidth: "36px",
                    minHeight: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    pointerEvents: "auto",
                    zIndex: 100,
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                  }}
                  aria-label="Close Brew AI"
                >
                  <X className="w-5 h-5" style={{ color: "#000000", strokeWidth: 2.5 }} />
                </button>
              </div>

              {/* Chat content area with subtle texture */}
              <div 
                className="overflow-y-auto flex-1" 
                style={{ 
                  WebkitOverflowScrolling: "touch",
                  padding: "20px",
                  position: "relative",
                }}
              >
                {/* Subtle texture overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(184, 115, 51, 0.02) 2px, rgba(184, 115, 51, 0.02) 4px)",
                    pointerEvents: "none",
                  }}
                />
                
                <div style={{ position: "relative", zIndex: 1 }}>
                  <MoodBrewerChat />
                </div>
              </div>

              {/* Decorative bottom accent */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "2px",
                  background: "linear-gradient(90deg, transparent, #B87333, #CD7F32, #D4A574, #CD7F32, #B87333, transparent)",
                  opacity: 0.6,
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}