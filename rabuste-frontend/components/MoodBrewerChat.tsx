"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, Sparkles, Loader2, X } from "lucide-react";
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
      className="bg-zinc-950 border border-zinc-800 rounded-2xl shadow-xl p-6 space-y-6 relative flex flex-col"
    >
      {/* Header */}
      <div className="text-center space-y-1">
        <Coffee className="w-8 h-8 mx-auto text-amber-400" />
        <h1 className="text-xl font-bold text-white">Brew AI</h1>
        <p className="text-sm text-zinc-400">
          Perfect cup, intelligently brewed
        </p>
      </div>

      {/* Mood */}
      <Section title="How are you feeling?">
        <ChipGroup items={MENU_META.moods} value={mood} onChange={setMood} />
      </Section>

      {/* Taste */}
      <Section title="Taste preference">
        <ChipGroup items={MENU_META.tastes} value={taste} onChange={setTaste} />
      </Section>

      {/* Time */}
      <Section title="Time of day">
        <div className="grid grid-cols-3 gap-2">
          {MENU_META.times.map((t) => (
            <button
              key={t}
              onClick={() => setTime(t)}
              className={`py-2 text-sm rounded-lg border ${
                time === t
                  ? "bg-amber-400 text-black border-amber-400"
                  : "border-zinc-700 text-zinc-300"
              }`}
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
          className="w-full bg-amber-400 text-black py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="animate-spin w-5 h-5" />
          ) : (
            <Sparkles className="w-5 h-5" />
          )}
          {loading ? "Brewing..." : "Ask Brew AI"}
        </button>

        {/* Popup Response */}
        <AnimatePresence>
          {reply && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="absolute bottom-16 left-1/2 -translate-x-1/2 w-[320px] bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-lg z-50"
            >
              {/* Close Button */}
              <button
                onClick={closePopup}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-zinc-800"
              >
                <X className="w-4 h-4 text-white" />
              </button>

              <h3 className="text-lg font-semibold text-amber-400">
                ☕ {reply.recommendation}
              </h3>
              <p className="text-zinc-300 text-sm mt-1">{reply.reason}</p>
              {reply.price && (
                <p className="text-white font-medium mt-1">₹{reply.price}</p>
              )}

              <button
                onClick={() => router.push("/menu")}
                className="mt-3 w-full bg-amber-400 text-black py-2 rounded-lg font-semibold hover:bg-amber-300 transition"
              >
                Order Now
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------- Helpers ---------- */
function Section({ title, children }: any) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-zinc-300">{title}</p>
      {children}
    </div>
  );
}

function ChipGroup({ items, value, onChange }: any) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item: string) => (
        <button
          key={item}
          onClick={() => onChange(item)}
          className={`px-3 py-1.5 rounded-full text-sm border ${
            value === item
              ? "bg-white text-black"
              : "border-zinc-700 text-zinc-300"
          }`}
        >
          {labelize(item)}
        </button>
      ))}
    </div>
  );
}
