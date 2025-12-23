'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import SpringCard from '../SpringCard';

// lightweight implementation — removed gsap/ScrollTrigger to speed up load
// we'll use IntersectionObserver + CSS transitions instead of heavy GSAP timelines

// Use public/ folder paths (leading slash) so Next.js serves them reliably
const items = [
  { id: '1', img: '/hero/img1.jpeg', title: 'Morning Brew' },
  { id: '2', img: '/hero/img2.jpeg', title: 'Cozy Corner' },
  { id: '3', img: '/hero/img3.jpeg', title: 'Perfect Pour' },
  { id: '4', img: '/hero/img4.jpeg', title: 'Fresh Roast' },
  { id: '5', img: '/hero/img5.jpeg', title: 'Latte Art' },
  { id: '6', img: '/hero/img6.jpeg', title: 'Bean Selection' },
  { id: '7', img: '/hero/img7.jpeg', title: 'Artisan Craft' },
  { id: '8', img: '/hero/img8.jpeg', title: 'Sweet Treats' },
  { id: '9', img: '/hero/img9.jpeg', title: 'Cafe Vibes' },
  { id: '10', img: '/hero/img10.jpeg', title: 'Golden Hour' }
];

export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!sectionRef.current) return;

    const el = sectionRef.current;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add('in-view');
            io.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );

    io.observe(el);

    // preload a few images (lightweight) to avoid black frames on change
    const preload = items.slice(0, 4).map((it) => {
      const img = new Image();
      img.src = it.img;
      return img;
    });

    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setActiveIndex(index);
    setIsAutoPlaying(false);
  };

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % items.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
    setIsAutoPlaying(false);
  };

  return (
    <section 
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px 100px', // add bottom padding so controls aren't flush to edge
        position: 'relative',
        overflow: 'visible' // allow page to scroll to controls / buttons
      }}
    >
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        /* springcard animation */
        @keyframes spring {
          0% { transform: scale(0.92) translateY(8px); opacity: 0; }
          50% { transform: scale(1.06) translateY(-6px); opacity: 1; }
          75% { transform: scale(0.98) translateY(2px); }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }

        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.3); opacity: 0; }
        }

        .gallery-main-image {
          position: relative;
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          background: transparent !important; /* stop using background-image crop */
        }
        /* actual img inside main container - show full image without cropping */
        .gallery-main-image > img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain; /* shows entire image (letterbox if aspect differs) */
          transition: opacity 0.6s ease-in-out, transform 0.6s cubic-bezier(0.16,1,0.3,1);
          will-change: opacity, transform;
          pointer-events: none;
        }

        .gallery-thumbnail {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
        }

        .gallery-thumbnail:hover {
          transform: translateY(-8px) scale(1.05);
        }

        .nav-button {
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .nav-button:hover {
          transform: scale(1.1);
          background: rgba(196, 165, 116, 0.3) !important;
        }

        .progress-bar {
          height: 2px;
          background: rgba(196, 165, 116, 0.2);
          position: relative;
          overflow: hidden;
          border-radius: 2px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #c4a574, #E6C9A8);
          animation: progress 4s linear infinite;
          transform-origin: left;
        }

        @keyframes progress {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
      `}</style>

      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '5%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(196, 165, 116, 0.12) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        pointerEvents: 'none',
        animation: 'float 8s ease-in-out infinite',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '5%',
        width: '350px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(200, 155, 123, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        pointerEvents: 'none',
        animation: 'float 10s ease-in-out infinite',
        animationDelay: '1s',
        zIndex: 0
      }} />

      <div style={{
        maxWidth: '1400px',
        width: '100%',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Header */}
        <div className="gallery-header" style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span style={{
            fontSize: '0.7rem',
            letterSpacing: '0.2em',
            color: '#c4a574',
            fontWeight: 600,
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '12px'
          }}>
            Visual Journey
          </span>

          {/* springcard wrapper for the title (clickable — navigates to /gallery) */}
          <SpringCard>
            <a
              id="experience-art-link"
              href="/gallery"
              style={{ textDecoration: 'none', display: 'inline-block', outline: 'none' }}
              aria-label="View Art Gallery"
            >
              <div
                role="button"
                tabIndex={0}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '12px 18px',
                  borderRadius: 16,
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.00))',
                  border: '1px solid rgba(196,165,116,0.12)',
                  boxShadow: '0 10px 30px rgba(12,12,12,0.45), 0 2px 8px rgba(196,165,116,0.06)',
                  cursor: 'pointer',
                  transformOrigin: 'center',
                  WebkitTapHighlightColor: 'transparent'
                }}
                onKeyDown={(e) => { if (e.key === 'Enter') (window.location.href = '/gallery'); }}
              >
                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#c4a574',
                  color: '#000',
                  fontWeight: 800,
                  fontSize: 20,
                  flexShrink: 0
                }}>
                  🎨
                </div>

                <div style={{ textAlign: 'left', lineHeight: 1 }}>
                  <h1 style={{
                    margin: 0,
                    fontSize: 'clamp(1.6rem, 3.6vw, 2.4rem)',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #FAD0C4 0%, #c4a574 50%, #E6C9A8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    letterSpacing: '-0.02em'
                  }}>
                    Experience art @Rabuste
                  </h1>
                  <div style={{ fontSize: '0.9rem', color: '#E6C9A8', opacity: 0.95, marginTop: 6 }}>
                    View the full gallery
                  </div>
                </div>

                <div style={{
                  marginLeft: 12,
                  padding: '6px 10px',
                  borderRadius: 999,
                  background: 'rgba(0,0,0,0.18)',
                  color: '#c4a574',
                  fontWeight: 700,
                  fontSize: 12,
                  alignSelf: 'flex-start'
                }}>
                  Open
                </div>
              </div>
            </a>
          </SpringCard>
 
          <p style={{
            color: '#E6C9A8',
            fontSize: '1.1rem',
            opacity: 0.9,
            margin: 0
          }}>
            {items[activeIndex].title}
          </p>
        </div>

        {/* Main Carousel */}
        <div style={{ position: 'relative', marginBottom: '40px' }}>
          {/* Main Image Container */}
          <div 
            ref={carouselRef}
            className="gallery-main-image"
            style={{
              position: 'relative',
              width: '100%',
              height: 'clamp(400px, 60vh, 600px)',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(196, 165, 116, 0.2)',
            }}
          >
            <img
              key={items[activeIndex].id}
              src={items[activeIndex].img}
              alt={items[activeIndex].title}
              style={{ width: '100%', height: '100%', display: 'block' }}
            />
            {/* Gradient overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)',
              pointerEvents: 'none'
            }} />

            {/* Image counter */}
            <div style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(10px)',
              padding: '8px 16px',
              borderRadius: '20px',
              color: '#c4a574',
              fontSize: '0.9rem',
              fontWeight: 600,
              border: '1px solid rgba(196, 165, 116, 0.2)'
            }}>
              {activeIndex + 1} / {items.length}
            </div>

            {/* Navigation Buttons */}
            <button
              className="nav-button"
              onClick={prevSlide}
              style={{
                position: 'absolute',
                left: '24px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(196, 165, 116, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#c4a574',
                fontSize: '1.5rem'
              }}
            >
              ‹
            </button>

            <button
              className="nav-button"
              onClick={nextSlide}
              style={{
                position: 'absolute',
                right: '24px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(196, 165, 116, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#c4a574',
                fontSize: '1.5rem'
              }}
            >
              ›
            </button>

            {/* Bottom info */}
            <div style={{
              position: 'absolute',
              bottom: '24px',
              left: '24px',
              right: '24px'
            }}>
              <h3 style={{
                margin: '0 0 12px 0',
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#FAD0C4',
                textShadow: '0 2px 10px rgba(0,0,0,0.8)'
              }}>
                {items[activeIndex].title}
              </h3>
              {isAutoPlaying && (
                <div className="progress-bar">
                  <div key={activeIndex} className="progress-fill" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Thumbnails */}
        <div 
          ref={thumbnailsRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
            gap: '12px',
            maxWidth: '1000px',
            margin: '0 auto 30px'
          }}
        >
          {items.map((item, index) => (
            <div
              key={item.id}
              className="gallery-thumbnail"
              onClick={() => goToSlide(index)}
              style={{
                position: 'relative',
                height: '80px',
                borderRadius: '12px',
                overflow: 'hidden',
                border: activeIndex === index 
                  ? '3px solid #c4a574' 
                  : '3px solid transparent',
                boxShadow: activeIndex === index
                  ? '0 4px 20px rgba(196, 165, 116, 0.4)'
                  : '0 2px 8px rgba(0, 0, 0, 0.3)',
                background: `url(${item.img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: activeIndex === index ? 1 : 0.6
              }}
            >
              {activeIndex === index && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(196, 165, 116, 0.2)',
                  pointerEvents: 'none'
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="gallery-controls" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              background: isAutoPlaying 
                ? 'linear-gradient(135deg, rgba(74, 40, 37, 0.4) 0%, rgba(26, 26, 26, 0.6) 100%)'
                : 'rgba(26, 26, 26, 0.5)',
              border: `1px solid ${isAutoPlaying ? '#c4a574' : 'rgba(42, 42, 42, 0.8)'}`,
              color: isAutoPlaying ? '#FAD0C4' : '#E6C9A8',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>{isAutoPlaying ? '⏸' : '▶'}</span>
            {isAutoPlaying ? 'Pause' : 'Play'} Slideshow
          </button>

          <div style={{
            color: '#E6C9A8',
            fontSize: '0.85rem',
            opacity: 0.7
          }}>
            Click thumbnails or use arrows to navigate
          </div>
        </div>
      </div>
    </section>
  );
}