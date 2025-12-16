"use client";

import dynamic from "next/dynamic";

const DotGrid = dynamic(() => import("@/components/DotGrid.jsx"), {
  ssr: false,
});

export default function DotGridBackground() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        zIndex: 0,
        backgroundColor: "#0a0a0a",
        pointerEvents: "auto",
      }}
    >
      <DotGrid
        dotSize={2}
        gap={15}
        baseColor="#6b3a2e"
        activeColor="#FF7400"
        proximity={100}
        shockRadius={200}
        shockStrength={1}
        resistance={750}
        returnDuration={1.5}
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  );
}
