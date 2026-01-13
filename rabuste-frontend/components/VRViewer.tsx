'use client';

import React, { useEffect, useRef, useState } from 'react';
import { X, Maximize2, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import { trackVRSceneInteraction } from '@/lib/analytics';

interface VRViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

// Coffee shop 360° panoramic images - using local optimized images
// Note: Using available images and creating multiple views with different rotations
const scenes = [
  {
    name: 'Outside Wide',
    image: '/vr/01-outside-wide.jpg',
    rotation: '0 -130 0',
    hotspots: [
      { position: '2 1.6 -4', target: 1, label: 'Entrance' },
      { position: '-2 1.6 -4', target: 2, label: 'Inside View' },
    ]
  },
  {
    name: 'Outside Door',
    image: '/vr/02-outside-door.jpg',
    rotation: '0 -130 0',
    hotspots: [
      { position: '-3 1.6 -4', target: 0, label: 'Back' },
      { position: '3 1.6 -3', target: 2, label: 'Enter' },
    ]
  },
  {
    name: 'Entrance View',
    image: '/vr/01-outside-wide.jpg',
    rotation: '0 -90 0',
    hotspots: [
      { position: '-3 1.6 -4', target: 1, label: 'Back' },
      { position: '3 1.6 -3', target: 3, label: 'Inside' },
    ]
  },
  {
    name: 'Interior Wide',
    image: '/vr/02-outside-door.jpg',
    rotation: '0 -180 0',
    hotspots: [
      { position: '-3 1.6 -4', target: 2, label: 'Back' },
      { position: '3 1.6 -3', target: 4, label: 'Seating' },
      { position: '0 1.6 -3', target: 5, label: 'Gallery' },
    ]
  },
  {
    name: 'Seating Area',
    image: '/vr/01-outside-wide.jpg',
    rotation: '0 -45 0',
    hotspots: [
      { position: '-3 1.6 -4', target: 3, label: 'Back' },
      { position: '3 1.6 -3', target: 5, label: 'Gallery' },
      { position: '0 1.6 -3', target: 6, label: 'Counter' },
    ]
  },
  {
    name: 'Gallery Space',
    image: '/vr/02-outside-door.jpg',
    rotation: '0 -225 0',
    hotspots: [
      { position: '-3 1.6 -4', target: 4, label: 'Seating' },
      { position: '3 1.6 -3', target: 6, label: 'Counter' },
    ]
  },
  {
    name: 'Barista Counter',
    image: '/vr/01-outside-wide.jpg',
    rotation: '0 -270 0',
    hotspots: [
      { position: '-3 1.6 -4', target: 5, label: 'Gallery' },
      { position: '3 1.6 -3', target: 7, label: 'Close View' },
    ]
  },
  {
    name: 'Counter Close',
    image: '/vr/02-outside-door.jpg',
    rotation: '0 -315 0',
    hotspots: [
      { position: '-3 1.6 -4', target: 6, label: 'Back' },
      { position: '3 1.6 -3', target: 8, label: 'Workspace' },
    ]
  },
  {
    name: 'Workspace',
    image: '/vr/01-outside-wide.jpg',
    rotation: '0 -360 0',
    hotspots: [
      { position: '-3 1.6 -4', target: 7, label: 'Back' },
      { position: '3 1.6 -3', target: 9, label: 'Exit' },
    ]
  },
  {
    name: 'Exit View',
    image: '/vr/02-outside-door.jpg',
    rotation: '0 -130 0',
    hotspots: [
      { position: '-3 1.6 -4', target: 8, label: 'Back' },
      { position: '3 1.6 -3', target: 0, label: 'Start Over' },
    ]
  }
];

export default function VRViewer({ isOpen, onClose }: VRViewerProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [imagesPreloaded, setImagesPreloaded] = useState(false);

  // Prevent body scroll when VR is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      const html = document.documentElement;
      
      // Disable body scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      html.style.overflow = 'hidden';
      
      return () => {
        // Re-enable body scroll
        const body = document.body;
        const html = document.documentElement;
        
        // Remove all inline styles we added
        body.style.removeProperty('position');
        body.style.removeProperty('top');
        body.style.removeProperty('width');
        body.style.removeProperty('overflow');
        html.style.removeProperty('overflow');
        
        // Restore scroll position immediately
        requestAnimationFrame(() => {
          window.scrollTo(0, scrollY);
          
          // Force reflow and repaint
          body.offsetHeight;
          
          // Trigger multiple events to ensure all components update
          setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
            window.dispatchEvent(new Event('orientationchange'));
            document.dispatchEvent(new Event('visibilitychange'));
            
            // Force React components to re-render by updating a data attribute
            const event = new CustomEvent('vr-closed', { detail: { scrollY } });
            window.dispatchEvent(event);
          }, 100);
        });
      };
    }
  }, [isOpen]);

  // Load A-Frame script only when VR is opened (lazy load)
  useEffect(() => {
    if (!isOpen) return; // Only load when VR is actually opened
    
    if (typeof window !== 'undefined' && !(window as any).AFRAME) {
      const script = document.createElement('script');
      script.src = 'https://aframe.io/releases/1.7.1/aframe.min.js';
      script.async = true;
      script.onload = () => {
        setIsLoaded(true);
      };
      script.onerror = () => {
        console.error('Failed to load A-Frame');
        setIsLoaded(false);
      };
      document.head.appendChild(script);
    } else if ((window as any).AFRAME) {
      setIsLoaded(true);
    }
  }, [isOpen]);

  // Preload all VR images for faster switching
  useEffect(() => {
    if (!isOpen) return;
    
    const preloadImages = async () => {
      // Get unique images only (since we reuse images with different rotations)
      const uniqueImages = [...new Set(scenes.map(s => s.image))];
      
      const imagePromises = uniqueImages.map((imageSrc) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = imageSrc;
        });
      });
      
      try {
        await Promise.all(imagePromises);
        setImagesPreloaded(true);
      } catch (error) {
        console.error('Error preloading images:', error);
        setImagesPreloaded(true); // Continue even if some fail
      }
    };
    
    preloadImages();
  }, [isOpen]);

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    
    // Track VR view when opened
    if (scenes[currentScene]) {
      trackVRSceneInteraction(scenes[currentScene].name, 'view');
    }
  }, [isOpen, currentScene]);

  useEffect(() => {
    if (!isLoaded || !sceneRef.current || !isOpen) return;

    // Create A-Frame scene
    const scene = document.createElement('a-scene');
    scene.setAttribute('embedded', '');
    scene.setAttribute('vr-mode-ui', 'enabled: true');
    scene.setAttribute('device-orientation-permission-ui', 'enabled: true');
    scene.setAttribute('renderer', 'antialias: true; colorManagement: true; sortObjects: true');
    scene.setAttribute('raycaster', 'objects: .clickable-hotspot');

    // Add sky with 360 image - optimized for faster loading
    const sky = document.createElement('a-sky');
    sky.setAttribute('src', scenes[currentScene].image);
    sky.setAttribute('rotation', scenes[currentScene].rotation || '0 -130 0');
    // Optimize for mobile
    if (isMobile) {
      sky.setAttribute('scale', '1 1 1');
      sky.setAttribute('radius', '500');
    }
    // Add crossOrigin for better loading
    sky.setAttribute('crossorigin', 'anonymous');
    scene.appendChild(sky);

    // Add camera with cursor - adjusted for mobile
    const cameraRig = document.createElement('a-entity');
    cameraRig.setAttribute('id', 'cameraRig');

    const camera = document.createElement('a-camera');
    camera.setAttribute('wasd-controls-enabled', 'false');
    camera.setAttribute('look-controls', 'pointerLockEnabled: false');
    // Adjust FOV for mobile to prevent zoom - wider FOV = less zoom
    camera.setAttribute('fov', isMobile ? '80' : '75'); // Wider FOV on mobile
    
    // Add camera position adjustment for mobile
    if (isMobile) {
      cameraRig.setAttribute('position', '0 1.6 0'); // Standard eye height
    }

    // Enhanced cursor with better click detection
    const cursor = document.createElement('a-cursor');
    cursor.setAttribute('color', '#B87333');
    cursor.setAttribute('fuse', 'true');
    cursor.setAttribute('fuse-timeout', '1000');
    cursor.setAttribute('raycaster', 'objects: .clickable-hotspot');
    cursor.setAttribute('geometry', 'primitive: ring; radiusInner: 0.015; radiusOuter: 0.03');
    cursor.setAttribute('material', 'color: #B87333; shader: flat');
    // Make cursor more visible on mobile
    if (isMobile) {
      cursor.setAttribute('geometry', 'primitive: ring; radiusInner: 0.02; radiusOuter: 0.04');
    }
    camera.appendChild(cursor);

    cameraRig.appendChild(camera);
    scene.appendChild(cameraRig);

    // Add hotspots for navigation with working click handlers
    scenes[currentScene].hotspots.forEach((hotspot, index) => {
      const hotspotEntity = document.createElement('a-entity');
      hotspotEntity.setAttribute('position', hotspot.position);
      hotspotEntity.setAttribute('class', 'clickable-hotspot');
      hotspotEntity.setAttribute('look-at', '#cameraRig');
      
      // Make hotspot larger and more clickable
      const sphere = document.createElement('a-sphere');
      sphere.setAttribute('radius', '0.4');
      sphere.setAttribute('color', '#B87333');
      sphere.setAttribute('opacity', '0.9');
      sphere.setAttribute('class', 'clickable-hotspot');
      sphere.setAttribute('animation', 'property: scale; to: 1.2 1.2 1.2; dur: 1000; loop: true; dir: alternate; easing: easeInOutSine');
      
      // Add glow animation
      sphere.setAttribute('material', 'shader: standard; color: #B87333; emissive: #D4A574; emissiveIntensity: 0.5; metalness: 0.6; roughness: 0.2');
      
      // Add click handler using A-Frame's built-in event system
      const handleClick = (e: any) => {
        e.stopPropagation();
        const targetScene = scenes[hotspot.target];
        if (targetScene) {
          setCurrentScene(hotspot.target);
          // Track VR scene navigation
          trackVRSceneInteraction(targetScene.name, 'navigate');
        }
      };
      
      // Use multiple event types for better compatibility
      sphere.addEventListener('click', handleClick);
      sphere.addEventListener('mousedown', handleClick);
      sphere.addEventListener('touchstart', handleClick);
      sphere.addEventListener('fusing', handleClick);

      hotspotEntity.appendChild(sphere);

      // Add text label with background - positioned better
      const textBg = document.createElement('a-plane');
      textBg.setAttribute('width', '2.5');
      textBg.setAttribute('height', '0.6');
      textBg.setAttribute('position', '0 0.8 0');
      textBg.setAttribute('color', '#000000');
      textBg.setAttribute('opacity', '0.8');
      textBg.setAttribute('look-at', '#cameraRig');
      hotspotEntity.appendChild(textBg);

      const text = document.createElement('a-text');
      text.setAttribute('value', hotspot.label);
      text.setAttribute('align', 'center');
      text.setAttribute('color', '#FFFEF9');
      text.setAttribute('width', '4');
      text.setAttribute('position', '0 0.8 0.01');
      text.setAttribute('font', 'roboto');
      text.setAttribute('look-at', '#cameraRig');
      hotspotEntity.appendChild(text);

      scene.appendChild(hotspotEntity);
    });

    // Add ambient light
    const ambientLight = document.createElement('a-light');
    ambientLight.setAttribute('type', 'ambient');
    ambientLight.setAttribute('color', '#FFF');
    ambientLight.setAttribute('intensity', '1');
    scene.appendChild(ambientLight);

    // Add directional light for better visibility
    const directionalLight = document.createElement('a-light');
    directionalLight.setAttribute('type', 'directional');
    directionalLight.setAttribute('color', '#FFF');
    directionalLight.setAttribute('intensity', '0.3');
    directionalLight.setAttribute('position', '1 1 1');
    scene.appendChild(directionalLight);

    sceneRef.current.innerHTML = '';
    sceneRef.current.appendChild(scene);

    return () => {
      if (sceneRef.current) {
        sceneRef.current.innerHTML = '';
      }
    };
  }, [isLoaded, currentScene, isMobile, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#000000',
        touchAction: 'none', // Prevent default touch behaviors on mobile
        overflow: 'hidden',
      }}
      onTouchMove={(e) => {
        // Prevent background scroll
        e.preventDefault();
      }}
      onWheel={(e) => {
        // Prevent background scroll
        e.preventDefault();
      }}
    >
      {/* Header - responsive for mobile */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100000,
          padding: isMobile ? '12px 16px' : '20px',
          paddingTop: isMobile ? '80px' : '100px',
          background: 'linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0) 100%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <h2 style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: isMobile ? '1.125rem' : '1.5rem',
            color: '#FFFEF9',
            marginBottom: '0.25rem',
            letterSpacing: '0.05em',
          }}>
            360° VR TOUR
          </h2>
          <p style={{
            fontSize: isMobile ? '0.75rem' : '0.875rem',
            color: '#B87333',
            letterSpacing: '0.1em',
          }}>
            {scenes[currentScene].name}
          </p>
        </div>

        <button
          onClick={() => {
            // Track VR close
            if (scenes[currentScene]) {
              trackVRSceneInteraction(scenes[currentScene].name, 'close');
            }
            onClose();
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            if (scenes[currentScene]) {
              trackVRSceneInteraction(scenes[currentScene].name, 'close');
            }
            onClose();
          }}
          style={{
            background: 'rgba(184, 115, 51, 1)',
            border: isMobile ? '2px solid #D4A574' : '3px solid #D4A574',
            color: '#000000',
            padding: isMobile ? '12px 16px' : '14px 18px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 20px rgba(184, 115, 51, 0.8), 0 0 30px rgba(212, 165, 116, 0.5)',
            zIndex: 100001,
            position: 'relative',
            fontWeight: 'bold',
            touchAction: 'manipulation',
            minWidth: isMobile ? '44px' : 'auto',
            minHeight: isMobile ? '44px' : 'auto',
          }}
          onMouseEnter={(e) => {
            if (!isMobile) {
              e.currentTarget.style.background = 'linear-gradient(135deg, #D4A574 0%, #B87333 100%)';
              e.currentTarget.style.transform = 'scale(1.15)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(184, 115, 51, 1), 0 0 40px rgba(212, 165, 116, 0.8)';
              e.currentTarget.style.borderColor = '#FFFEF9';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(184, 115, 51, 1)';
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(184, 115, 51, 0.8), 0 0 30px rgba(212, 165, 116, 0.5)';
            e.currentTarget.style.borderColor = '#D4A574';
          }}
          aria-label="Close VR Tour"
        >
          <X style={{ width: isMobile ? 20 : 24, height: isMobile ? 20 : 24 }} />
        </button>
      </div>

      {/* VR Scene Container with Frame */}
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          zIndex: 99999,
          padding: isMobile ? '8px' : '16px',
          boxSizing: 'border-box',
        }}
      >
        {/* Frame Border */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            border: isMobile ? '3px solid rgba(184, 115, 51, 0.6)' : '4px solid rgba(184, 115, 51, 0.8)',
            borderRadius: isMobile ? '12px' : '16px',
            boxShadow: 'inset 0 0 40px rgba(184, 115, 51, 0.3), 0 0 60px rgba(184, 115, 51, 0.4)',
            pointerEvents: 'none',
            zIndex: 100002,
          }}
        />
        
        {/* Inner Glow */}
        <div
          style={{
            position: 'absolute',
            inset: isMobile ? '3px' : '4px',
            border: '1px solid rgba(212, 165, 116, 0.4)',
            borderRadius: isMobile ? '9px' : '12px',
            pointerEvents: 'none',
            zIndex: 100003,
          }}
        />
        
        <div
          ref={sceneRef}
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            borderRadius: isMobile ? '9px' : '12px',
            overflow: 'hidden',
          }}
        />
      </div>

      {/* Loading State */}
      {(!isLoaded || !imagesPreloaded) && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#000000',
            zIndex: 10001,
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                border: '3px solid rgba(184, 115, 51, 0.3)',
                borderTop: '3px solid #B87333',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 20px',
              }}
            />
            <p style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: '1.25rem',
              color: '#B87333',
              letterSpacing: '0.1em',
            }}>
              {!isLoaded ? 'Loading VR Engine...' : 'Preloading Images...'}
            </p>
            {imagesPreloaded && (
              <p style={{
                fontSize: '0.875rem',
                color: '#8B6F47',
                marginTop: '8px',
              }}>
                {scenes.length} scenes ready
              </p>
            )}
          </div>
        </div>
      )}

      {/* Bottom Controls */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 100000,
          padding: '20px',
          background: 'linear-gradient(0deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0) 100%)',
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          flexWrap: 'wrap',
        }}>
          {scenes.map((scene, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentScene(index);
                // Track scene selection
                trackVRSceneInteraction(scene.name, 'navigate');
              }}
              style={{
                padding: '12px 24px',
                background: currentScene === index 
                  ? 'linear-gradient(135deg, #B87333, #CD7F32)' 
                  : 'rgba(184, 115, 51, 0.2)',
                border: '1px solid #B87333',
                color: currentScene === index ? '#000000' : '#FFFEF9',
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: '1rem',
                letterSpacing: '0.05em',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              {scene.name}
            </button>
          ))}
        </div>

        <div style={{
          marginTop: '16px',
          textAlign: 'center',
          fontSize: '0.875rem',
          color: 'rgba(255, 254, 249, 0.6)',
        }}>
          <p>Click on glowing spheres to navigate • Look around by dragging or moving device</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}