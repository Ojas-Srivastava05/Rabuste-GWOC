"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, X, Brain, Zap, Cpu } from "lucide-react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div
      ref={containerRef}
      className="rounded-2xl p-6 space-y-6 relative flex flex-col overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(26, 17, 16, 0.95) 0%, rgba(42, 24, 16, 0.9) 100%)',
        border: '2px solid rgba(184, 115, 51, 0.4)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(184, 115, 51, 0.15)',
      }}
    >
      {/* Subtle Copper Glow - Top */}
      <div 
        className="absolute top-0 left-0 right-0 h-32 opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top, rgba(184, 115, 51, 0.4), transparent 70%)',
        }}
      />
      
      {/* Header */}
      <div className="text-center space-y-2 relative z-10">
        <div className="relative inline-block">
          {/* Metallic Glow */}
          <div 
            className="absolute inset-0 blur-2xl opacity-50"
            style={{
              background: 'radial-gradient(circle, #D4A574, #B87333)',
            }}
          />
          <Brain className="w-12 h-12 mx-auto relative" style={{ color: '#D4A574', strokeWidth: 1.5 }} />
        </div>
        <div>
          <h1 
            className="text-3xl font-bold mb-1" 
            style={{ 
              fontFamily: 'var(--font-heading)', 
              background: 'linear-gradient(135deg, #D4A574 0%, #CD7F32 50%, #B87333 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '0.1em',
              textShadow: '0 0 30px rgba(212, 165, 116, 0.3)',
            }}
          >
            BREW AI
          </h1>
          <div className="flex items-center justify-center gap-2">
            <Cpu size={12} style={{ color: '#B87333' }} />
            <p className="text-xs uppercase tracking-widest" style={{ color: '#B87333', fontWeight: 600 }}>
              Intelligent Brewing Assistant
            </p>
          </div>
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
        <div className="grid grid-cols-3 gap-2">
          {MENU_META.times.map((t) => (
            <button
              key={t}
              onClick={() => setTime(t)}
              className="py-3 text-xs font-bold uppercase tracking-wider transition-all hover:scale-105"
              style={{
                background: time === t 
                  ? 'linear-gradient(135deg, rgba(184, 115, 51, 0.3), rgba(205, 127, 50, 0.3))' 
                  : 'rgba(61, 43, 31, 0.4)',
                border: `2px solid ${time === t ? '#CD7F32' : 'rgba(184, 115, 51, 0.2)'}`,
                color: time === t ? '#D4A574' : '#8B6F47',
                fontFamily: 'var(--font-body)',
                boxShadow: time === t ? '0 0 20px rgba(205, 127, 50, 0.3), inset 0 1px 0 rgba(212, 165, 116, 0.2)' : 'none',
              }}
            >
              {labelize(t)}
            </button>
          ))}
        </div>
      </Section>

      {/* Ask Button */}
      <div className="mt-4 relative">
        <button
          onClick={send}
          disabled={loading || !mood || !taste}
          className="w-full py-4 font-bold flex items-center justify-center gap-3 transition-all hover:scale-[1.02] relative overflow-hidden group"
          style={{
            background: loading || !mood || !taste 
              ? 'rgba(61, 43, 31, 0.5)' 
              : 'linear-gradient(135deg, #B87333 0%, #CD7F32 50%, #D4A574 100%)',
            color: loading || !mood || !taste ? '#8B6F47' : '#000',
            fontFamily: 'var(--font-heading)',
            letterSpacing: '0.15em',
            boxShadow: loading || !mood || !taste 
              ? 'none' 
              : '0 15px 50px rgba(184, 115, 51, 0.6), inset 0 1px 0 rgba(212, 165, 116, 0.5)',
            cursor: loading || !mood || !taste ? 'not-allowed' : 'pointer',
            fontSize: '15px',
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
        </button>

        {/* Popup Response */}
        <AnimatePresence>
          {reply && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="absolute bottom-16 left-1/2 -translate-x-1/2 w-[340px] p-6 shadow-lg z-50 overflow-hidden"
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
                onClick={closePopup}
                className="absolute top-3 right-3 p-1.5 transition-all hover:scale-110 z-10"
                style={{
                  background: 'rgba(184, 115, 51, 0.2)',
                  border: '1px solid rgba(184, 115, 51, 0.4)',
                }}
              >
                <X className="w-4 h-4" style={{ color: '#D4A574' }} />
              </button>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <Sparkles size={22} style={{ color: '#D4A574' }} fill="#D4A574" />
                  <h3 
                    className="text-xl font-bold"
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
                <p className="text-sm leading-relaxed mb-4" style={{ color: '#D4A574' }}>
                  {reply.reason}
                </p>
                {reply.price && (
                  <div 
                    className="inline-block px-4 py-2 mb-4"
                    style={{ 
                      background: 'linear-gradient(135deg, rgba(184, 115, 51, 0.3), rgba(205, 127, 50, 0.3))',
                      border: '2px solid rgba(184, 115, 51, 0.5)',
                      boxShadow: 'inset 0 1px 0 rgba(212, 165, 116, 0.3)',
                    }}
                  >
                    <span className="text-lg font-bold gradient-text" style={{ fontFamily: 'var(--font-heading)' }}>
                      ₹{reply.price}
                    </span>
                  </div>
                )}

                <button
                  onClick={() => router.push("/menu")}
                  className="w-full py-3 font-bold transition-all hover:scale-[1.02]"
                  style={{
                    background: 'linear-gradient(135deg, #B87333 0%, #CD7F32 50%, #D4A574 100%)',
                    color: '#000',
                    fontFamily: 'var(--font-heading)',
                    letterSpacing: '0.12em',
                    fontSize: '14px',
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
    <div className="space-y-3 relative z-10">
      <div className="flex items-center gap-3">
        <span 
          className="text-xs font-bold opacity-40"
          style={{ color: '#B87333', fontFamily: 'var(--font-heading)' }}
        >
          {number}
        </span>
        <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(184, 115, 51, 0.3), transparent)' }} />
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#D4A574', fontFamily: 'var(--font-body)' }}>
          {title}
        </p>
      </div>
      {children}
    </div>
  );
}

function PremiumChipGroup({ items, value, onChange, type }: any) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item: string, index: number) => {
        // Subtle variations within copper/bronze/gold palette
        const intensity = (index % 3);
        const shades = [
          { bg: 'rgba(184, 115, 51, 0.15)', border: 'rgba(184, 115, 51, 0.3)', text: '#B87333', glow: 'rgba(184, 115, 51, 0.2)' },
          { bg: 'rgba(205, 127, 50, 0.15)', border: 'rgba(205, 127, 50, 0.3)', text: '#CD7F32', glow: 'rgba(205, 127, 50, 0.2)' },
          { bg: 'rgba(212, 165, 116, 0.15)', border: 'rgba(212, 165, 116, 0.3)', text: '#D4A574', glow: 'rgba(212, 165, 116, 0.2)' },
        ];
        const shade = shades[intensity];
        
        return (
          <button
            key={item}
            onClick={() => onChange(item)}
            className="px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-all hover:scale-105"
            style={{
              background: value === item 
                ? `linear-gradient(135deg, ${shade.bg}, rgba(61, 43, 31, 0.3))`
                : 'rgba(61, 43, 31, 0.4)',
              border: `1.5px solid ${value === item ? shade.border : 'rgba(184, 115, 51, 0.2)'}`,
              color: value === item ? shade.text : '#8B6F47',
              fontFamily: 'var(--font-body)',
              boxShadow: value === item 
                ? `0 0 20px ${shade.glow}, inset 0 1px 0 rgba(212, 165, 116, 0.2)` 
                : 'none',
            }}
          >
            {labelize(item)}
          </button>
        );
      })}
    </div>
  );
}
