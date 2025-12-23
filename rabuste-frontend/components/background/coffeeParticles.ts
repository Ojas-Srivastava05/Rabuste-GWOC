export default function initCoffeeParticles(): void {
  const canvas = document.getElementById(
    "coffeeParticles"
  ) as HTMLCanvasElement | null;

  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Accessibility: reduced motion
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    canvas.style.display = "none";
    return;
  }

  const isMobile = window.innerWidth < 768;
  const PARTICLE_COUNT = isMobile ? 18 : 45;

  function resize(): void {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener("resize", resize);

  class Particle {
    x!: number;
    y!: number;
    r!: number;
    vx!: number;
    vy!: number;
    o!: number;

    constructor() {
      this.reset();
    }

    reset(): void {
      if (!canvas) return;
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + Math.random() * 100;
      this.r = Math.random() * 2 + 0.5;
      this.vy = Math.random() * 0.15 + 0.05;
      this.vx = (Math.random() - 0.5) * 0.1;
      this.o = Math.random() * 0.06 + 0.03;
    }

    update(): void {
      this.y -= this.vy;
      this.x += this.vx;
      if (this.y < -20) this.reset();
    }

    draw(): void {
      if (!ctx) return;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 251, 214, ${this.o})`;
      ctx.fill();
    }
  }

  const particles: Particle[] = Array.from(
    { length: PARTICLE_COUNT },
    () => new Particle()
  );

  let lastTime = 0;
  const interval = isMobile ? 40 : 16;

  function animate(time: number): void {
    if (time - lastTime >= interval) {
      lastTime = time;
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
          p.update();
          p.draw();
        });
      }
    }
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}
