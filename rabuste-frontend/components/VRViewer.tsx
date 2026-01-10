'use client';

import React, { useEffect, useRef, useState } from 'react';
import { X, Maximize2, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';

interface VRViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VRViewer({ isOpen, onClose }: VRViewerProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);

  // Coffee shop 360° panoramic images (optimized for faster loading)
  const scenes = [
    {
      name: 'Main Counter',
      image: 'https://images.pexels.com/photos/6390818/pexels-photo-6390818.jpeg?auto=compress&cs=tinysrgb&w=2000&h=1000',
      hotspots: [
        { position: '-2 1.6 -4', target: 1, label: 'Seating Area' },
        { position: '3 1.6 -3', target: 2, label: 'Art Gallery' },
      ]
    },
    {
      name: 'Seating Area',
      image: 'https://images.pexels.com/photos/15040062/pexels-photo-15040062.jpeg?auto=compress&cs=tinysrgb&w=2000&h=1000',
      hotspots: [
        { position: '-3 1.6 -4', target: 0, label: 'Back to Counter' },
        { position: '3 1.6 -3', target: 2, label: 'Art Gallery' },
      ]
    },
    {
      name: 'Art Gallery',
      image: 'https://images.pexels.com/photos/33409064/pexels-photo-33409064.jpeg?auto=compress&cs=tinysrgb&w=2000&h=1000',
      hotspots: [
        { position: '-3 1.6 -4', target: 0, label: 'Main Counter' },
        { position: '3 1.6 -3', target: 1, label: 'Seating Area' },
      ]
    }
  ];

  useEffect(() => {
    if (!isOpen) return;

    // Dynamically load A-Frame
    const loadAFrame = async () => {
      if (typeof window !== 'undefined' && !(window as any).AFRAME) {
        const script = document.createElement('script');
        script.src = 'https://aframe.io/releases/1.7.1/aframe.min.js';
        script.async = true;
        script.onload = () => {
          setIsLoaded(true);
        };
        document.head.appendChild(script);
      } else {
        setIsLoaded(true);
      }
    };

    loadAFrame();
  }, [isOpen]);

  useEffect(() => {
    if (!isLoaded || !sceneRef.current) return;

    // Create A-Frame scene
    const scene = document.createElement('a-scene');
    scene.setAttribute('embedded', '');
    scene.setAttribute('vr-mode-ui', 'enabled: true');
    scene.setAttribute('device-orientation-permission-ui', 'enabled: true');

    // Add sky with 360 image
    const sky = document.createElement('a-sky');
    sky.setAttribute('src', scenes[currentScene].image);
    sky.setAttribute('rotation', '0 -130 0');
    scene.appendChild(sky);

    // Add camera with cursor
    const cameraRig = document.createElement('a-entity');
    cameraRig.setAttribute('id', 'cameraRig');

    const camera = document.createElement('a-camera');
    camera.setAttribute('wasd-controls-enabled', 'false');
    camera.setAttribute('look-controls', 'pointerLockEnabled: false');

    const cursor = document.createElement('a-cursor');
    cursor.setAttribute('color', '#B87333');
    cursor.setAttribute('fuse', 'true');
    cursor.setAttribute('fuse-timeout', '1500');
    camera.appendChild(cursor);

    cameraRig.appendChild(camera);
    scene.appendChild(cameraRig);

    // Add hotspots for navigation with working click handlers
    scenes[currentScene].hotspots.forEach((hotspot, index) => {
      const hotspotEntity = document.createElement('a-entity');
      hotspotEntity.setAttribute('position', hotspot.position);
      
      const sphere = document.createElement('a-sphere');
      sphere.setAttribute('radius', '0.3');
      sphere.setAttribute('color', '#B87333');
      sphere.setAttribute('opacity', '0.8');
      sphere.setAttribute('class', 'clickable');
      sphere.setAttribute('cursor-listener', '');
      sphere.setAttribute('animation', 'property: scale; to: 1.3 1.3 1.3; dur: 1000; loop: true; dir: alternate; easing: easeInOutSine');
      
      // Add glow animation
      sphere.setAttribute('animation__glow', 'property: components.material.material.emissiveIntensity; from: 0; to: 0.5; dur: 1000; loop: true; dir: alternate; easing: easeInOutSine');
      sphere.setAttribute('material', 'shader: standard; color: #B87333; emissive: #D4A574; emissiveIntensity: 0.3; metalness: 0.5; roughness: 0.3');
      
      // Use mousedown/touchstart for better mobile support
      const handleClick = () => {
        setCurrentScene(hotspot.target);
      };
      
      sphere.addEventListener('mousedown', handleClick);
      sphere.addEventListener('touchstart', handleClick);
      sphere.addEventListener('click', handleClick);

      hotspotEntity.appendChild(sphere);

      // Add text label with background
      const textBg = document.createElement('a-plane');
      textBg.setAttribute('width', '2');
      textBg.setAttribute('height', '0.5');
      textBg.setAttribute('position', '0 0.6 0');
      textBg.setAttribute('color', '#000000');
      textBg.setAttribute('opacity', '0.7');
      hotspotEntity.appendChild(textBg);

      const text = document.createElement('a-text');
      text.setAttribute('value', hotspot.label);
      text.setAttribute('align', 'center');
      text.setAttribute('color', '#FFFEF9');
      text.setAttribute('width', '3');
      text.setAttribute('position', '0 0.6 0.01');
      text.setAttribute('font', 'roboto');
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
  }, [isLoaded, currentScene]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#000000',
      }}
    >
      {/* Header */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100000,
          padding: '20px',
          paddingTop: '100px', // Add extra padding to account for navbar
          background: 'linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0) 100%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h2 style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: '1.5rem',
            color: '#FFFEF9',
            marginBottom: '0.25rem',
            letterSpacing: '0.05em',
          }}>
            360° VR TOUR
          </h2>
          <p style={{
            fontSize: '0.875rem',
            color: '#B87333',
            letterSpacing: '0.1em',
          }}>
            {scenes[currentScene].name}
          </p>
        </div>

        <button
          onClick={onClose}
          style={{
            background: 'rgba(184, 115, 51, 1)',
            border: '3px solid #D4A574',
            color: '#000000',
            padding: '14px 18px',
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
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #D4A574 0%, #B87333 100%)';
            e.currentTarget.style.transform = 'scale(1.15)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(184, 115, 51, 1), 0 0 40px rgba(212, 165, 116, 0.8)';
            e.currentTarget.style.borderColor = '#FFFEF9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(184, 115, 51, 1)';
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(184, 115, 51, 0.8), 0 0 30px rgba(212, 165, 116, 0.5)';
            e.currentTarget.style.borderColor = '#D4A574';
          }}
          aria-label="Close VR Tour"
        >
          <X style={{ width: 24, height: 24 }} />
        </button>
      </div>

      {/* VR Scene Container */}
      <div
        ref={sceneRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          zIndex: 99999,
        }}
      />

      {/* Loading State */}
      {!isLoaded && (
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
              Loading VR Experience...
            </p>
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
              onClick={() => setCurrentScene(index)}
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