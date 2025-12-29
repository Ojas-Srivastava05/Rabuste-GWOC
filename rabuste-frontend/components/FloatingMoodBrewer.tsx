
"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, X } from "lucide-react";
import MoodBrewerChat from "./MoodBrewerChat";
import Image from "next/image";

export default function FloatingMoodBrewer() {
  const [open, setOpen] = useState(false);
  const botRef = useRef<HTMLDivElement>(null);

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
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-50 bg-amber-400 p-4 rounded-full shadow-lg"
      >
        {/* <Coffee /> */}
        <Image src="/Rabuste logo.png" alt="bot logo" width={20} height={20}/>
      </button>

      {/* Bot Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-24 left-6 z-50 w-[360px] max-h-[70vh] flex flex-col"
            ref={botRef}
          >
            <div className="relative flex flex-col h-full bg-zinc-950 border border-zinc-800 rounded-2xl shadow-xl overflow-hidden">
              
              {/* Close Button */}
              <button
                onClick={() => setOpen(false)}
                className="absolute -top-3 -right-3 bg-zinc-800 p-1 rounded-full z-10"
              >
                <X className="w-4 h-4 text-white" />
              </button>

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
