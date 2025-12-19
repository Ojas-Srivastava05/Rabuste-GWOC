"use client";

import "aframe";
import { useState } from "react";

const scenes = [
  {
    id: "brewing",
    title: "The Brewing Ritual",
    src: "/vr/brewing.png",
  },
  {
    id: "cafe",
    title: "Inside Rabuste",
    src: "/vr/cafe.png",
  },
  {
    id: "origin",
    title: "From Bean to Cup",
    src: "/vr/origin.png",
  },
];

export default function VRGallery() {
  const [active, setActive] = useState(scenes[0]);

  return (
    <section className="text-white py-24">
      <h2 className="text-4xl font-bold text-center mb-4">
        Step Inside Rabuste
      </h2>
      <p className="text-center text-gray-400 mb-10">
        Explore the coffee, the space, and the story
      </p>

      {/* VR Scene */}
      <div
        className="w-full mx-auto rounded-xl overflow-hidden border border-[#2a2a2a]"
        style={{
          maxWidth: "1600px",          // much wider container
          width: "100%",
          height: 570,                 // shorter so it looks wide rather than tall
        }}
      >
        <a-scene embedded style={{ width: "100%", height: "100%" }}>
          <a-sky src={active.src} rotation="0 -90 0" />
        </a-scene>
      </div>

      {/* Scene Selector */}
      <div className="flex justify-center gap-4 mt-6">
        {scenes.map((scene) => (
          <button
            key={scene.id}
            onClick={() => setActive(scene)}
            className={`px-4 py-2 rounded-full text-sm transition
              ${
                active.id === scene.id
                  ? "bg-[#4a2825]"
                  : "bg-[#1a1a1a] text-gray-400"
              }`}
          >
            {scene.title}
          </button>
        ))}
      </div>
    </section>
  );
}
