"use client";

import { useRef, useEffect } from 'react';
import './Squares.css';

interface SquaresProps {
  direction?: 'right' | 'left' | 'up' | 'down' | 'diagonal';
  speed?: number;
  borderColor?: string;
  squareSize?: number;
  hoverFillColor?: string;
  className?: string;
}

const Squares = ({
  direction = 'right',
  speed = 1,
  borderColor = '#999',
  squareSize = 40,
  hoverFillColor = '#222',
  className = ''
}: SquaresProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const numSquaresX = useRef<number>(0);
  const numSquaresY = useRef<number>(0);
  const gridOffset = useRef({ x: 0, y: 0 });
  const hoveredSquare = useRef<{ x: number; y: number } | null>(null);
  const timeRef = useRef<number>(0);
  const squareStates = useRef<Map<string, { pulse: number; fadeDelay: number }>>(new Map());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      numSquaresX.current = Math.ceil(canvas.width / squareSize) + 1;
      numSquaresY.current = Math.ceil(canvas.height / squareSize) + 1;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

      timeRef.current += 0.02;

      for (let x = startX; x < canvas.width + squareSize; x += squareSize) {
        for (let y = startY; y < canvas.height + squareSize; y += squareSize) {
          const squareX = x - (gridOffset.current.x % squareSize);
          const squareY = y - (gridOffset.current.y % squareSize);
          
          const gridX = Math.floor((x - startX) / squareSize);
          const gridY = Math.floor((y - startY) / squareSize);
          const key = `${gridX}-${gridY}`;

          // Initialize square state if not exists
          if (!squareStates.current.has(key)) {
            squareStates.current.set(key, {
              pulse: Math.random() * Math.PI * 2,
              fadeDelay: Math.random() * 5
            });
          }

          const state = squareStates.current.get(key)!;

          // Calculate distance from center for radial effects
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const distFromCenter = Math.sqrt(
            Math.pow(squareX + squareSize / 2 - centerX, 2) + 
            Math.pow(squareY + squareSize / 2 - centerY, 2)
          );
          const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);
          const normalizedDist = distFromCenter / maxDist;

          // Dynamic pulsing effect
          const pulse = Math.sin(timeRef.current + state.pulse + normalizedDist * 3) * 0.5 + 0.5;
          
          // Ripple effect from center
          const ripple = Math.sin(timeRef.current * 2 - normalizedDist * 8) * 0.5 + 0.5;
          
          // Wave effect
          const wave = Math.sin(timeRef.current + gridX * 0.3 + gridY * 0.3) * 0.3 + 0.7;

          // Combine effects
          const combinedEffect = (pulse * 0.4 + ripple * 0.3 + wave * 0.3);

          // Enhanced border color with opacity variation
          const baseOpacity = 0.3 + combinedEffect * 0.4;
          const borderOpacity = Math.max(0.2, Math.min(0.8, baseOpacity * (1 - normalizedDist * 0.3)));

          // Hover effect
          const isHovered = hoveredSquare.current &&
            gridX === hoveredSquare.current.x &&
            gridY === hoveredSquare.current.y;

          if (isHovered) {
            // Glow effect on hover
            const glowGradient = ctx.createRadialGradient(
              squareX + squareSize / 2,
              squareY + squareSize / 2,
              0,
              squareX + squareSize / 2,
              squareY + squareSize / 2,
              squareSize * 1.5
            );
            glowGradient.addColorStop(0, `${hoverFillColor}66`);
            glowGradient.addColorStop(0.5, `${hoverFillColor}33`);
            glowGradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = glowGradient;
            ctx.fillRect(squareX - squareSize / 2, squareY - squareSize / 2, squareSize * 2, squareSize * 2);

            ctx.fillStyle = `${hoverFillColor}99`;
            ctx.fillRect(squareX, squareY, squareSize, squareSize);
          }

          // Random subtle fills for depth
          if (Math.sin(timeRef.current + state.fadeDelay + gridX * 0.5) > 0.95) {
            const fillOpacity = Math.floor((combinedEffect * 0.15) * 255).toString(16).padStart(2, '0');
            ctx.fillStyle = `${borderColor}${fillOpacity}`;
            ctx.fillRect(squareX, squareY, squareSize, squareSize);
          }

          // Draw border with variable width
          const lineWidth = 0.5 + combinedEffect * 1;
          ctx.lineWidth = lineWidth;
          
          const opacityHex = Math.floor(borderOpacity * 255).toString(16).padStart(2, '0');
          ctx.strokeStyle = `${borderColor}${opacityHex}`;
          ctx.strokeRect(squareX, squareY, squareSize, squareSize);
        }
      }

      // Enhanced gradient overlay with dynamic center glow
      const centerGlowPulse = Math.sin(timeRef.current * 0.5) * 0.1 + 0.1;
      
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.sqrt(canvas.width ** 2 + canvas.height ** 2) / 2
      );
      gradient.addColorStop(0, `rgba(0, 0, 0, ${centerGlowPulse})`);
      gradient.addColorStop(0.4, 'rgba(0, 0, 0, 0.4)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.85)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add subtle scanline effect
      if (timeRef.current % 0.1 < 0.05) {
        ctx.strokeStyle = 'rgba(255, 116, 0, 0.03)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, (timeRef.current * 50) % canvas.height);
        ctx.lineTo(canvas.width, (timeRef.current * 50) % canvas.height);
        ctx.stroke();
      }
    };

    const updateAnimation = () => {
      const effectiveSpeed = Math.max(speed, 0.1);
      
      // Add slight speed variation for more organic feel
      const speedVariation = Math.sin(timeRef.current * 0.5) * 0.1 + 1;
      const adjustedSpeed = effectiveSpeed * speedVariation;

      switch (direction) {
        case 'right':
          gridOffset.current.x = (gridOffset.current.x - adjustedSpeed + squareSize) % squareSize;
          break;
        case 'left':
          gridOffset.current.x = (gridOffset.current.x + adjustedSpeed + squareSize) % squareSize;
          break;
        case 'up':
          gridOffset.current.y = (gridOffset.current.y + adjustedSpeed + squareSize) % squareSize;
          break;
        case 'down':
          gridOffset.current.y = (gridOffset.current.y - adjustedSpeed + squareSize) % squareSize;
          break;
        case 'diagonal':
          gridOffset.current.x = (gridOffset.current.x - adjustedSpeed + squareSize) % squareSize;
          gridOffset.current.y = (gridOffset.current.y - adjustedSpeed + squareSize) % squareSize;
          break;
        default:
          break;
      }

      drawGrid();
      requestRef.current = requestAnimationFrame(updateAnimation);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

      const hoveredSquareX = Math.floor((mouseX + gridOffset.current.x - startX) / squareSize);
      const hoveredSquareY = Math.floor((mouseY + gridOffset.current.y - startY) / squareSize);

      if (
        !hoveredSquare.current ||
        hoveredSquare.current.x !== hoveredSquareX ||
        hoveredSquare.current.y !== hoveredSquareY
      ) {
        hoveredSquare.current = { x: hoveredSquareX, y: hoveredSquareY };
      }
    };

    const handleMouseLeave = () => {
      hoveredSquare.current = null;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    requestRef.current = requestAnimationFrame(updateAnimation);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [direction, speed, borderColor, hoverFillColor, squareSize]);

  return <canvas ref={canvasRef} className={`squares-canvas ${className}`}></canvas>;
};

export default Squares;
