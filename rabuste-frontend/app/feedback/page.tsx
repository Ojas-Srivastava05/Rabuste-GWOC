"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { Star, MessageSquare, Coffee, Globe, Package, CheckCircle2, X } from 'lucide-react';
import Navbar from "@/components/Navbar";
import DynamicBackground from "@/components/DynamicBackground";
import Footer from "@/components/sections/footer";
import { useUser } from "@/contexts/UserContext";
import { useRouter, useSearchParams } from "next/navigation";

type FeedbackType = 'order' | 'cafe' | 'website';

function FeedbackContent() {
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<FeedbackType>('order');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const [orderFeedback, setOrderFeedback] = useState({
    orderId: '',
    rating: 0,
    foodQuality: 0,
    deliveryTime: 0,
    packaging: 0,
    comments: ''
  });

  // Get orderId from URL if present
  useEffect(() => {
    const orderId = searchParams?.get('orderId');
    if (orderId) {
      setOrderFeedback(prev => ({ ...prev, orderId }));
      setActiveTab('order');
    }
  }, [searchParams]);

  const [cafeFeedback, setCafeFeedback] = useState({
    rating: 0,
    ambience: 0,
    service: 0,
    cleanliness: 0,
    music: 0,
    comments: ''
  });

  const [websiteFeedback, setWebsiteFeedback] = useState({
    rating: 0,
    easeOfUse: 0,
    design: 0,
    speed: 0,
    features: 0,
    comments: ''
  });

  const handleOrderChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrderFeedback(prev => ({ ...prev, [name]: value }));
  };

  const handleCafeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCafeFeedback(prev => ({ ...prev, [name]: value }));
  };

  const handleWebsiteChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setWebsiteFeedback(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (type: FeedbackType, field: string, value: number) => {
    if (type === 'order') {
      setOrderFeedback(prev => ({ ...prev, [field]: value }));
    } else if (type === 'cafe') {
      setCafeFeedback(prev => ({ ...prev, [field]: value }));
    } else {
      setWebsiteFeedback(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      const feedbackData = {
        type: activeTab,
        userId: user?.id || null,
        userEmail: user?.email || '',
        userName: user?.name || 'Guest',
        ...(activeTab === 'order' ? orderFeedback : activeTab === 'cafe' ? cafeFeedback : websiteFeedback)
      };

      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Submission failed");
      }

      setSubmitStatus({
        type: "success",
        message: "Thank you for your feedback! We appreciate your input.",
      });

      // Reset form after 2 seconds
      setTimeout(() => {
        if (activeTab === 'order') {
          setOrderFeedback({
            orderId: '',
            rating: 0,
            foodQuality: 0,
            deliveryTime: 0,
            packaging: 0,
            comments: ''
          });
        } else if (activeTab === 'cafe') {
          setCafeFeedback({
            rating: 0,
            ambience: 0,
            service: 0,
            cleanliness: 0,
            music: 0,
            comments: ''
          });
        } else {
          setWebsiteFeedback({
            rating: 0,
            easeOfUse: 0,
            design: 0,
            speed: 0,
            features: 0,
            comments: ''
          });
        }
        setSubmitStatus({ type: '', message: '' });
      }, 3000);

    } catch (error: any) {
      setSubmitStatus({
        type: "error",
        message: error.message || "Failed to submit feedback",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ value, onChange, label }: { value: number; onChange: (val: number) => void; label: string }) => (
    <div className="space-y-3">
      <label className="block text-sm font-bold text-zinc-300 mb-2 uppercase tracking-wide" style={{ fontFamily: 'var(--font-body)', letterSpacing: '0.05em' }}>
        {label}
      </label>
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="transition-transform hover:scale-110"
          >
            <Star
              size={32}
              className={star <= value ? 'text-amber-500 fill-amber-500' : 'text-zinc-600'}
            />
          </button>
        ))}
        {value > 0 && (
          <span className="ml-4 text-lg font-bold" style={{ color: '#D4A574' }}>
            {value}/5
          </span>
        )}
      </div>
    </div>
  );

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
                YOUR VOICE MATTERS
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
              <span style={{ color: '#FFFEF9' }}>SHARE YOUR</span>
              <br />
              <span className="gradient-copper">FEEDBACK</span>
            </h1>
            
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-16" style={{ color: '#B87333', lineHeight: 1.7 }}>
              Help us improve by sharing your experience with us
            </p>
          </div>
        </div>

        {/* Feedback Form */}
        <div className="max-w-6xl mx-auto px-6 pb-32">
          <div className="bg-gradient-to-br from-amber-950/20 via-zinc-900/60 to-zinc-950/60 backdrop-blur-xl border border-amber-900/30 rounded-3xl p-10 md:p-14 shadow-2xl">
            {/* Tabs */}
            <div className="flex flex-wrap gap-4 mb-10 border-b-2 border-amber-900/30 pb-6">
              {[
                { id: 'order' as FeedbackType, icon: Package, label: 'Order Feedback' },
                { id: 'cafe' as FeedbackType, icon: Coffee, label: 'Cafe Ambience' },
                { id: 'website' as FeedbackType, icon: Globe, label: 'Website Feedback' }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSubmitStatus({ type: '', message: '' });
                    }}
                    className={`flex items-center gap-3 px-6 py-4 rounded-xl font-bold uppercase tracking-wide transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-amber-700 to-amber-600 text-white shadow-lg shadow-amber-900/50'
                        : 'bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-300'
                    }`}
                    style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.1em' }}
                  >
                    <Icon size={20} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Order Feedback */}
              {activeTab === 'order' && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-zinc-300 mb-3 uppercase tracking-wide" style={{ fontFamily: 'var(--font-body)', letterSpacing: '0.05em' }}>
                      ORDER ID (OPTIONAL)
                    </label>
                    <input
                      type="text"
                      name="orderId"
                      value={orderFeedback.orderId}
                      onChange={handleOrderChange}
                      className="w-full bg-zinc-950/70 border-2 border-zinc-800 hover:border-amber-900/50 focus:border-amber-600 rounded-xl px-5 py-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-600/30 transition-all"
                      placeholder="Enter order ID if you have one"
                    />
                  </div>

                  <StarRating
                    value={orderFeedback.rating}
                    onChange={(val) => handleRatingChange('order', 'rating', val)}
                    label="Overall Rating"
                  />

                  <StarRating
                    value={orderFeedback.foodQuality}
                    onChange={(val) => handleRatingChange('order', 'foodQuality', val)}
                    label="Food Quality"
                  />

                  <StarRating
                    value={orderFeedback.deliveryTime}
                    onChange={(val) => handleRatingChange('order', 'deliveryTime', val)}
                    label="Delivery Time"
                  />

                  <StarRating
                    value={orderFeedback.packaging}
                    onChange={(val) => handleRatingChange('order', 'packaging', val)}
                    label="Packaging"
                  />

                  <div>
                    <label className="block text-sm font-bold text-zinc-300 mb-3 uppercase tracking-wide" style={{ fontFamily: 'var(--font-body)', letterSpacing: '0.05em' }}>
                      ADDITIONAL COMMENTS
                    </label>
                    <textarea
                      name="comments"
                      value={orderFeedback.comments}
                      onChange={handleOrderChange}
                      rows={5}
                      className="w-full bg-zinc-950/70 border-2 border-zinc-800 hover:border-amber-900/50 focus:border-amber-600 rounded-xl px-5 py-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-600/30 transition-all resize-none"
                      placeholder="Tell us more about your order experience..."
                    />
                  </div>
                </>
              )}

              {/* Cafe Feedback */}
              {activeTab === 'cafe' && (
                <>
                  <StarRating
                    value={cafeFeedback.rating}
                    onChange={(val) => handleRatingChange('cafe', 'rating', val)}
                    label="Overall Rating"
                  />

                  <StarRating
                    value={cafeFeedback.ambience}
                    onChange={(val) => handleRatingChange('cafe', 'ambience', val)}
                    label="Ambience"
                  />

                  <StarRating
                    value={cafeFeedback.service}
                    onChange={(val) => handleRatingChange('cafe', 'service', val)}
                    label="Service Quality"
                  />

                  <StarRating
                    value={cafeFeedback.cleanliness}
                    onChange={(val) => handleRatingChange('cafe', 'cleanliness', val)}
                    label="Cleanliness"
                  />

                  <StarRating
                    value={cafeFeedback.music}
                    onChange={(val) => handleRatingChange('cafe', 'music', val)}
                    label="Music & Atmosphere"
                  />

                  <div>
                    <label className="block text-sm font-bold text-zinc-300 mb-3 uppercase tracking-wide" style={{ fontFamily: 'var(--font-body)', letterSpacing: '0.05em' }}>
                      ADDITIONAL COMMENTS
                    </label>
                    <textarea
                      name="comments"
                      value={cafeFeedback.comments}
                      onChange={handleCafeChange}
                      rows={5}
                      className="w-full bg-zinc-950/70 border-2 border-zinc-800 hover:border-amber-900/50 focus:border-amber-600 rounded-xl px-5 py-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-600/30 transition-all resize-none"
                      placeholder="Tell us about your cafe experience..."
                    />
                  </div>
                </>
              )}

              {/* Website Feedback */}
              {activeTab === 'website' && (
                <>
                  <StarRating
                    value={websiteFeedback.rating}
                    onChange={(val) => handleRatingChange('website', 'rating', val)}
                    label="Overall Rating"
                  />

                  <StarRating
                    value={websiteFeedback.easeOfUse}
                    onChange={(val) => handleRatingChange('website', 'easeOfUse', val)}
                    label="Ease of Use"
                  />

                  <StarRating
                    value={websiteFeedback.design}
                    onChange={(val) => handleRatingChange('website', 'design', val)}
                    label="Design & Aesthetics"
                  />

                  <StarRating
                    value={websiteFeedback.speed}
                    onChange={(val) => handleRatingChange('website', 'speed', val)}
                    label="Website Speed"
                  />

                  <StarRating
                    value={websiteFeedback.features}
                    onChange={(val) => handleRatingChange('website', 'features', val)}
                    label="Features & Functionality"
                  />

                  <div>
                    <label className="block text-sm font-bold text-zinc-300 mb-3 uppercase tracking-wide" style={{ fontFamily: 'var(--font-body)', letterSpacing: '0.05em' }}>
                      ADDITIONAL COMMENTS
                    </label>
                    <textarea
                      name="comments"
                      value={websiteFeedback.comments}
                      onChange={handleWebsiteChange}
                      rows={5}
                      className="w-full bg-zinc-950/70 border-2 border-zinc-800 hover:border-amber-900/50 focus:border-amber-600 rounded-xl px-5 py-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-600/30 transition-all resize-none"
                      placeholder="Tell us how we can improve our website..."
                    />
                  </div>
                </>
              )}

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 hover:from-amber-600 hover:via-amber-500 hover:to-amber-600 disabled:from-zinc-700 disabled:to-zinc-700 disabled:cursor-not-allowed text-white font-bold py-6 px-10 rounded-2xl transition-all duration-300 flex items-center justify-center gap-4 shadow-2xl shadow-amber-900/50 hover:shadow-amber-900/70 hover:scale-[1.02] disabled:hover:scale-100 group uppercase tracking-widest text-lg"
                  style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.1em' }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-7 h-7 border-3 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting Feedback...</span>
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-7 h-7 group-hover:scale-110 transition-transform" />
                      <span>Submit Feedback</span>
                    </>
                  )}
                </button>

                {/* Success/Error Message */}
                {submitStatus.message && (
                  <div className={`mt-8 p-6 rounded-2xl border-2 ${
                    submitStatus.type === 'success' 
                      ? 'bg-gradient-to-br from-green-950/60 to-green-900/40 border-green-700/60 shadow-xl shadow-green-900/30' 
                      : 'bg-gradient-to-br from-red-950/60 to-red-900/40 border-red-700/60 shadow-xl shadow-red-900/30'
                  } animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                    <div className="flex items-start gap-4">
                      {submitStatus.type === 'success' ? (
                        <CheckCircle2 className="w-7 h-7 text-green-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-7 h-7 text-red-400 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className={`font-bold text-xl mb-2 uppercase tracking-wide ${
                          submitStatus.type === 'success' ? 'text-green-300' : 'text-red-300'
                        }`} style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.1em' }}>
                          {submitStatus.type === 'success' ? 'THANK YOU!' : 'SUBMISSION FAILED'}
                        </p>
                        <p className={`text-base ${submitStatus.type === 'success' ? 'text-green-200' : 'text-red-200'}`}>
                          {submitStatus.message}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function FeedbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #1A1110 0%, #000000 50%, #1A1110 100%)' }}>
        <div className="text-center">
          <p style={{ color: '#B87333' }}>Loading...</p>
        </div>
      </div>
    }>
      <FeedbackContent />
    </Suspense>
  );
}
