"use client";

import Navbar from "@/components/Navbar";
import HeroRevamped from "@/components/sections/HeroRevamped";
import HorizontalScroll from "@/components/sections/HorizontalScroll";
import BenefitsShowcase from "@/components/sections/BenefitsShowcase";
import CallToAction from "@/components/sections/CallToAction";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
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
      
      {/* Premium copper accent line */}
      <div 
        className="fixed top-0 left-0 right-0 h-1 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, #B87333, #CD7F32, #D4A574, #CD7F32, #B87333, transparent)',
          zIndex: 100,
          boxShadow: '0 0 20px rgba(184, 115, 51, 0.5)',
        }}
      />
      
      <main style={{ background: '#000000', position: 'relative', zIndex: 2 }}>
        {/* Hero - Bold & Massive with Animations */}
        <HeroRevamped />

        {/* Horizontal Scroll Section - UNIQUE EXPERIENCE */}
        <HorizontalScroll />

        {/* Benefits - Parallax */}
        <BenefitsShowcase />

        {/* Strong CTA Section */}
        <CallToAction />

        {/* Social Proof - Fully Responsive */}
        <TestimonialsSection />

        {/* Contact Section - Fully Responsive */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}