'use client';

import React, { useEffect, useRef, useState } from 'react';
import { X, Navigation, Compass, MapPin, Phone } from 'lucide-react';

interface ARNavigatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ARNavigator({ isOpen, onClose }: ARNavigatorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [deviceOrientation, setDeviceOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [heading, setHeading] = useState(0);
  
  // Coffee shop location (replace with actual coordinates)
  const shopLocation = {
    lat: 37.7749, // San Francisco example
    lng: -122.4194,
    name: 'Rabuste Coffee',
    address: '123 Coffee Street, San Francisco, CA'
  };

  useEffect(() => {
    if (!isOpen) return;

    // Request camera permission
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasPermission(true);
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        setHasPermission(false);
      }
    };

    // Request location permission
    const initLocation = () => {
      if ('geolocation' in navigator) {
        navigator.geolocation.watchPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
            
            // Calculate heading if available
            if (position.coords.heading !== null) {
              setHeading(position.coords.heading);
            }
          },
          (error) => {
            console.error('Error getting location:', error);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 0
          }
        );
      }
    };

    // Request device orientation
    const handleOrientation = (event: DeviceOrientationEvent) => {
      setDeviceOrientation({
        alpha: event.alpha || 0,
        beta: event.beta || 0,
        gamma: event.gamma || 0
      });
    };

    if (typeof DeviceOrientationEvent !== 'undefined' && typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      (DeviceOrientationEvent as any).requestPermission()
        .then((response: string) => {
          if (response === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
          }
        });
    } else {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    initCamera();
    initLocation();

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [isOpen]);

  // Calculate distance and bearing
  const calculateDistance = () => {
    if (!userLocation) return 0;
    
    const R = 6371; // Earth's radius in km
    const dLat = (shopLocation.lat - userLocation.lat) * Math.PI / 180;
    const dLon = (shopLocation.lng - userLocation.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(shopLocation.lat * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance * 1000; // Convert to meters
  };

  const calculateBearing = () => {
    if (!userLocation) return 0;
    
    const lat1 = userLocation.lat * Math.PI / 180;
    const lat2 = shopLocation.lat * Math.PI / 180;
    const dLon = (shopLocation.lng - userLocation.lng) * Math.PI / 180;
    
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) -
              Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    const bearing = Math.atan2(y, x) * 180 / Math.PI;
    
    return (bearing + 360) % 360;
  };

  const distance = calculateDistance();
  const bearing = calculateBearing();
  const relativeBearing = (bearing - deviceOrientation.alpha + 360) % 360;

  // Draw AR overlay
  useEffect(() => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      canvas.width = videoRef.current?.videoWidth || 640;
      canvas.height = videoRef.current?.videoHeight || 480;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw direction arrow
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const arrowY = canvas.height * 0.3;

      ctx.save();
      ctx.translate(centerX, arrowY);
      ctx.rotate((relativeBearing * Math.PI) / 180);

      // Draw arrow
      ctx.strokeStyle = '#B87333';
      ctx.fillStyle = '#B87333';
      ctx.lineWidth = 8;
      ctx.shadowColor = 'rgba(184, 115, 51, 0.8)';
      ctx.shadowBlur = 20;

      ctx.beginPath();
      ctx.moveTo(0, -60);
      ctx.lineTo(-30, 20);
      ctx.lineTo(0, 0);
      ctx.lineTo(30, 20);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.restore();

      // Draw distance indicator
      if (distance > 0) {
        const distanceText = distance < 1000 
          ? `${Math.round(distance)}m`
          : `${(distance / 1000).toFixed(1)}km`;

        ctx.font = 'bold 32px "Bebas Neue", sans-serif';
        ctx.fillStyle = '#FFFEF9';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 6;
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 10;

        ctx.strokeText(distanceText, centerX, arrowY + 100);
        ctx.fillText(distanceText, centerX, arrowY + 100);
      }

      requestAnimationFrame(draw);
    };

    draw();
  }, [relativeBearing, distance]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#000000',
      }}
    >
      {/* Camera Feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      {/* AR Overlay Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />

      {/* Header */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10000,
          padding: '20px',
          background: 'linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)',
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
            textShadow: '0 2px 10px rgba(0,0,0,0.8)',
          }}>
            AR NAVIGATION
          </h2>
          <p style={{
            fontSize: '0.875rem',
            color: '#B87333',
            letterSpacing: '0.1em',
            textShadow: '0 2px 10px rgba(0,0,0,0.8)',
          }}>
            Follow the arrow to Rabuste
          </p>
        </div>

        <button
          onClick={onClose}
          style={{
            background: 'rgba(184, 115, 51, 0.3)',
            backdropFilter: 'blur(10px)',
            border: '1px solid #B87333',
            color: '#FFFEF9',
            padding: '12px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          <X style={{ width: 24, height: 24 }} />
        </button>
      </div>

      {/* Bottom Info Panel */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10000,
          padding: '20px',
          background: 'linear-gradient(0deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0) 100%)',
        }}
      >
        <div
          style={{
            background: 'rgba(26, 17, 16, 0.9)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(184, 115, 51, 0.5)',
            padding: '24px',
            marginBottom: '16px',
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '16px',
          }}>
            <div
              style={{
                background: 'linear-gradient(135deg, #B87333, #CD7F32)',
                padding: '12px',
              }}
            >
              <MapPin style={{ width: 24, height: 24, color: '#000000' }} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: '1.25rem',
                color: '#FFFEF9',
                marginBottom: '4px',
                letterSpacing: '0.05em',
              }}>
                {shopLocation.name}
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: 'rgba(255, 254, 249, 0.7)',
              }}>
                {shopLocation.address}
              </p>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
          }}>
            <div style={{
              background: 'rgba(184, 115, 51, 0.1)',
              padding: '12px',
              textAlign: 'center',
            }}>
              <Compass style={{ width: 20, height: 20, color: '#B87333', margin: '0 auto 8px' }} />
              <div style={{
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: '1.125rem',
                color: '#D4A574',
              }}>
                {Math.round(bearing)}°
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: 'rgba(255, 254, 249, 0.6)',
              }}>
                Bearing
              </div>
            </div>

            <div style={{
              background: 'rgba(184, 115, 51, 0.1)',
              padding: '12px',
              textAlign: 'center',
            }}>
              <Navigation style={{ width: 20, height: 20, color: '#B87333', margin: '0 auto 8px' }} />
              <div style={{
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: '1.125rem',
                color: '#D4A574',
              }}>
                {distance < 1000 ? `${Math.round(distance)}m` : `${(distance / 1000).toFixed(1)}km`}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: 'rgba(255, 254, 249, 0.6)',
              }}>
                Distance
              </div>
            </div>

            <button
              onClick={() => {
                window.open(`tel:+1234567890`, '_self');
              }}
              style={{
                background: 'rgba(184, 115, 51, 0.2)',
                border: '1px solid #B87333',
                padding: '12px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <Phone style={{ width: 20, height: 20, color: '#B87333' }} />
              <div style={{
                fontSize: '0.75rem',
                color: 'rgba(255, 254, 249, 0.6)',
              }}>
                Call Us
              </div>
            </button>
          </div>
        </div>

        {hasPermission === false && (
          <div style={{
            background: 'rgba(184, 115, 51, 0.2)',
            border: '1px solid #B87333',
            padding: '16px',
            textAlign: 'center',
          }}>
            <p style={{
              fontSize: '0.875rem',
              color: '#FFFEF9',
            }}>
              Please enable camera and location permissions to use AR navigation
            </p>
          </div>
        )}

        <div style={{
          marginTop: '12px',
          display: 'flex',
          gap: '8px',
          justifyContent: 'center',
        }}>
          <button
            onClick={() => {
              const url = `https://www.google.com/maps/dir/?api=1&destination=${shopLocation.lat},${shopLocation.lng}`;
              window.open(url, '_blank');
            }}
            style={{
              flex: 1,
              padding: '14px',
              background: 'linear-gradient(135deg, #B87333, #CD7F32)',
              border: 'none',
              color: '#000000',
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: '1rem',
              letterSpacing: '0.05em',
              cursor: 'pointer',
            }}
          >
            Open in Google Maps
          </button>
        </div>
      </div>

      {!hasPermission && hasPermission !== null && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.9)',
            zIndex: 10001,
          }}
        >
          <div style={{
            textAlign: 'center',
            padding: '40px',
            maxWidth: '400px',
          }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                background: 'rgba(184, 115, 51, 0.2)',
                border: '2px solid #B87333',
                margin: '0 auto 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Navigation style={{ width: 40, height: 40, color: '#B87333' }} />
            </div>
            <h3 style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: '2rem',
              color: '#FFFEF9',
              marginBottom: '16px',
            }}>
              Camera Permission Required
            </h3>
            <p style={{
              fontSize: '1rem',
              color: 'rgba(255, 254, 249, 0.7)',
              lineHeight: 1.6,
            }}>
              To use AR navigation, please allow camera and location access in your browser settings.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}