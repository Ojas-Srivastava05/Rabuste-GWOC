"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import HeroRevamped from "@/components/sections/HeroRevamped";
import SectionTracker from "@/components/SectionTracker";
import SEOContent from "@/components/SEOContent";
import { useUser } from "@/contexts/UserContext";
import ComparisonWheel from '@/components/ComparisonWheel';

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

        {/* Instagram Reel slot — rendering ComparisonWheel instead */}
        <SectionTracker sectionName="instagram_reel">
          <div className="relative overflow-hidden" style={{ isolation: 'isolate' }}>
            <div
              className="absolute inset-0 -z-10"
              style={{
                background: 'linear-gradient(180deg, #1A1110 0%, #000000 50%, #1A1110 100%)',
              }}
            />
            <div className="absolute inset-0 -z-[5] noise-overlay opacity-20" />

            <div className="container mx-auto px-4 py-20">
              <div className="text-center mb-16">
                <p
                  className="section-label mb-4"
                  style={{ color: '#B87333', fontFamily: 'var(--font-body)' }}
                >
                  BEAN COMPARISON
                </p>
                <h3
                  className="text-4xl md:text-6xl mb-4"
                  style={{
                    color: '#FFFEF9',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 400,
                    letterSpacing: '0.05em',
                    textShadow: '0 6px 22px rgba(0, 0, 0, 0.7)',
                    lineHeight: 0.95,
                  }}
                >
                  ARABICA VS ROBUSTA
                </h3>
                <div
                  className="w-20 h-1 mx-auto mb-5"
                  style={{
                    background: 'linear-gradient(90deg, transparent, #B87333, #CD7F32, #B87333, transparent)',
                  }}
                />
                <p
                  className="text-lg md:text-xl max-w-2xl mx-auto"
                  style={{
                    color: '#D4A574',
                    fontFamily: 'var(--font-body)',
                    lineHeight: 1.6,
                    textShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                  }}
                >
                  Explore the unique characteristics of each coffee bean variety. Click any sector to dive into detailed insights.
                </p>
              </div>
            </div>

              <div className="flex justify-center items-center min-h-[700px]">
                <ComparisonWheel size={600} />
              </div>

            <div className="mt-32 grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div
                className="brutal-card p-8"
                style={{
                  background: 'linear-gradient(135deg, rgba(232, 195, 158, 0.1), rgba(212, 165, 116, 0.05))',
                  border: '2px solid rgba(232, 195, 158, 0.3)',
                }}
              >
                <h3
                  className="text-2xl mb-4"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: '#E8C39E',
                    letterSpacing: '0.1em',
                  }}
                >
                  ARABICA BEANS
                </h3>
                <p
                  className="leading-relaxed"
                  style={{ color: '#F5F1E8', fontFamily: 'var(--font-body)' }}
                >
                  Known for their smooth, sweet flavor profile with delicate aromatic notes. 
                  Arabica beans are cultivated at higher altitudes and are prized for their 
                  refined taste and natural sweetness. Perfect for those who appreciate 
                  nuanced coffee experiences.
                </p>
              </div>

              <div
                className="brutal-card p-8"
                style={{
                  background: 'linear-gradient(135deg, rgba(42, 24, 16, 0.6), rgba(61, 43, 31, 0.4))',
                  border: '2px solid rgba(184, 115, 51, 0.4)',
                }}
              >
                <h3
                  className="text-2xl mb-4"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: '#B87333',
                    letterSpacing: '0.1em',
                  }}
                >
                  ROBUSTA BEANS
                </h3>
                <p
                  className="leading-relaxed"
                  style={{ color: '#F5F1E8', fontFamily: 'var(--font-body)' }}
                >
                  Robust and powerful with double the caffeine content. Robusta beans deliver 
                  a strong, earthy flavor with exceptional energy-boosting properties. Ideal 
                  for those seeking maximum performance, extended energy, and bold taste at 
                  an excellent value.
                </p>
              </div>
            </div>
          </div>
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