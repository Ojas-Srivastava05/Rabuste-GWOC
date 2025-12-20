"use client";

import { useEffect, useRef } from "react";
import "./bg_login.css";

type Light = {
  x: number;
  y: number;
  r: number;
  dx: number;
  dy: number;
  intensity: number;
};

export default function BackgroundLogin() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    let t = 0;

    const lights: Light[] = [
      { x: w * 0.2, y: h * 0.3, r: 420, dx: 0.02, dy: 0.01, intensity: 0.06 },
      { x: w * 0.8, y: h * 0.7, r: 520, dx: -0.015, dy: 0.01, intensity: 0.04 },
      { x: w * 0.5, y: h * 0.5, r: 600, dx: 0.01, dy: -0.015, intensity: 0.02 },
    ];

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    const draw = () => {
      t += 0.003;

      // Base background
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, w, h);

      // Vignette
      const vignette = ctx.createRadialGradient(
        w / 2,
        h / 2,
        Math.min(w, h) * 0.2,
        w / 2,
        h / 2,
        Math.max(w, h) * 0.7
      );
      vignette.addColorStop(0, "rgba(0,0,0,0)");
      vignette.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);

      lights.forEach((l, i) => {
        l.x += l.dx;
        l.y += l.dy;

        if (l.x < -l.r) l.x = w + l.r;
        if (l.y < -l.r) l.y = h + l.r;
        if (l.x > w + l.r) l.x = -l.r;
        if (l.y > h + l.r) l.y = -l.r;

        const breathe = 1 + Math.sin(t + i) * 0.08;

        const grad = ctx.createRadialGradient(
          l.x,
          l.y,
          0,
          l.x,
          l.y,
          l.r * breathe
        );

        grad.addColorStop(
          0,
          i === 0
            ? `rgba(255,116,0,${l.intensity})`
            : `rgba(255,255,255,${l.intensity})`
        );
        grad.addColorStop(1, "transparent");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(l.x, l.y, l.r * breathe, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(draw);
    };

    draw();
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <div className="bg-login-canvas">
      <canvas ref={canvasRef} />
      <div className="grain-overlay" />
    </div>
  );
}
