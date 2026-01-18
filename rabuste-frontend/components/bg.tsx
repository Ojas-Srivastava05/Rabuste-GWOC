"use client";

import { Renderer, Program, Mesh, Triangle } from 'ogl';
import { useEffect, useRef, useState } from 'react';

import './bg.css';

interface BalatroProps {
  spinRotation?: number;
  spinSpeed?: number;
  offset?: [number, number];
  color1?: string;
  color2?: string;
  color3?: string;
  contrast?: number;
  lighting?: number;
  spinAmount?: number;
  pixelFilter?: number;
  spinEase?: number;
  isRotate?: boolean;
  mouseInteraction?: boolean;
}

const oglAttributes = {
  alpha: false,
  depth: true,
  stencil: false,
  antialias: false, // CRITICAL: Disable antialiasing for crisp rendering
  premultipliedAlpha: false,
  preserveDrawingBuffer: false,
  powerPreference: 'default' as const,
  // Additional attributes to force crisp rendering
  desynchronized: false,
  failIfMajorPerformanceCaveat: false
};

function hexToVec4(hex: string): [number, number, number, number] {
  let hexStr = hex.replace('#', '');
  let r = 0,
    g = 0,
    b = 0,
    a = 1;
  if (hexStr.length === 6) {
    r = parseInt(hexStr.slice(0, 2), 16) / 255;
    g = parseInt(hexStr.slice(2, 4), 16) / 255;
    b = parseInt(hexStr.slice(4, 6), 16) / 255;
  } else if (hexStr.length === 8) {
    r = parseInt(hexStr.slice(0, 2), 16) / 255;
    g = parseInt(hexStr.slice(2, 4), 16) / 255;
    b = parseInt(hexStr.slice(4, 6), 16) / 255;
    a = parseInt(hexStr.slice(6, 8), 16) / 255;
  }
  return [r, g, b, a];
}

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

const fragmentShader = `
precision highp float;

#define PI 3.14159265359

uniform float iTime;
uniform vec3 iResolution;
uniform float uSpinRotation;
uniform float uSpinSpeed;
uniform vec2 uOffset;
uniform vec4 uColor1;
uniform vec4 uColor2;
uniform vec4 uColor3;
uniform float uContrast;
uniform float uLighting;
uniform float uSpinAmount;
uniform float uPixelFilter;
uniform float uSpinEase;
uniform bool uIsRotate;
uniform vec2 uMouse;

varying vec2 vUv;

vec4 effect(vec2 screenSize, vec2 screen_coords) {
    float pixel_size = length(screenSize.xy) / uPixelFilter;
    vec2 uv = (floor(screen_coords.xy * (1.0 / pixel_size)) * pixel_size - 0.5 * screenSize.xy) / length(screenSize.xy) - uOffset;
    float uv_len = length(uv);
    
    float speed = (uSpinRotation * uSpinEase * 0.2);
    if(uIsRotate){
       speed = iTime * speed;
    }
    speed += 302.2;
    
    float mouseInfluence = (uMouse.x * 2.0 - 1.0);
    speed += mouseInfluence * 0.1;
    
    float new_pixel_angle = atan(uv.y, uv.x) + speed - uSpinEase * 20.0 * (uSpinAmount * uv_len + (1.0 - uSpinAmount));
    vec2 mid = (screenSize.xy / length(screenSize.xy)) / 2.0;
    uv = (vec2(uv_len * cos(new_pixel_angle) + mid.x, uv_len * sin(new_pixel_angle) + mid.y) - mid);
    
    uv *= 30.0;
    float baseSpeed = iTime * uSpinSpeed;
    speed = baseSpeed + mouseInfluence * 2.0;
    
    vec2 uv2 = vec2(uv.x + uv.y);
    
    for(int i = 0; i < 5; i++) {
        uv2 += sin(max(uv.x, uv.y)) + uv;
        uv += 0.5 * vec2(
            cos(5.1123314 + 0.353 * uv2.y + speed * 0.131121),
            sin(uv2.x - 0.113 * speed)
        );
        uv -= cos(uv.x + uv.y) - sin(uv.x * 0.711 - uv.y);
    }
    
    float contrast_mod = (0.25 * uContrast + 0.5 * uSpinAmount + 1.2);
    float paint_res = min(2.0, max(0.0, length(uv) * 0.035 * contrast_mod));
    float c1p = max(0.0, 1.0 - contrast_mod * abs(1.0 - paint_res));
    float c2p = max(0.0, 1.0 - contrast_mod * abs(paint_res));
    float c3p = 1.0 - min(1.0, c1p + c2p);
    float light = (uLighting - 0.2) * max(c1p * 5.0 - 4.0, 0.0) + uLighting * max(c2p * 5.0 - 4.0, 0.0);

    vec4 col = (0.3 / uContrast) * uColor1
         + (1.0 - 0.3 / uContrast)
         * (uColor1 * c1p
         + uColor2 * c2p
         + vec4(c3p * uColor3.rgb, c3p * uColor1.a))
         + light;

// DARK BIAS (critical)
col.rgb *= vec3(0.85, 0.8, 0.75);

return col;

}

void main() {
    vec2 uv = vUv * iResolution.xy;
    gl_FragColor = effect(iResolution.xy, uv);
}
`;

// Helper function to check WebGL support
function isWebGLSupported(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch (e) {
    return false;
  }
}

export default function Balatro({
  spinRotation = -2.0,
  spinSpeed = 7.0,
  offset = [0.0, 0.0],
  color1 = '#050505'  , // deep black (background)
  color2 = '#2e211a'   ,// dominant espresso field (this spreads)
  color3 = '#4a352a'   ,// lighter mocha edge (gives width)
  contrast = 2.6,
  lighting = 0.15,
  spinAmount = 0.15,
  pixelFilter = 1970.0,
  spinEase = 1.0,
  isRotate = false,
  mouseInteraction = true
}: BalatroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Only render on client to prevent hydration mismatches
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Don't run on server or before mount
    if (!isMounted || typeof window === 'undefined' || !containerRef.current) return;
    const container = containerRef.current;

    // Styles are handled by CSS class, only set backgroundColor as fallback if needed

    // Check WebGL support before attempting to create context
    if (!isWebGLSupported()) {
      console.warn('WebGL is not supported on this device. Using fallback background.');
      // Set a solid background color as fallback
      container.style.backgroundColor = color1;
      return;
    }

    let renderer: Renderer | null = null;
    let program: Program | null = null;
    let animationFrameId: number | null = null;

    try {
      renderer = new Renderer();
      if (!renderer || !renderer.gl) {
        throw new Error('Failed to create WebGL renderer');
      }
      
      const gl = renderer.gl;
      
      // AGGRESSIVE: Disable ALL smoothing and blending for crisp rendering
      gl.disable(gl.BLEND);
      gl.disable(gl.DITHER);
      gl.disable(gl.SAMPLE_ALPHA_TO_COVERAGE);
      gl.disable(gl.SAMPLE_COVERAGE);
      gl.disable(gl.MULTISAMPLE);
      
      // Disable polygon and line smoothing (if available - deprecated in WebGL2 but may exist in WebGL1)
      try {
        const POLYGON_SMOOTH = (gl as any).POLYGON_SMOOTH_HINT || (gl as any).POLYGON_SMOOTH;
        const LINE_SMOOTH = (gl as any).LINE_SMOOTH_HINT || (gl as any).LINE_SMOOTH;
        if (POLYGON_SMOOTH !== undefined) gl.disable(POLYGON_SMOOTH);
        if (LINE_SMOOTH !== undefined) gl.disable(LINE_SMOOTH);
      } catch (e) {
        // These constants may not exist in WebGL2, ignore
      }
      
      // Set clear color
      gl.clearColor(0, 0, 0, 1);
      
      // Helper function to apply crisp styles to canvas
      const applyCrispStyles = (canvas: HTMLCanvasElement) => {
        if (!canvas) return;
        
        // CRITICAL: Apply ALL crisp rendering styles with !important via setProperty
        canvas.style.setProperty('image-rendering', 'pixelated', 'important');
        canvas.style.setProperty('image-rendering', '-webkit-optimize-contrast', 'important');
        canvas.style.setProperty('image-rendering', 'crisp-edges', 'important');
        canvas.style.setProperty('image-rendering', '-moz-crisp-edges', 'important');
        canvas.style.setProperty('image-rendering', '-o-crisp-edges', 'important');
        
        // Disable any transforms that might cause blur
        canvas.style.setProperty('transform', 'translateZ(0)', 'important');
        canvas.style.setProperty('will-change', 'auto', 'important');
        canvas.style.setProperty('backface-visibility', 'hidden', 'important');
        canvas.style.setProperty('-webkit-backface-visibility', 'hidden', 'important');
        
        // Force no filters
        canvas.style.setProperty('filter', 'none', 'important');
        canvas.style.setProperty('-webkit-filter', 'none', 'important');
        canvas.style.setProperty('backdrop-filter', 'none', 'important');
        canvas.style.setProperty('-webkit-backdrop-filter', 'none', 'important');
      };

      function resize() {
        if (!renderer || !renderer.gl || !program) return;
        try {
          const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2x for performance
          const width = container.offsetWidth;
          const height = container.offsetHeight;
          
          // CRITICAL: Set canvas internal size to exact pixel dimensions (no scaling)
          // Use 1:1 pixel ratio for maximum crispness
          const canvasWidth = Math.floor(width);
          const canvasHeight = Math.floor(height);
          
          renderer.setSize(canvasWidth, canvasHeight);
          
          // Set display size to match exactly - NO scaling
          if (renderer.gl.canvas) {
            const canvas = renderer.gl.canvas;
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            
            // RESIZE PROTECTION: Reapply crisp styles on every resize
            applyCrispStyles(canvas);
            
            // Force viewport to match exactly
            gl.viewport(0, 0, canvasWidth, canvasHeight);
            
            if (program) {
              program.uniforms.iResolution.value = [
                canvasWidth, 
                canvasHeight, 
                canvasWidth / canvasHeight
              ];
            }
          }
        } catch (e) {
          console.warn('Error during resize:', e);
        }
      }
      window.addEventListener('resize', resize);
      resize();

      const geometry = new Triangle(gl);
      program = new Program(gl, {
        vertex: vertexShader,
        fragment: fragmentShader,
        uniforms: {
          iTime: { value: 0 },
          iResolution: {
            value: [renderer.gl.canvas.width, renderer.gl.canvas.height, renderer.gl.canvas.width / renderer.gl.canvas.height]
          },
          uSpinRotation: { value: spinRotation },
          uSpinSpeed: { value: spinSpeed },
          uOffset: { value: offset },
          uColor1: { value: hexToVec4(color1) },
          uColor2: { value: hexToVec4(color2) },
          uColor3: { value: hexToVec4(color3) },
          uContrast: { value: contrast },
          uLighting: { value: lighting },
          uSpinAmount: { value: spinAmount },
          uPixelFilter: { value: pixelFilter },
          uSpinEase: { value: spinEase },
          uIsRotate: { value: isRotate },
          uMouse: { value: [0.5, 0.5] }
        }
      });

      const mesh = new Mesh(gl, { geometry, program });

      function update(time: number) {
        if (!renderer || !program || !renderer.gl) return;
        try {
          animationFrameId = requestAnimationFrame(update);
          
          // FRAME-BY-FRAME CHECK: Reapply crisp styles every frame to prevent blur
          if (renderer.gl.canvas) {
            applyCrispStyles(renderer.gl.canvas);
          }
          
          program.uniforms.iTime.value = time * 0.001;
          renderer.render({ scene: mesh });
        } catch (e) {
          console.warn('Error during render:', e);
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
          }
        }
      }
      // FIRST RENDER: Apply styles BEFORE DOM append
      if (renderer.gl.canvas) {
        const canvas = renderer.gl.canvas;
        
        // Apply crisp styles BEFORE appending to DOM
        applyCrispStyles(canvas);
        
        // make sure the canvas fills container and does not create an interactive stacking context
        canvas.style.position = "absolute";
        canvas.style.left = "0";
        canvas.style.top = "0";
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.pointerEvents = "none";
        
        // Try to disable smoothing via 2D context (if available)
        try {
          const ctx2d = canvas.getContext('2d');
          if (ctx2d) {
            (ctx2d as any).imageSmoothingEnabled = false;
            (ctx2d as any).webkitImageSmoothingEnabled = false;
            (ctx2d as any).mozImageSmoothingEnabled = false;
            (ctx2d as any).msImageSmoothingEnabled = false;
          }
        } catch (e) {
          // Ignore - WebGL context doesn't support 2D context methods
        }
        
        // MUTATIONOBSERVER: Watch for style changes and revert any blur
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'attributes') {
              if (mutation.attributeName === 'style' || mutation.attributeName === 'class') {
                // Re-apply crisp rendering styles immediately
                applyCrispStyles(canvas);
              }
            }
            // Also watch for child changes (in case canvas is replaced)
            if (mutation.type === 'childList') {
              mutation.addedNodes.forEach((node) => {
                if (node === canvas || (node as Element).querySelector?.('canvas')) {
                  applyCrispStyles(canvas);
                }
              });
            }
          });
        });
        
        observer.observe(canvas, {
          attributes: true,
          attributeFilter: ['style', 'class'],
          childList: false,
          subtree: false
        });
        
        // Also observe the container for any changes
        observer.observe(container, {
          attributes: false,
          childList: true,
          subtree: false
        });
        
        // Store observer for cleanup
        (canvas as any)._crispObserver = observer;
        
        // NOW append to DOM after styles are applied
        container.appendChild(canvas);
        
        // Re-apply styles one more time after DOM append (first render protection)
        requestAnimationFrame(() => {
          applyCrispStyles(canvas);
        });
      }
      
      // Start the update loop
      animationFrameId = requestAnimationFrame(update);

      function handleMouseMove(e: MouseEvent) {
        if (!mouseInteraction || !program) return;
        try {
          const rect = container.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width;
          const y = 1.0 - (e.clientY - rect.top) / rect.height;
          program.uniforms.uMouse.value = [x, y];
        } catch (e) {
          console.warn('Error handling mouse move:', e);
        }
      }
      container.addEventListener('mousemove', handleMouseMove);

      return () => {
        try {
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
          }
          window.removeEventListener('resize', resize);
          container.removeEventListener('mousemove', handleMouseMove);
          
          // Clean up MutationObserver if it exists
          if (renderer && renderer.gl && renderer.gl.canvas) {
            const canvas = renderer.gl.canvas;
            if ((canvas as any)._crispObserver) {
              (canvas as any)._crispObserver.disconnect();
            }
          }
          
          if (renderer && renderer.gl && renderer.gl.canvas && container.contains(renderer.gl.canvas)) {
            container.removeChild(renderer.gl.canvas);
          }
          if (renderer && renderer.gl) {
            const loseContext = renderer.gl.getExtension('WEBGL_lose_context');
            if (loseContext) {
              loseContext.loseContext();
            }
          }
        } catch (e) {
          console.warn('Error during cleanup:', e);
        }
      };
    } catch (error) {
      console.error('Failed to initialize WebGL background:', error);
      // Fallback to solid background color
      container.style.backgroundColor = color1;
      return () => {
        // Cleanup for fallback case (no-op)
      };
    }
  }, [
    spinRotation,
    spinSpeed,
    offset,
    color1,
    color2,
    color3,
    contrast,
    lighting,
    spinAmount,
    pixelFilter,
    spinEase,
    isRotate,
    mouseInteraction,
    isMounted
  ]);

  // Always render the container with consistent styles to prevent hydration mismatch
  // CSS class handles positioning, backgroundColor is set as fallback until WebGL initializes
  // This ensures server and client initial render match
  return (
    <div 
      ref={containerRef} 
      className="balatro-container"
      style={{ backgroundColor: color1 }}
    />
  );
}