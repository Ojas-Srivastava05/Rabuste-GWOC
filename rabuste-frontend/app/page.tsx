"use client";

import { useEffect, useState } from "react";
import PremiumIntro2D from "@/components/PremiumIntro2D";
import { AnimatePresence } from "framer-motion";
import SimpleIntro from "@/components/SimpleIntro";
import FinalIntro from "@/components/FinalIntro";
import SVGIntro from "@/components/SVGIntro";

export default function Home() {
  const [showIntro, setShowIntro] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const seen = sessionStorage.getItem("rabuste_intro_seen");
      if (!seen) {
        setShowIntro(true);
        sessionStorage.setItem("rabuste_intro_seen", "true");
      } else {
        setIsReady(true);
      }
    } catch {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (!showIntro) {
      setIsReady(true);
    }
  }, [showIntro]);

  return (
    <>
      <AnimatePresence mode="wait">
        {showIntro && <SVGIntro onFinish={() => setShowIntro(false)} />}
      </AnimatePresence>
      
      {isReady && (
        <div className="h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] text-white text-4xl">
          HOME PAGE CONTENT
        </div>
      )}
    </>
  );
}
