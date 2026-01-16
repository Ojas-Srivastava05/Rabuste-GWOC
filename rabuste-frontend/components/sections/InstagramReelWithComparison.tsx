"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Check, X, Zap, Brain, Clock, TrendingUp, Award, Trophy } from 'lucide-react';

const comparisonData = [
  { 
    feature: 'Caffeine Content', 
    robusta: '2.7%', 
    arabica: '1.5%', 
    winner: 'robusta',
    icon: Zap,
    robustaColor: '#B87333',
    arabicaColor: '#6B5744'
  },
  { 
    feature: 'Energy Duration', 
    robusta: '6-8 hours', 
    arabica: '3-4 hours', 
    winner: 'robusta',
    icon: Clock,
    robustaColor: '#CD7F32',
    arabicaColor: '#6B5744'
  },
  { 
    feature: 'Antioxidants (CGA)', 
    robusta: '7-10%', 
    arabica: '5.5-8%', 
    winner: 'robusta',
    icon: Award,
    robustaColor: '#D4A574',
    arabicaColor: '#6B5744'
  },
  { 
    feature: 'Performance Boost', 
    robusta: '+15%', 
    arabica: '+8%', 
    winner: 'robusta',
    icon: TrendingUp,
    robustaColor: '#B87333',
    arabicaColor: '#6B5744'
  },
  { 
    feature: 'Bold Flavor', 
    robusta: 'Intense & Strong', 
    arabica: 'Mild & Acidic', 
    winner: 'robusta',
    icon: Trophy,
    robustaColor: '#CD7F32',
    arabicaColor: '#6B5744'
  },
  { 
    feature: 'Price Value', 
    robusta: '₹140/cup', 
    arabica: '₹180+/cup', 
    winner: 'robusta',
    icon: Brain,
    robustaColor: '#D4A574',
    arabicaColor: '#6B5744'
  },
];

export default function InstagramReelWithComparison() {
  const containerRef = useRef<HTMLDivElement>(null);
  const embedRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state after component mounts (client-only)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load Instagram embed script ONLY when component is in view (defer to prevent blocking LCP)
  useEffect(() => {
    if (!isMounted || !isInView) return;

    // Only load Instagram script when component is visible to prevent blocking critical path
    if (typeof window !== 'undefined' && !window.instgrm) {
      const script = document.createElement('script');
      script.src = '//www.instagram.com/embed.js';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsLoaded(true);
        if (window.instgrm) {
          window.instgrm.Embeds.process();
          setTimeout(() => {
            if (window.instgrm) {
              window.instgrm.Embeds.process();
            }
          }, 300);
        }
      };
      document.body.appendChild(script);

      return () => {
        const existingScript = document.querySelector('script[src="//www.instagram.com/embed.js"]');
        if (existingScript) {
          existingScript.remove();
        }
      };
    } else if (typeof window !== 'undefined' && window.instgrm) {
      setIsLoaded(true);
      window.instgrm.Embeds.process();
      setTimeout(() => {
        if (window.instgrm) {
          window.instgrm.Embeds.process();
        }
      }, 300);
    }
  }, [isMounted, isInView]);

  // Intersection Observer for autoplay on scroll
  useEffect(() => {
    if (!isMounted || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.2) {
            setIsInView(true);
            
            const triggerAutoplay = () => {
              const iframe = containerRef.current?.querySelector('iframe');
              if (!iframe) return;
              
              iframe.style.opacity = '1';
              iframe.style.display = 'block';
              iframe.style.visibility = 'visible';
              
              try {
                if (iframe.contentWindow) {
                  iframe.contentWindow.postMessage(JSON.stringify({ type: 'play', action: 'play' }), '*');
                  iframe.contentWindow.postMessage(JSON.stringify({ type: 'scroll', details: { direction: 'down' } }), '*');
                  iframe.contentWindow.postMessage('play', '*');
                }
              } catch (e) {
                // CORS may block this
              }
              
              setTimeout(() => {
                try {
                  iframe.focus();
                  iframe.click();
                } catch (e) {}
              }, 100);
              
              if (isLoaded && window.instgrm) {
                setTimeout(() => {
                  if (window.instgrm) {
                    window.instgrm.Embeds.process();
                  }
                }, 200);
              }
              
              setTimeout(() => {
                window.dispatchEvent(new Event('scroll'));
                window.dispatchEvent(new CustomEvent('instagram-embed-visible'));
              }, 150);
            };
            
            triggerAutoplay();
            setTimeout(triggerAutoplay, 500);
            setTimeout(triggerAutoplay, 1000);
          } else {
            setIsInView(false);
          }
        });
      },
      {
        threshold: [0.1, 0.2, 0.3],
        rootMargin: '100px',
      }
    );

    observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [isMounted, isLoaded]);

  // Reprocess embeds when loaded
  useEffect(() => {
    if (isMounted && isLoaded && typeof window !== 'undefined' && window.instgrm && embedRef.current) {
      window.instgrm.Embeds.process();
      setTimeout(() => {
        const iframe = embedRef.current?.querySelector('iframe');
        if (iframe && isInView) {
          iframe.style.opacity = '1';
          iframe.style.visibility = 'visible';
        }
      }, 500);
    }
  }, [isMounted, isLoaded, isInView]);

  // Add CSS to override Instagram embed colors
  useEffect(() => {
    if (!isMounted) return;

    const style = document.createElement('style');
    style.id = 'instagram-dark-theme';
    style.textContent = `
      .instagram-embed-wrapper .instagram-media {
        background: #1A1110 !important;
        border: 1px solid rgba(184, 115, 51, 0.3) !important;
      }
      .instagram-embed-wrapper .instagram-media iframe {
        background: #1A1110 !important;
        filter: brightness(0.95) contrast(1.1);
      }
      .instagram-embed-wrapper .instagram-media a {
        color: #D4A574 !important;
      }
      .instagram-embed-wrapper .instagram-media p {
        color: #8B6F47 !important;
      }
      .instagram-embed-wrapper blockquote {
        background: #1A1110 !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      const existingStyle = document.getElementById('instagram-dark-theme');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, [isMounted]);

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #000000 0%, #1A1110 50%, #000000 100%)',
        padding: '120px 0',
      }}
    >
      {/* Background gradient effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(184, 115, 51, 0.08), transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-8">
        {/* Premium Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16 sm:mb-20"
        >
          <div className="inline-flex items-center gap-6 mb-8">
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#B87333] to-[#B87333]" />
            <span
              className="text-xs uppercase tracking-[0.3em] px-4 py-2"
              style={{
                color: '#D4A574',
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                background: 'rgba(184, 115, 51, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(184, 115, 51, 0.2)',
              }}
            >
              WATCH & COMPARE
            </span>
            <div className="h-px w-24 bg-gradient-to-l from-transparent via-[#B87333] to-[#B87333]" />
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-6"
            style={{
              fontFamily: 'var(--font-heading)',
              lineHeight: 0.9,
              color: '#F5F1E8',
              fontWeight: 400,
              letterSpacing: '0.03em',
            }}
          >
            <span
              style={{
                background: 'linear-gradient(135deg, #FFFEF9 0%, #D4A574 40%, #B87333 60%, #D4A574 80%, #FFFEF9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 0 60px rgba(212, 165, 116, 0.3)',
              }}
            >
              ROBUSTA
            </span>
            <span className="mx-4" style={{ 
              color: '#B87333',
              textShadow: '0 0 20px rgba(184, 115, 51, 0.5)',
            }}>
              VS
            </span>
            <span style={{ 
              color: '#8B6F47',
              opacity: 0.8,
            }}>
              ARABICA
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl max-w-3xl mx-auto"
            style={{
              color: 'rgba(212, 165, 116, 0.7)',
              fontWeight: 300,
              lineHeight: 1.8,
              letterSpacing: '0.05em',
            }}
          >
            Experience the undeniable superiority through our latest content
          </motion.p>
        </motion.div>

        {/* Side-by-Side Layout: Video Left, Comparison Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left Side: Instagram Video - Premium Design */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="sticky top-24"
          >
            {/* Premium Frame with Multiple Layers */}
            <div className="relative">
              {/* Outer Glow Effect */}
              <div
                className="absolute -inset-1 rounded-[28px] opacity-30 blur-xl"
                style={{
                  background: 'linear-gradient(135deg, #B87333, #CD7F32, #D4A574, #CD7F32, #B87333)',
                }}
              />
              
              {/* Ultra Premium Container with Multi-Layer Design */}
              <div
                ref={embedRef}
                className="relative instagram-embed-wrapper"
                style={{
                  background: `
                    linear-gradient(135deg, 
                      rgba(0, 0, 0, 0.98) 0%, 
                      rgba(10, 10, 10, 0.97) 25%,
                      rgba(26, 17, 16, 0.96) 50%,
                      rgba(10, 10, 10, 0.97) 75%,
                      rgba(0, 0, 0, 0.98) 100%
                    )
                  `,
                  borderRadius: '32px',
                  padding: '48px',
                  position: 'relative',
                  boxShadow: `
                    0 32px 128px rgba(0, 0, 0, 0.9),
                    0 16px 64px rgba(184, 115, 51, 0.5),
                    0 8px 32px rgba(212, 165, 116, 0.3),
                    inset 0 3px 6px rgba(212, 165, 116, 0.2),
                    inset 0 -3px 6px rgba(184, 115, 51, 0.15),
                    0 0 0 2px rgba(184, 115, 51, 0.4),
                    0 0 60px rgba(184, 115, 51, 0.15)
                  `,
                }}
              >
                {/* Ultra Premium Animated Border with Multiple Layers */}
                <motion.div
                  className="absolute inset-0 rounded-[32px]"
                  style={{
                    background: 'linear-gradient(135deg, rgba(184, 115, 51, 0.9), rgba(205, 127, 50, 0.7), rgba(212, 165, 116, 0.6), rgba(205, 127, 50, 0.7), rgba(184, 115, 51, 0.9))',
                    padding: '5px',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    zIndex: 0,
                    filter: 'blur(1px)',
                  }}
                  animate={{
                    background: [
                      'linear-gradient(135deg, rgba(184, 115, 51, 0.9), rgba(205, 127, 50, 0.7), rgba(212, 165, 116, 0.6), rgba(205, 127, 50, 0.7), rgba(184, 115, 51, 0.9))',
                      'linear-gradient(225deg, rgba(212, 165, 116, 0.6), rgba(205, 127, 50, 0.7), rgba(184, 115, 51, 0.9), rgba(205, 127, 50, 0.7), rgba(212, 165, 116, 0.6))',
                      'linear-gradient(135deg, rgba(184, 115, 51, 0.9), rgba(205, 127, 50, 0.7), rgba(212, 165, 116, 0.6), rgba(205, 127, 50, 0.7), rgba(184, 115, 51, 0.9))',
                    ],
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                
                {/* Secondary Glow Layer */}
                <div
                  className="absolute -inset-2 rounded-[36px] opacity-30"
                  style={{
                    background: 'radial-gradient(circle, rgba(184, 115, 51, 0.4), transparent 70%)',
                    filter: 'blur(20px)',
                    zIndex: -1,
                  }}
                />
                
                {/* Inner Content Container with Ultra Premium Glass Effect */}
                <div
                  className="relative z-10"
                  style={{
                    background: `
                      linear-gradient(135deg, 
                        rgba(0, 0, 0, 0.97) 0%,
                        rgba(10, 10, 10, 0.95) 30%,
                        rgba(26, 17, 16, 0.93) 50%,
                        rgba(10, 10, 10, 0.95) 70%,
                        rgba(0, 0, 0, 0.97) 100%
                      )
                    `,
                    borderRadius: '28px',
                    overflow: 'hidden',
                    backdropFilter: 'blur(30px) saturate(180%)',
                    border: '2px solid rgba(184, 115, 51, 0.3)',
                    boxShadow: 'inset 0 2px 8px rgba(212, 165, 116, 0.1), inset 0 -2px 8px rgba(184, 115, 51, 0.1)',
                  }}
                >
                  {/* Premium Inner Glow Layers */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'radial-gradient(ellipse at 50% 30%, rgba(184, 115, 51, 0.2), transparent 70%)',
                    }}
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'radial-gradient(ellipse at 50% 70%, rgba(212, 165, 116, 0.1), transparent 70%)',
                    }}
                  />
                  {/* Premium Video Frame with Elegant Design */}
                  <div
                    className="relative mx-4 my-4"
                    style={{
                      background: 'linear-gradient(135deg, rgba(184, 115, 51, 0.25) 0%, rgba(205, 127, 50, 0.2) 50%, rgba(212, 165, 116, 0.15) 100%)',
                      borderRadius: '24px',
                      padding: '8px',
                      position: 'relative',
                    }}
                  >
                    {/* Animated Border Glow */}
                    <motion.div
                      className="absolute inset-0 rounded-[24px]"
                      style={{
                        background: 'linear-gradient(135deg, rgba(184, 115, 51, 0.5), rgba(205, 127, 50, 0.4), rgba(212, 165, 116, 0.3))',
                        filter: 'blur(12px)',
                      }}
                      animate={{
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                    
                    {/* Instagram Embed - Ultra Premium Styling */}
                    <blockquote
                      className="instagram-media relative z-10"
                      data-instgrm-permalink="https://www.instagram.com/reel/DNx2XdsWAGS/?utm_source=ig_embed&amp;utm_campaign=loading"
                      data-instgrm-version="14"
                      data-instgrm-captioned
                      style={{
                        background: '#000000',
                        border: '4px solid rgba(184, 115, 51, 0.6)',
                        borderRadius: '18px',
                        boxShadow: `
                          0 16px 64px rgba(0, 0, 0, 1),
                          0 8px 32px rgba(184, 115, 51, 0.4),
                          inset 0 3px 6px rgba(212, 165, 116, 0.3),
                          inset 0 -3px 6px rgba(184, 115, 51, 0.2),
                          0 0 0 2px rgba(212, 165, 116, 0.15),
                          0 0 40px rgba(184, 115, 51, 0.2)
                        `,
                        margin: '0',
                        maxWidth: '100%',
                        minWidth: '326px',
                        padding: '0',
                        width: '100%',
                        overflow: 'hidden',
                        position: 'relative',
                      }}
                    >
                      {/* Premium Top Accent Bar with Animation */}
                      <motion.div
                        className="absolute top-0 left-0 right-0 h-1.5 z-20"
                        style={{
                          background: 'linear-gradient(90deg, transparent, rgba(184, 115, 51, 1), rgba(212, 165, 116, 0.8), rgba(184, 115, 51, 1), transparent)',
                          boxShadow: '0 3px 12px rgba(184, 115, 51, 0.6)',
                        }}
                        animate={{
                          background: [
                            'linear-gradient(90deg, transparent, rgba(184, 115, 51, 1), rgba(212, 165, 116, 0.8), rgba(184, 115, 51, 1), transparent)',
                            'linear-gradient(90deg, transparent, rgba(212, 165, 116, 0.8), rgba(184, 115, 51, 1), rgba(212, 165, 116, 0.8), transparent)',
                            'linear-gradient(90deg, transparent, rgba(184, 115, 51, 1), rgba(212, 165, 116, 0.8), rgba(184, 115, 51, 1), transparent)',
                          ],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      />
                      
                      <div style={{ padding: '28px', background: 'linear-gradient(180deg, #000000 0%, #0A0A0A 25%, #1A1110 75%, #000000 100%)' }}>
                        <a
                          href="https://www.instagram.com/reel/DNx2XdsWAGS/?utm_source=ig_embed&amp;utm_campaign=loading"
                          style={{
                            background: 'transparent',
                            lineHeight: '0',
                            padding: '0 0',
                            textAlign: 'center',
                            textDecoration: 'none',
                            width: '100%',
                            display: 'block',
                          }}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {/* Loading placeholder - will be replaced by Instagram */}
                          <div style={{ padding: '19% 0', background: 'linear-gradient(135deg, #000000 0%, #0A0A0A 50%, #000000 100%)' }} />
                          <div
                            style={{
                              display: 'block',
                              height: '50px',
                              margin: '0 auto 12px',
                              width: '50px',
                            }}
                          >
                            <svg
                              width="50px"
                              height="50px"
                              viewBox="0 0 60 60"
                              version="1.1"
                              xmlns="https://www.w3.org/2000/svg"
                            >
                              <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                <g transform="translate(-511.000000, -20.000000)" fill="#B87333">
                                  <g>
                                    <path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631" />
                                  </g>
                                </g>
                              </g>
                            </svg>
                          </div>
                        </a>
                        <p
                          style={{
                            color: '#8B6F47',
                            fontFamily: 'var(--font-body), Arial, sans-serif',
                            fontSize: '13px',
                            lineHeight: '17px',
                            marginBottom: '0',
                            marginTop: '14px',
                            overflow: 'hidden',
                            padding: '12px 0',
                            textAlign: 'center',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            letterSpacing: '0.08em',
                            fontWeight: 500,
                          }}
                        >
                          <a
                            href="https://www.instagram.com/reel/DNx2XdsWAGS/?utm_source=ig_embed&amp;utm_campaign=loading"
                            style={{
                              color: '#D4A574',
                              fontFamily: 'var(--font-body), Arial, sans-serif',
                              fontSize: '13px',
                              fontStyle: 'normal',
                              fontWeight: '600',
                              lineHeight: '17px',
                              textDecoration: 'none',
                              transition: 'all 0.3s ease',
                              letterSpacing: '0.08em',
                            }}
                            target="_blank"
                            rel="noopener noreferrer"
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = '#B87333';
                              e.currentTarget.style.textShadow = '0 0 12px rgba(184, 115, 51, 0.6)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = '#D4A574';
                              e.currentTarget.style.textShadow = 'none';
                            }}
                          >
                            A post shared by rabuste (@rabuste.coffee)
                          </a>
                        </p>
                      </div>
                    </blockquote>
                  </div>

                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Comparison Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-4"
          >
            {/* Comparison Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {comparisonData.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.feature}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    whileHover={{ y: -6, scale: 1.03 }}
                    className="relative group"
                    style={{
                      background: `
                        linear-gradient(135deg, 
                          rgba(0, 0, 0, 0.95) 0%,
                          rgba(26, 17, 16, 0.93) 50%,
                          rgba(0, 0, 0, 0.95) 100%
                        )
                      `,
                      border: '3px solid rgba(184, 115, 51, 0.5)',
                      borderRadius: '20px',
                      padding: '24px',
                      boxShadow: `
                        0 12px 48px rgba(0, 0, 0, 0.7),
                        0 6px 24px rgba(184, 115, 51, 0.3),
                        inset 0 2px 4px rgba(212, 165, 116, 0.15),
                        inset 0 -2px 4px rgba(184, 115, 51, 0.1),
                        0 0 0 1px rgba(212, 165, 116, 0.1)
                      `,
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Premium Corner Accents */}
                    <div
                      className="absolute top-0 left-0 w-16 h-16 opacity-30"
                      style={{
                        background: 'radial-gradient(circle, rgba(184, 115, 51, 0.4), transparent)',
                        filter: 'blur(8px)',
                      }}
                    />
                    <div
                      className="absolute bottom-0 right-0 w-16 h-16 opacity-30"
                      style={{
                        background: 'radial-gradient(circle, rgba(212, 165, 116, 0.3), transparent)',
                        filter: 'blur(8px)',
                      }}
                    />
                    {/* Premium Icon with Glow */}
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className="relative"
                        style={{
                          background: `linear-gradient(135deg, ${item.robustaColor}, ${item.robustaColor}dd)`,
                          borderRadius: '14px',
                          padding: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: `
                            0 4px 16px ${item.robustaColor}40,
                            inset 0 1px 2px rgba(255, 255, 255, 0.2)
                          `,
                        }}
                      >
                        <Icon size={22} color="#000" strokeWidth={2.5} />
                        <div
                          className="absolute inset-0 rounded-[14px] opacity-50"
                          style={{
                            background: `radial-gradient(circle, ${item.robustaColor}, transparent)`,
                            filter: 'blur(8px)',
                          }}
                        />
                      </div>
                      <h3
                        className="font-bold text-base flex-1"
                        style={{
                          color: '#F5F1E8',
                          fontFamily: 'var(--font-heading)',
                          letterSpacing: '0.08em',
                          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                        }}
                      >
                        {item.feature}
                      </h3>
                    </div>

                    {/* Premium Comparison Values */}
                    <div className="space-y-4">
                      {/* Robusta Card - Premium Design */}
                      <div
                        className="relative overflow-hidden"
                        style={{
                          background: `
                            linear-gradient(135deg, 
                              ${item.robustaColor}25 0%, 
                              ${item.robustaColor}15 50%,
                              ${item.robustaColor}20 100%
                            )
                          `,
                          border: `2px solid ${item.robustaColor}60`,
                          borderRadius: '14px',
                          padding: '16px',
                          position: 'relative',
                          boxShadow: `
                            0 4px 16px ${item.robustaColor}30,
                            inset 0 1px 2px rgba(255, 255, 255, 0.1)
                          `,
                        }}
                      >
                        {/* Subtle Glow */}
                        <div
                          className="absolute inset-0 opacity-20"
                          style={{
                            background: `radial-gradient(circle at top right, ${item.robustaColor}, transparent)`,
                            filter: 'blur(12px)',
                          }}
                        />
                        <div className="relative z-10 flex items-center justify-between">
                          <div>
                            <p
                              className="text-xs uppercase tracking-widest mb-2"
                              style={{
                                color: '#8B6F47',
                                fontFamily: 'var(--font-body)',
                                fontWeight: 600,
                                letterSpacing: '0.15em',
                              }}
                            >
                              ROBUSTA
                            </p>
                            <p
                              className="text-xl font-bold"
                              style={{
                                color: item.robustaColor,
                                fontFamily: 'var(--font-heading)',
                                textShadow: `0 2px 8px ${item.robustaColor}40`,
                                letterSpacing: '0.05em',
                              }}
                            >
                              {item.robusta}
                            </p>
                          </div>
                          <div
                            style={{
                              background: `linear-gradient(135deg, ${item.robustaColor}, ${item.robustaColor}dd)`,
                              borderRadius: '50%',
                              padding: '8px',
                              boxShadow: `0 4px 12px ${item.robustaColor}50`,
                            }}
                          >
                            <Check
                              size={20}
                              color="#000"
                              strokeWidth={3}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Arabica Card - Muted Premium Design */}
                      <div
                        className="relative overflow-hidden"
                        style={{
                          background: 'linear-gradient(135deg, rgba(107, 87, 68, 0.15), rgba(107, 87, 68, 0.08))',
                          border: '2px solid rgba(107, 87, 68, 0.3)',
                          borderRadius: '14px',
                          padding: '16px',
                          opacity: 0.75,
                          filter: 'grayscale(20%)',
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p
                              className="text-xs uppercase tracking-widest mb-2"
                              style={{
                                color: '#6B5744',
                                fontFamily: 'var(--font-body)',
                                fontWeight: 600,
                                letterSpacing: '0.15em',
                              }}
                            >
                              ARABICA
                            </p>
                            <p
                              className="text-xl font-semibold"
                              style={{
                                color: '#6B5744',
                                fontFamily: 'var(--font-heading)',
                                letterSpacing: '0.05em',
                              }}
                            >
                              {item.arabica}
                            </p>
                          </div>
                          <div
                            style={{
                              background: 'rgba(107, 87, 68, 0.3)',
                              borderRadius: '50%',
                              padding: '8px',
                            }}
                          >
                            <X
                              size={18}
                              color="#6B5744"
                              strokeWidth={2.5}
                              style={{ opacity: 0.6 }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Premium Winner Badge */}
                    <div
                      className="absolute top-4 right-4 z-10"
                      style={{
                        background: `linear-gradient(135deg, ${item.robustaColor}, ${item.robustaColor}dd)`,
                        borderRadius: '10px',
                        padding: '6px 14px',
                        boxShadow: `
                          0 4px 16px ${item.robustaColor}50,
                          inset 0 1px 2px rgba(255, 255, 255, 0.3)
                        `,
                        border: '1px solid rgba(212, 165, 116, 0.4)',
                      }}
                    >
                      <span
                        className="text-xs font-bold uppercase tracking-widest"
                        style={{
                          color: '#000',
                          fontFamily: 'var(--font-heading)',
                          letterSpacing: '0.15em',
                          textShadow: '0 1px 2px rgba(255, 255, 255, 0.3)',
                        }}
                      >
                        Winner
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Follow CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="text-center pt-4"
            >
              <a
                href="https://www.instagram.com/rabuste.coffee/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-all hover:scale-105"
                style={{
                  background: 'rgba(184, 115, 51, 0.2)',
                  border: '1px solid rgba(184, 115, 51, 0.5)',
                  color: '#D4A574',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                }}
              >
                <Instagram size={18} />
                <span>Follow @rabuste.coffee for more</span>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}
