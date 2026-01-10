"use client";

import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroRevamped from "@/components/sections/HeroRevamped";
import HorizontalScroll from "@/components/sections/HorizontalScroll";
import ExperienceSection from "@/components/sections/ExperienceSection";
import BenefitsShowcase from "@/components/sections/BenefitsShowcase";
import VRExperienceSection from "@/components/sections/VRExperienceSection";
import ProcessSectionRevamped from "@/components/sections/ProcessSectionRevamped";
import CallToAction from "@/components/sections/CallToAction";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import InstagramShowcase from "@/components/sections/InstagramShowcase";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/sections/footer";
import FloatingCart from "@/components/FloatingCart";
import FloatingMoodBrewer from "@/components/FloatingMoodBrewer";
import WelcomePopup from "@/components/WelcomePopup";
import PersonalizedComboPopup from "@/components/PersonalizedComboPopup";
import SectionTracker from "@/components/SectionTracker";
import { useUser } from "@/contexts/UserContext";

export default function Home() {
  const { user, showWelcomePopup, setShowWelcomePopup } = useUser();

  // Ensure page starts at top on initial load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, []);

  return (
    <>
      <Navbar />
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
      
      {/* SEO: Hidden semantic content for search engines */}
      <div style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
        <h1>Premium Robusta Coffee Online - Buy Best Robusta Coffee Beans</h1>
        <p>Rabuste offers the finest Robusta coffee with 2x the caffeine. Shop premium Robusta coffee beans, ground Robusta coffee, and instant Robusta coffee online. Our Robusta coffee is sourced from the best coffee-growing regions and roasted to perfection. Experience bold, intense Robusta coffee flavor with every cup.</p>
        <h2>Why Choose Robusta Coffee?</h2>
        <p>Robusta coffee contains 2x the caffeine of Arabica coffee, making it perfect for those who need an extra energy boost. Robusta coffee beans are known for their strong, earthy flavor and higher caffeine content. Buy Robusta coffee online from Rabuste and enjoy the bold taste of premium Robusta coffee.</p>
        <h2>Best Robusta Coffee Online</h2>
        <p>Looking for the best Robusta coffee? Rabuste offers premium Robusta coffee beans, ground Robusta coffee, and instant Robusta coffee. All our Robusta coffee is carefully selected and roasted to bring out the bold, intense flavors that Robusta coffee is famous for. Order Robusta coffee online today and experience the difference.</p>
      </div>

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