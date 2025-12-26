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
      
      <main style={{ background: 'transparent', position: 'relative', zIndex: 1 }}>
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