"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroRevamped from "@/components/sections/HeroRevamped";
import SectionTracker from "@/components/SectionTracker";
import SEOContent from "@/components/SEOContent";
import { useUser } from "@/contexts/UserContext";
import ComparisonWheel from '@/components/ComparisonWheel';
import LazySection from "@/components/LazySection";

// Lazy load below-the-fold components for better initial load performance
const DynamicBackground = dynamic(() => import("@/components/DynamicBackground"), {
  loading: () => null,
});
const FloatingCart = dynamic(() => import("@/components/FloatingCart"), {
  loading: () => null,
});
const FloatingMoodBrewer = dynamic(() => import("@/components/FloatingMoodBrewer"), {
  loading: () => null,
});
const WelcomePopup = dynamic(() => import("@/components/WelcomePopup"), {
  loading: () => null,
});
const PersonalizedComboPopup = dynamic(() => import("@/components/PersonalizedComboPopup"), {
  loading: () => null,
});

const HorizontalScroll = dynamic(() => import("@/components/sections/HorizontalScroll"), {
  loading: () => <div style={{ minHeight: '100vh' }} />,
});
const ExperienceSection = dynamic(() => import("@/components/sections/ExperienceSection"), {
  loading: () => <div style={{ minHeight: '50vh' }} />,
});
const BenefitsShowcase = dynamic(() => import("@/components/sections/BenefitsShowcase"), {
  loading: () => <div style={{ minHeight: '50vh' }} />,
});
// ComparisonWheel is imported statically above to avoid dynamic HMR issues
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
        <LazySection fallback={<div style={{ minHeight: '100vh', background: '#000000' }} />}>
          <SectionTracker sectionName="horizontal_scroll">
            <HorizontalScroll />
          </SectionTracker>
        </LazySection>

        {/* Experience - What We Offer */}
        <LazySection fallback={<div style={{ minHeight: '50vh', background: '#000000' }} />}>
          <SectionTracker sectionName="experience">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <ExperienceSection />
            </motion.div>
          </SectionTracker>
        </LazySection>

        {/* Benefits - Science Backed Power */}
        <LazySection fallback={<div style={{ minHeight: '50vh', background: '#000000' }} />}>
          <SectionTracker sectionName="benefits">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
              <BenefitsShowcase />
            </motion.div>
          </SectionTracker>
        </LazySection>

        {/* Instagram Reel slot — rendering ComparisonWheel instead */}
        <SectionTracker sectionName="instagram_reel">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-6xl mx-auto px-6 py-12"
          >
            <motion.h3
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center text-3xl md:text-4xl mb-6"
              style={{ color: '#F5F1E8', fontFamily: 'var(--font-heading)', fontWeight: 500 }}
            >
              Latest Reel & Interactive Comparison
            </motion.h3>
            <ComparisonWheel showInfo={false} />
          </motion.div>
        </SectionTracker>

        {/* VR/AR Experience - Virtual Exploration */}
        <LazySection fallback={<div style={{ minHeight: '50vh', background: '#000000' }} />}>
          <SectionTracker sectionName="vr_experience">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <VRExperienceSection />
            </motion.div>
          </SectionTracker>
        </LazySection>

        {/* Process - Bean to Cup Journey (Revamped) */}
        <LazySection fallback={<div style={{ minHeight: '50vh', background: '#000000' }} />}>
          <SectionTracker sectionName="process">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <ProcessSectionRevamped />
            </motion.div>
          </SectionTracker>
        </LazySection>

        {/* Strong CTA Section - Visit Us */}
        <LazySection fallback={<div style={{ minHeight: '50vh', background: '#000000' }} />}>
          <SectionTracker sectionName="call_to_action">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <CallToAction />
            </motion.div>
          </SectionTracker>
        </LazySection>

        {/* Social Proof - Customer Testimonials */}
        <LazySection fallback={<div style={{ minHeight: '50vh', background: '#000000' }} />}>
          <SectionTracker sectionName="testimonials">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <TestimonialsSection />
            </motion.div>
          </SectionTracker>
        </LazySection>

        {/* Instagram Showcase */}
        <LazySection fallback={<div style={{ minHeight: '50vh', background: '#000000' }} />}>
          <SectionTracker sectionName="instagram_showcase">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            >
              <InstagramShowcase />
            </motion.div>
          </SectionTracker>
        </LazySection>

        {/* Contact Section - Get in Touch */}
        <LazySection fallback={<div style={{ minHeight: '50vh', background: '#000000' }} />}>
          <SectionTracker sectionName="contact">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <ContactSection />
            </motion.div>
          </SectionTracker>
        </LazySection>
      </main>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Footer />
      </motion.div>
    </>
  );
}