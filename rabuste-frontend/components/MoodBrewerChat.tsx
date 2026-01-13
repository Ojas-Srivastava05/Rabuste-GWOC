"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, X, Brain, Zap, Cpu, User, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";

type MenuItem = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
};

/* ---------- MENU META ---------- */
const MENU_META = {
  moods: [
    "focused",
    "energetic",
    "sleepy",
    "fresh",
    "light",
    "relaxed",
    "happy",
    "treat",
    "comfort",
    "stressed",
    "snack",
    "meal",
  ],
  tastes: [
    "bold",
    "strong",
    "bitter",
    "refreshing",
    "citrus",
    "fruity",
    "creamy",
    "sweet",
    "nutty",
    "caramel",
    "chocolatey",
    "dessert",
    "rich",
    "smooth",
    "balanced",
    "clean",
    "spicy",
    "salty",
    "savory",
    "plain",
    "herb",
    "buttery",
  ],
  times: ["morning", "afternoon", "evening", "night", "any"],
};

type Reply = {
  recommendation: string;
  reason: string;
  price?: number;
};

function labelize(value: string) {
  return value.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function MoodBrewerChat() {
  const [mood, setMood] = useState("");
  const [taste, setTaste] = useState("");
  const [time, setTime] = useState("evening");
  const [reply, setReply] = useState<Reply | null>(null);
  const [loading, setLoading] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [showDashboardHint, setShowDashboardHint] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch menu items on mount
  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch('/api/menu');
        const data = await res.json();
        setMenuItems(data);
      } catch (err) {
        console.error('Failed to fetch menu', err);
      }
    }
    fetchMenu();
  }, []);

  // Show dashboard hint for logged-in users after 5 seconds
  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        setShowDashboardHint(true);
        // Auto-hide after 8 seconds
        setTimeout(() => setShowDashboardHint(false), 8000);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        reply &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setReply(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [reply]);

  async function send() {
    if (!mood || !taste) return;

    try {
      setLoading(true);
      setReply(null);

      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL_BREWAI}/chat`, {
        mood,
        taste,
        time,
        temperature: "cold",
        caffeine: "medium",
      });

      setReply(res.data);
    } finally {
      setLoading(false);
    }
  }

  function closePopup() {
    setReply(null);
  }

  function handleOrderNow() {
    if (!reply || !reply.recommendation) {
      router.push("/menu");
      return;
    }

    // Find the item by name (case-insensitive, flexible matching)
    const recommendedName = reply.recommendation.toLowerCase().trim();
    const matchedItem = menuItems.find((item) => {
      const itemName = item.name.toLowerCase().trim();
      return (
        itemName === recommendedName ||
        itemName.includes(recommendedName) ||
        recommendedName.includes(itemName)
      );
    });

    if (matchedItem) {
      // Navigate to menu with item highlight
      router.push(`/menu#item-${matchedItem._id}`);
    } else {
      // Fallback to regular menu page
      router.push("/menu");
    }
  }

  return (
    <div
      ref={containerRef}
      className="rounded-2xl p-6 sm:p-8 space-y-6 sm:space-y-8 relative flex flex-col overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(26, 17, 16, 0.98) 0%, rgba(42, 24, 16, 0.95) 100%)',
        border: '1px solid rgba(184, 115, 51, 0.3)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(184, 115, 51, 0.2), inset 0 1px 0 rgba(184, 115, 51, 0.1)',
      }}
    >
      {/* Subtle Copper Glow - Top */}
      <div 
        className="absolute top-0 left-0 right-0 h-40 opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top, rgba(184, 115, 51, 0.4), transparent 70%)',
        }}
      />
      
      {/* Header */}
      <div className="text-center space-y-3 relative z-10">
        <div className="relative inline-block mb-2">
          {/* Enhanced Metallic Glow */}
          <motion.div 
            className="absolute inset-0 blur-3xl opacity-60"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              background: 'radial-gradient(circle, #D4A574, #B87333, #CD7F32)',
            }}
          />
          <div
            className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(184, 115, 51, 0.2), rgba(205, 127, 50, 0.2))',
              border: '2px solid rgba(184, 115, 51, 0.4)',
              borderRadius: '50%',
              boxShadow: '0 0 30px rgba(184, 115, 51, 0.4), inset 0 0 20px rgba(212, 165, 116, 0.2)',
            }}
          >
            <Brain className="w-8 h-8 sm:w-10 sm:h-10 relative z-10" style={{ color: '#D4A574', strokeWidth: 2 }} />
          </div>
        </div>
        <div>
          <h1 
            className="text-3xl sm:text-4xl font-bold mb-2 relative" 
            style={{ 
              fontFamily: 'var(--font-heading)', 
              background: 'linear-gradient(135deg, #FFFEF9 0%, #D4A574 50%, #FFFEF9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '0.1em',
              textShadow: '0 0 80px rgba(212, 165, 116, 0.3)',
            }}
          >
            BREW AI
            {/* Glow effect behind text */}
            <motion.span
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 blur-2xl"
              style={{
                background: 'linear-gradient(135deg, #D4A574, #B87333)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                zIndex: -1,
              }}
            >
              BREW AI
            </motion.span>
          </h1>
          <div className="flex items-center justify-center gap-2 mb-1">
            <Cpu size={14} className="sm:w-4 sm:h-4" style={{ color: '#B87333' }} />
            <p className="text-xs sm:text-sm uppercase tracking-widest" style={{ color: '#B87333', fontWeight: 600, fontFamily: 'var(--font-heading)' }}>
              Intelligent Brewing Assistant
            </p>
          </div>
          <p className="text-xs sm:text-sm" style={{ color: 'rgba(255, 254, 249, 0.6)', lineHeight: 1.5 }}>
            Tell us your mood and taste, we'll find your perfect cup
          </p>
        </div>
      </div>

      {/* Mood */}
      <Section title="How are you feeling?" number="01">
        <PremiumChipGroup items={MENU_META.moods} value={mood} onChange={setMood} type="mood" />
      </Section>

      {/* Taste */}
      <Section title="Taste preference" number="02">
        <PremiumChipGroup items={MENU_META.tastes} value={taste} onChange={setTaste} type="taste" />
      </Section>

      {/* Time */}
      <Section title="Time of day" number="03">
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
          {MENU_META.times.map((t) => {
            const isSelected = time === t;
            return (
              <motion.button
                key={t}
                onClick={() => setTime(t)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="py-3 sm:py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all relative overflow-hidden"
                style={{
                  background: isSelected 
                    ? 'linear-gradient(135deg, rgba(184, 115, 51, 0.3), rgba(205, 127, 50, 0.3))' 
                    : 'rgba(26, 17, 16, 0.6)',
                  border: `1px solid ${isSelected ? '#CD7F32' : 'rgba(184, 115, 51, 0.2)'}`,
                  color: isSelected ? '#D4A574' : '#8B6F47',
                  fontFamily: 'var(--font-heading)',
                  letterSpacing: '0.08em',
                  boxShadow: isSelected ? '0 4px 20px rgba(205, 127, 50, 0.3), inset 0 1px 0 rgba(212, 165, 116, 0.2)' : 'none',
                }}
              >
                {isSelected && (
                  <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.3, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                      background: 'linear-gradient(135deg, #D4A574, transparent)',
                    }}
                  />
                )}
                <span className="relative z-10">{labelize(t)}</span>
              </motion.button>
            );
          })}
        </div>
      </Section>

      {/* Ask Button */}
      <div className="mt-6 relative">
        <motion.button
          onClick={send}
          disabled={loading || !mood || !taste}
          whileHover={!loading && mood && taste ? { scale: 1.02 } : {}}
          whileTap={!loading && mood && taste ? { scale: 0.98 } : {}}
          className="w-full py-4 sm:py-5 font-bold flex items-center justify-center gap-3 transition-all relative overflow-hidden group"
          style={{
            background: loading || !mood || !taste 
              ? 'rgba(26, 17, 16, 0.6)' 
              : 'linear-gradient(135deg, #B87333 0%, #CD7F32 50%, #D4A574 100%)',
            color: loading || !mood || !taste ? '#8B6F47' : '#000',
            fontFamily: 'var(--font-heading)',
            letterSpacing: '0.15em',
            fontSize: '16px',
            border: loading || !mood || !taste 
              ? '1px solid rgba(184, 115, 51, 0.2)' 
              : '1px solid rgba(184, 115, 51, 0.4)',
            boxShadow: loading || !mood || !taste 
              ? 'none' 
              : '0 10px 40px rgba(184, 115, 51, 0.5), inset 0 1px 0 rgba(212, 165, 116, 0.5)',
            cursor: loading || !mood || !taste ? 'not-allowed' : 'pointer',
          }}
        >
          {/* Shimmer Effect */}
          {!loading && mood && taste && (
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                background: 'linear-gradient(135deg, #D4A574 0%, #CD7F32 50%, #B87333 100%)',
              }}
            />
          )}
          <span className="relative z-10 flex items-center gap-3">
            {loading ? (
              <>
                <Loader2 className="animate-spin w-6 h-6" />
                ANALYZING...
              </>
            ) : (
              <>
                <Zap className="w-6 h-6" fill="#000" />
                BREW MY PERFECT CUP
              </>
            )}
          </span>
        </motion.button>

        {/* Dashboard Hint for Logged-in Users */}
        {user && (
          <AnimatePresence>
            {showDashboardHint && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-4 p-4 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(184, 115, 51, 0.15), rgba(205, 127, 50, 0.15))',
                  border: '1px solid rgba(184, 115, 51, 0.4)',
                  borderRadius: '8px',
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, #B87333, #CD7F32)',
                      borderRadius: '8px',
                    }}
                  >
                    <User size={18} color="#000" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <h4 
                      className="text-sm font-bold mb-1"
                      style={{
                        fontFamily: 'var(--font-heading)',
                        color: '#D4A574',
                        letterSpacing: '0.05em',
                      }}
                    >
                      YOUR DASHBOARD
                    </h4>
                    <p className="text-xs mb-3" style={{ color: 'rgba(255, 254, 249, 0.8)', lineHeight: 1.5 }}>
                      Track orders, manage favorites, and view your coffee journey
                    </p>
                    <motion.button
                      onClick={() => router.push('/user')}
                      whileHover={{ scale: 1.02, x: 2 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider transition-all"
                      style={{
                        color: '#B87333',
                        fontFamily: 'var(--font-heading)',
                        letterSpacing: '0.1em',
                      }}
                    >
                      VIEW DASHBOARD
                      <ArrowRight size={14} strokeWidth={2.5} />
                    </motion.button>
                  </div>
                  <button
                    onClick={() => setShowDashboardHint(false)}
                    className="flex-shrink-0 p-1 hover:opacity-70 transition-opacity"
                    style={{ color: '#8B6F47' }}
                  >
                    <X size={14} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Popup Response */}
        <AnimatePresence>
          {reply && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] sm:w-[340px] p-4 sm:p-6 shadow-lg z-50 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(26, 17, 16, 0.98), rgba(42, 24, 16, 0.95))',
                border: '2px solid rgba(184, 115, 51, 0.5)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(184, 115, 51, 0.3)',
              }}
            >
              {/* Copper Glow */}
              <div 
                className="absolute top-0 left-0 right-0 h-24 opacity-20 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at top, rgba(212, 165, 116, 0.5), transparent 70%)',
                }}
              />
              
              {/* Close Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closePopup();
                }}
                className="absolute top-3 right-3 p-1.5 rounded-lg transition-all hover:scale-110 z-50"
                style={{
                  background: 'rgba(184, 115, 51, 0.3)',
                  border: '2px solid rgba(184, 115, 51, 0.6)',
                }}
                aria-label="Close recommendation"
              >
                <X className="w-4 h-4" style={{ color: '#D4A574' }} />
              </button>

              <div className="relative z-10">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <Sparkles size={18} className="sm:w-[22px] sm:h-[22px]" style={{ color: '#D4A574' }} fill="#D4A574" />
                  <h3 
                    className="text-lg sm:text-xl font-bold"
                    style={{ 
                      fontFamily: 'var(--font-heading)',
                      background: 'linear-gradient(135deg, #D4A574 0%, #CD7F32 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {reply.recommendation}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4" style={{ color: '#D4A574' }}>
                  {reply.reason}
                </p>
                {reply.price && (
                  <div 
                    className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 mb-3 sm:mb-4"
                    style={{ 
                      background: 'linear-gradient(135deg, rgba(184, 115, 51, 0.3), rgba(205, 127, 50, 0.3))',
                      border: '2px solid rgba(184, 115, 51, 0.5)',
                      boxShadow: 'inset 0 1px 0 rgba(212, 165, 116, 0.3)',
                    }}
                  >
                    <span className="text-base sm:text-lg font-bold gradient-text" style={{ fontFamily: 'var(--font-heading)' }}>
                      ₹{reply.price}
                    </span>
                  </div>
                )}

                <button
                  onClick={handleOrderNow}
                  className="w-full py-2.5 sm:py-3 font-bold transition-all hover:scale-[1.02]"
                  style={{
                    background: 'linear-gradient(135deg, #B87333 0%, #CD7F32 50%, #D4A574 100%)',
                    color: '#000',
                    fontFamily: 'var(--font-heading)',
                    letterSpacing: '0.12em',
                    fontSize: '13px',
                    boxShadow: '0 10px 40px rgba(184, 115, 51, 0.5), inset 0 1px 0 rgba(212, 165, 116, 0.5)',
                  }}
                >
                  ORDER NOW
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------- Helpers ---------- */
function Section({ title, children, number }: any) {
  return (
    <div className="space-y-4 relative z-10">
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-8 h-8 flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, rgba(184, 115, 51, 0.2), rgba(205, 127, 50, 0.2))',
            border: '1px solid rgba(184, 115, 51, 0.4)',
            borderRadius: '4px',
          }}
        >
          <span 
            className="text-xs font-bold"
            style={{ color: '#B87333', fontFamily: 'var(--font-heading)' }}
          >
            {number}
          </span>
        </div>
        <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(184, 115, 51, 0.3), transparent)' }} />
        <p className="text-sm font-bold uppercase tracking-wider" style={{ color: '#D4A574', fontFamily: 'var(--font-heading)', letterSpacing: '0.1em' }}>
          {title}
        </p>
      </div>
      {children}
    </div>
  );
}

function PremiumChipGroup({ items, value, onChange, type }: any) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {items.map((item: string, index: number) => {
        // Subtle variations within copper/bronze/gold palette
        const intensity = (index % 3);
        const shades = [
          { bg: 'rgba(184, 115, 51, 0.15)', border: 'rgba(184, 115, 51, 0.4)', text: '#B87333', glow: 'rgba(184, 115, 51, 0.3)' },
          { bg: 'rgba(205, 127, 50, 0.15)', border: 'rgba(205, 127, 50, 0.4)', text: '#CD7F32', glow: 'rgba(205, 127, 50, 0.3)' },
          { bg: 'rgba(212, 165, 116, 0.15)', border: 'rgba(212, 165, 116, 0.4)', text: '#D4A574', glow: 'rgba(212, 165, 116, 0.3)' },
        ];
        const shade = shades[intensity];
        const isSelected = value === item;
        
        return (
          <motion.button
            key={item}
            onClick={() => onChange(item)}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide transition-all relative overflow-hidden"
            style={{
              background: isSelected 
                ? `linear-gradient(135deg, ${shade.bg}, rgba(61, 43, 31, 0.3))`
                : 'rgba(26, 17, 16, 0.6)',
              border: `1px solid ${isSelected ? shade.border : 'rgba(184, 115, 51, 0.2)'}`,
              color: isSelected ? shade.text : '#8B6F47',
              fontFamily: 'var(--font-heading)',
              letterSpacing: '0.08em',
              boxShadow: isSelected 
                ? `0 4px 20px ${shade.glow}, inset 0 1px 0 rgba(212, 165, 116, 0.2)` 
                : 'none',
            }}
          >
            {isSelected && (
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  background: `linear-gradient(135deg, ${shade.text}, transparent)`,
                }}
              />
            )}
            <span className="relative z-10">{labelize(item)}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
