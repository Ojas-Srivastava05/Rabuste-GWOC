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
        left: "50%",
        bottom: 24,
        transform: "translateX(-50%)",
        zIndex: 999,
        width: 48,
        height: 48,
        borderRadius: 999,
        display: visible ? "flex" : "none",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(26, 17, 16, 0.95)",
        border: "2px solid rgba(184, 115, 51, 0.6)",
        color: "#D4A574",
        backdropFilter: "blur(10px)",
        cursor: "pointer",
        boxShadow: "0 8px 32px rgba(184, 115, 51, 0.4)",
        transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
        pointerEvents: "auto",
        willChange: "transform, opacity",
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleScrollToTop();
        }
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateX(-50%) translateY(-4px) scale(1.1)";
        e.currentTarget.style.boxShadow = "0 12px 40px rgba(184, 115, 51, 0.5)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateX(-50%) translateY(0)";
        e.currentTarget.style.boxShadow = "0 8px 32px rgba(184, 115, 51, 0.4)";
      }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 5l-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 5l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 19V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}