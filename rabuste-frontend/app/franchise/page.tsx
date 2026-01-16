"use client";

import React, { useState } from 'react';
import { FileText, Building2, MapPin, User, Mail, Phone, IndianRupee, Users, ArrowRight, CheckCircle2, Zap, Shield, Target, Sparkles } from 'lucide-react';
import Navbar from "@/components/Navbar";
import DynamicBackground from "@/components/DynamicBackground";
import Footer from "@/components/sections/footer";
import { motion } from 'framer-motion';

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

  const [focusedField, setFocusedField] = useState<string | null>(null);
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

  // Modern Input Component
  const ModernInput = ({ 
    label, 
    name, 
    type = 'text', 
    required = false, 
    placeholder, 
    value, 
    onChange,
    icon: Icon,
    options
  }: any) => {
    const isFocused = focusedField === name;
    const hasValue = value && value.toString().length > 0;
    // For select, check if a non-empty value is selected
    const hasSelectValue = type === 'select' ? (value && value !== '') : hasValue;

    if (type === 'select') {
      return (
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
            <Icon className="w-5 h-5 transition-colors" style={{ color: isFocused || hasSelectValue ? '#B87333' : 'rgba(161, 161, 170, 0.5)' }} />
          </div>
          <label 
            className={`absolute left-12 transition-all duration-300 pointer-events-none ${
              isFocused || hasSelectValue 
                ? 'top-2 text-xs text-[#B87333] font-semibold' 
                : 'top-1/2 -translate-y-1/2 text-base text-zinc-400'
            }`}
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {label} {required && <span className="text-[#B87333]">*</span>}
          </label>
          <select
            name={name}
            value={value || ''}
            onChange={onChange}
            onFocus={() => setFocusedField(name)}
            onBlur={() => setFocusedField(null)}
            required={required}
            className="w-full h-16 pl-12 pr-10 pt-6 bg-transparent border-2 rounded-xl transition-all duration-300 appearance-none cursor-pointer"
            style={{
              borderColor: isFocused ? '#B87333' : 'rgba(39, 39, 42, 0.6)',
              color: hasSelectValue ? '#F5F1E8' : 'rgba(161, 161, 170, 0.6)',
              fontFamily: 'var(--font-body)',
              boxShadow: isFocused ? '0 0 0 4px rgba(184, 115, 51, 0.1)' : 'none',
            }}
          >
            {options?.map((opt: any) => (
              <option key={opt.value} value={opt.value} style={{ background: '#1A1110', color: '#F5F1E8' }}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
            <ArrowRight className="w-4 h-4 rotate-90" style={{ color: isFocused || hasSelectValue ? '#B87333' : 'rgba(161, 161, 170, 0.5)' }} />
          </div>
          {isFocused && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              className="absolute bottom-0 left-0 right-0 h-0.5 origin-left"
              style={{ background: 'linear-gradient(90deg, #B87333, #CD7F32, #D4A574)' }}
            />
          )}
        </div>
      );
    }

    if (type === 'textarea') {
      return (
        <div className="relative group">
          <div className="absolute left-4 top-6 z-10">
            <Icon className="w-5 h-5 transition-colors" style={{ color: isFocused || hasValue ? '#B87333' : 'rgba(161, 161, 170, 0.5)' }} />
          </div>
          <label 
            className={`absolute left-12 transition-all duration-300 pointer-events-none ${
              isFocused || hasValue 
                ? 'top-2 text-xs text-[#B87333] font-semibold' 
                : 'top-6 text-base text-zinc-400'
            }`}
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {label}
          </label>
          <textarea
            name={name}
            value={value || ''}
            onChange={onChange}
            onFocus={() => setFocusedField(name)}
            onBlur={() => setFocusedField(null)}
            rows={5}
            className="w-full pl-12 pr-4 pt-8 pb-4 bg-transparent border-2 rounded-xl transition-all duration-300 resize-none"
            style={{
              borderColor: isFocused ? '#B87333' : 'rgba(39, 39, 42, 0.6)',
              color: '#F5F1E8',
              fontFamily: 'var(--font-body)',
              boxShadow: isFocused ? '0 0 0 4px rgba(184, 115, 51, 0.1)' : 'none',
            }}
            placeholder={isFocused ? placeholder : ''}
          />
          {isFocused && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              className="absolute bottom-0 left-0 right-0 h-0.5 origin-left"
              style={{ background: 'linear-gradient(90deg, #B87333, #CD7F32, #D4A574)' }}
            />
          )}
        </div>
      );
    }

    return (
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
          <Icon className="w-5 h-5 transition-colors" style={{ color: isFocused || hasValue ? '#B87333' : 'rgba(161, 161, 170, 0.5)' }} />
        </div>
        <label 
          className={`absolute left-12 transition-all duration-300 pointer-events-none ${
            isFocused || hasValue 
              ? 'top-2 text-xs text-[#B87333] font-semibold' 
              : 'top-1/2 -translate-y-1/2 text-base text-zinc-400'
          }`}
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {label} {required && <span className="text-[#B87333]">*</span>}
        </label>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocusedField(name)}
          onBlur={() => setFocusedField(null)}
          required={required}
          className="w-full h-16 pl-12 pr-4 pt-6 bg-transparent border-2 rounded-xl transition-all duration-300"
          style={{
            borderColor: isFocused ? '#B87333' : 'rgba(39, 39, 42, 0.6)',
            color: '#F5F1E8',
            fontFamily: 'var(--font-body)',
            boxShadow: isFocused ? '0 0 0 4px rgba(184, 115, 51, 0.1)' : 'none',
          }}
          placeholder={isFocused ? placeholder : ''}
        />
        {isFocused && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            className="absolute bottom-0 left-0 right-0 h-0.5 origin-left"
            style={{ background: 'linear-gradient(90deg, #B87333, #CD7F32, #D4A574)' }}
          />
        )}
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <DynamicBackground />
      
      <div className="min-h-screen relative" style={{ background: 'linear-gradient(180deg, #1A1110 0%, #000000 50%, #1A1110 100%)' }}>
        {/* Premium Copper Accent Line */}
        <div 
          className="fixed top-0 left-0 right-0 h-1 pointer-events-none z-50"
          style={{
            background: 'linear-gradient(90deg, transparent, #B87333, #CD7F32, #D4A574, #CD7F32, #B87333, transparent)',
            boxShadow: '0 0 20px rgba(184, 115, 51, 0.5)',
          }}
        />

        {/* Hero Header */}
        <div className="relative pt-32 pb-16 px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-4 mb-8"
            >
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#B87333]" />
              <span className="text-xs uppercase tracking-[0.3em]" style={{ color: '#B87333', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
                EXPANSION OPPORTUNITY
              </span>
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#B87333]" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
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
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl max-w-3xl mx-auto mb-16" 
              style={{ color: '#B87333', lineHeight: 1.7, fontFamily: 'var(--font-body)' }}
            >
              Partner with Rabuste Coffee. Dominate your market.
            </motion.p>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { icon: Target, value: '50+', label: 'LOCATIONS' },
                { icon: Zap, value: '25%', label: 'AVERAGE ROI' },
                { icon: Shield, value: '100K+', label: 'DAILY CUPS' },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                    className="brutal-card p-8 group hover:scale-105 transition-transform"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center transition-transform group-hover:scale-110 rounded-xl"
                      style={{
                        background: 'linear-gradient(135deg, rgba(184, 115, 51, 0.2), rgba(205, 127, 50, 0.2))',
                        border: '2px solid rgba(184, 115, 51, 0.4)',
                      }}
                    >
                      <Icon size={32} style={{ color: '#B87333' }} />
                    </div>
                    <div className="text-5xl font-bold mb-2 gradient-copper" style={{ fontFamily: 'var(--font-heading)' }}>
                      {stat.value}
                    </div>
                    <div className="text-sm uppercase tracking-[0.2em]" style={{ color: '#8B6F47', fontFamily: 'var(--font-heading)' }}>
                      {stat.label}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Franchise Overview Card */}
        <div className="max-w-7xl mx-auto px-6 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
            style={{ 
              background: 'linear-gradient(to bottom right, rgba(26, 17, 16, 0.4), rgba(39, 39, 42, 0.6), rgba(9, 9, 11, 0.6))', 
              border: '1px solid rgba(184, 115, 51, 0.3)',
            }}
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, #B87333, transparent)' }} />
            </div>

            <div className="relative z-10">
              <div className="flex items-start gap-5 mb-10">
                <div className="p-5 rounded-2xl shadow-xl" style={{ background: 'linear-gradient(to bottom right, #CD7F32, #B87333)', boxShadow: '0 20px 25px -5px rgba(184, 115, 51, 0.4)' }}>
                  <FileText className="w-9 h-9 text-white" />
                </div>
                <div>
                  <h2 className="text-4xl md:text-5xl mb-3" style={{ color: '#D4A574', textAlign: 'left', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>
                    FRANCHISE OVERVIEW
                  </h2>
                  <p className="text-zinc-300 text-lg" style={{ fontFamily: 'var(--font-body)' }}>
                    Everything you need to know about partnering with Rabuste Coffee
                  </p>
                </div>
              </div>

              {/* Key Highlights */}
              <div className="grid md:grid-cols-2 gap-6 mb-10">
                {[
                  { icon: IndianRupee, title: 'INVESTMENT RANGE', value: '₹25 - 50 LAKHS', desc: 'Including setup, equipment, and initial inventory' },
                  { icon: Building2, title: 'SPACE REQUIREMENTS', value: '800 - 1200 SQ.FT', desc: 'Prime location with high footfall preferred' },
                  { icon: Users, title: 'TRAINING & SUPPORT', value: '2-WEEK PROGRAM', desc: 'Ongoing operational and marketing support' },
                  { icon: CheckCircle2, title: 'FRANCHISE TERM', value: '5 YEARS', desc: 'Renewable with exclusive territory rights' },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="group rounded-2xl p-6 transition-all duration-300 hover:shadow-xl relative overflow-hidden"
                      style={{ 
                        background: 'linear-gradient(to bottom right, rgba(39, 39, 42, 0.6), rgba(9, 9, 11, 0.6))', 
                        border: '2px solid rgba(184, 115, 51, 0.3)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(184, 115, 51, 0.6)';
                        e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(184, 115, 51, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(184, 115, 51, 0.3)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-xl transition-colors" style={{ background: 'rgba(184, 115, 51, 0.2)' }}>
                          <Icon className="w-6 h-6" style={{ color: '#B87333' }} />
                        </div>
                        <h3 className="text-lg font-bold uppercase tracking-wide" style={{ color: '#D4A574', fontFamily: 'var(--font-heading)', letterSpacing: '0.1em' }}>
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-2xl font-bold mb-2" style={{ color: '#D4A574', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>
                        {item.value}
                      </p>
                      <p className="text-zinc-400 text-sm" style={{ fontFamily: 'var(--font-body)' }}>{item.desc}</p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Benefits List */}
              <div className="rounded-2xl p-8 mb-8" style={{ background: 'linear-gradient(to bottom right, rgba(26, 17, 16, 0.3), rgba(9, 9, 11, 0.3))', border: '2px solid rgba(184, 115, 51, 0.2)' }}>
                <h3 className="text-2xl mb-6" style={{ color: '#D4A574', textAlign: 'left', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>
                  WHAT YOU GET
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
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
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" style={{ color: '#B87333' }} />
                      <span className="leading-relaxed text-sm" style={{ fontFamily: 'var(--font-body)' }}>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={openFranchisePDF}
                className="w-full text-white font-bold py-5 px-10 rounded-xl transition-all duration-300 flex items-center justify-center gap-4 shadow-2xl group uppercase tracking-widest"
                style={{ 
                  fontFamily: 'var(--font-heading)', 
                  letterSpacing: '0.1em',
                  background: 'linear-gradient(135deg, #B87333 0%, #CD7F32 50%, #D4A574 100%)',
                  boxShadow: '0 25px 50px -12px rgba(184, 115, 51, 0.5)'
                }}
              >
                <FileText className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                View Complete Terms & Conditions
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Premium Franchise Enquiry Form */}
        <div className="max-w-5xl mx-auto px-6 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
            style={{ 
              background: 'linear-gradient(to bottom right, rgba(26, 17, 16, 0.4), rgba(39, 39, 42, 0.6), rgba(9, 9, 11, 0.6))', 
              border: '1px solid rgba(184, 115, 51, 0.3)',
            }}
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, #CD7F32, transparent)' }} />
            </div>

            <div className="relative z-10">
              <div className="text-center mb-12">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8"
                  style={{ background: 'rgba(26, 17, 16, 0.5)', border: '1px solid rgba(184, 115, 51, 0.4)' }}
                >
                  <Mail className="w-5 h-5" style={{ color: '#B87333' }} />
                  <span className="text-sm font-bold tracking-widest uppercase" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.15em', color: '#B87333' }}>
                    GET STARTED
                  </span>
                </motion.div>
                
                <h2 className="text-5xl md:text-6xl mb-4" style={{ color: '#D4A574', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>
                  FRANCHISE ENQUIRY
                </h2>
                <p className="text-zinc-300 text-lg max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-body)' }}>
                  Fill in your details and we'll get back to you within 2-3 business days
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4 pb-4" style={{ borderBottom: '2px solid rgba(184, 115, 51, 0.3)' }}>
                    <div className="p-2.5 rounded-lg" style={{ background: 'rgba(184, 115, 51, 0.2)' }}>
                      <User className="w-5 h-5" style={{ color: '#B87333' }} />
                    </div>
                    <h3 className="text-xl font-bold uppercase tracking-wider" style={{ color: '#D4A574', fontFamily: 'var(--font-heading)', letterSpacing: '0.1em' }}>
                      PERSONAL INFORMATION
                    </h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <ModernInput
                      label="Full Name"
                      name="fullName"
                      type="text"
                      required
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={handleChange}
                      icon={User}
                    />
                    <ModernInput
                      label="Email Address"
                      name="email"
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      icon={Mail}
                    />
                    <ModernInput
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                      icon={Phone}
                    />
                    <ModernInput
                      label="Applying As"
                      name="organizationType"
                      type="select"
                      required
                      value={formData.organizationType}
                      onChange={handleChange}
                      icon={Building2}
                      options={[
                        { value: 'individual', label: 'Individual' },
                        { value: 'company', label: 'Company' },
                        { value: 'partnership', label: 'Partnership' },
                      ]}
                    />
                  </div>

                  <ModernInput
                    label="Organization/Company Name"
                    name="organizationName"
                    type="text"
                    placeholder="If applicable"
                    value={formData.organizationName}
                    onChange={handleChange}
                    icon={Building2}
                  />
                </div>

                {/* Location Details */}
                <div className="space-y-6 pt-6" style={{ borderTop: '2px solid rgba(184, 115, 51, 0.2)' }}>
                  <div className="flex items-center gap-4 pb-4" style={{ borderBottom: '2px solid rgba(184, 115, 51, 0.3)' }}>
                    <div className="p-2.5 rounded-lg" style={{ background: 'rgba(184, 115, 51, 0.2)' }}>
                      <MapPin className="w-5 h-5" style={{ color: '#B87333' }} />
                    </div>
                    <h3 className="text-xl font-bold uppercase tracking-wider" style={{ color: '#D4A574', fontFamily: 'var(--font-heading)', letterSpacing: '0.1em' }}>
                      LOCATION DETAILS
                    </h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <ModernInput
                      label="City"
                      name="city"
                      type="text"
                      required
                      placeholder="Mumbai"
                      value={formData.city}
                      onChange={handleChange}
                      icon={MapPin}
                    />
                    <ModernInput
                      label="State"
                      name="state"
                      type="text"
                      required
                      placeholder="Maharashtra"
                      value={formData.state}
                      onChange={handleChange}
                      icon={MapPin}
                    />
                  </div>

                  <ModernInput
                    label="Preferred Location/Area"
                    name="preferredLocation"
                    type="text"
                    required
                    placeholder="e.g., MG Road, Indiranagar, etc."
                    value={formData.preferredLocation}
                    onChange={handleChange}
                    icon={MapPin}
                  />
                </div>

                {/* Business Details */}
                <div className="space-y-6 pt-6" style={{ borderTop: '2px solid rgba(184, 115, 51, 0.2)' }}>
                  <div className="flex items-center gap-4 pb-4" style={{ borderBottom: '2px solid rgba(184, 115, 51, 0.3)' }}>
                    <div className="p-2.5 rounded-lg" style={{ background: 'rgba(184, 115, 51, 0.2)' }}>
                      <Building2 className="w-5 h-5" style={{ color: '#B87333' }} />
                    </div>
                    <h3 className="text-xl font-bold uppercase tracking-wider" style={{ color: '#D4A574', fontFamily: 'var(--font-heading)', letterSpacing: '0.1em' }}>
                      BUSINESS DETAILS
                    </h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <ModernInput
                      label="Investment Capacity"
                      name="investmentCapacity"
                      type="select"
                      required
                      value={formData.investmentCapacity}
                      onChange={handleChange}
                      icon={IndianRupee}
                      options={[
                        { value: '', label: 'Select range' },
                        { value: '25-35', label: '₹25 - 35 Lakhs' },
                        { value: '35-45', label: '₹35 - 45 Lakhs' },
                        { value: '45+', label: '₹45+ Lakhs' },
                      ]}
                    />
                    <ModernInput
                      label="Previous Business Experience"
                      name="experience"
                      type="select"
                      value={formData.experience}
                      onChange={handleChange}
                      icon={Sparkles}
                      options={[
                        { value: '', label: 'Select experience' },
                        { value: 'none', label: 'No prior experience' },
                        { value: 'retail', label: 'Retail/F&B' },
                        { value: 'hospitality', label: 'Hospitality' },
                        { value: 'other', label: 'Other business' },
                      ]}
                    />
                  </div>

                  <ModernInput
                    label="Additional Message"
                    name="message"
                    type="textarea"
                    placeholder="Tell us more about your franchise plans..."
                    value={formData.message}
                    onChange={handleChange}
                    icon={FileText}
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    className="w-full text-white font-bold py-5 px-10 rounded-xl transition-all duration-300 flex items-center justify-center gap-4 shadow-2xl group uppercase tracking-widest disabled:cursor-not-allowed"
                    style={{ 
                      fontFamily: 'var(--font-heading)', 
                      letterSpacing: '0.1em',
                      background: isSubmitting 
                        ? 'linear-gradient(135deg, #3F3F46, #3F3F46)' 
                        : 'linear-gradient(135deg, #B87333 0%, #CD7F32 50%, #D4A574 100%)',
                      boxShadow: isSubmitting 
                        ? 'none' 
                        : '0 25px 50px -12px rgba(184, 115, 51, 0.5)'
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting Your Enquiry...</span>
                      </>
                    ) : (
                      <>
                        <Mail className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        <span>Submit Franchise Enquiry</span>
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                      </>
                    )}
                  </motion.button>

                  {/* Success/Error Message */}
                  {submitStatus.message && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-6 p-6 rounded-xl border-2 ${
                        submitStatus.type === 'success' 
                          ? 'bg-gradient-to-br from-green-950/60 to-green-900/40 border-green-700/60' 
                          : 'bg-gradient-to-br from-red-950/60 to-red-900/40 border-red-700/60'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <CheckCircle2 className={`w-6 h-6 flex-shrink-0 mt-0.5 ${
                          submitStatus.type === 'success' ? 'text-green-400' : 'text-red-400'
                        }`} />
                        <div>
                          <p className={`font-bold text-lg mb-1 uppercase tracking-wide ${
                            submitStatus.type === 'success' ? 'text-green-300' : 'text-red-300'
                          }`} style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.1em' }}>
                            {submitStatus.type === 'success' ? 'ENQUIRY SUBMITTED!' : 'SUBMISSION FAILED'}
                          </p>
                          <p className={`text-sm ${submitStatus.type === 'success' ? 'text-green-200' : 'text-red-200'}`} style={{ fontFamily: 'var(--font-body)' }}>
                            {submitStatus.message}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                <p className="text-xs text-zinc-500 text-center pt-4 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                  By submitting this form, you agree to our privacy policy and terms of service.
                  <br />
                  We respect your privacy and will never share your information.
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
