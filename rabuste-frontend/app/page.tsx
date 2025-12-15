"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import SVGIntro from "@/components/SVGIntro";

export default function Home() {
  const [showIntro, setShowIntro] = useState(true); // Start with true
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if intro was already seen in this session
    try {
      const seen = sessionStorage.getItem("rabuste_intro_seen");
      if (seen) {
        setShowIntro(false);
      }
    } catch {
      // If sessionStorage fails, show intro anyway
    }
  }, []);

  const handleIntroFinish = () => {
    try {
      sessionStorage.setItem("rabuste_intro_seen", "true");
    } catch {
      // Ignore storage errors
    }
    setShowIntro(false);
  };

  // Don't render anything until mounted
  if (!mounted) {
    return null;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {showIntro && <SVGIntro onFinish={handleIntroFinish} />}
      </AnimatePresence>
      
      {!showIntro && (
        <div className="h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] text-white text-4xl">
          HOME PAGE CONTENT
        </div>
      )}
    </>
  );
}
