"use client"; // Important! This component must be client-side only

import { useEffect, useState } from "react";

type CoffeeBeanProps = {
  delay: number;
  duration: number;
};

export default function CoffeeBean({ delay, duration }: CoffeeBeanProps) {
  const [left, setLeft] = useState(50); // default for SSR
  const [fontSize, setFontSize] = useState(24);
  const [animationDuration, setAnimationDuration] = useState(duration);

  useEffect(() => {
    // This runs only on the client
    setLeft(Math.random() * 100);
    setFontSize(16 + Math.random() * 20);
    setAnimationDuration(duration + Math.random() * 10);
  }, [delay, duration]);

  return (
    <div
      className="absolute block drop-shadow-[0_0_8px_rgba(251,191,36,0.3)] animate-coffee-fall"
      style={{
        left: `${left}%`,
        top: "-10%",
        fontSize: `${fontSize}px`,
        animationDelay: `${delay}s`,
        animationDuration: `${animationDuration}s`,
        lineHeight: 1,
        fontFamily:
          "Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif",
        zIndex: 5,
      }}
    >
      ☕
    </div>
  );
}
