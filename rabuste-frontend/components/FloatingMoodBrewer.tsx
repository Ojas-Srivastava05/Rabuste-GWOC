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
      {/* Floating Button */}
      <AnimatePresence>
        {showFloating && !open && (
          <motion.div
            initial={{ opacity: 0, x: -100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed left-4 sm:left-6 z-50"
            style={{
              top: "50%",
              transform: "translateY(-50%)",
            }}
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

            {/* Label - Shows ONLY for 3 seconds */}
            <AnimatePresence>
              {showLabel && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
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

      {/* Bot Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: "-100%", y: "-100%" }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: "-100%", y: "-100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="fixed left-0 top-0 z-50 w-full sm:w-[95vw] md:w-[500px] lg:w-[550px] h-full sm:h-[95vh] md:h-[90vh] flex flex-col"
            style={{
              maxHeight: "100vh",
            }}
            ref={botRef}
          >
            <div
              className="relative flex flex-col h-full overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(26, 17, 16, 0.98), rgba(42, 24, 16, 0.98))",
                border: "2px solid rgba(184, 115, 51, 0.6)",
                borderRadius: "0 16px 16px 0",
                backdropFilter: "blur(20px)",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8), 0 0 80px rgba(184, 115, 51, 0.3)",
              }}
            >
              <div
                className="relative p-4 sm:p-4 md:p-4 border-b"
                style={{
                  borderColor: "rgba(184, 115, 51, 0.3)",
                  background: "linear-gradient(90deg, rgba(184, 115, 51, 0.1), transparent)",
                }}
              >
                <div className="flex items-center gap-3 pr-12 sm:pr-12 md:pr-12">
                  <div
                    className="w-10 h-10 sm:w-10 sm:h-10 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #B87333, #CD7F32)",
                      boxShadow: "0 0 20px rgba(184, 115, 51, 0.5)",
                    }}
                  >
                    <Brain size={20} style={{ color: "#000000" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      style={{
                        fontFamily: "Bebas Neue, sans-serif",
                        fontSize: "1.125rem sm:text-1.25rem md:text-1.25rem",
                        color: "#FFFEF9",
                        letterSpacing: "0.1em",
                        margin: 0,
                        lineHeight: "1.2",
                      }}
                    >
                      BREW AI
                    </h3>
                    <p style={{ fontSize: "0.7rem sm:text-0.75rem md:text-0.75rem", color: "#B87333", margin: 0 }}>
                      Your AI Coffee Sommelier
                    </p>
                  </div>
                </div>

                {/* Enhanced close button - bigger and more accessible on mobile */}
                <button
                  onClick={() => setOpen(false)}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    setOpen(false);
                  }}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 rounded-full transition-all active:scale-95 touch-manipulation"
                  style={{
                    background: "rgba(184, 115, 51, 0.3)",
                    border: "2px solid rgba(184, 115, 51, 0.6)",
                    padding: "10px",
                    minWidth: "44px",
                    minHeight: "44px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  aria-label="Close Brew AI"
                >
                  <X className="w-5 h-5 sm:w-5 sm:h-5 md:w-4 md:h-4" style={{ color: "#D4A574" }} />
                </button>
              </div>

              <div className="overflow-y-auto p-4 sm:p-6 flex-1" style={{ WebkitOverflowScrolling: "touch" }}>
                <MoodBrewerChat />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}