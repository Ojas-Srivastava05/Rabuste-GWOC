"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import DynamicBackground from "@/components/DynamicBackground";
import HeroRevamped from "@/components/sections/HeroRevamped";
import FloatingCart from "@/components/FloatingCart";
import FloatingMoodBrewer from "@/components/FloatingMoodBrewer";
import WelcomePopup from "@/components/WelcomePopup";
import PersonalizedComboPopup from "@/components/PersonalizedComboPopup";
import SectionTracker from "@/components/SectionTracker";
import SEOContent from "@/components/SEOContent";
import { useUser } from "@/contexts/UserContext";

// Lazy load below-the-fold components for better initial load performance
const HorizontalScroll = dynamic(() => import("@/components/sections/HorizontalScroll"), {
  loading: () => <div style={{ minHeight: '100vh' }} />,
});
const ExperienceSection = dynamic(() => import("@/components/sections/ExperienceSection"), {
  loading: () => <div style={{ minHeight: '50vh' }} />,
});
const BenefitsShowcase = dynamic(() => import("@/components/sections/BenefitsShowcase"), {
  loading: () => <div style={{ minHeight: '50vh' }} />,
});
const InstagramReelWithComparison = dynamic(() => import("@/components/sections/InstagramReelWithComparison"), {
  loading: () => <div style={{ minHeight: '50vh' }} />,
});
const VRExperienceSection = dynamic(() => import("@/components/sections/VRExperienceSection"), {
  loading: () => <div style={{ minHeight: '50vh' }} />,
});
const ProcessSectionRevamped = dynamic(() => import("@/components/sections/ProcessSectionRevamped"), {
  loading: () => <div style={{ minHeight: '50vh' }} />,
});
const CallToAction = dynamic(() => import("@/components/sections/CallToAction"), {
  loading: () => <div style={{ minHeight: '50vh' }} />,
});
const TestimonialsSection = dynamic(() => import("@/components/sections/TestimonialsSection"), {
  loading: () => <div style={{ minHeight: '50vh' }} />,
});
const InstagramShowcase = dynamic(() => import("@/components/sections/InstagramShowcase"), {
  loading: () => <div style={{ minHeight: '50vh' }} />,
});
const ContactSection = dynamic(() => import("@/components/sections/ContactSection"), {
  loading: () => <div style={{ minHeight: '50vh' }} />,
});
const Footer = dynamic(() => import("@/components/sections/footer"), {
  loading: () => <div style={{ minHeight: '200px' }} />,
});

export default function Home() {
  const { user, showWelcomePopup, setShowWelcomePopup } = useUser();

  // Ensure page starts at top on initial load (client-only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'auto' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      });
    }
  }, []);

  return (
    <>
      <Navbar />
      <DynamicBackground />
      <FloatingCart />
      <FloatingMoodBrewer />

      {/* Welcome Popup - Only shows after direct login (path 1) */}
      {showWelcomePopup && user && (
        <WelcomePopup
          userName={user.name}
          onClose={() => setShowWelcomePopup(false)}
        />
      )}

      {/* Personalized Combo Popup - Always visible at bottom-right */}
      <PersonalizedComboPopup
        userName={user?.name}
        isLoggedIn={!!user}
      />

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
      
      {/* SEO: Hidden semantic content for search engines - Client only */}
      <SEOContent />

      <main style={{ background: 'transparent', position: 'relative', zIndex: 2 }}>
        {/* Hero - Bold & Massive with Animations */}
        <SectionTracker sectionName="hero">
          <HeroRevamped />
        </SectionTracker>

        {/* Horizontal Scroll Section - UNIQUE EXPERIENCE */}
        <SectionTracker sectionName="horizontal_scroll">
          <HorizontalScroll />
        </SectionTracker>

        {/* Experience - What We Offer */}
        <SectionTracker sectionName="experience">
          <ExperienceSection />
        </SectionTracker>

        {/* Benefits - Science Backed Power */}
        <SectionTracker sectionName="benefits">
          <BenefitsShowcase />
        </SectionTracker>

        {/* Instagram Reel with Comparison - Latest Content */}
        <SectionTracker sectionName="instagram_reel">
          <InstagramReelWithComparison />
        </SectionTracker>

        {/* VR/AR Experience - Virtual Exploration */}
        <SectionTracker sectionName="vr_experience">
          <VRExperienceSection />
        </SectionTracker>

        {/* Process - Bean to Cup Journey (Revamped) */}
        <SectionTracker sectionName="process">
          <ProcessSectionRevamped />
        </SectionTracker>

        {/* Strong CTA Section - Visit Us */}
        <SectionTracker sectionName="call_to_action">
          <CallToAction />
        </SectionTracker>

        {/* Social Proof - Customer Testimonials */}
        <SectionTracker sectionName="testimonials">
          <TestimonialsSection />
        </SectionTracker>

        {/* Instagram Showcase */}
        <SectionTracker sectionName="instagram_showcase">
          <InstagramShowcase />
        </SectionTracker>

        {/* Contact Section - Get in Touch */}
        <SectionTracker sectionName="contact">
          <ContactSection />
        </SectionTracker>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}