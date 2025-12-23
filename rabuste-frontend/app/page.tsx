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
import VRGallery from "@/components/sections/VR";
import Footer from "@/components/sections/footer"; // corrected casing to match the actual file name

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
            id="snap-main-container"
            style={{
              height: '100vh',               // required for consistent snap behavior
              overflowY: 'auto',
              scrollSnapType: 'y mandatory',
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch',
              paddingBottom: '40px'
            }}
          >
            {/* each section must match the snap container height */}
            <div style={{ scrollSnapAlign: 'start', height: '100vh' }}>
              <Hero />
            </div>

            <div style={{ scrollSnapAlign: 'start', height: '100vh' }}>
              <Origin />
            </div>

            <div style={{ scrollSnapAlign: 'start', height: '100vh' }}>
              <CoffeeComparison />
            </div>

            <div style={{ scrollSnapAlign: 'start', height: '100vh' }}>
              <VRGallery />
            </div>

            <div style={{ scrollSnapAlign: 'start', height: '100vh' }}>
              <Menu />
            </div>

            {/* Gallery needs internal scrolling but must keep the direct child at 100vh for snapping */}
            <div style={{ scrollSnapAlign: 'start', height: '100vh', display: 'flex', flexDirection: 'column' }}>
              {/* inner area can scroll while outer snap behavior remains intact */}
              <div style={{ flex: '1 1 auto', overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <Gallery />
              </div>
            </div>

            {/* footer should size to its content so it appears at the bottom of the page */}
            <div style={{ scrollSnapAlign: 'start', minHeight: 'auto', paddingTop: '20px' }}>
              <Footer />
            </div>
          </main>
        </>
      )}
    </>
  );
}