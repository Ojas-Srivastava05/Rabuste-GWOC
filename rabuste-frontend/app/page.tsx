"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import SVGIntro from "@/components/SVGIntro";
import RabusteHero from "@/components/sections/RabusteHero";
import WhatIsRobusta from "@/components/sections/WhatIsRobusta";
import RobustaOrigin from "@/components/sections/RobustaOrigin";

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
        <main>
          <RabusteHero />
          <WhatIsRobusta />
          <RobustaOrigin />
        </main>
      )}
    </>
  );
}
