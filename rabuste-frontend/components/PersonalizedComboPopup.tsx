import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Coffee, Sparkles, ArrowRight, Palette } from "lucide-react";
import { useRouter } from "next/navigation";

interface PersonalizedComboPopupProps {
  userName?: string | null;
  isLoggedIn: boolean;
}

export default function PersonalizedComboPopup({ userName, isLoggedIn }: PersonalizedComboPopupProps) {
  const router = useRouter();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  // Show popup after 3 seconds on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Rotate messages every 8 seconds
  useEffect(() => {
    if (!isVisible || isMinimized) return;

    const messages = isLoggedIn ? loggedInMessages : guestMessages;
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [isVisible, isMinimized, isLoggedIn]);

  const guestMessages = [
    {
      icon: Coffee,
      title: "Discover Bold Coffee",
      description: "2X caffeine. Zero compromises.",
      cta: "Explore Menu",
      route: "/menu",
      color: "#B87333",
    },
    {
      icon: Palette,
      title: "Explore Art Gallery",
      description: "Where coffee meets creativity.",
      cta: "View Collection",
      route: "/gallery",
      color: "#CD7F32",
    },
    {
      icon: Sparkles,
      title: "Join the Movement",
      description: "Sign up for exclusive perks!",
      cta: "Sign Up Now",
      route: "/auth/login",
      color: "#D4A574",
    },
  ];

  const loggedInMessages = [
    {
      icon: Coffee,
      title: `Welcome Back, ${userName}!`,
      description: "Try our new seasonal blends.",
      cta: "Browse Menu",
      route: "/menu",
      color: "#B87333",
    },
    {
      icon: Palette,
      title: "Fresh Art Just Dropped",
      description: "Check out this month's featured artists.",
      cta: "View Gallery",
      route: "/gallery",
      color: "#CD7F32",
    },
    {
      icon: Sparkles,
      title: `${userName}, You're Awesome!`,
      description: "Exclusive deals waiting for you.",
      cta: "See Offers",
      route: "/menu",
      color: "#D4A574",
    },
  ];

  const messages = isLoggedIn ? loggedInMessages : guestMessages;
  const currentMessage = messages[currentMessageIndex];
  const Icon = currentMessage.icon;

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleCTAClick = () => {
    router.push(currentMessage.route);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          y: 0, 
          scale: 1,
          height: isMinimized ? 'auto' : 'auto'
        }}
        exit={{ opacity: 0, y: 100, scale: 0.8 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="fixed bottom-6 right-6 z-[9997]"
        style={{
          maxWidth: isMinimized ? '60px' : '320px',
          width: isMinimized ? '60px' : '90%',
        }}
      >
        {/* Minimized View */}
        {isMinimized ? (
          <motion.div
            onClick={handleMinimize}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer relative"
            style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #B87333, #CD7F32)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 30px rgba(184, 115, 51, 0.5), 0 0 0 3px rgba(184, 115, 51, 0.3)',
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Coffee size={28} color="#000" strokeWidth={2.5} />
            </motion.div>
            
            {/* Notification Badge */}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1"
              style={{
                width: '20px',
                height: '20px',
                background: '#FF4444',
                borderRadius: '50%',
                border: '2px solid #000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: 700,
                color: '#FFF',
              }}
            >
              !
            </motion.div>
          </motion.div>
        ) : (
          /* Expanded View */
          <div
            className="relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(61, 43, 31, 0.98), rgba(26, 17, 16, 0.98))',
              border: '3px solid rgba(184, 115, 51, 0.5)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(184, 115, 51, 0.3)',
            }}
          >
            {/* Animated Glow Background */}
            <motion.div
              animate={{
                opacity: [0.2, 0.4, 0.2],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-1/2 -right-1/4 w-64 h-64 rounded-full"
              style={{
                background: `radial-gradient(circle, ${currentMessage.color}40 0%, transparent 70%)`,
                filter: 'blur(40px)',
              }}
            />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-3 pb-2">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex-shrink-0"
                >
                  <Icon size={20} color={currentMessage.color} strokeWidth={2.5} />
                </motion.div>
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: currentMessage.color,
                    fontSize: '12px',
                    letterSpacing: '0.1em',
                  }}
                >
                  {isLoggedIn ? 'FOR YOU' : 'DISCOVER'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleMinimize}
                  className="p-1 transition-all duration-300 hover:scale-110"
                  style={{ color: '#8B6F47' }}
                  title="Minimize"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 8H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
                <button
                  onClick={handleClose}
                  className="p-1 transition-all duration-300 hover:rotate-90 hover:scale-110"
                  style={{ color: '#8B6F47' }}
                  title="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMessageIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="relative z-10 px-3 pb-3"
              >
                {/* Title */}
                <h3
                  className="mb-1.5"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(16px, 4vw, 18px)',
                    color: '#FFFEF9',
                    letterSpacing: '0.05em',
                    lineHeight: 1.2,
                  }}
                >
                  {currentMessage.title}
                </h3>

                {/* Description */}
                <p
                  className="mb-3"
                  style={{
                    fontSize: '13px',
                    color: 'rgba(255, 254, 249, 0.8)',
                    lineHeight: 1.4,
                  }}
                >
                  {currentMessage.description}
                </p>

                {/* CTA Button */}
                <motion.button
                  onClick={handleCTAClick}
                  whileHover={{ scale: 1.02, x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-between group py-2.5 px-3 transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${currentMessage.color}, ${currentMessage.color}dd)`,
                    color: '#000000',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 400,
                    letterSpacing: '0.12em',
                    fontSize: '13px',
                    border: `2px solid ${currentMessage.color}40`,
                  }}
                >
                  {currentMessage.cta}
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight size={16} strokeWidth={3} />
                  </motion.div>
                </motion.button>
              </motion.div>
            </AnimatePresence>

            {/* Progress Indicators */}
            <div className="relative z-10 flex gap-1 px-3 pb-2.5">
              {messages.map((_, index) => (
                <div
                  key={index}
                  className="flex-1 h-0.5 transition-all duration-300"
                  style={{
                    background: index === currentMessageIndex 
                      ? currentMessage.color 
                      : 'rgba(255, 254, 249, 0.2)',
                    boxShadow: index === currentMessageIndex 
                      ? `0 0 10px ${currentMessage.color}` 
                      : 'none',
                  }}
                />
              ))}
            </div>

            {/* Corner Decorations */}
            <div
              className="absolute top-0 left-0 w-10 h-10 pointer-events-none"
              style={{
                borderTop: `2px solid ${currentMessage.color}40`,
                borderLeft: `2px solid ${currentMessage.color}40`,
              }}
            />
            <div
              className="absolute bottom-0 right-0 w-10 h-10 pointer-events-none"
              style={{
                borderBottom: `2px solid ${currentMessage.color}40`,
                borderRight: `2px solid ${currentMessage.color}40`,
              }}
            />
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}