"use client";

import "aframe";
import { useState, useEffect } from "react";

const scenes = [
  {
    id: "brewing",
    title: "The Brewing Ritual",
    subtitle: "Watch our baristas craft the perfect pour",
    src: "/vr/brewing.png",
    highlights: [
      { label: "Espresso Machine", info: "Italian craftsmanship at its finest" },
      { label: "Fresh Grinder", info: "Beans ground to perfection daily" },
      { label: "Pour Over Station", info: "Precision brewing technique" }
    ]
  },
  {
    id: "cafe",
    title: "Inside Rabuste",
    subtitle: "Experience the warmth of our space",
    src: "/vr/cafe.png",
    highlights: [
      { label: "Cozy Seating", info: "Comfortable atmosphere for work or relaxation" },
      { label: "Art Gallery", info: "Featuring local artists monthly" },
      { label: "Natural Light", info: "Floor-to-ceiling windows" }
    ]
  },
  {
    id: "origin",
    title: "From Bean to Cup",
    subtitle: "Trace the journey of every bean",
    src: "/vr/origin.png",
    highlights: [
      { label: "Ethiopian Highlands", info: "Single-origin coffee farms" },
      { label: "Small Batch Roasting", info: "Roasted fresh weekly" },
      { label: "Quality Control", info: "Every batch tested and cupped" }
    ]
  },
];

export default function VRGallery() {
  const [active, setActive] = useState(scenes[0]);
  const [loading, setLoading] = useState(false);
  const [rotation, setRotation] = useState(-90);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, [active]);

  const handleSceneChange = (scene) => {
    if (scene.id !== active.id) {
      setActive(scene);
      setRotation(-90);
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const delta = e.clientX - startX;
      setRotation(prev => prev + delta * 0.3);
      setStartX(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };



  return (
    <section className="text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Compact Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-white via-[#c4a574] to-white bg-clip-text text-transparent">
            Step Inside Rabuste
          </h2>
          <p className="text-sm text-gray-400">
            Drag to explore in 360° and discover our story
          </p>
        </div>

        {/* VR Viewer */}
        <div className="relative group mb-6">
          {loading && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 rounded-2xl backdrop-blur-sm">
              <div className="w-10 h-10 border-4 border-[#c4a574]/30 border-t-[#c4a574] rounded-full animate-spin" />
            </div>
          )}

          <div className="absolute top-4 left-4 z-40 bg-black/70 backdrop-blur-md rounded-lg px-3 py-2 border border-[#2a2a2a]">
            <h3 className="text-lg font-bold text-white">{active.title}</h3>
            <p className="text-xs text-gray-400">{active.subtitle}</p>
          </div>



          <div
            className="w-full rounded-2xl overflow-hidden border border-[#2a2a2a] shadow-2xl"
            style={{
              height: "500px",
              cursor: isDragging ? "grabbing" : "grab"
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <a-scene 
              embedded 
              style={{ width: "100%", height: "100%" }}
              vr-mode-ui="enabled: false"
            >
              <a-sky 
                src={active.src} 
                rotation={`0 ${rotation} 0`}
              />
            </a-scene>
          </div>
        </div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {active.highlights.map((highlight, index) => (
            <div
              key={index}
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 hover:border-[#c4a574]/50 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#c4a574] mt-2 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">{highlight.label}</h4>
                  <p className="text-xs text-gray-400">{highlight.info}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scene Selector */}
        <div className="flex justify-center gap-3 flex-wrap">
          {scenes.map((scene) => (
            <button
              key={scene.id}
              onClick={() => handleSceneChange(scene)}
              className={`px-5 py-3 rounded-xl transition-all duration-300 border ${
                active.id === scene.id
                  ? "bg-gradient-to-br from-[#4a2825] to-[#3a1f1c] border-[#c4a574] shadow-lg shadow-[#c4a574]/20"
                  : "bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#c4a574]/50"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  active.id === scene.id 
                    ? "bg-[#c4a574] text-black" 
                    : "bg-[#252525] text-gray-400"
                }`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className={`text-sm font-semibold ${
                    active.id === scene.id ? "text-white" : "text-gray-300"
                  }`}>
                    {scene.title}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </section>
  );
}