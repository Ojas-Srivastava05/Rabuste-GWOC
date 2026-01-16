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
      const response = await fetch("/api/franchise", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Submission failed");
      }

      setSubmitStatus({
        type: "success",
        message: data.message,
      });

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

    } catch (error: any) {
      setSubmitStatus({
        type: "error",
        message: error.message || "Failed to submit enquiry",
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
      
      <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #1A1110 0%, #000000 50%, #1A1110 100%)' }}>

        {/* Hero Header */}
        <div className="relative pt-40 pb-20 px-6 overflow-hidden">
          <div className="max-w-6xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-4 mb-8">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#B87333]" />
              <span className="text-xs uppercase tracking-[0.3em]" style={{ color: '#B87333', fontFamily: 'var(--font-body)' }}>
                EXPANSION OPPORTUNITY
              </span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#B87333]" />
            </div>
            
            <h1 
              className="text-6xl md:text-7xl lg:text-8xl mb-8"
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 400,
                lineHeight: 0.9,
                letterSpacing: '0.05em',
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
          <div className="backdrop-blur-xl rounded-3xl p-10 md:p-14 shadow-2xl" style={{ background: 'linear-gradient(to bottom right, rgba(26, 17, 16, 0.2), rgba(39, 39, 42, 0.6), rgba(9, 9, 11, 0.6))', border: '1px solid rgba(184, 115, 51, 0.3)' }}>
            <div className="flex items-start gap-5 mb-10">
              <div className="p-5 rounded-2xl shadow-xl" style={{ background: 'linear-gradient(to bottom right, #CD7F32, #B87333)', boxShadow: '0 20px 25px -5px rgba(184, 115, 51, 0.4)' }}>
                <FileText className="w-9 h-9 text-white" />
              </div>
              <div>
                <h2 className="text-4xl md:text-5xl mb-3" style={{ color: '#D4A574', textAlign: 'left', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>
                  FRANCHISE OVERVIEW
                </h2>
                <p className="text-zinc-300 text-lg">
                  Everything you need to know about partnering with Rabuste Coffee
                </p>
              </div>
            </div>

            {/* Key Highlights */}
            <div className="grid md:grid-cols-2 gap-8 mb-10">
              <div className="group rounded-2xl p-8 transition-all duration-300 hover:shadow-xl" style={{ background: 'linear-gradient(to bottom right, rgba(39, 39, 42, 0.9), rgba(9, 9, 11, 0.9))', border: '2px solid rgba(184, 115, 51, 0.3)' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(184, 115, 51, 0.5)'; e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(184, 115, 51, 0.3)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(184, 115, 51, 0.3)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div className="flex items-center gap-4 mb-5">
                  <div className="p-3 rounded-xl transition-colors" style={{ background: 'rgba(184, 115, 51, 0.3)' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(184, 115, 51, 0.4)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(184, 115, 51, 0.3)'; }}>
                    <IndianRupee className="w-7 h-7" style={{ color: '#B87333' }} />
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-wide" style={{ color: '#D4A574', fontFamily: 'var(--font-heading)', letterSpacing: '0.1em' }}>
                    INVESTMENT RANGE
                  </h3>
                </div>
                <p className="text-3xl font-bold mb-3" style={{ color: '#D4A574', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>
                  ₹25 - 50 LAKHS
                </p>
                <p className="text-zinc-400">Including setup, equipment, and initial inventory</p>
              </div>

              <div className="group rounded-2xl p-8 transition-all duration-300 hover:shadow-xl" style={{ background: 'linear-gradient(to bottom right, rgba(39, 39, 42, 0.9), rgba(9, 9, 11, 0.9))', border: '2px solid rgba(184, 115, 51, 0.3)' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(184, 115, 51, 0.5)'; e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(184, 115, 51, 0.3)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(184, 115, 51, 0.3)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div className="flex items-center gap-4 mb-5">
                  <div className="p-3 rounded-xl transition-colors" style={{ background: 'rgba(184, 115, 51, 0.3)' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(184, 115, 51, 0.4)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(184, 115, 51, 0.3)'; }}>
                    <Building2 className="w-7 h-7" style={{ color: '#B87333' }} />
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-wide" style={{ color: '#D4A574', fontFamily: 'var(--font-heading)', letterSpacing: '0.1em' }}>
                    SPACE REQUIREMENTS
                  </h3>
                </div>
                <p className="text-3xl font-bold mb-3" style={{ color: '#D4A574', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>
                  800 - 1200 SQ.FT
                </p>
                <p className="text-zinc-400">Prime location with high footfall preferred</p>
              </div>

              <div className="group rounded-2xl p-8 transition-all duration-300 hover:shadow-xl" style={{ background: 'linear-gradient(to bottom right, rgba(39, 39, 42, 0.9), rgba(9, 9, 11, 0.9))', border: '2px solid rgba(184, 115, 51, 0.3)' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(184, 115, 51, 0.5)'; e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(184, 115, 51, 0.3)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(184, 115, 51, 0.3)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div className="flex items-center gap-4 mb-5">
                  <div className="p-3 rounded-xl transition-colors" style={{ background: 'rgba(184, 115, 51, 0.3)' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(184, 115, 51, 0.4)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(184, 115, 51, 0.3)'; }}>
                    <Users className="w-7 h-7" style={{ color: '#B87333' }} />
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-wide" style={{ color: '#D4A574', fontFamily: 'var(--font-heading)', letterSpacing: '0.1em' }}>
                    TRAINING & SUPPORT
                  </h3>
                </div>
                <p className="text-3xl font-bold mb-3" style={{ color: '#D4A574', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>
                  2-WEEK PROGRAM
                </p>
                <p className="text-zinc-400">Ongoing operational and marketing support</p>
              </div>

              <div className="group rounded-2xl p-8 transition-all duration-300 hover:shadow-xl" style={{ background: 'linear-gradient(to bottom right, rgba(39, 39, 42, 0.9), rgba(9, 9, 11, 0.9))', border: '2px solid rgba(184, 115, 51, 0.3)' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(184, 115, 51, 0.5)'; e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(184, 115, 51, 0.3)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(184, 115, 51, 0.3)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div className="flex items-center gap-4 mb-5">
                  <div className="p-3 rounded-xl transition-colors" style={{ background: 'rgba(184, 115, 51, 0.3)' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(184, 115, 51, 0.4)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(184, 115, 51, 0.3)'; }}>
                    <CheckCircle2 className="w-7 h-7" style={{ color: '#B87333' }} />
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-wide" style={{ color: '#D4A574', fontFamily: 'var(--font-heading)', letterSpacing: '0.1em' }}>
                    FRANCHISE TERM
                  </h3>
                </div>
                <p className="text-3xl font-bold mb-3" style={{ color: '#D4A574', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>
                  5 YEARS
                </p>
                <p className="text-zinc-400">Renewable with exclusive territory rights</p>
              </div>
            </div>

            {/* Benefits List */}
            <div className="rounded-2xl p-10 mb-10" style={{ background: 'linear-gradient(to bottom right, rgba(26, 17, 16, 0.3), rgba(9, 9, 11, 0.3))', border: '2px solid rgba(184, 115, 51, 0.3)' }}>
              <h3 className="text-3xl mb-8" style={{ color: '#D4A574', textAlign: 'left', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>
                WHAT YOU GET
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
                    <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" style={{ color: '#B87333' }} />
                    <span className="leading-relaxed text-base">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={openFranchisePDF}
              className="w-full text-white font-bold py-6 px-10 rounded-2xl transition-all duration-300 flex items-center justify-center gap-4 shadow-2xl hover:scale-[1.02] group uppercase tracking-widest text-lg"
              style={{ 
                fontFamily: 'var(--font-heading)', 
                letterSpacing: '0.1em',
                background: 'linear-gradient(135deg, #B87333 0%, #CD7F32 50%, #D4A574 100%)',
                boxShadow: '0 25px 50px -12px rgba(184, 115, 51, 0.5)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #CD7F32 0%, #D4A574 50%, #E8C39E 100%)';
                e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(184, 115, 51, 0.7)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #B87333 0%, #CD7F32 50%, #D4A574 100%)';
                e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(184, 115, 51, 0.5)';
              }}
            >
              <FileText className="w-7 h-7 group-hover:rotate-12 transition-transform" />
              View Complete Terms & Conditions
              <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>

        {/* Franchise Enquiry Form */}
        <div className="max-w-6xl mx-auto px-6 pb-32">
          <div className="backdrop-blur-xl rounded-3xl p-10 md:p-14 shadow-2xl" style={{ background: 'linear-gradient(to bottom right, rgba(26, 17, 16, 0.2), rgba(39, 39, 42, 0.6), rgba(9, 9, 11, 0.6))', border: '1px solid rgba(184, 115, 51, 0.3)' }}>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8" style={{ background: 'rgba(26, 17, 16, 0.3)', border: '1px solid rgba(184, 115, 51, 0.4)' }}>
                <Mail className="w-5 h-5" style={{ color: '#B87333' }} />
                <span className="text-sm font-bold tracking-widest uppercase" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.15em', color: '#B87333' }}>
                  GET STARTED
                </span>
              </div>
              
              <h2 className="text-5xl md:text-6xl mb-6" style={{ color: '#D4A574', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>
                FRANCHISE ENQUIRY
              </h2>
              <p className="text-zinc-300 text-lg max-w-2xl mx-auto">
                Fill in your details and we'll get back to you within 2-3 business days
              </p>
            </div>

            <div className="space-y-10">
              {/* Personal Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-4 pb-5" style={{ borderBottom: '2px solid rgba(184, 115, 51, 0.3)' }}>
                  <div className="p-3 rounded-xl" style={{ background: 'rgba(184, 115, 51, 0.3)' }}>
                    <User className="w-6 h-6" style={{ color: '#B87333' }} />
                  </div>
                  <h3 className="text-2xl font-bold uppercase tracking-wider" style={{ color: '#D4A574', fontFamily: 'var(--font-heading)', letterSpacing: '0.1em' }}>
                    PERSONAL INFORMATION
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-zinc-300 mb-3 uppercase tracking-wide" style={{ fontFamily: 'var(--font-body)', letterSpacing: '0.05em' }}>
                      FULL NAME <span style={{ color: '#B87333' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full bg-zinc-950/70 border-2 border-zinc-800 rounded-xl px-5 py-4 text-zinc-100 focus:outline-none transition-all"
                      style={{ 
                        borderColor: 'rgba(39, 39, 42, 1)',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(184, 115, 51, 0.5)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(39, 39, 42, 1)'; }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#B87333'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(184, 115, 51, 0.3)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(39, 39, 42, 1)'; e.currentTarget.style.boxShadow = 'none'; }}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-zinc-300 mb-3 uppercase tracking-wide" style={{ fontFamily: 'var(--font-body)', letterSpacing: '0.05em' }}>
                      EMAIL ADDRESS <span style={{ color: '#B87333' }}>*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-zinc-950/70 border-2 border-zinc-800 rounded-xl px-5 py-4 text-zinc-100 focus:outline-none transition-all"
                      style={{ 
                        borderColor: 'rgba(39, 39, 42, 1)',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(184, 115, 51, 0.5)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(39, 39, 42, 1)'; }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#B87333'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(184, 115, 51, 0.3)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(39, 39, 42, 1)'; e.currentTarget.style.boxShadow = 'none'; }}
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-zinc-300 mb-3 uppercase tracking-wide" style={{ fontFamily: 'var(--font-body)', letterSpacing: '0.05em' }}>
                      PHONE NUMBER <span style={{ color: '#B87333' }}>*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full bg-zinc-950/70 border-2 border-zinc-800 rounded-xl px-5 py-4 text-zinc-100 focus:outline-none transition-all"
                      style={{ 
                        borderColor: 'rgba(39, 39, 42, 1)',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(184, 115, 51, 0.5)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(39, 39, 42, 1)'; }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#B87333'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(184, 115, 51, 0.3)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(39, 39, 42, 1)'; e.currentTarget.style.boxShadow = 'none'; }}
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-zinc-300 mb-3 uppercase tracking-wide" style={{ fontFamily: 'var(--font-body)', letterSpacing: '0.05em' }}>
                      APPLYING AS <span style={{ color: '#B87333' }}>*</span>
                    </label>
                    <select
                      name="organizationType"
                      value={formData.organizationType}
                      onChange={handleChange}
                      required
                      className="w-full bg-zinc-950/70 border-2 border-zinc-800 rounded-xl px-5 py-4 text-zinc-100 focus:outline-none transition-all"
                      style={{ 
                        borderColor: 'rgba(39, 39, 42, 1)',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(184, 115, 51, 0.5)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(39, 39, 42, 1)'; }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#B87333'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(184, 115, 51, 0.3)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(39, 39, 42, 1)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      <option value="individual">Individual</option>
                      <option value="company">Company</option>
                      <option value="partnership">Partnership</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-zinc-300 mb-3 uppercase tracking-wide" style={{ fontFamily: 'var(--font-body)', letterSpacing: '0.05em' }}>
                    ORGANIZATION/COMPANY NAME
                  </label>
                    <input
                      type="text"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleChange}
                      className="w-full bg-zinc-950/70 border-2 border-zinc-800 rounded-xl px-5 py-4 text-zinc-100 focus:outline-none transition-all"
                      style={{ 
                        borderColor: 'rgba(39, 39, 42, 1)',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(184, 115, 51, 0.5)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(39, 39, 42, 1)'; }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#B87333'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(184, 115, 51, 0.3)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(39, 39, 42, 1)'; e.currentTarget.style.boxShadow = 'none'; }}
                      placeholder="If applicable"
                    />
                </div>
              </div>

              {/* Location Details */}
              <div className="space-y-6 pt-10" style={{ borderTop: '2px solid rgba(184, 115, 51, 0.3)' }}>
                <div className="flex items-center gap-4 pb-5" style={{ borderBottom: '2px solid rgba(184, 115, 51, 0.3)' }}>
                  <div className="p-3 rounded-xl" style={{ background: 'rgba(184, 115, 51, 0.3)' }}>
                    <MapPin className="w-6 h-6" style={{ color: '#B87333' }} />
                  </div>
                  <h3 className="text-2xl font-bold uppercase tracking-wider" style={{ color: '#D4A574', fontFamily: 'var(--font-heading)', letterSpacing: '0.1em' }}>
                    LOCATION DETAILS
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-zinc-300 mb-3 uppercase tracking-wide" style={{ fontFamily: 'var(--font-body)', letterSpacing: '0.05em' }}>
                      CITY <span style={{ color: '#B87333' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full bg-zinc-950/70 border-2 border-zinc-800 rounded-xl px-5 py-4 text-zinc-100 focus:outline-none transition-all"
                      style={{ 
                        borderColor: 'rgba(39, 39, 42, 1)',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(184, 115, 51, 0.5)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(39, 39, 42, 1)'; }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#B87333'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(184, 115, 51, 0.3)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(39, 39, 42, 1)'; e.currentTarget.style.boxShadow = 'none'; }}
                      placeholder="Enter city"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-zinc-300 mb-3 uppercase tracking-wide" style={{ fontFamily: 'var(--font-body)', letterSpacing: '0.05em' }}>
                      STATE <span style={{ color: '#B87333' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="w-full bg-zinc-950/70 border-2 border-zinc-800 rounded-xl px-5 py-4 text-zinc-100 focus:outline-none transition-all"
                      style={{ 
                        borderColor: 'rgba(39, 39, 42, 1)',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(184, 115, 51, 0.5)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(39, 39, 42, 1)'; }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#B87333'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(184, 115, 51, 0.3)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(39, 39, 42, 1)'; e.currentTarget.style.boxShadow = 'none'; }}
                      placeholder="Enter state"
                    />
                  </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-zinc-300 mb-3 uppercase tracking-wide" style={{ fontFamily: 'var(--font-body)', letterSpacing: '0.05em' }}>
                      PREFERRED LOCATION/AREA <span style={{ color: '#B87333' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="preferredLocation"
                      value={formData.preferredLocation}
                      onChange={handleChange}
                      required
                      className="w-full bg-zinc-950/70 border-2 border-zinc-800 rounded-xl px-5 py-4 text-zinc-100 focus:outline-none transition-all"
                      style={{ 
                        borderColor: 'rgba(39, 39, 42, 1)',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(184, 115, 51, 0.5)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(39, 39, 42, 1)'; }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#B87333'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(184, 115, 51, 0.3)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(39, 39, 42, 1)'; e.currentTarget.style.boxShadow = 'none'; }}
                      placeholder="e.g., MG Road, Indiranagar, etc."
                    />
                </div>
              </div>

              {/* Business Details */}
              <div className="space-y-6 pt-10" style={{ borderTop: '2px solid rgba(184, 115, 51, 0.3)' }}>
                <div className="flex items-center gap-4 pb-5" style={{ borderBottom: '2px solid rgba(184, 115, 51, 0.3)' }}>
                  <div className="p-3 rounded-xl" style={{ background: 'rgba(184, 115, 51, 0.3)' }}>
                    <Building2 className="w-6 h-6" style={{ color: '#B87333' }} />
                  </div>
                  <h3 className="text-2xl font-bold uppercase tracking-wider" style={{ color: '#D4A574', fontFamily: 'var(--font-heading)', letterSpacing: '0.1em' }}>
                    BUSINESS DETAILS
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-zinc-300 mb-3 uppercase tracking-wide" style={{ fontFamily: 'var(--font-body)', letterSpacing: '0.05em' }}>
                      INVESTMENT CAPACITY <span style={{ color: '#B87333' }}>*</span>
                    </label>
                    <select
                      name="investmentCapacity"
                      value={formData.investmentCapacity}
                      onChange={handleChange}
                      required
                      className="w-full bg-zinc-950/70 border-2 border-zinc-800 rounded-xl px-5 py-4 text-zinc-100 focus:outline-none transition-all"
                      style={{ 
                        borderColor: 'rgba(39, 39, 42, 1)',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(184, 115, 51, 0.5)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(39, 39, 42, 1)'; }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#B87333'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(184, 115, 51, 0.3)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(39, 39, 42, 1)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      <option value="">Select range</option>
                      <option value="25-35">₹25 - 35 Lakhs</option>
                      <option value="35-45">₹35 - 45 Lakhs</option>
                      <option value="45+">₹45+ Lakhs</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-zinc-300 mb-3 uppercase tracking-wide" style={{ fontFamily: 'var(--font-body)', letterSpacing: '0.05em' }}>
                      PREVIOUS BUSINESS EXPERIENCE
                    </label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="w-full bg-zinc-950/70 border-2 border-zinc-800 rounded-xl px-5 py-4 text-zinc-100 focus:outline-none transition-all"
                      style={{ 
                        borderColor: 'rgba(39, 39, 42, 1)',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(184, 115, 51, 0.5)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(39, 39, 42, 1)'; }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#B87333'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(184, 115, 51, 0.3)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(39, 39, 42, 1)'; e.currentTarget.style.boxShadow = 'none'; }}
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
                  <label className="block text-sm font-bold text-zinc-300 mb-3 uppercase tracking-wide" style={{ fontFamily: 'var(--font-body)', letterSpacing: '0.05em' }}>
                    ADDITIONAL MESSAGE
                  </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full bg-zinc-950/70 border-2 border-zinc-800 rounded-xl px-5 py-4 text-zinc-100 focus:outline-none transition-all resize-none"
                      style={{ 
                        borderColor: 'rgba(39, 39, 42, 1)',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(184, 115, 51, 0.5)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(39, 39, 42, 1)'; }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#B87333'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(184, 115, 51, 0.3)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(39, 39, 42, 1)'; e.currentTarget.style.boxShadow = 'none'; }}
                      placeholder="Tell us more about your franchise plans and why you'd like to partner with Rabuste Coffee..."
                    />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-10">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full text-white font-bold py-6 px-10 rounded-2xl transition-all duration-300 flex items-center justify-center gap-4 shadow-2xl hover:scale-[1.02] disabled:hover:scale-100 group uppercase tracking-widest text-lg disabled:cursor-not-allowed"
                  style={{ 
                    fontFamily: 'var(--font-heading)', 
                    letterSpacing: '0.1em',
                    background: isSubmitting ? 'linear-gradient(135deg, #3F3F46, #3F3F46)' : 'linear-gradient(135deg, #B87333 0%, #CD7F32 50%, #D4A574 100%)',
                    boxShadow: isSubmitting ? 'none' : '0 25px 50px -12px rgba(184, 115, 51, 0.5)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #CD7F32 0%, #D4A574 50%, #E8C39E 100%)';
                      e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(184, 115, 51, 0.7)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #B87333 0%, #CD7F32 50%, #D4A574 100%)';
                      e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(184, 115, 51, 0.5)';
                    }
                  }}
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
                        }`} style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.1em' }}>
                          {submitStatus.type === 'success' ? 'ENQUIRY SUBMITTED!' : 'SUBMISSION FAILED'}
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