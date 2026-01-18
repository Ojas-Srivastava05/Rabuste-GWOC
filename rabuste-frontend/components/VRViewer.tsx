'use client';

import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { trackVRSceneInteraction } from '@/lib/analytics';

interface VRViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

// Scenes
const scenes = [
  {
    name: 'Outside Wide',
    image: 'https://res.cloudinary.com/dvraokarg/image/upload/v1768739285/WhatsApp_Image_2026-01-16_at_21.13.36_5_lyfrln.jpg',
    rotation: '0 -130 0',
    hotspots: [
      { position: '2 1.6 -4', target: 1, label: 'Entrance' },
      { position: '-2 1.6 -4', target: 2, label: 'Inside View' },
      { position: '0 1.6 -3', target: 5, label: 'Overview' },
    ]
  },
  {
    name: 'Entrance View',
    image: 'https://res.cloudinary.com/dvraokarg/image/upload/v1768739286/WhatsApp_Image_2026-01-16_at_21.13.37_1_vlwepp.jpg',
    rotation: '0 -90 0',
    hotspots: [
      { position: '-3 1.6 -4', target: 0, label: 'Outside' },
      { position: '3 1.6 -3', target: 2, label: 'Inside' },
      { position: '0 1.6 -3', target: 3, label: 'Seating' },
    ]
  },
  {
    name: 'Interior Wide',
    image: 'https://res.cloudinary.com/dvraokarg/image/upload/v1768739284/WhatsApp_Image_2026-01-16_at_21.13.36_4_sfk0wl.jpg',
    rotation: '0 -180 0',
    hotspots: [
      { position: '-3 1.6 -4', target: 1, label: 'Entrance' },
      { position: '3 1.6 -3', target: 3, label: 'Seating' },
      { position: '0 1.6 -3', target: 4, label: 'Counter' },
    ]
  },
  {
    name: 'Seating Area',
    image: 'https://res.cloudinary.com/dvraokarg/image/upload/v1768739281/WhatsApp_Image_2026-01-16_at_21.13.36_3_rsgfoo.jpg',
    rotation: '0 -45 0',
    hotspots: [
      { position: '-3 1.6 -4', target: 2, label: 'Back' },
      { position: '3 1.6 -3', target: 4, label: 'Counter' },
      { position: '0 1.6 -3', target: 5, label: 'Overview' },
    ]
  },
  {
    name: 'Barista Counter',
    image: 'https://res.cloudinary.com/dvraokarg/image/upload/v1768739281/WhatsApp_Image_2026-01-16_at_21.13.35_4_ysadnz.jpg',
    rotation: '0 -270 0',
    hotspots: [
      { position: '-3 1.6 -4', target: 3, label: 'Back' },
      { position: '3 1.6 -3', target: 5, label: 'Overview' },
      { position: '0 1.6 -3', target: 0, label: 'Exit' },
    ]
  },
  {
    name: 'Overview',
    image: 'https://res.cloudinary.com/dvraokarg/image/upload/v1768739284/WhatsApp_Image_2026-01-16_at_21.13.36_4_sfk0wl.jpg',
    rotation: '0 -315 0',
    hotspots: [
      { position: '-3 1.6 -4', target: 4, label: 'Counter' },
      { position: '3 1.6 -3', target: 0, label: 'Outside' },
      { position: '0 1.6 -3', target: 2, label: 'Interior' },
    ]
  },
];

export default function VRViewer({ isOpen, onClose }: VRViewerProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const scrollPosRef = useRef(0);

  const [isLoaded, setIsLoaded] = useState(false);
  const [imagesPreloaded, setImagesPreloaded] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Disable body scroll when VR opens
  useEffect(() => {
    if (!isOpen) return;

    scrollPosRef.current = window.scrollY;

    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPosRef.current}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.removeProperty('position');
      document.body.style.removeProperty('top');
      document.body.style.removeProperty('width');
      document.body.style.removeProperty('overflow');
      document.documentElement.style.removeProperty('overflow');

      window.scrollTo(0, scrollPosRef.current);
    };
  }, [isOpen]);

  // Load A-Frame once
  useEffect(() => {
    if (!isOpen) return;

    if (!(window as any).AFRAME) {
      const script = document.createElement('script');
      script.src = 'https://aframe.io/releases/1.7.1/aframe.min.js';
      script.onload = () => setIsLoaded(true);
      document.head.appendChild(script);

      const lookAtScript = document.createElement('script');
      lookAtScript.src =
        'https://cdn.jsdelivr.net/npm/aframe-look-at-component@0.8.0/dist/aframe-look-at-component.min.js';
      document.head.appendChild(lookAtScript);
    } else {
      setIsLoaded(true);
    }
  }, [isOpen]);

  // Preload images
  useEffect(() => {
    if (!isOpen) return;

    const unique = [...new Set(scenes.map(s => s.image))];
    Promise.all(
      unique.map(
        src =>
          new Promise(res => {
            const img = new Image();
            img.onload = res;
            img.src = src;
          })
      )
    ).then(() => setImagesPreloaded(true));
  }, [isOpen]);

  // Mobile detection
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth <= 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Create and manage A-Frame scene
  useEffect(() => {
    if (!isOpen || !isLoaded || !imagesPreloaded || !sceneRef.current) return;

    const container = sceneRef.current;
    
    // Create scene only once
    let scene = container.querySelector('a-scene') as HTMLElement;
    if (!scene) {
      scene = document.createElement('a-scene');
      scene.setAttribute('embedded', '');
      scene.setAttribute('vr-mode-ui', 'enabled: true');
      scene.setAttribute('renderer', 'antialias: true; colorManagement: true');
      scene.setAttribute('loading-screen', 'enabled: false');
      container.appendChild(scene);
    }

    const buildSceneContent = (index: number) => {
      // Clear existing content except assets
      const assets = scene.querySelector('a-assets');
      scene.innerHTML = '';
      if (assets) scene.appendChild(assets);

      // Add sky
      const sky = document.createElement('a-sky');
      sky.setAttribute('src', scenes[index].image);
      sky.setAttribute('rotation', scenes[index].rotation);
      sky.setAttribute('radius', '500');
      scene.appendChild(sky);

      // Camera rig
      const cameraRig = document.createElement('a-entity');
      cameraRig.setAttribute('id', 'cameraRig');
      cameraRig.setAttribute('position', '0 1.6 0');

      const camera = document.createElement('a-camera');
      camera.setAttribute('look-controls', 'pointerLockEnabled: false; reverseMouseDrag: true');
      camera.setAttribute('wasd-controls', 'enabled: false');
      camera.setAttribute('fov', isMobile ? '80' : '75');

      const cursor = document.createElement('a-cursor');
      cursor.setAttribute('color', '#B87333');
      cursor.setAttribute('fuse', 'true');
      cursor.setAttribute('fuse-timeout', '1500');
      cursor.setAttribute('raycaster', 'objects: .clickable');
      camera.appendChild(cursor);

      cameraRig.appendChild(camera);
      scene.appendChild(cameraRig);

      // Add hotspots
      scenes[index].hotspots.forEach((h, i) => {
        const spot = document.createElement('a-entity');
        spot.setAttribute('position', h.position);
        spot.setAttribute('look-at', '#cameraRig');
        spot.classList.add('clickable');

        const sphere = document.createElement('a-sphere');
        sphere.setAttribute('radius', '0.3');
        sphere.setAttribute('color', '#B87333');
        sphere.setAttribute('opacity', '0.8');
        sphere.setAttribute('animation', 'property: scale; to: 1.2 1.2 1.2; dir: alternate; dur: 1000; loop: true');
        
        sphere.addEventListener('click', () => {
          trackVRSceneInteraction(scenes[currentScene].name, 'navigate');
          setCurrentScene(h.target);
        });

        spot.appendChild(sphere);

        const label = document.createElement('a-text');
        label.setAttribute('value', h.label);
        label.setAttribute('color', '#ffffff');
        label.setAttribute('align', 'center');
        label.setAttribute('position', '0 0.6 0');
        label.setAttribute('width', '3');
        label.setAttribute('look-at', '#cameraRig');
        spot.appendChild(label);

        scene.appendChild(spot);
      });
    };

    // Build initial scene
    buildSceneContent(currentScene);

    return () => {
      if (container && scene) {
        container.removeChild(scene);
      }
    };
  }, [isLoaded, isOpen, imagesPreloaded, currentScene, isMobile]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        zIndex: 99999,
      }}
    >
      {/* Close button + header */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 0,
          right: 0,
          padding: 20,
          zIndex: 100000,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <h2 style={{ color: '#fff' }}>360° VR TOUR – {scenes[currentScene].name}</h2>

        <button
          onClick={() => {
            trackVRSceneInteraction(scenes[currentScene].name, 'close');
            onClose();
          }}
          style={{
            background: '#B87333',
            border: '2px solid #D4A574',
            padding: 10,
            borderRadius: 8,
          }}
        >
          <X color="black" />
        </button>
      </div>

      {/* Scene */}
      <div
        ref={sceneRef}
        style={{
          width: '100%',
          height: '100%',
        }}
      />

      {/* Loading */}
      {(!isLoaded || !imagesPreloaded) && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#B87333',
          }}
        >
          Loading VR…
        </div>
      )}
    </div>
  );
}
