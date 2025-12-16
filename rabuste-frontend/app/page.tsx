"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import SVGIntro from "@/components/SVGIntro";

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const seen = sessionStorage.getItem("rabuste_intro_seen");
      if (seen) setShowIntro(false);
    } catch {
      // ignore storage errors
    }
  }, []);

  const handleIntroFinish = () => {
    try {
      sessionStorage.setItem("rabuste_intro_seen", "true");
    } catch {
      // ignore storage errors
    }
    setShowIntro(false);
  };

  if (!mounted) return null;

  return (
    <>
      <AnimatePresence mode="wait">
        {showIntro && <SVGIntro onFinish={handleIntroFinish} />}
      </AnimatePresence>

      {!showIntro && (
        <main className="min-h-screen bg-[#fffbd6] flex items-center justify-center">
          <section className="max-w-2xl px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-medium text-[#4a2825] mb-6">
              What Are Robusta Beans?
            </h1>

            <p className="text-lg leading-relaxed text-[#4a2825]">
              Robusta coffee beans are known for their bold character, higher caffeine
              content, and deep, earthy flavor. Grown at lower altitudes and naturally
              resilient, Robusta delivers intensity, strength, and a crema-rich cup.
            </p>
          </section>
        </main>
      )}
    </>
  );
}
