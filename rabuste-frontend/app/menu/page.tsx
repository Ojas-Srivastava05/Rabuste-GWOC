"use client";

import { useEffect } from "react";
import "./menu.css";
import gsap from "gsap";
import { initAccordionSlider } from "./menu.core";

export default function Page() {
  useEffect(() => {
    // initialize accordion slider once on mount
    initAccordionSlider();
  }, []);

  return (
    <div className="slider-container">
      <div className="now-showing">Now in Showroom</div>

      <div className="accordion-slider">
        <div
          className="slide"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1617788138017-80ad40651399?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')"
          }}
        >
          <div className="slide-content">
            <div className="slide-number">01</div>
            <div className="car-brand">BMW M3</div>
            <div className="car-name">BMW M3 Competition</div>
            <div className="car-subtitle">Twin-Turbo Inline-6 Performance</div>
            <div className="car-specs">
              <div className="spec-row">
                <span className="spec-label">Engine:</span>
                <span className="spec-value">3.0L Twin-Turbo Inline-6</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Power:</span>
                <span className="spec-value">503 HP @ 6,250 RPM</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Torque:</span>
                <span className="spec-value">650 Nm @ 2,750 RPM</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Transmission:</span>
                <span className="spec-value">8-Speed Automatic</span>
              </div>
            </div>
            <div className="performance-badges">
              <div className="badge">
                <div className="badge-icon" />
                <span>0-100: 3.9s</span>
              </div>
              <div className="badge">
                <div className="badge-icon" />
                <span>Top Speed: 290 km/h</span>
              </div>
              <div className="badge">
                <div className="badge-icon" />
                <span>Price: $73,400</span>
              </div>
            </div>
          </div>
          <div className="add-button" />
        </div>

        <div
          className="slide"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80')"
          }}
        >
          <div className="slide-content">
            <div className="slide-number">02</div>
            <div className="car-brand">Lamborghini Huracán</div>
            <div className="car-name">Lamborghini Huracán</div>
            <div className="car-subtitle">Naturally Aspirated V10 Excellence</div>
            <div className="car-specs">
              <div className="spec-row">
                <span className="spec-label">Engine:</span>
                <span className="spec-value">5.2L V10 Naturally Aspirated</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Power:</span>
                <span className="spec-value">610 HP @ 8,250 RPM</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Torque:</span>
                <span className="spec-value">560 Nm @ 6,500 RPM</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Transmission:</span>
                <span className="spec-value">7-Speed Dual-Clutch</span>
              </div>
            </div>
            <div className="performance-badges">
              <div className="badge">
                <div className="badge-icon" />
                <span>0-100: 3.2s</span>
              </div>
              <div className="badge">
                <div className="badge-icon" />
                <span>Top Speed: 325 km/h</span>
              </div>
              <div className="badge">
                <div className="badge-icon" />
                <span>Price: $248,295</span>
              </div>
            </div>
          </div>
          <div className="add-button" />
        </div>

        <div
          className="slide"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')"
          }}
        >
          <div className="slide-content">
            <div className="slide-number">03</div>
            <div className="car-brand">Ferrari SF90</div>
            <div className="car-name">Ferrari SF90 Stradale</div>
            <div className="car-subtitle">Plug-in Hybrid Revolution</div>
            <div className="car-specs">
              <div className="spec-row">
                <span className="spec-label">Engine:</span>
                <span className="spec-value">4.0L V8 Twin-Turbo + Electric</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Power:</span>
                <span className="spec-value">1000 HP Combined</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Torque:</span>
                <span className="spec-value">800 Nm @ 6,000 RPM</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Transmission:</span>
                <span className="spec-value">8-Speed F1 DCT</span>
              </div>
            </div>
            <div className="performance-badges">
              <div className="badge">
                <div className="badge-icon" />
                <span>0-100: 2.5s</span>
              </div>
              <div className="badge">
                <div className="badge-icon" />
                <span>Top Speed: 340 km/h</span>
              </div>
              <div className="badge">
                <div className="badge-icon" />
                <span>Price: $625,000</span>
              </div>
            </div>
          </div>
          <div className="add-button" />
        </div>

        <div
          className="slide"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1563720223185-11003d516935?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')"
          }}
        >
          <div className="slide-content">
            <div className="slide-number">04</div>
            <div className="car-brand">Porsche 911</div>
            <div className="car-name">Porsche 911 Turbo S</div>
            <div className="car-subtitle">Twin-Turbo Flat-Six Perfection</div>
            <div className="car-specs">
              <div className="spec-row">
                <span className="spec-label">Engine:</span>
                <span className="spec-value">3.8L Twin-Turbo Flat-6</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Power:</span>
                <span className="spec-value">640 HP @ 6,750 RPM</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Torque:</span>
                <span className="spec-value">800 Nm @ 2,500 RPM</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Transmission:</span>
                <span className="spec-value">8-Speed PDK</span>
              </div>
            </div>
            <div className="performance-badges">
              <div className="badge">
                <div className="badge-icon" />
                <span>0-100: 2.7s</span>
              </div>
              <div className="badge">
                <div className="badge-icon" />
                <span>Top Speed: 330 km/h</span>
              </div>
              <div className="badge">
                <div className="badge-icon" />
                <span>Price: $207,000</span>
              </div>
            </div>
          </div>
          <div className="add-button" />
        </div>
      </div>

      <button type="button" className="navigation-arrows nav-prev">
        ‹
      </button>
      <button type="button" className="navigation-arrows nav-next">
        ›
      </button>
    </div>
  );
}