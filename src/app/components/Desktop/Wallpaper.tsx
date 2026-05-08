"use client";

import { useEffect, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";
import { useWallpaper } from "./WallpaperProvider";

export default function Wallpaper() {
  const { wallpaper } = useWallpaper();
  return wallpaper === "tahoe-dawn" ? <TahoeDawn /> : <FlowField />;
}

// ─── Tahoe Dawn — radial gradient with two drifting blobs ────────────────────

function TahoeDawn() {
  return (
    <div className="wallpaper-fallback absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="wallpaper-blob-1 absolute" />
      <div className="wallpaper-blob-2 absolute" />
      <div className="wallpaper-grain absolute inset-0 pointer-events-none" />
    </div>
  );
}

// ─── Flow Field — simplex-noise particle canvas ───────────────────────────────

function FlowField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCanvasReady, setIsCanvasReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d", { alpha: true });

    if (!context) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const random = seededRandom(20260507);
    const noise3D = createNoise3D(random);
    const particles = Array.from({ length: prefersReducedMotion.matches ? 120 : 420 }, () =>
      createParticle(),
    );

    let width = 0;
    let height = 0;
    let dpr = 1;
    let animationFrame = 0;
    let lastReducedFrame = 0;
    let hasPainted = false;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      for (const particle of particles) {
        resetParticle(particle, width, height);
      }
    };

    const draw = (time: number) => {
      const reducedMotion = prefersReducedMotion.matches;

      if (reducedMotion && time - lastReducedFrame < 260) {
        animationFrame = window.requestAnimationFrame(draw);
        return;
      }

      lastReducedFrame = time;

      context.globalCompositeOperation = "source-over";
      context.fillStyle = reducedMotion ? "rgba(10, 10, 15, 0.16)" : "rgba(10, 10, 15, 0.075)";
      context.fillRect(0, 0, width, height);
      context.globalCompositeOperation = "lighter";
      context.lineCap = "round";

      const timeOffset = reducedMotion ? 0.08 : time * 0.00008;
      const speed = reducedMotion ? 0.35 : 0.95;

      for (const particle of particles) {
        const previousX = particle.x;
        const previousY = particle.y;
        const angle =
          noise3D(particle.x * 0.0019, particle.y * 0.0019, timeOffset) * Math.PI * 2.2;

        particle.x += Math.cos(angle) * particle.velocity * speed;
        particle.y += Math.sin(angle) * particle.velocity * speed;
        particle.life -= 1;

        if (
          particle.life <= 0 ||
          particle.x < -24 ||
          particle.x > width + 24 ||
          particle.y < -24 ||
          particle.y > height + 24
        ) {
          resetParticle(particle, width, height);
          continue;
        }

        context.strokeStyle = `hsla(${particle.hue}, 88%, ${particle.lightness}%, ${particle.alpha})`;
        context.lineWidth = particle.width;
        context.beginPath();
        context.moveTo(previousX, previousY);
        context.lineTo(particle.x, particle.y);
        context.stroke();
      }

      if (!hasPainted) {
        hasPainted = true;
        setIsCanvasReady(true);
      }

      animationFrame = window.requestAnimationFrame(draw);
    };

    resize();
    animationFrame = window.requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="wallpaper-fallback absolute inset-0 overflow-hidden" aria-hidden="true">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full transition-opacity duration-500"
        style={{ opacity: isCanvasReady ? 1 : 0 }}
      />
      <div className="wallpaper-grain absolute inset-0 pointer-events-none" />
    </div>
  );
}

type Particle = {
  x: number;
  y: number;
  velocity: number;
  life: number;
  hue: number;
  lightness: number;
  alpha: number;
  width: number;
};

function createParticle(): Particle {
  return {
    x: 0,
    y: 0,
    velocity: 0.6 + Math.random() * 1.8,
    life: 0,
    hue: 205 + Math.random() * 110,
    lightness: 54 + Math.random() * 22,
    alpha: 0.045 + Math.random() * 0.08,
    width: 0.45 + Math.random() * 1.4,
  };
}

function resetParticle(particle: Particle, width: number, height: number) {
  particle.x = Math.random() * width;
  particle.y = Math.random() * height;
  particle.velocity = 0.6 + Math.random() * 1.8;
  particle.life = 90 + Math.random() * 260;
}

function seededRandom(seed: number) {
  let state = seed;

  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}
