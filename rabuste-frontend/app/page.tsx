"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import SVGIntro from "@/components/SVGIntro";
import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import Gallery from "@/components/sections/Gallery";
import Origin from "@/components/sections/Origin";
import Balatro from '@/components/bg';
import Menu from "@/components/sections/Menu";
import CoffeeComparison from "@/components/sections/CoffeeComparison";

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

          {/* Scroll-snap container */}
          <main
            id="snap-main-container" /* add id so IntersectionObservers can use this scroll root */
            style={{
              height: 'calc(100vh)',            // full viewport
              overflowY: 'auto',                // enable scrolling inside this container
              scrollSnapType: 'y mandatory',    // enable vertical snapping
              scrollBehavior: 'smooth',         // smooth snap transition
              WebkitOverflowScrolling: 'touch', // momentum scrolling on mobile
            }}
          >
            {/* each section wrapped so it snaps to viewport on scroll */}
            <div style={{ scrollSnapAlign: 'start', minHeight: '100vh' }}>
              <Hero />
            </div>

            <div style={{ scrollSnapAlign: 'start', minHeight: '100vh' }}>
              <Origin />
            </div>

            <div style={{ scrollSnapAlign: 'start', minHeight: '100vh' }}>
              <CoffeeComparison />
            </div>

            <div style={{ scrollSnapAlign: 'start', minHeight: '100vh' }}>
              <Menu />
            </div>

            <div style={{ scrollSnapAlign: 'start', minHeight: '100vh' }}>
              <Gallery />
            </div>
          </main>
        </>
      )}
    </>
  );
}