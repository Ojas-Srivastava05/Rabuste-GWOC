'use client';

import React, { useEffect, useState } from 'react';

export default function Origin() {
  const [hoveredStat, setHoveredStat] = useState(null);

  // simple mobile detection
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  const stats = [
    { label: "Caffeine", value: "2x", icon: "⚡" },
    { label: "Altitude", value: "0-800m", icon: "⛰️" },
    { label: "Structure", value: "Stronger", icon: "💪" }
  ];

  const regions = [
    { name: "Congo Basin", position: "Central Africa" },
    { name: "Vietnam", position: "Southeast Asia" },
    { name: "India", position: "South Asia" }
  ];

  // simplified mobile layout: vertical scroll of cards
  if (isMobile) {
    return (
      <section
        id="origin-section"
        style={{
          width: "100%",
          minHeight: "100vh",
          padding: "18px",
          backgroundColor: "transparent",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ textAlign: "center" }}>
            <span style={{ fontSize: "0.7rem", letterSpacing: "0.12em", color: "#c4a574", fontWeight: 600, textTransform: "uppercase" }}>
              Where It All Begins
            </span>
            <h1 style={{ margin: "8px 0", fontSize: "2rem", fontWeight: 800, color: "#FAD0C4", fontFamily: "Montserrat, sans-serif" }}>
              ORIGIN
            </h1>
          </div>

          <div style={{ borderRadius: 12, overflow: "hidden", boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}>
            <img src="/origin/RobustaBeans.png" alt="Robusta beans" style={{ width: "100%", height: "auto", display: "block", objectFit: "contain" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {stats.map((s, i) => (
              <div key={i} style={{ background: "rgba(26,26,26,0.6)", borderRadius: 10, padding: 12, display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ fontSize: 22 }}>{s.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, color: "#c4a574" }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: "#E6C9A8" }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: "rgba(26,26,26,0.5)", borderRadius: 12, padding: 14 }}>
            <p style={{ margin: "0 0 10px 0", color: "#FAD0C4" }}>
              Robusta beans originate from the <strong style={{ color: "#c4a574" }}>rainforests of Central & Western Africa</strong>, especially the <strong style={{ color: "#C89B7B" }}>Congo Basin</strong>.
            </p>
            <p style={{ margin: 0, color: "#FAD0C4" }}>
              They evolved to survive <em style={{ color: "#E6C9A8" }}>harsh climates, pests, and lower altitudes</em>, giving them <strong style={{ color: "#c4a574" }}>higher caffeine</strong> and <strong style={{ color: "#c4a574" }}>stronger structure</strong>.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {regions.map((r, i) => (
              <div key={i} style={{ background: "rgba(26,26,26,0.5)", borderRadius: 10, padding: 12 }}>
                <div style={{ fontWeight: 700, color: "#FAD0C4" }}>{r.name}</div>
                <div style={{ fontSize: 13, color: "#E6C9A8" }}>{r.position}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // desktop / original layout (unchanged)
  return (
    <section
      id="origin-section"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflow: 'hidden',
        backgroundColor: 'transparent'
      }}
    >
      {/* Decorative glow */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(196, 165, 116, 0.06) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{
        maxWidth: '1200px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '30px',
        alignItems: 'center'
      }}>
        {/* Left: Image + Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center' }}>
            <span style={{
              fontSize: '0.7rem',
              letterSpacing: '0.15em',
              color: '#c4a574',
              fontWeight: 600,
              textTransform: 'uppercase'
            }}>
              Where It All Begins
            </span>
            <h1 style={{
              margin: '8px 0',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #FAD0C4 0%, #c4a574 50%, #E6C9A8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontFamily: "Montserrat, sans-serif"
            }}>
              ORIGIN
            </h1>
          </div>

          {/* Bean Image */}
          <div style={{ position: 'relative' }}>
            <img
              src="/origin/RobustaBeans.png"
              alt="Robusta beans"
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
                filter: 'brightness(1.4) contrast(1.15) saturate(1.25) drop-shadow(0 20px 40px rgba(0,0,0,0.5))',
                maxHeight: '300px'
              }}
            />
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center'
          }}>
            {stats.map((stat, index) => (
              <div
                key={index}
                onMouseEnter={() => setHoveredStat(index)}
                onMouseLeave={() => setHoveredStat(null)}
                style={{
                  background: hoveredStat === index 
                    ? 'linear-gradient(135deg, rgba(74, 40, 37, 0.4) 0%, rgba(26, 26, 26, 0.6) 100%)'
                    : 'rgba(26, 26, 26, 0.5)',
                  border: `1px solid ${hoveredStat === index ? '#c4a574' : 'rgba(42, 42, 42, 0.8)'}`,
                  borderRadius: '12px',
                  padding: '16px',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  transform: hoveredStat === index ? 'translateY(-2px)' : 'translateY(0)',
                  cursor: 'pointer',
                  flex: 1,
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{stat.icon}</div>
                <div style={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: '#c4a574',
                  fontFamily: "Montserrat, sans-serif"
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#FAD0C4',
                  opacity: 0.8
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Main Content */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.6) 0%, rgba(42, 42, 42, 0.4) 100%)',
            border: '1px solid rgba(196, 165, 116, 0.2)',
            borderRadius: '20px',
            padding: '30px',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
          }}>
            <div style={{
              color: '#FAD0C4',
              fontSize: 'clamp(0.9rem, 1.5vw, 1rem)',
              lineHeight: 1.7,
              fontFamily: "Montserrat, sans-serif"
            }}>
              <p style={{ margin: '0 0 1rem 0', fontWeight: 400 }}>
                Robusta beans originate from the{' '}
                <span style={{ color: '#c4a574', fontWeight: 700 }}>
                  rainforests of Central & Western Africa
                </span>, especially the{' '}
                <strong style={{ color: '#C89B7B', fontWeight: 700 }}>Congo Basin</strong>.
              </p>

              <p style={{ margin: '0 0 1rem 0', fontWeight: 400 }}>
                They evolved to survive{' '}
                <em style={{ color: '#E6C9A8', fontStyle: 'italic', fontWeight: 600 }}>
                  harsh climates, pests, and lower altitudes
                </em>, giving them{' '}
                <strong style={{ color: '#c4a574', fontWeight: 700 }}>higher caffeine</strong> and{' '}
                <span style={{ color: '#c4a574', fontWeight: 700 }}>stronger structure</span>.
              </p>

              <p style={{ margin: 0, fontWeight: 400 }}>
                As coffee spread globally, Robusta found its place in{' '}
                <span style={{ color: '#E6C9A8', fontWeight: 600 }}>Asia and India</span>, valued for{' '}
                <strong style={{ color: '#C89B7B', fontWeight: 700 }}>
                  resilience, intensity, and bold character
                </strong>.
              </p>
            </div>
          </div>

          {/* Regions */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px'
          }}>
            {regions.map((region, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(26, 26, 26, 0.6)',
                  border: '1px solid rgba(42, 42, 42, 0.8)',
                  borderRadius: '12px',
                  padding: '16px 12px',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  textAlign: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#c4a574';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(42, 42, 42, 0.8)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <h4 style={{
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: '#FAD0C4',
                  margin: '0 0 4px 0',
                  fontFamily: "Montserrat, sans-serif"
                }}>
                  {region.name}
                </h4>
                <p style={{
                  fontSize: '0.75rem',
                  color: '#E6C9A8',
                  margin: 0,
                  opacity: 0.8
                }}>
                  {region.position}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}