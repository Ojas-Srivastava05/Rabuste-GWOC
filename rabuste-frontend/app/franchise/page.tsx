"use client";

import React, { useState } from 'react';
import { FileText, Building2, MapPin, User, Mail, Phone, IndianRupee, Users, ArrowRight, CheckCircle2, Zap, Shield, Target } from 'lucide-react';
import Navbar from "@/components/Navbar";
import DynamicBackground from "@/components/DynamicBackground";
import Footer from "@/components/sections/footer";

export default function FranchisePage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    organizationName: '',
    organizationType: 'individual',
    city: '',
    state: '',
    preferredLocation: '',
    investmentCapacity: '',
    experience: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const response = await fetch(`${apiUrl}/api/franchise/enquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Thank you! Your franchise enquiry has been submitted successfully. Our team will contact you within 2-3 business days.'
        });
        
        setTimeout(() => {
          setFormData({
            fullName: '',
            email: '',
            phone: '',
            organizationName: '',
            organizationType: 'individual',
            city: '',
            state: '',
            preferredLocation: '',
            investmentCapacity: '',
            experience: '',
            message: ''
          });
          setSubmitStatus({ type: '', message: '' });
        }, 5000);
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Franchise submission error:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Failed to submit enquiry. Please try again or contact us directly.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openFranchisePDF = () => {
    window.open('/franchise-terms-conditions.pdf', '_blank');
  };

  return (
    <>
      <Navbar />
      <DynamicBackground />
      
      <div className="min-h-screen" style={{ backgroundColor: 'transparent' }}>

        {/* Hero Header */}
        <div className="relative pt-32 pb-20 px-6 overflow-hidden">
          <div className="max-w-6xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-4 mb-8">
              <div className="copper-line" />
              <span className="section-label">EXPANSION OPPORTUNITY</span>
              <div className="copper-line" style={{ transform: 'scaleX(-1)' }} />
            </div>
            
            <h1 
              className="text-6xl md:text-7xl lg:text-8xl mb-8"
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 400,
                lineHeight: 0.9,
              }}
            >
              <span style={{ color: '#FFFEF9' }}>BUILD AN</span>
              <br />
              <span className="gradient-copper">EMPIRE</span>
            </h1>
            
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-16" style={{ color: '#B87333', lineHeight: 1.7 }}>
              Partner with Rabuste Coffee. Dominate your market.
            </p>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { icon: <Target size={32} />, value: '50+', label: 'LOCATIONS' },
                { icon: <Zap size={32} />, value: '25%', label: 'AVERAGE ROI' },
                { icon: <Shield size={32} />, value: '100K+', label: 'DAILY CUPS' },
              ].map((stat, i) => (
                <div key={i} className="brutal-card p-8 group hover:scale-105 transition-transform">
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{
                      background: 'linear-gradient(135deg, rgba(184, 115, 51, 0.3), rgba(115, 54, 53, 0.3))',
                      border: '2px solid rgba(184, 115, 51, 0.4)',
                      color: '#B87333',
                    }}
                  >
                    {stat.icon}
                  </div>
                  <div className="text-5xl font-bold mb-2 gradient-copper" style={{ fontFamily: 'var(--font-heading)' }}>
                    {stat.value}
                  </div>
                  <div className="text-sm uppercase tracking-[0.2em]" style={{ color: '#8B6F47', fontFamily: 'var(--font-heading)' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Terms & Conditions Card */}
        <div className="max-w-7xl mx-auto px-6 pb-24">
          <div className="bg-gradient-to-br from-amber-950/20 via-zinc-900/60 to-zinc-950/60 backdrop-blur-xl border border-amber-900/30 rounded-3xl p-10 md:p-14 shadow-2xl">
            <div className="flex items-start gap-5 mb-10">
              <div className="bg-gradient-to-br from-amber-700 to-amber-900 p-5 rounded-2xl shadow-xl shadow-amber-900/40">
                <FileText className="w-9 h-9 text-white" />
              </div>
              <div>
                <h2 className="plantation-header text-4xl md:text-5xl mb-3" style={{ color: '#D4A574', textAlign: 'left' }}>
                  Franchise Overview
                </h2>
                <p className="text-zinc-300 text-lg">
                  Everything you need to know about partnering with Rabuste Coffee
                </p>
              </div>
            </div>

            {/* Key Highlights */}
            <div className="grid md:grid-cols-2 gap-8 mb-10">
              <div className="group bg-gradient-to-br from-zinc-900/90 to-zinc-950/90 border-2 border-amber-900/30 hover:border-amber-700/50 rounded-2xl p-8 transition-all duration-300 hover:shadow-xl hover:shadow-amber-900/30">
                <div className="flex items-center gap-4 mb-5">
                  <div className="bg-amber-900/30 p-3 rounded-xl group-hover:bg-amber-900/40 transition-colors">
                    <IndianRupee className="w-7 h-7 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-wide" style={{ color: '#D4A574', fontFamily: 'Montserrat, sans-serif' }}>
                    Investment Range
                  </h3>
                </div>
                <p className="text-3xl font-bold mb-3" style={{ color: '#D4A574', fontFamily: 'Montserrat, sans-serif' }}>
                  ₹25 - 50 Lakhs
                </p>
                <p className="text-zinc-400">Including setup, equipment, and initial inventory</p>
              </div>

              <div className="group bg-gradient-to-br from-zinc-900/90 to-zinc-950/90 border-2 border-amber-900/30 hover:border-amber-700/50 rounded-2xl p-8 transition-all duration-300 hover:shadow-xl hover:shadow-amber-900/30">
                <div className="flex items-center gap-4 mb-5">
                  <div className="bg-amber-900/30 p-3 rounded-xl group-hover:bg-amber-900/40 transition-colors">
                    <Building2 className="w-7 h-7 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-wide" style={{ color: '#D4A574', fontFamily: 'Montserrat, sans-serif' }}>
                    Space Requirements
                  </h3>
                </div>
                <p className="text-3xl font-bold mb-3" style={{ color: '#D4A574', fontFamily: 'Montserrat, sans-serif' }}>
                  800 - 1200 sq.ft
                </p>
                <p className="text-zinc-400">Prime location with high footfall preferred</p>
              </div>

              <div className="group bg-gradient-to-br from-zinc-900/90 to-zinc-950/90 border-2 border-amber-900/30 hover:border-amber-700/50 rounded-2xl p-8 transition-all duration-300 hover:shadow-xl hover:shadow-amber-900/30">
                <div className="flex items-center gap-4 mb-5">
                  <div className="bg-amber-900/30 p-3 rounded-xl group-hover:bg-amber-900/40 transition-colors">
                    <Users className="w-7 h-7 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-wide" style={{ color: '#D4A574', fontFamily: 'Montserrat, sans-serif' }}>
                    Training & Support
                  </h3>
                </div>
                <p className="text-3xl font-bold mb-3" style={{ color: '#D4A574', fontFamily: 'Montserrat, sans-serif' }}>
                  2-Week Program
                </p>
                <p className="text-zinc-400">Ongoing operational and marketing support</p>
              </div>

              <div className="group bg-gradient-to-br from-zinc-900/90 to-zinc-950/90 border-2 border-amber-900/30 hover:border-amber-700/50 rounded-2xl p-8 transition-all duration-300 hover:shadow-xl hover:shadow-amber-900/30">
                <div className="flex items-center gap-4 mb-5">
                  <div className="bg-amber-900/30 p-3 rounded-xl group-hover:bg-amber-900/40 transition-colors">
                    <CheckCircle2 className="w-7 h-7 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-wide" style={{ color: '#D4A574', fontFamily: 'Montserrat, sans-serif' }}>
                    Franchise Term
                  </h3>
                </div>
                <p className="text-3xl font-bold mb-3" style={{ color: '#D4A574', fontFamily: 'Montserrat, sans-serif' }}>
                  5 Years
                </p>
                <p className="text-zinc-400">Renewable with exclusive territory rights</p>
              </div>
            </div>

            {/* Benefits List */}
            <div className="bg-gradient-to-br from-amber-950/30 to-zinc-950/30 border-2 border-amber-900/30 rounded-2xl p-10 mb-10">
              <h3 className="plantation-header text-3xl mb-8" style={{ color: '#D4A574', textAlign: 'left' }}>
                What You Get
              </h3>
              <div className="grid md:grid-cols-2 gap-5">
                {[
                  'Proven business model with track record',
                  'Brand recognition & marketing support',
                  'Premium coffee supply chain access',
                  'Complete interior design assistance',
                  'Advanced POS & technology systems',
                  'Standardized recipes & quality control',
                  'Comprehensive staff training programs',
                  'Ongoing operational & business support'
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-zinc-200 group">
                    <CheckCircle2 className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <span className="leading-relaxed text-base">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={openFranchisePDF}
              className="w-full bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 hover:from-amber-600 hover:via-amber-500 hover:to-amber-600 text-white font-bold py-6 px-10 rounded-2xl transition-all duration-300 flex items-center justify-center gap-4 shadow-2xl shadow-amber-900/50 hover:shadow-amber-900/70 hover:scale-[1.02] group uppercase tracking-widest text-lg"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <FileText className="w-7 h-7 group-hover:rotate-12 transition-transform" />
              View Complete Terms & Conditions
              <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>

        {/* Franchise Enquiry Form */}
        <div className="max-w-6xl mx-auto px-6 pb-32">
          <div className="bg-gradient-to-br from-amber-950/20 via-zinc-900/60 to-zinc-950/60 backdrop-blur-xl border border-amber-900/30 rounded-3xl p-10 md:p-14 shadow-2xl">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-950/30 border border-amber-800/40 rounded-full mb-8">
                <Mail className="w-5 h-5 text-amber-600" />
                <span className="text-amber-600 text-sm font-bold tracking-widest uppercase" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Get Started
                </span>
              </div>
              
              <h2 className="plantation-header text-5xl md:text-6xl mb-6" style={{ color: '#D4A574' }}>
                Franchise Enquiry
              </h2>
              <p className="text-zinc-300 text-lg max-w-2xl mx-auto">
                Fill in your details and we'll get back to you within 2-3 business days
              </p>
            </div>

            <div className="space-y-10">
              {/* Personal Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-4 pb-5 border-b-2 border-amber-900/30">
                  <div className="bg-amber-900/30 p-3 rounded-xl">
                    <User className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="text-2xl font-bold uppercase tracking-wider" style={{ color: '#D4A574', fontFamily: 'Montserrat, sans-serif' }}>
                    Personal Information
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-zinc-300 mb-3 uppercase tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Full Name <span className="text-amber-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full bg-zinc-950/70 border-2 border-zinc-800 hover:border-amber-900/50 focus:border-amber-600 rounded-xl px-5 py-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-600/30 transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-zinc-300 mb-3 uppercase tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Email Address <span className="text-amber-600">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-zinc-950/70 border-2 border-zinc-800 hover:border-amber-900/50 focus:border-amber-600 rounded-xl px-5 py-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-600/30 transition-all"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-zinc-300 mb-3 uppercase tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Phone Number <span className="text-amber-600">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full bg-zinc-950/70 border-2 border-zinc-800 hover:border-amber-900/50 focus:border-amber-600 rounded-xl px-5 py-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-600/30 transition-all"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-zinc-300 mb-3 uppercase tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Applying As <span className="text-amber-600">*</span>
                    </label>
                    <select
                      name="organizationType"
                      value={formData.organizationType}
                      onChange={handleChange}
                      required
                      className="w-full bg-zinc-950/70 border-2 border-zinc-800 hover:border-amber-900/50 focus:border-amber-600 rounded-xl px-5 py-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-600/30 transition-all"
                    >
                      <option value="individual">Individual</option>
                      <option value="company">Company</option>
                      <option value="partnership">Partnership</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-zinc-300 mb-3 uppercase tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Organization/Company Name
                  </label>
                  <input
                    type="text"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleChange}
                    className="w-full bg-zinc-950/70 border-2 border-zinc-800 hover:border-amber-900/50 focus:border-amber-600 rounded-xl px-5 py-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-600/30 transition-all"
                    placeholder="If applicable"
                  />
                </div>
              </div>

              {/* Location Details */}
              <div className="space-y-6 pt-10 border-t-2 border-amber-900/30">
                <div className="flex items-center gap-4 pb-5 border-b-2 border-amber-900/30">
                  <div className="bg-amber-900/30 p-3 rounded-xl">
                    <MapPin className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="text-2xl font-bold uppercase tracking-wider" style={{ color: '#D4A574', fontFamily: 'Montserrat, sans-serif' }}>
                    Location Details
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-zinc-300 mb-3 uppercase tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      City <span className="text-amber-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full bg-zinc-950/70 border-2 border-zinc-800 hover:border-amber-900/50 focus:border-amber-600 rounded-xl px-5 py-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-600/30 transition-all"
                      placeholder="Enter city"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-zinc-300 mb-3 uppercase tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      State <span className="text-amber-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="w-full bg-zinc-950/70 border-2 border-zinc-800 hover:border-amber-900/50 focus:border-amber-600 rounded-xl px-5 py-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-600/30 transition-all"
                      placeholder="Enter state"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-zinc-300 mb-3 uppercase tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Preferred Location/Area <span className="text-amber-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="preferredLocation"
                    value={formData.preferredLocation}
                    onChange={handleChange}
                    required
                    className="w-full bg-zinc-950/70 border-2 border-zinc-800 hover:border-amber-900/50 focus:border-amber-600 rounded-xl px-5 py-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-600/30 transition-all"
                    placeholder="e.g., MG Road, Indiranagar, etc."
                  />
                </div>
              </div>

              {/* Business Details */}
              <div className="space-y-6 pt-10 border-t-2 border-amber-900/30">
                <div className="flex items-center gap-4 pb-5 border-b-2 border-amber-900/30">
                  <div className="bg-amber-900/30 p-3 rounded-xl">
                    <Building2 className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="text-2xl font-bold uppercase tracking-wider" style={{ color: '#D4A574', fontFamily: 'Montserrat, sans-serif' }}>
                    Business Details
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-zinc-300 mb-3 uppercase tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Investment Capacity <span className="text-amber-600">*</span>
                    </label>
                    <select
                      name="investmentCapacity"
                      value={formData.investmentCapacity}
                      onChange={handleChange}
                      required
                      className="w-full bg-zinc-950/70 border-2 border-zinc-800 hover:border-amber-900/50 focus:border-amber-600 rounded-xl px-5 py-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-600/30 transition-all"
                    >
                      <option value="">Select range</option>
                      <option value="25-35">₹25 - 35 Lakhs</option>
                      <option value="35-45">₹35 - 45 Lakhs</option>
                      <option value="45+">₹45+ Lakhs</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-zinc-300 mb-3 uppercase tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Previous Business Experience
                    </label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="w-full bg-zinc-950/70 border-2 border-zinc-800 hover:border-amber-900/50 focus:border-amber-600 rounded-xl px-5 py-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-600/30 transition-all"
                    >
                      <option value="">Select experience</option>
                      <option value="none">No prior experience</option>
                      <option value="retail">Retail/F&B</option>
                      <option value="hospitality">Hospitality</option>
                      <option value="other">Other business</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-zinc-300 mb-3 uppercase tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Additional Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full bg-zinc-950/70 border-2 border-zinc-800 hover:border-amber-900/50 focus:border-amber-600 rounded-xl px-5 py-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-600/30 transition-all resize-none"
                    placeholder="Tell us more about your franchise plans and why you'd like to partner with Rabuste Coffee..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-10">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 hover:from-amber-600 hover:via-amber-500 hover:to-amber-600 disabled:from-zinc-700 disabled:to-zinc-700 disabled:cursor-not-allowed text-white font-bold py-6 px-10 rounded-2xl transition-all duration-300 flex items-center justify-center gap-4 shadow-2xl shadow-amber-900/50 hover:shadow-amber-900/70 hover:scale-[1.02] disabled:hover:scale-100 group uppercase tracking-widest text-lg"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-7 h-7 border-3 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting Your Enquiry...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-7 h-7 group-hover:scale-110 transition-transform" />
                      <span>Submit Franchise Enquiry</span>
                    </>
                  )}
                </button>

                {/* Success/Error Message - Below Submit Button */}
                {submitStatus.message && (
                  <div className={`mt-8 p-6 rounded-2xl border-2 ${
                    submitStatus.type === 'success' 
                      ? 'bg-gradient-to-br from-green-950/60 to-green-900/40 border-green-700/60 shadow-xl shadow-green-900/30' 
                      : 'bg-gradient-to-br from-red-950/60 to-red-900/40 border-red-700/60 shadow-xl shadow-red-900/30'
                  } animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                    <div className="flex items-start gap-4">
                      <CheckCircle2 className={`w-7 h-7 flex-shrink-0 mt-0.5 ${
                        submitStatus.type === 'success' ? 'text-green-400' : 'text-red-400'
                      }`} />
                      <div>
                        <p className={`font-bold text-xl mb-2 uppercase tracking-wide ${
                          submitStatus.type === 'success' ? 'text-green-300' : 'text-red-300'
                        }`} style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          {submitStatus.type === 'success' ? 'Enquiry Submitted!' : 'Submission Failed'}
                        </p>
                        <p className={`text-base ${submitStatus.type === 'success' ? 'text-green-200' : 'text-red-200'}`}>
                          {submitStatus.message}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <p className="text-sm text-zinc-500 text-center pt-6 leading-relaxed">
                By submitting this form, you agree to our privacy policy and terms of service.
                <br />
                We respect your privacy and will never share your information.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}