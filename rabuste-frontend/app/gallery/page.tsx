"use client";

import { useEffect, useRef } from "react";
import "./gallery.css";
import { FashionGallery } from "./gallery.core";

export default function GalleryPage() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;

    // inject markup
    rootRef.current.innerHTML = `
      <div id="preloader-overlay"></div>
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
      <button id="gallery-exit" onclick="window.location.href = '/'">← Back</button>
    `;

    // initialize gallery immediately (no preloader)
    const gallery = new FashionGallery();
    // initialize on next tick so injected DOM is ready
    const rafId = window.requestAnimationFrame(() => {
      try {
        gallery.init();
        (window as any).gallery = gallery;
      } catch (err) {
        // inspect console if needed
      }
    });

    return () => {
      window.cancelAnimationFrame(rafId);
      try {
        if (gallery) {
          if (typeof gallery.destroy === "function") gallery.destroy();
          else {
            try { gallery.draggable?.kill?.(); } catch {}
            try { gallery.viewportObserver?.disconnect?.(); } catch {}
          }
        }
      } catch {}
      try { if ((window as any).gallery === gallery) delete (window as any).gallery; } catch {}
      try { if (rootRef.current) rootRef.current.innerHTML = ""; } catch {}
    };
  }, []);

  return <div id="drag-gallery-root" ref={rootRef}></div>;
}
