import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Coffee, Sparkles, ArrowRight } from "lucide-react";

interface WelcomePopupProps {
  userName: string;
  onClose: () => void;
}

export default function WelcomePopup({ userName, onClose }: WelcomePopupProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Prevent body scroll when popup is visible
    document.body.style.overflow = 'hidden';
    // Auto-close after 8 seconds
    const timer = setTimeout(() => {
      handleClose();
    }, 8000);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleExplore = () => {
    handleClose();
    // Smooth scroll to experience section
    const experienceSection = document.getElementById('experience-section');
    if (experienceSection) {
      experienceSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop - tap to close on mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-md"
            onClick={handleClose}
            onTouchStart={(e) => {
              e.preventDefault();
              handleClose();
            }}
            style={{ touchAction: "none" }}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ 
              duration: 0.5, 
              ease: [0.4, 0, 0.2, 1],
              type: "spring",
              stiffness: 100
            }}
            className="fixed left-1/2 top-1/2 z-[9999] w-[90%] max-w-2xl -translate-x-1/2 -translate-y-1/2"
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className="relative overflow-hidden p-6 sm:p-8 md:p-10 lg:p-14 max-h-[90vh] overflow-y-auto"
              style={{
                background: 'linear-gradient(135deg, rgba(61, 43, 31, 0.95), rgba(42, 24, 16, 0.95))',
                border: '3px solid rgba(184, 115, 51, 0.4)',
                boxShadow: '0 30px 100px rgba(0, 0, 0, 0.9), 0 0 80px rgba(184, 115, 51, 0.3)',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {/* Animated Background Glow */}
              <motion.div
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-1/2 -right-1/4 w-96 h-96 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(184, 115, 51, 0.3) 0%, transparent 70%)',
                  filter: 'blur(60px)',
                }}
              />

              {/* Close Button - mobile-friendly */}
              <button
                onClick={handleClose}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  handleClose();
                }}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 rounded-full transition-all duration-300 hover:rotate-90 active:scale-95 touch-manipulation"
                style={{ 
                  color: '#B87333',
                  padding: '10px',
                  minWidth: '44px',
                  minHeight: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(184, 115, 51, 0.1)',
                  border: '1px solid rgba(184, 115, 51, 0.3)',
                }}
                aria-label="Close welcome popup"
              >
                <X size={isVisible ? 20 : 20} />
              </button>

              {/* Content */}
              <div className="relative z-10 text-center">
                {/* Icon Animation */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    delay: 0.2,
                    duration: 0.6,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                  className="mb-6 flex justify-center"
                >
                  <div 
                    className="relative p-6"
                    style={{
                      background: 'linear-gradient(135deg, rgba(184, 115, 51, 0.2), rgba(115, 54, 53, 0.2))',
                      border: '2px solid rgba(184, 115, 51, 0.4)',
                    }}
                  >
                    <Coffee size={48} style={{ color: '#B87333' }} />
                    <motion.div
                      animate={{ 
                        rotate: 360,
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ 
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className="absolute -top-2 -right-2"
                    >
                      <Sparkles size={24} style={{ color: '#D4A574' }} />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Welcome Text */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <p 
                    className="mb-2 text-sm tracking-[0.3em] uppercase"
                    style={{ 
                      color: '#8B6F47',
                      fontFamily: 'var(--font-body)',
                      fontWeight: 600,
                    }}
                  >
                    WELCOME BACK
                  </p>
                </motion.div>

                {/* User Name */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="mb-4 text-5xl md:text-6xl"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 400,
                    letterSpacing: '0.05em',
                    lineHeight: 1.1,
                  }}
                >
                  <span style={{ color: '#FFFEF9' }}>{userName.toUpperCase()}</span>
                </motion.h2>

                {/* Divider */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100px' }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="mx-auto mb-6 h-1"
                  style={{
                    background: 'linear-gradient(90deg, transparent, #B87333, #CD7F32, #B87333, transparent)',
                  }}
                />

                {/* Tagline */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="mb-8 text-lg md:text-xl"
                  style={{ 
                    color: '#B87333',
                    fontFamily: 'var(--font-body)',
                    lineHeight: 1.6,
                  }}
                >
                  Ready to experience the bold power of
                  <br />
                  <span style={{ color: '#D4A574', fontWeight: 600 }}>2X caffeine Robusta?</span>
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                  <motion.button
                    onClick={handleExplore}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="group flex items-center gap-3 px-8 py-4 transition-all duration-300"
                    style={{
                      background: 'linear-gradient(135deg, #B87333, #CD7F32)',
                      color: '#000000',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 400,
                      letterSpacing: '0.15em',
                      fontSize: '16px',
                      border: '2px solid rgba(184, 115, 51, 0.4)',
                      boxShadow: '0 10px 40px rgba(184, 115, 51, 0.4)',
                    }}
                  >
                    EXPLORE NOW
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ 
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <ArrowRight size={20} />
                    </motion.div>
                  </motion.button>

                  <motion.button
                    onClick={handleClose}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 transition-all duration-300"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: '#F5F1E8',
                      border: '2px solid rgba(184, 115, 51, 0.6)',
                      fontFamily: 'var(--font-heading)',
                      letterSpacing: '0.15em',
                      fontSize: '16px',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    MAYBE LATER
                  </motion.button>
                </motion.div>

                {/* Bottom Note */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="mt-6 text-xs tracking-wider"
                  style={{ color: '#8B6F47' }}
                >
                  YOUR BOLD COFFEE JOURNEY CONTINUES
                </motion.p>
              </div>

              {/* Corner Decorations */}
              <div 
                className="absolute top-0 left-0 w-20 h-20"
                style={{
                  borderTop: '3px solid rgba(184, 115, 51, 0.3)',
                  borderLeft: '3px solid rgba(184, 115, 51, 0.3)',
                }}
              />
              <div 
                className="absolute bottom-0 right-0 w-20 h-20"
                style={{
                  borderBottom: '3px solid rgba(184, 115, 51, 0.3)',
                  borderRight: '3px solid rgba(184, 115, 51, 0.3)',
                }}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}