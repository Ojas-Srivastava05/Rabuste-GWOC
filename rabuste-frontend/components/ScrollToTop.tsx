"use client";

import React, { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const docH = document.documentElement.scrollHeight || document.body.scrollHeight || 0;
      const vh = window.innerHeight || 0;
      setVisible(scrollY > 100 || docH <= vh + 20);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const handleScrollToTop = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    try {
      window.scrollTo?.({ top: 0, behavior: "smooth" });
      document.documentElement?.scrollTo?.({ top: 0, behavior: "smooth" });
      setTimeout(() => {
        window.scrollTo?.({ top: 0, behavior: "auto" });
        document.body.scrollTop = 0;
        document.documentElement!.scrollTop = 0;
      }, 600);
    } catch (err) {
      document.body.scrollTop = 0;
      document.documentElement!.scrollTop = 0;
    }
  };

  return (
    <button
      aria-label="Scroll to top"
      role="button"
      tabIndex={0}
      onClick={handleScrollToTop}
      style={{
        position: "fixed",
        right: 20,
        bottom: 20,
        zIndex: 2147483647,
        width: 52,
        height: 52,
        borderRadius: 999,
        display: visible ? "flex" : "none",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(180deg, rgba(246,230,220,0.06), rgba(246,230,220,0.04))",
        border: "1px solid rgba(246,230,220,0.12)",
        color: "#f6e6dc",
        backdropFilter: "blur(6px)",
        cursor: "pointer",
        boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
        transition: "transform 160ms ease, opacity 160ms ease",
        pointerEvents: "auto",
        willChange: "transform, opacity",
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleScrollToTop();
        }
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 5l-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 5l7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 19V7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}