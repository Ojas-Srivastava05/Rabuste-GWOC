// "use client";

// import React, { useState } from 'react';
// import { FileText, Building2, MapPin, User, Mail, Phone, IndianRupee, Users, ArrowRight, CheckCircle2 } from 'lucide-react';

// export default function FranchisePage() {
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     phone: '',
//     organizationName: '',
//     organizationType: 'individual',
//     city: '',
//     state: '',
//     preferredLocation: '',
//     investmentCapacity: '',
//     experience: '',
//     message: ''
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setSubmitStatus({ type: '', message: '' });

//     try {
//       // Send to your backend API
//       const response = await fetch('http://localhost:5001/api/franchise/enquiry', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       if (response.ok) {
//         setSubmitStatus({
//           type: 'success',
//           message: 'Thank you! Your franchise enquiry has been submitted successfully. Our team will contact you within 2-3 business days.'
//         });
        
//         // Reset form after 3 seconds
//         setTimeout(() => {
//           setFormData({
//             fullName: '',
//             email: '',
//             phone: '',
//             organizationName: '',
//             organizationType: 'individual',
//             city: '',
//             state: '',
//             preferredLocation: '',
//             investmentCapacity: '',
//             experience: '',
//             message: ''
//           });
//           setSubmitStatus({ type: '', message: '' });
//         }, 3000);
//       } else {
//         throw new Error('Submission failed');
//       }
//     } catch (error) {
//       setSubmitStatus({
//         type: 'error',
//         message: 'Failed to submit enquiry. Please try again or contact us directly.'
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const openFranchisePDF = () => {
//     window.open('/franchise-terms-conditions.pdf', '_blank');
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
//       {/* Header */}
//       <div className="relative pt-24 pb-16 px-6">
//         <div className="max-w-4xl mx-auto text-center">
//           <h1 className="text-5xl md:text-6xl font-bold text-amber-50 mb-4 tracking-tight">
//             Join the <span className="text-amber-600">Rabuste</span> Family
//           </h1>
//           <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
//             Be part of India's fastest-growing specialty coffee franchise. Bring the Rabuste experience to your city.
//           </p>
//         </div>
//       </div>

//       {/* Terms & Conditions Card */}
//       <div className="max-w-6xl mx-auto px-6 pb-20">
//         <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-amber-900/30 rounded-2xl p-8 md:p-12 shadow-2xl">
//           <div className="flex items-start gap-4 mb-8">
//             <div className="bg-amber-600/10 p-3 rounded-xl">
//               <FileText className="w-8 h-8 text-amber-600" />
//             </div>
//             <div>
//               <h2 className="text-3xl font-bold text-amber-50 mb-2">
//                 Franchise Terms & Conditions
//               </h2>
//               <p className="text-zinc-400">
//                 Everything you need to know about partnering with Rabuste Coffee
//               </p>
//             </div>
//           </div>

//           {/* Key Highlights */}
//           <div className="grid md:grid-cols-2 gap-6 mb-8">
//             <div className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-6">
//               <div className="flex items-center gap-3 mb-3">
//                 <IndianRupee className="w-6 h-6 text-amber-600" />
//                 <h3 className="text-lg font-semibold text-amber-50">Investment Range</h3>
//               </div>
//               <p className="text-zinc-400">₹25 Lakhs - ₹50 Lakhs</p>
//               <p className="text-sm text-zinc-500 mt-2">Including setup, equipment, and initial inventory</p>
//             </div>

//             <div className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-6">
//               <div className="flex items-center gap-3 mb-3">
//                 <Building2 className="w-6 h-6 text-amber-600" />
//                 <h3 className="text-lg font-semibold text-amber-50">Space Requirements</h3>
//               </div>
//               <p className="text-zinc-400">800 - 1200 sq.ft</p>
//               <p className="text-sm text-zinc-500 mt-2">Prime location with high footfall preferred</p>
//             </div>

//             <div className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-6">
//               <div className="flex items-center gap-3 mb-3">
//                 <Users className="w-6 h-6 text-amber-600" />
//                 <h3 className="text-lg font-semibold text-amber-50">Training & Support</h3>
//               </div>
//               <p className="text-zinc-400">Comprehensive 2-week program</p>
//               <p className="text-sm text-zinc-500 mt-2">Ongoing operational and marketing support</p>
//             </div>

//             <div className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-6">
//               <div className="flex items-center gap-3 mb-3">
//                 <CheckCircle2 className="w-6 h-6 text-amber-600" />
//                 <h3 className="text-lg font-semibold text-amber-50">Franchise Term</h3>
//               </div>
//               <p className="text-zinc-400">5 Years (Renewable)</p>
//               <p className="text-sm text-zinc-500 mt-2">Exclusive territory rights included</p>
//             </div>
//           </div>

//           {/* Benefits List */}
//           <div className="bg-zinc-950/30 border border-zinc-800/50 rounded-xl p-6 mb-8">
//             <h3 className="text-xl font-semibold text-amber-50 mb-4">What You Get</h3>
//             <div className="grid md:grid-cols-2 gap-3">
//               {[
//                 'Proven business model',
//                 'Brand recognition & marketing',
//                 'Premium coffee supply chain',
//                 'Interior design assistance',
//                 'POS & technology systems',
//                 'Recipe & quality standards',
//                 'Staff training programs',
//                 'Ongoing operational support'
//               ].map((benefit, idx) => (
//                 <div key={idx} className="flex items-center gap-2 text-zinc-300">
//                   <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
//                   <span>{benefit}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* CTA Button */}
//           <button
//             onClick={openFranchisePDF}
//             className="w-full bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-amber-900/30 hover:shadow-amber-900/50"
//           >
//             <FileText className="w-5 h-5" />
//             View Complete Terms & Conditions (PDF)
//             <ArrowRight className="w-5 h-5" />
//           </button>
//         </div>
//       </div>

//       {/* Franchise Enquiry Form */}
//       <div className="max-w-4xl mx-auto px-6 pb-24">
//         <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-amber-900/30 rounded-2xl p-8 md:p-12 shadow-2xl">
//           <div className="text-center mb-10">
//             <h2 className="text-3xl md:text-4xl font-bold text-amber-50 mb-3">
//               Franchise Enquiry Form
//             </h2>
//             <p className="text-zinc-400">
//               Fill in your details and we'll get back to you soon
//             </p>
//           </div>

//           {submitStatus.message && (
//             <div className={`mb-6 p-4 rounded-xl border ${
//               submitStatus.type === 'success' 
//                 ? 'bg-green-950/50 border-green-800 text-green-300' 
//                 : 'bg-red-950/50 border-red-800 text-red-300'
//             }`}>
//               <div className="flex items-center gap-2">
//                 <CheckCircle2 className="w-5 h-5" />
//                 <span>{submitStatus.message}</span>
//               </div>
//             </div>
//           )}

//           <div className="space-y-6">
//             {/* Personal Information */}
//             <div className="space-y-6">
//               <h3 className="text-xl font-semibold text-amber-50 flex items-center gap-2">
//                 <User className="w-5 h-5 text-amber-600" />
//                 Personal Information
//               </h3>

//               <div className="grid md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-zinc-300 mb-2">
//                     Full Name *
//                   </label>
//                   <input
//                     type="text"
//                     name="fullName"
//                     value={formData.fullName}
//                     onChange={handleChange}
//                     required
//                     className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-colors"
//                     placeholder="Enter your full name"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-zinc-300 mb-2">
//                     Email Address *
//                   </label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     required
//                     className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-colors"
//                     placeholder="your.email@example.com"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-zinc-300 mb-2">
//                     Phone Number *
//                   </label>
//                   <input
//                     type="tel"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleChange}
//                     required
//                     className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-colors"
//                     placeholder="+91 XXXXX XXXXX"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-zinc-300 mb-2">
//                     Applying As *
//                   </label>
//                   <select
//                     name="organizationType"
//                     value={formData.organizationType}
//                     onChange={handleChange}
//                     required
//                     className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-colors"
//                   >
//                     <option value="individual">Individual</option>
//                     <option value="company">Company</option>
//                     <option value="partnership">Partnership</option>
//                   </select>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-zinc-300 mb-2">
//                   Organization/Company Name
//                 </label>
//                 <input
//                   type="text"
//                   name="organizationName"
//                   value={formData.organizationName}
//                   onChange={handleChange}
//                   className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-colors"
//                   placeholder="If applicable"
//                 />
//               </div>
//             </div>

//             {/* Location Details */}
//             <div className="space-y-6 pt-6 border-t border-zinc-800">
//               <h3 className="text-xl font-semibold text-amber-50 flex items-center gap-2">
//                 <MapPin className="w-5 h-5 text-amber-600" />
//                 Location Details
//               </h3>

//               <div className="grid md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-zinc-300 mb-2">
//                     City *
//                   </label>
//                   <input
//                     type="text"
//                     name="city"
//                     value={formData.city}
//                     onChange={handleChange}
//                     required
//                     className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-colors"
//                     placeholder="Enter city"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-zinc-300 mb-2">
//                     State *
//                   </label>
//                   <input
//                     type="text"
//                     name="state"
//                     value={formData.state}
//                     onChange={handleChange}
//                     required
//                     className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-colors"
//                     placeholder="Enter state"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-zinc-300 mb-2">
//                   Preferred Location/Area *
//                 </label>
//                 <input
//                   type="text"
//                   name="preferredLocation"
//                   value={formData.preferredLocation}
//                   onChange={handleChange}
//                   required
//                   className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-colors"
//                   placeholder="e.g., MG Road, Indiranagar, etc."
//                 />
//               </div>
//             </div>

//             {/* Business Details */}
//             <div className="space-y-6 pt-6 border-t border-zinc-800">
//               <h3 className="text-xl font-semibold text-amber-50 flex items-center gap-2">
//                 <Building2 className="w-5 h-5 text-amber-600" />
//                 Business Details
//               </h3>

//               <div className="grid md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-zinc-300 mb-2">
//                     Investment Capacity *
//                   </label>
//                   <select
//                     name="investmentCapacity"
//                     value={formData.investmentCapacity}
//                     onChange={handleChange}
//                     required
//                     className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-colors"
//                   >
//                     <option value="">Select range</option>
//                     <option value="25-35">₹25 - 35 Lakhs</option>
//                     <option value="35-45">₹35 - 45 Lakhs</option>
//                     <option value="45+">₹45+ Lakhs</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-zinc-300 mb-2">
//                     Previous Business Experience
//                   </label>
//                   <select
//                     name="experience"
//                     value={formData.experience}
//                     onChange={handleChange}
//                     className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-colors"
//                   >
//                     <option value="">Select experience</option>
//                     <option value="none">No prior experience</option>
//                     <option value="retail">Retail/F&B</option>
//                     <option value="hospitality">Hospitality</option>
//                     <option value="other">Other business</option>
//                   </select>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-zinc-300 mb-2">
//                   Additional Message
//                 </label>
//                 <textarea
//                   name="message"
//                   value={formData.message}
//                   onChange={handleChange}
//                   rows={4}
//                   className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-colors resize-none"
//                   placeholder="Tell us more about your franchise plans..."
//                 />
//               </div>
//             </div>

//             {/* Submit Button */}
//             <div className="pt-6">
//               <button
//                 onClick={handleSubmit}
//                 disabled={isSubmitting}
//                 className="w-full bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 disabled:from-zinc-700 disabled:to-zinc-700 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-amber-900/30 hover:shadow-amber-900/50"
//               >
//                 {isSubmitting ? (
//                   <>
//                     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                     Submitting...
//                   </>
//                 ) : (
//                   <>
//                     <Mail className="w-5 h-5" />
//                     Submit Franchise Enquiry
//                   </>
//                 )}
//               </button>
//             </div>

//             <p className="text-sm text-zinc-500 text-center">
//               By submitting this form, you agree to our privacy policy and terms of service.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import React, { useState } from 'react';
import { FileText, Building2, MapPin, User, Mail, Phone, IndianRupee, Users, ArrowRight, CheckCircle2, Coffee, Award, TrendingUp } from 'lucide-react';
import Navbar from "@/components/Navbar";

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
      const response = await fetch('http://localhost:5001/api/franchise/enquiry', {
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
      
      <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
        {/* Coffee Bean Background Animation */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-5">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="coffee-bean absolute"
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${15 + Math.random() * 10}s`,
                animationDelay: `${Math.random() * 5}s`,
                fontSize: '24px',
              }}
            >
              ☕
            </div>
          ))}
        </div>

        {/* Hero Header */}
        <div className="relative pt-32 pb-20 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-950/20 via-transparent to-transparent" />
          <div className="max-w-6xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-950/30 border border-amber-800/40 rounded-full mb-8">
              <Coffee className="w-5 h-5 text-amber-600" />
              <span className="text-amber-600 text-sm font-bold tracking-widest uppercase" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Franchise Opportunity
              </span>
            </div>
            
            <h1 className="plantation-header text-6xl md:text-7xl lg:text-8xl mb-8" style={{ color: '#D4A574' }}>
              Join the Rabuste Family
            </h1>
            
            <p className="text-xl md:text-2xl text-zinc-300 max-w-3xl mx-auto leading-relaxed mb-4">
              Partner with India's fastest-growing specialty coffee brand.
            </p>
            <p className="text-2xl md:text-3xl font-bold mb-16" style={{ color: '#D4A574', fontFamily: 'Montserrat, sans-serif' }}>
              Brew Success. Build Legacy.
            </p>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-gradient-to-br from-amber-950/30 to-zinc-900/40 backdrop-blur-sm border border-amber-900/30 rounded-3xl p-8 hover:border-amber-800/50 transition-all duration-300 hover:transform hover:scale-105">
                <Award className="w-10 h-10 text-amber-600 mx-auto mb-4" />
                <div className="text-4xl font-bold mb-2" style={{ color: '#D4A574', fontFamily: 'Montserrat, sans-serif' }}>
                  50+
                </div>
                <div className="text-sm text-zinc-400 uppercase tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Premium Locations
                </div>
              </div>
              <div className="bg-gradient-to-br from-amber-950/30 to-zinc-900/40 backdrop-blur-sm border border-amber-900/30 rounded-3xl p-8 hover:border-amber-800/50 transition-all duration-300 hover:transform hover:scale-105">
                <TrendingUp className="w-10 h-10 text-amber-600 mx-auto mb-4" />
                <div className="text-4xl font-bold mb-2" style={{ color: '#D4A574', fontFamily: 'Montserrat, sans-serif' }}>
                  25%
                </div>
                <div className="text-sm text-zinc-400 uppercase tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Average ROI
                </div>
              </div>
              <div className="bg-gradient-to-br from-amber-950/30 to-zinc-900/40 backdrop-blur-sm border border-amber-900/30 rounded-3xl p-8 hover:border-amber-800/50 transition-all duration-300 hover:transform hover:scale-105">
                <Coffee className="w-10 h-10 text-amber-600 mx-auto mb-4" />
                <div className="text-4xl font-bold mb-2" style={{ color: '#D4A574', fontFamily: 'Montserrat, sans-serif' }}>
                  100K+
                </div>
                <div className="text-sm text-zinc-400 uppercase tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Cups Served Daily
                </div>
              </div>
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
    </>
  );
}