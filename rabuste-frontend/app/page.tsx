"use client";

import Navbar from "@/components/Navbar";
import CinematicHero from "@/components/sections/CinematicHero";
import RobustaSuperioritySection from "@/components/sections/RobustaSuperioritySection";
import DiagonalProducts from "@/components/sections/DiagonalProducts";
import AboutSection from "@/components/sections/AboutSection";
import Gallery from "@/components/sections/Gallery";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/sections/footer";
import FloatingCart from "@/components/FloatingCart";
import BackgroundPattern from "@/components/BackgroundPattern";

export default function Home() {
  return (
    <>
      <Navbar />
      <FloatingCart />

      {/* Background Pattern */}
      <BackgroundPattern />

      {/* Noise overlay */}
      <div className="noise-overlay" />
      
      <main style={{ background: '#000000', position: 'relative', zIndex: 1 }}>
        {/* Hero */}
        <CinematicHero />

        {/* Robusta Superiority */}
        <RobustaSuperioritySection />

        {/* Featured Products */}
        <DiagonalProducts />

        {/* About Section */}
        <AboutSection />

        {/* Gallery Section */}
        <Gallery />

        {/* Contact Section */}
        <ContactSection />
      </main>

      {/* Footer - Single instance */}
      <Footer />
    </>
  );
}