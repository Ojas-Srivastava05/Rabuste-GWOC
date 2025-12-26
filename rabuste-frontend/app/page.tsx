"use client";

import Navbar from "@/components/Navbar";
import CinematicHero from "@/components/sections/CinematicHero";
import DiagonalProducts from "@/components/sections/DiagonalProducts";
import AboutSection from "@/components/sections/AboutSection";
import ArtisanExperience from "@/components/sections/ArtisanExperience";
import Gallery from "@/components/sections/Gallery";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/sections/footer";
import FloatingCart from "@/components/FloatingCart";

export default function Home() {
  return (
    <>
      <Navbar />
      <FloatingCart />

      {/* Noise overlay */}
      <div className="noise-overlay" />
      
      <main style={{ background: '#0A0A0A' }}>
        {/* Hero */}
        <CinematicHero />

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