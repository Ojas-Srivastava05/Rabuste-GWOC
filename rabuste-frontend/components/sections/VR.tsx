"use client";

import "aframe";
import { useState, useEffect, useRef, useCallback } from "react";

// Extend JSX.IntrinsicElements to include A-Frame elements

/* -------------------------------
   LINEAR WALKTHROUGH DATA
--------------------------------*/
const walkthrough = [
  {
    id: "outside-wide",
    title: "Rabuste Awaits",
    subtitle: "A quiet corner where stories begin",
    src: "/vr/01-outside-wide.jpg",
    intent: "First impression — calm, inviting, curiosity"
  },
  {
    id: "outside-door",
    title: "Closer to the Door",
    subtitle: "Warm light spills onto the street",
    src: "/vr/02-outside-door.jpg",
    intent: "Anticipation — you are about to enter"
  },
  {
    id: "entrance-threshold",
    title: "The Threshold",
    subtitle: "Step inside, leave the noise behind",
    src: "/vr/03-entrance-threshold.jpg",
    intent: "Transition — outside world fades"
  },
  {
    id: "entrance-inside",
    title: "Inside Rabuste",
    subtitle: "The aroma of freshly brewed coffee",
    src: "/vr/04-entrance-inside.jpg",
    intent: "Arrival — first true interior moment"
  },
  {
    id: "seating-wide",
    title: "The Sitting Area",
    subtitle: "A space to pause and breathe",
    src: "/vr/05-seating-wide.jpg",
    intent: "Spatial understanding — openness and comfort"
  },
  {
    id: "seating-intimate",
    title: "A Place to Stay",
    subtitle: "One table, one cup, your moment",
    src: "/vr/06-seating-intimate.jpg",
    intent: "Intimacy — user imagines themselves sitting here"
  },
  {
    id: "gallery-transition",
    title: "Where Art Appears",
    subtitle: "Coffee slowly meets culture",
    src: "/vr/07-gallery-transition.jpg",
    intent: "Shift — visual interest and curiosity"
  },
  {
    id: "gallery-focus",
    title: "The Art Gallery",
    subtitle: "Local voices on these walls",
    src: "/vr/08-gallery-focus.jpg",
    intent: "Depth — brand philosophy and creativity"
  },
  {
    id: "barista-wide",
    title: "The Barista Counter",
    subtitle: "The heart of Rabuste",
    src: "/vr/09-barista-wide.jpg",
    intent: "Energy — movement, machines, craft"
  },
  {
    id: "barista-close",
    title: "Crafted by Hand",
    subtitle: "Every cup tells a story",
    src: "/vr/10-barista-close.jpg",
    intent: "Climax — human connection, warmth, finish"
  }
];

// normalize base rotation once
const BASE_ROTATION = 180;

export default function VRGallery() {
  const [step, setStep] = useState(0);
  const [rotation, setRotation] = useState(-90);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const startX = useRef(0);
  const arrowRef = useRef<HTMLElement | null>(null);
  const cameraRef = useRef<any>(null);
  const skyRef = useRef<any>(null); // <-- moved inside component

  const active = walkthrough[step];

  // useCallback so reference is stable for the DOM listener
  const goForward = useCallback(() => {
    if (step >= walkthrough.length - 1) return;

    const sky = skyRef.current;
    const cam = cameraRef.current;
    if (!sky || !cam) return;

    const next = step + 1;

    // PHASE 1 — lean into motion
    sky.setAttribute("animation__fadeout", {
      property: "material.opacity",
      from: 1,
      to: 0,
      dur: 300,
      easing: "easeInQuad"
    });

    cam.setAttribute("animation__fov", {
      property: "camera.fov",
      from: 78,
      to: 88,
      dur: 300,
      easing: "easeInQuad"
    });

    cam.setAttribute("animation__yaw", {
      property: "rotation.y",
      from: 0,
      to: 4,
      dur: 300,
      easing: "easeInQuad"
    });

    // PHASE 2 — commit & settle
    setTimeout(() => {
      setStep(next);
      setRotation(-90);

      requestAnimationFrame(() => {
        sky.setAttribute("src", walkthrough[next].src);

        sky.setAttribute("animation__fadein", {
          property: "material.opacity",
          from: 0,
          to: 1,
          dur: 450,
          easing: "easeOutCubic"
        });

        cam.setAttribute("animation__fov", {
          property: "camera.fov",
          from: 88,
          to: 78,
          dur: 450,
          easing: "easeOutCubic"
        });

        cam.setAttribute("animation__yaw", {
          property: "rotation.y",
          from: 4,
          to: 0,
          dur: 450,
          easing: "easeOutCubic"
        });
      });
    }, 300);
  }, [step]);

  // backward handler ref + safe goBack (placed just below goForward)
  const backArrowRef = useRef<HTMLElement | null>(null);

  const goBack = useCallback(() => {
    if (step <= 0) return;

    const sky = skyRef.current;
    const cam = cameraRef.current;
    if (!sky || !cam) return;

    const prev = step - 1;

    // PHASE 1 — pull back
    sky.setAttribute("animation__fadeout", {
      property: "material.opacity",
      from: 1,
      to: 0,
      dur: 300,
      easing: "easeInQuad"
    });

    cam.setAttribute("animation__fov", {
      property: "camera.fov",
      from: 78,
      to: 70,
      dur: 300,
      easing: "easeInQuad"
    });

    cam.setAttribute("animation__yaw", {
      property: "rotation.y",
      from: 0,
      to: -4,
      dur: 300,
      easing: "easeInQuad"
    });

    setTimeout(() => {
      setStep(prev);
      setRotation(-90);

      requestAnimationFrame(() => {
        sky.setAttribute("src", walkthrough[prev].src);

        sky.setAttribute("animation__fadein", {
          property: "material.opacity",
          from: 0,
          to: 1,
          dur: 450,
          easing: "easeOutCubic"
        });

        cam.setAttribute("animation__fov", {
          property: "camera.fov",
          from: 70,
          to: 78,
          dur: 450,
          easing: "easeOutCubic"
        });

        cam.setAttribute("animation__yaw", {
          property: "rotation.y",
          from: -4,
          to: 0,
          dur: 450,
          easing: "easeOutCubic"
        });
      });
    }, 300);
  }, [step]);

  // attach native click listener to the A-Frame element (works reliably)
  useEffect(() => {
    const forward = arrowRef.current;
    const back = backArrowRef.current;

    if (forward) forward.addEventListener("click", goForward);
    if (back) back.addEventListener("click", goBack);

    return () => {
      if (forward) forward.removeEventListener("click", goForward);
      if (back) back.removeEventListener("click", goBack);
    };
  }, [goForward, goBack]);

  /* -------------------------------
     LOADING EFFECT
  --------------------------------*/
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, [step]);

  /* -------------------------------
     FULLSCREEN DETECTION (overlay only in fullscreen)
  --------------------------------*/
  useEffect(() => {
    const onChange = () => {
      const fs =
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        null;
      setIsFullscreen(!!fs);
    };

    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    document.addEventListener("mozfullscreenchange", onChange);
    // initialize state
    onChange();

    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
      document.removeEventListener("mozfullscreenchange", onChange);
    };
  }, []);

  /* -------------------------------
     NEXT SKY logic removed (handled by step commit only)
  --------------------------------*/
  
  /* -------------------------------
     MOUSE DRAG ROTATION
  --------------------------------*/
  const onMouseDown = (e) => {
    setDragging(true);
    startX.current = e.clientX;
  };

  const onMouseMove = (e) => {
    if (!dragging) return;
    const delta = e.clientX - startX.current;
    setRotation((r) => r + delta * 0.25);
    startX.current = e.clientX;
  };

  const stopDrag = () => setDragging(false);

  return (
    <section className="text-white py-16 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold mb-2">
            Step Inside Rabuste
          </h2>
          <p className="text-sm text-gray-400">
            Drag to look • Click arrow to move forward
          </p>
        </div>

        {/* VR Container */}
        <div className="relative">

          {/* Loading overlay */}
          {loading && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-xl">
              <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          )}

          {/* STORY OVERLAY — only visible when in fullscreen */}
          {isFullscreen && (
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
              <div className="bg-black/60 backdrop-blur-md rounded-xl px-4 py-2 text-center max-w-xs">
                <h4 className="text-sm font-semibold text-white leading-tight">
                  {active.title}
                </h4>
                <p className="text-[11px] text-gray-300 leading-snug mt-0.5">
                  {active.subtitle}
                </p>
              </div>
            </div>
          )}

          <div
            className="w-full h-[500px] rounded-xl overflow-hidden border border-neutral-800"
            style={{ cursor: dragging ? "grabbing" : "grab" }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={stopDrag}
            onMouseLeave={stopDrag}
          >
<a-scene
  embedded
  vr-mode-ui="enabled: false"
  cursor="rayOrigin: mouse"
  raycaster="objects: .clickable"
>

  {/* CAMERA (REQUIRED) */}
  <a-entity
    id="camera"
    ref={cameraRef}
    camera="fov: 78"
    position="0 0 0"
  ></a-entity>

  {/* 360 IMAGE */}
{/* CURRENT SKY */}
<a-sky
  ref={skyRef}
  src={active.src}
  rotation={`0 ${BASE_ROTATION + rotation} 0`}
  material="opacity: 1; transparent: true"
  scale="1 1 1"
/>

{/* (next-sky removed — only current sky is rendered; nextStep/nextSkyRef eliminated) */}

  {/* ARROWS STACKED VERTICALLY: BACK above FORWARD (swapped Y so forward sits above) */}
  {step > 0 && (
    <>
      <a-image
        src="/vr/arrow-backward.png"
        position="0 -1.8 -3"
        scale="0.7 0.7 0.7"
        look-at="#camera"
        material="transparent: true; opacity: 0.85; depthTest: false;"
      />
      <a-entity
        ref={backArrowRef}
        geometry="primitive: plane; width: 1.2; height: 1.2"
        position="0 -1.8 -3"
        look-at="#camera"
        class="clickable"
        material="opacity: 0"
      />
    </>
  )}

  {step < walkthrough.length - 1 && (
    <>
      <a-image
        src="/vr/arrow-forward.png"
        position="0 -1.0 -3"
        scale="0.7 0.7 0.7"
        look-at="#camera"
        material="transparent: true; opacity: 0.9; depthTest: false;"
      />
      <a-entity
        ref={arrowRef}
        geometry="primitive: plane; width: 1.4; height: 1.4"
        position="0 -1.0 -3"
        look-at="#camera"
        class="clickable"
        material="opacity: 0"
      />
    </>
  )}

</a-scene>

          {/* STORY PROGRESS DOTS (optional) */}
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
            <div className="flex gap-1.5">
              {walkthrough.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === step ? "w-6 bg-white" : "w-1.5 bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>

          </div>
        </div>
      </div>
    </section>
  );
}
