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
    comments: ''
  });

  const [websiteFeedback, setWebsiteFeedback] = useState({
    rating: 0,
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
            comments: ''
          });
        } else if (activeTab === 'cafe') {
          setCafeFeedback({
            rating: 0,
            comments: ''
          });
        } else {
          setWebsiteFeedback({
            rating: 0,
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
      <label className="block text-sm font-bold mb-2 uppercase tracking-wide" style={{ color: '#D4A574', fontFamily: 'var(--font-body)', letterSpacing: '0.05em' }}>
        {label}
      </label>
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="transition-all hover:scale-110 active:scale-95"
          >
            <Star
              size={32}
              style={{
                color: star <= value ? '#B87333' : 'rgba(139, 111, 71, 0.3)',
                fill: star <= value ? '#B87333' : 'transparent',
                transition: 'all 0.2s ease',
              }}
            />
          </button>
        ))}
        {value > 0 && (
          <span className="ml-4 text-lg font-bold" style={{ color: '#D4A574', fontFamily: 'var(--font-heading)' }}>
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
          <div className="brutal-card rounded-3xl p-10 md:p-14">
            {/* Tabs */}
            <div className="flex flex-wrap gap-4 mb-10 border-b-2 border-[#B87333]/30 pb-6">
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
                        ? 'text-white shadow-lg'
                        : 'text-[#8B6F47] hover:text-[#D4A574]'
                    }`}
                    style={{
                      fontFamily: 'var(--font-heading)',
                      letterSpacing: '0.1em',
                      background: activeTab === tab.id
                        ? 'linear-gradient(135deg, #B87333 0%, #CD7F32 50%, #D4A574 100%)'
                        : 'rgba(61, 43, 31, 0.3)',
                      border: activeTab === tab.id
                        ? '2px solid rgba(212, 165, 116, 0.5)'
                        : '2px solid rgba(184, 115, 51, 0.2)',
                    }}
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
                    <label className="block text-sm font-bold mb-3 uppercase tracking-wide" style={{ color: '#D4A574', fontFamily: 'var(--font-body)', letterSpacing: '0.05em' }}>
                      ORDER ID (OPTIONAL)
                    </label>
                    <input
                      type="text"
                      name="orderId"
                      value={orderFeedback.orderId}
                      onChange={handleOrderChange}
                      className="w-full rounded-xl px-5 py-4 focus:outline-none transition-all"
                      style={{
                        background: 'rgba(26, 17, 16, 0.6)',
                        border: '2px solid rgba(184, 115, 51, 0.3)',
                        color: '#F5F1E8',
                        fontFamily: 'var(--font-body)',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(212, 165, 116, 0.6)';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(184, 115, 51, 0.2)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(184, 115, 51, 0.3)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      placeholder="Enter order ID if you have one"
                    />
                  </div>

                  <StarRating
                    value={orderFeedback.rating}
                    onChange={(val) => handleRatingChange('order', 'rating', val)}
                    label="Overall Rating"
                  />

                  <div>
                    <label className="block text-sm font-bold mb-3 uppercase tracking-wide" style={{ color: '#D4A574', fontFamily: 'var(--font-body)', letterSpacing: '0.05em' }}>
                      ADDITIONAL COMMENTS
                    </label>
                    <textarea
                      name="comments"
                      value={orderFeedback.comments}
                      onChange={handleOrderChange}
                      rows={5}
                      className="w-full rounded-xl px-5 py-4 focus:outline-none transition-all resize-none"
                      style={{
                        background: 'rgba(26, 17, 16, 0.6)',
                        border: '2px solid rgba(184, 115, 51, 0.3)',
                        color: '#F5F1E8',
                        fontFamily: 'var(--font-body)',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(212, 165, 116, 0.6)';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(184, 115, 51, 0.2)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(184, 115, 51, 0.3)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
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

                  <div>
                    <label className="block text-sm font-bold mb-3 uppercase tracking-wide" style={{ color: '#D4A574', fontFamily: 'var(--font-body)', letterSpacing: '0.05em' }}>
                      ADDITIONAL COMMENTS
                    </label>
                    <textarea
                      name="comments"
                      value={cafeFeedback.comments}
                      onChange={handleCafeChange}
                      rows={5}
                      className="w-full rounded-xl px-5 py-4 focus:outline-none transition-all resize-none"
                      style={{
                        background: 'rgba(26, 17, 16, 0.6)',
                        border: '2px solid rgba(184, 115, 51, 0.3)',
                        color: '#F5F1E8',
                        fontFamily: 'var(--font-body)',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(212, 165, 116, 0.6)';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(184, 115, 51, 0.2)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(184, 115, 51, 0.3)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
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

                  <div>
                    <label className="block text-sm font-bold mb-3 uppercase tracking-wide" style={{ color: '#D4A574', fontFamily: 'var(--font-body)', letterSpacing: '0.05em' }}>
                      ADDITIONAL COMMENTS
                    </label>
                    <textarea
                      name="comments"
                      value={websiteFeedback.comments}
                      onChange={handleWebsiteChange}
                      rows={5}
                      className="w-full rounded-xl px-5 py-4 focus:outline-none transition-all resize-none"
                      style={{
                        background: 'rgba(26, 17, 16, 0.6)',
                        border: '2px solid rgba(184, 115, 51, 0.3)',
                        color: '#F5F1E8',
                        fontFamily: 'var(--font-body)',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(212, 165, 116, 0.6)';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(184, 115, 51, 0.2)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(184, 115, 51, 0.3)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
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
                  className="w-full font-bold py-6 px-10 rounded-2xl transition-all duration-300 flex items-center justify-center gap-4 hover:scale-[1.02] disabled:hover:scale-100 group uppercase tracking-widest text-lg disabled:cursor-not-allowed"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    letterSpacing: '0.1em',
                    background: isSubmitting
                      ? 'rgba(61, 43, 31, 0.6)'
                      : 'linear-gradient(135deg, #B87333 0%, #CD7F32 50%, #D4A574 100%)',
                    color: isSubmitting ? '#8B6F47' : '#000000',
                    border: 'none',
                    boxShadow: isSubmitting
                      ? 'none'
                      : '0 10px 40px rgba(184, 115, 51, 0.4)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.boxShadow = '0 12px 48px rgba(184, 115, 51, 0.6)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.boxShadow = '0 10px 40px rgba(184, 115, 51, 0.4)';
                    }
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-7 h-7 border-3 border-[#8B6F47] border-t-transparent rounded-full animate-spin" />
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
                  <div
                    className="mt-8 p-6 rounded-2xl border-2 animate-in fade-in slide-in-from-bottom-4 duration-500"
                    style={{
                      background: submitStatus.type === 'success'
                        ? 'linear-gradient(135deg, rgba(61, 43, 31, 0.8), rgba(42, 24, 16, 0.8))'
                        : 'linear-gradient(135deg, rgba(61, 43, 31, 0.8), rgba(42, 24, 16, 0.8))',
                      borderColor: submitStatus.type === 'success'
                        ? 'rgba(212, 165, 116, 0.5)'
                        : 'rgba(220, 38, 38, 0.5)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
                    }}
                  >
                    <div className="flex items-start gap-4">
                      {submitStatus.type === 'success' ? (
                        <CheckCircle2 className="w-7 h-7 flex-shrink-0 mt-0.5" style={{ color: '#D4A574' }} />
                      ) : (
                        <X className="w-7 h-7 flex-shrink-0 mt-0.5" style={{ color: '#DC2626' }} />
                      )}
                      <div>
                        <p
                          className="font-bold text-xl mb-2 uppercase tracking-wide"
                          style={{
                            fontFamily: 'var(--font-heading)',
                            letterSpacing: '0.1em',
                            color: submitStatus.type === 'success' ? '#D4A574' : '#DC2626',
                          }}
                        >
                          {submitStatus.type === 'success' ? 'THANK YOU!' : 'SUBMISSION FAILED'}
                        </p>
                        <p style={{ color: submitStatus.type === 'success' ? '#F5F1E8' : '#FCA5A5' }}>
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
