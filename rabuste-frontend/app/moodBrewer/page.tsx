"use client";

import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, Sparkles, Loader2 } from "lucide-react";

/* ---------- Hard-coded MENU META ---------- */
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

/* ---------- Types ---------- */
type Reply = {
  recommendation: string;
  reason: string;
  price?: number;
};

/* ---------- Helpers ---------- */
function labelize(value: string) {
  return value.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function Chat() {
  const [mood, setMood] = useState("");
  const [taste, setTaste] = useState("");
  const [time, setTime] = useState("evening");
  const [reply, setReply] = useState<Reply | null>(null);
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!mood || !taste) return;

    try {
      setLoading(true);
      setReply(null);

      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
        mood,
        taste,
        time,
        temperature: "cold",
        caffeine: "medium",
      });

      setReply(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 to-black px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-xl p-6 space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="flex justify-center">
            <Coffee className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">AI Coffee Barista</h1>
          <p className="text-sm text-zinc-400">
            Your perfect cup, intelligently brewed ☕
          </p>
        </div>

        {/* Mood */}
        <Section title="How are you feeling?">
          <ChipGroup items={MENU_META.moods} value={mood} onChange={setMood} />
        </Section>

        {/* Taste */}
        <Section title="Taste preference">
          <ChipGroup
            items={MENU_META.tastes}
            value={taste}
            onChange={setTaste}
          />
        </Section>

        {/* Time */}
        <Section title="Time of day">
          <div className="grid grid-cols-3 gap-2">
            {MENU_META.times.map((t) => (
              <button
                key={t}
                onClick={() => setTime(t)}
                className={`text-sm py-2 rounded-lg border transition ${
                  time === t
                    ? "bg-amber-400 text-black border-amber-400"
                    : "border-zinc-700 text-zinc-300 hover:border-zinc-500"
                }`}
              >
                {labelize(t)}
              </button>
            ))}
          </div>
        </Section>

        {/* Button */}
        <button
          onClick={send}
          disabled={loading || !mood || !taste}
          className="w-full bg-amber-400 text-black font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-amber-300 transition disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" />
              Brewing...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Ask Barista
            </>
          )}
        </button>

        {/* Response */}
        <AnimatePresence>
          {reply && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2"
            >
              <h3 className="text-lg font-semibold text-amber-400">
                ☕ {reply.recommendation}
              </h3>
              <p className="text-zinc-300 text-sm">{reply.reason}</p>
              {reply.price && (
                <p className="text-white font-medium">₹{reply.price}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/* ---------- Small Components ---------- */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-zinc-300">{title}</p>
      {children}
    </div>
  );
}

function ChipGroup({
  items,
  value,
  onChange,
}: {
  items: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <button
          key={item}
          onClick={() => onChange(item)}
          className={`px-3 py-1.5 rounded-full text-sm border transition ${
            value === item
              ? "bg-white text-black border-white"
              : "border-zinc-700 text-zinc-300 hover:border-zinc-500"
          }`}
        >
          {labelize(item)}
        </button>
      ))}
    </div>
  );
}
