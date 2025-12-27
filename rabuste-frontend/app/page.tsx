"use client";

import Navbar from "@/components/Navbar";
import CinematicHero from "@/components/sections/CinematicHero";
import BenefitsShowcase from "@/components/sections/BenefitsShowcase";
import ComparisonSection from "@/components/sections/ComparisonSection";
import DiagonalProducts from "@/components/sections/DiagonalProducts";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/sections/footer";
import FloatingCart from "@/components/FloatingCart";
import DynamicBackground from "@/components/DynamicBackground";

export default function Home() {
  return (
    <>
      <Navbar />
      <FloatingCart />

      {/* Dynamic animated background */}
      <DynamicBackground />

      {/* Noise overlay */}
      <div className="noise-overlay" />
      
      {/* Signature copper accent line */}
      <div 
        className="fixed top-0 left-0 right-0 h-1 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, #B87333, #CD7F32, #D4A574, #CD7F32, #B87333, transparent)',
          zIndex: 100,
          boxShadow: '0 0 20px rgba(184, 115, 51, 0.5)',
        }}
      />
      
      <main style={{ background: 'transparent', position: 'relative', zIndex: 2 }}>
        {/* Hero */}
        <CinematicHero />

        {/* Benefits - conversion focused */}
        <BenefitsShowcase />

        {/* Comparison - data driven */}
        <ComparisonSection />

        {/* Featured Products */}
        <DiagonalProducts />

        {/* Social Proof */}
        <TestimonialsSection />

        {/* Contact Section */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}