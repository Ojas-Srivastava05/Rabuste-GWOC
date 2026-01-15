"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Play, Volume2 } from 'lucide-react';

export default function InstagramReel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const embedRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state after component mounts (client-only)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load Instagram embed script (client-only)
  useEffect(() => {
    if (!isMounted) return;

    if (typeof window !== 'undefined' && !window.instgrm) {
      const script = document.createElement('script');
      script.src = '//www.instagram.com/embed.js';
      script.async = true;
      script.onload = () => {
        setIsLoaded(true);
        if (window.instgrm) {
          // Process embeds immediately
          window.instgrm.Embeds.process();
          
          // Reprocess after a short delay to ensure they're fully loaded
          setTimeout(() => {
            if (window.instgrm) {
              window.instgrm.Embeds.process();
            }
          }, 300);
        }
      };
      document.body.appendChild(script);

      return () => {
        // Cleanup script if component unmounts
        const existingScript = document.querySelector('script[src="//www.instagram.com/embed.js"]');
        if (existingScript) {
          existingScript.remove();
        }
      };
    } else if (typeof window !== 'undefined' && window.instgrm) {
      setIsLoaded(true);
      window.instgrm.Embeds.process();
      
      // Reprocess after a short delay
      setTimeout(() => {
        if (window.instgrm) {
          window.instgrm.Embeds.process();
        }
      }, 300);
    }
  }, [isMounted]);

  // Intersection Observer for autoplay on scroll (client-only)
  useEffect(() => {
    if (!isMounted || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.2) {
            setIsInView(true);
            
            // Try multiple methods to trigger autoplay
            const triggerAutoplay = () => {
              const iframe = containerRef.current?.querySelector('iframe');
              if (!iframe) return;
              
              // Ensure iframe is visible and ready
              iframe.style.opacity = '1';
              iframe.style.display = 'block';
              iframe.style.visibility = 'visible';
              
              // Method 1: Try to send play message to iframe
              try {
                if (iframe.contentWindow) {
                  // Try different message formats that Instagram might listen to
                  iframe.contentWindow.postMessage(
                    JSON.stringify({
                      type: 'play',
                      action: 'play'
                    }),
                    '*'
                  );
                  
                  iframe.contentWindow.postMessage(
                    JSON.stringify({
                      type: 'scroll',
                      details: { direction: 'down' }
                    }),
                    '*'
                  );
                  
                  // Try direct play command
                  iframe.contentWindow.postMessage('play', '*');
                }
              } catch (e) {
                // CORS may block this, but it's worth trying
              }
              
              // Method 2: Trigger click on iframe to activate it
              setTimeout(() => {
                try {
                  iframe.focus();
                  iframe.click();
                } catch (e) {
                  // May fail due to iframe restrictions
                }
              }, 100);
              
              // Method 3: Reprocess embeds to ensure they're active
              if (isLoaded && window.instgrm) {
                setTimeout(() => {
                  if (window.instgrm) {
                    window.instgrm.Embeds.process();
                  }
                }, 200);
              }
              
              // Method 4: Force a small scroll to wake up the embed
              setTimeout(() => {
                window.dispatchEvent(new Event('scroll'));
                // Also try dispatching a custom event
                const event = new CustomEvent('instagram-embed-visible');
                window.dispatchEvent(event);
              }, 150);
            };
            
            // Trigger immediately
            triggerAutoplay();
            
            // Also trigger after a delay to ensure iframe is loaded
            setTimeout(triggerAutoplay, 500);
            setTimeout(triggerAutoplay, 1000);
            
          } else {
            setIsInView(false);
          }
        });
      },
      {
        threshold: [0.1, 0.2, 0.3], // Multiple thresholds for better detection
        rootMargin: '100px', // Start loading 100px before entering viewport
      }
    );

    observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [isMounted, isLoaded]);

  // Reprocess embeds when loaded (client-only)
  useEffect(() => {
    if (isMounted && isLoaded && typeof window !== 'undefined' && window.instgrm && embedRef.current) {
      window.instgrm.Embeds.process();
      
      // Try to ensure autoplay after processing
      setTimeout(() => {
        const iframe = embedRef.current?.querySelector('iframe');
        if (iframe && isInView) {
          // Ensure iframe is visible and active
          iframe.style.opacity = '1';
          iframe.style.visibility = 'visible';
        }
      }, 500);
    }
  }, [isMounted, isLoaded, isInView]);

  // Add CSS to override Instagram embed colors after mount
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
      .instagram-embed-wrapper .instagram-media * {
        color: #F5F1E8 !important;
      }
      /* Override Instagram's default white background */
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#B87333]" />
            <span
              className="text-xs uppercase tracking-[0.2em]"
              style={{
                color: '#8B6F47',
                fontFamily: 'var(--font-body)',
                fontWeight: 400,
              }}
            >
              LATEST FROM INSTAGRAM
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#B87333]" />
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4"
            style={{
              fontFamily: 'var(--font-heading)',
              lineHeight: 0.9,
              color: '#F5F1E8',
              fontWeight: 400,
              letterSpacing: '0.02em',
            }}
          >
            <span
              style={{
                background: 'linear-gradient(135deg, #FFFEF9 0%, #D4A574 50%, #FFFEF9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              WATCH
            </span>
            <span className="mx-2" style={{ color: '#B87333' }}>
              OUR
            </span>
            <span
              style={{
                background: 'linear-gradient(135deg, #FFFEF9 0%, #D4A574 50%, #FFFEF9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              STORY
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg max-w-2xl mx-auto"
            style={{
              color: 'rgba(245, 241, 232, 0.6)',
              fontWeight: 300,
              lineHeight: 1.7,
            }}
          >
            Experience Rabuste through our latest Instagram reel
          </motion.p>
        </motion.div>

        {/* Instagram Reel Container - Better placement with larger size */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex justify-center items-center"
        >
          <div
            ref={embedRef}
            className="relative instagram-embed-wrapper"
            style={{
              background: 'linear-gradient(135deg, rgba(26, 17, 16, 0.98) 0%, rgba(45, 28, 20, 0.95) 100%)',
              border: '2px solid rgba(184, 115, 51, 0.6)',
              borderRadius: '20px',
              padding: '28px',
              maxWidth: '650px',
              width: '100%',
              boxShadow: `
                0 16px 64px rgba(184, 115, 51, 0.4),
                0 0 0 1px rgba(184, 115, 51, 0.2),
                inset 0 1px 0 rgba(212, 165, 116, 0.1)
              `,
            }}
          >
            {/* Instagram Embed - Styled for dark theme with autoplay */}
            <blockquote
              className="instagram-media"
              data-instgrm-permalink="https://www.instagram.com/reel/DNx2XdsWAGS/?utm_source=ig_embed&amp;utm_campaign=loading"
              data-instgrm-version="14"
              data-instgrm-captioned
              data-autoplay="true"
              style={{
                background: '#1A1110',
                border: '1px solid rgba(184, 115, 51, 0.3)',
                borderRadius: '12px',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(184, 115, 51, 0.1)',
                margin: '0',
                maxWidth: '100%',
                minWidth: '326px',
                padding: '0',
                width: '100%',
              }}
            >
              <div style={{ padding: '16px', background: '#1A1110' }}>
                <a
                  href="https://www.instagram.com/reel/DNx2XdsWAGS/?utm_source=ig_embed&amp;utm_campaign=loading"
                  style={{
                    background: 'transparent',
                    lineHeight: '0',
                    padding: '0 0',
                    textAlign: 'center',
                    textDecoration: 'none',
                    width: '100%',
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <div
                      style={{
                        backgroundColor: 'rgba(184, 115, 51, 0.3)',
                        borderRadius: '50%',
                        flexGrow: '0',
                        height: '40px',
                        marginRight: '14px',
                        width: '40px',
                      }}
                    />
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: '1',
                        justifyContent: 'center',
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: 'rgba(212, 165, 116, 0.2)',
                          borderRadius: '4px',
                          flexGrow: '0',
                          height: '14px',
                          marginBottom: '6px',
                          width: '100px',
                        }}
                      />
                      <div
                        style={{
                          backgroundColor: 'rgba(212, 165, 116, 0.2)',
                          borderRadius: '4px',
                          flexGrow: '0',
                          height: '14px',
                          width: '60px',
                        }}
                      />
                    </div>
                  </div>
                  <div style={{ padding: '19% 0' }} />
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
                      xmlnsXlink="https://www.w3.org/1999/xlink"
                    >
                      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                        <g
                          transform="translate(-511.000000, -20.000000)"
                          fill="#B87333"
                        >
                          <g>
                            <path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631" />
                          </g>
                        </g>
                      </g>
                    </svg>
                  </div>
                  <div style={{ padding: '12.5% 0' }} />
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      marginBottom: '14px',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          backgroundColor: 'rgba(212, 165, 116, 0.3)',
                          borderRadius: '50%',
                          height: '12.5px',
                          width: '12.5px',
                          transform: 'translateX(0px) translateY(7px)',
                        }}
                      />
                      <div
                        style={{
                          backgroundColor: 'rgba(212, 165, 116, 0.3)',
                          height: '12.5px',
                          transform: 'rotate(-45deg) translateX(3px) translateY(1px)',
                          width: '12.5px',
                          flexGrow: '0',
                          marginRight: '14px',
                          marginLeft: '2px',
                        }}
                      />
                      <div
                        style={{
                          backgroundColor: 'rgba(212, 165, 116, 0.3)',
                          borderRadius: '50%',
                          height: '12.5px',
                          width: '12.5px',
                          transform: 'translateX(9px) translateY(-18px)',
                        }}
                      />
                    </div>
                    <div style={{ marginLeft: '8px' }}>
                      <div
                        style={{
                          backgroundColor: 'rgba(212, 165, 116, 0.3)',
                          borderRadius: '50%',
                          flexGrow: '0',
                          height: '20px',
                          width: '20px',
                        }}
                      />
                      <div
                        style={{
                          width: '0',
                          height: '0',
                          borderTop: '2px solid transparent',
                          borderLeft: '6px solid rgba(212, 165, 116, 0.3)',
                          borderBottom: '2px solid transparent',
                          transform: 'translateX(16px) translateY(-4px) rotate(30deg)',
                        }}
                      />
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                      <div
                        style={{
                          width: '0px',
                          borderTop: '8px solid rgba(212, 165, 116, 0.3)',
                          borderRight: '8px solid transparent',
                          transform: 'translateY(16px)',
                        }}
                      />
                      <div
                        style={{
                          backgroundColor: 'rgba(212, 165, 116, 0.3)',
                          flexGrow: '0',
                          height: '12px',
                          width: '16px',
                          transform: 'translateY(-4px)',
                        }}
                      />
                      <div
                        style={{
                          width: '0',
                          height: '0',
                          borderTop: '8px solid rgba(212, 165, 116, 0.3)',
                          borderLeft: '8px solid transparent',
                          transform: 'translateY(-4px) translateX(8px)',
                        }}
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      flexGrow: '1',
                      justifyContent: 'center',
                      marginBottom: '24px',
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: 'rgba(212, 165, 116, 0.2)',
                        borderRadius: '4px',
                        flexGrow: '0',
                        height: '14px',
                        marginBottom: '6px',
                        width: '224px',
                      }}
                    />
                    <div
                      style={{
                        backgroundColor: 'rgba(212, 165, 116, 0.2)',
                        borderRadius: '4px',
                        flexGrow: '0',
                        height: '14px',
                        width: '144px',
                      }}
                    />
                  </div>
                </a>
                <p
                  style={{
                    color: '#8B6F47',
                    fontFamily: 'var(--font-body), Arial, sans-serif',
                    fontSize: '14px',
                    lineHeight: '17px',
                    marginBottom: '0',
                    marginTop: '8px',
                    overflow: 'hidden',
                    padding: '8px 0 7px',
                    textAlign: 'center',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <a
                    href="https://www.instagram.com/reel/DNx2XdsWAGS/?utm_source=ig_embed&amp;utm_campaign=loading"
                    style={{
                      color: '#D4A574',
                      fontFamily: 'var(--font-body), Arial, sans-serif',
                      fontSize: '14px',
                      fontStyle: 'normal',
                      fontWeight: '500',
                      lineHeight: '17px',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={(e) => e.currentTarget.style.color = '#B87333'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#D4A574'}
                  >
                    A post shared by rabuste (@rabuste.coffee)
                  </a>
                </p>
              </div>
            </blockquote>

            {/* Autoplay indicator (when in view) - Only show on client */}
            {isMounted && isInView && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{
                  background: 'rgba(184, 115, 51, 0.9)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Play size={14} className="text-white" />
                <Volume2 size={14} className="text-white" />
                <span
                  className="text-xs font-semibold text-white"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Playing
                </span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Follow CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-8"
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
