"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import SVGIntro from "@/components/SVGIntro";
import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero"
import Gallery from "@/components/sections/Gallery";
import Origin from "@/components/sections/Origin";
import Balatro from '@/components/bg';

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
    {/*Background Effect*/}
    {!showIntro && (
      <div className="fixed inset-0 -z-10">
        <Balatro
        isRotate={false}
        mouseInteraction={true}
        pixelFilter={700}
        />
        </div>

    )}
      <AnimatePresence mode="wait">
        {showIntro && <SVGIntro onFinish={handleIntroFinish} />}
      </AnimatePresence>

      {!showIntro && (
        <>
          <Navbar />
          <main>
            <Hero />
            <Origin />
            <Gallery />
          </main>
        </>
      )}
    </>
  );
}
