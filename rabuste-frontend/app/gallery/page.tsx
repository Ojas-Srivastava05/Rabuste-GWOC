"use client";

import { useEffect, useRef } from "react";
import "./gallery.css";
import gsap from "gsap";
import { FashionGallery } from "./gallery.core";

export default function GalleryPage() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;

    // inject markup
    rootRef.current.innerHTML = `
      <div class="header"></div>
      <div class="viewport" id="viewport">
        <div class="canvas-wrapper" id="canvasWrapper">
          <div class="grid-container" id="gridContainer"></div>
        </div>
      </div>
      <div class="split-screen-container" id="splitScreenContainer">
        <div class="split-left" id="splitLeft">
          <div class="zoom-target" id="zoomTarget"></div>
        </div>
        <div class="split-right" id="splitRight"></div>
      </div>
      <div class="image-title-overlay" id="imageTitleOverlay">
        <div id="imageSlideNumber"><span>01</span></div>
        <div id="imageSlideTitle"><h1></h1></div>
        <div id="imageSlideDescription"></div>
      </div>
      <button class="close-button" id="closeButton"></button>
      <div class="controls-container" id="controlsContainer">
        <div id="percentageIndicator">60%</div>
        <button id="soundToggle">
          <canvas id="soundWaveCanvas" width="32" height="16"></canvas>
        </button>
      </div>
      <button id="gallery-exit"
        style="position:fixed; top:20px; left:20px; z-index:2000; width:44px; height:44px; border-radius:9999px; background:#c4a574; color:#000; display:flex; align-items:center; justify-content:center; font-size:18px; box-shadow:0 6px 18px rgba(0,0,0,.45); border:none; cursor:pointer;"
        onclick="window.location.replace('/')"
        aria-label="Back to home"
      >←</button>
    `;

    // Initialize gallery immediately on next frame to avoid any blocking overlay/black screen
    const gallery = new FashionGallery();
    const rafId = window.requestAnimationFrame(() => {
      try {
        gallery.init();
        (window as any).__dragGallery = gallery;
      } catch {}
    });

    return () => {
      window.cancelAnimationFrame(rafId);
      try { gallery.destroy(); } catch {}
      // absolute reset (keeps previous cleanup behavior)
      try { document.body.className = ""; document.body.style.cssText = ""; } catch {}
      try { gsap.globalTimeline.clear(); } catch {}
      try { delete (window as any).__dragGallery; } catch {}
      try { if (rootRef.current) rootRef.current.innerHTML = ""; } catch {}
    };
  }, []);

  return <div id="drag-gallery-root" ref={rootRef}></div>;
}
