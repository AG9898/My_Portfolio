"use client";

import { useEffect, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";
import * as THREE from "three";
import {
  type FlowFieldSettings,
  type GradientDotsSettings,
  type SpookySmokeSettings,
  type TahoeDawnSettings,
  type WallpaperType,
  useWallpaper,
} from "./WallpaperProvider";

export default function Wallpaper() {
  const {
    wallpaper,
    tahoeDawnSettings,
    flowFieldSettings,
    spookySmokeSettings,
    gradientDotsSettings,
  } = useWallpaper();
  const activeWallpaperRef = useRef(wallpaper);
  const [previousWallpaper, setPreviousWallpaper] = useState<WallpaperType | null>(null);
  const [isPreviousVisible, setIsPreviousVisible] = useState(false);

  useEffect(() => {
    if (wallpaper === activeWallpaperRef.current) {
      return;
    }

    setPreviousWallpaper(activeWallpaperRef.current);
    setIsPreviousVisible(true);
    activeWallpaperRef.current = wallpaper;

    const animationFrame = window.requestAnimationFrame(() => {
      setIsPreviousVisible(false);
    });
    const timeout = window.setTimeout(() => {
      setPreviousWallpaper(null);
    }, 900);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(timeout);
    };
  }, [wallpaper]);

  const renderWallpaper = (type: WallpaperType) => {
    switch (type) {
      case "flow-field":
        return <FlowField settings={flowFieldSettings} />;
      case "tahoe-dawn":
        return <TahoeDawn settings={tahoeDawnSettings} />;
      case "spooky-smoke":
        return <SpookySmoke settings={spookySmokeSettings} />;
      case "gradient-dots":
        return <GradientDots settings={gradientDotsSettings} />;
      default:
        return <TahoeDawn settings={tahoeDawnSettings} />;
    }
  };

  const wallpaperTypes: WallpaperType[] = [
    "flow-field",
    "tahoe-dawn",
    "spooky-smoke",
    "gradient-dots",
  ];

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {wallpaperTypes.map((type) => {
        const isActive = type === wallpaper;
        const isPrevious = type === previousWallpaper;
        const opacity = isActive || (isPrevious && isPreviousVisible) ? 1 : 0;
        const zIndex = isPrevious ? 2 : isActive ? 1 : 0;

        return (
          <div
            key={type}
            className="pointer-events-none absolute inset-0 transition-opacity duration-700 ease-out motion-reduce:transition-none"
            style={{ opacity, zIndex }}
          >
            {renderWallpaper(type)}
          </div>
        );
      })}
    </div>
  );
}

// ─── Tahoe Dawn — radial gradient with two drifting blobs ────────────────────

function TahoeDawn({ settings }: { settings: TahoeDawnSettings }) {
  const dawnRgb = hexToRgb(settings.dawnColor);
  const glowRgb = hexToRgb(settings.glowColor);

  return (
    <div
      className="wallpaper-fallback absolute inset-0 overflow-hidden"
      style={{
        background: [
          `radial-gradient(120% 90% at 80% 10%, ${rgbToCss(dawnRgb)} 0%, ${settings.dawnColor} 22%, ${rgbToCss(glowRgb)} 54%, ${settings.backgroundColor} 100%)`,
          settings.backgroundColor,
        ].join(", "),
      }}
      aria-hidden="true"
    >
      <div
        className="wallpaper-blob-1 absolute"
        style={{
          background: `radial-gradient(50% 60% at 20% 80%, ${rgbToCss(dawnRgb, 0.26)}, transparent 60%)`,
        }}
      />
      <div
        className="wallpaper-blob-2 absolute"
        style={{
          background: `radial-gradient(40% 50% at 80% 30%, ${rgbToCss(glowRgb, 0.32)}, transparent 60%)`,
        }}
      />
      <div className="wallpaper-grain absolute inset-0 pointer-events-none" />
    </div>
  );
}

// ─── Spooky Smoke — transient-color smoke field ──────────────────────────────

function SpookySmoke({ settings }: { settings: SpookySmokeSettings }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const smokeColorRef = useRef(hexToRgb(settings.smokeColor));
  const [isCanvasReady, setIsCanvasReady] = useState(false);

  useEffect(() => {
    smokeColorRef.current = hexToRgb(settings.smokeColor);
  }, [settings.smokeColor]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    setIsCanvasReady(false);

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
      depth: false,
      powerPreference: "high-performance",
      stencil: false,
    });

    if (!gl) {
      return;
    }

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, SPOOKY_SMOKE_VERTEX_SHADER);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, SPOOKY_SMOKE_FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) {
      if (vertexShader) gl.deleteShader(vertexShader);
      if (fragmentShader) gl.deleteShader(fragmentShader);
      return;
    }

    const program = gl.createProgram();

    if (!program) {
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return;
    }

    const positionBuffer = gl.createBuffer();
    const vertexArray = gl.createVertexArray();
    const positionLocation = gl.getAttribLocation(program, "a_position");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const smokeColorLocation = gl.getUniformLocation(program, "u_smokeColor");
    const reducedMotionLocation = gl.getUniformLocation(program, "u_reducedMotion");

    if (
      !positionBuffer ||
      !vertexArray ||
      positionLocation < 0 ||
      !resolutionLocation ||
      !timeLocation ||
      !smokeColorLocation ||
      !reducedMotionLocation
    ) {
      if (positionBuffer) gl.deleteBuffer(positionBuffer);
      if (vertexArray) gl.deleteVertexArray(vertexArray);
      gl.deleteProgram(program);
      return;
    }

    gl.bindVertexArray(vertexArray);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let width = 0;
    let height = 0;
    let dpr = 1;
    let animationFrame = 0;
    let hasPainted = false;
    let lastReducedFrame = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const draw = (time: number) => {
      const reducedMotion = prefersReducedMotion.matches;

      if (reducedMotion && hasPainted && time - lastReducedFrame < 640) {
        animationFrame = window.requestAnimationFrame(draw);
        return;
      }

      lastReducedFrame = time;
      const smokeColor = smokeColorRef.current;

      gl.useProgram(program);
      gl.bindVertexArray(vertexArray);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, reducedMotion ? 16.0 : time * 0.001);
      gl.uniform3f(smokeColorLocation, smokeColor.r, smokeColor.g, smokeColor.b);
      gl.uniform1f(reducedMotionLocation, reducedMotion ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.bindVertexArray(null);

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
      gl.bindVertexArray(null);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.deleteBuffer(positionBuffer);
      gl.deleteVertexArray(vertexArray);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <div
      className="wallpaper-fallback absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full transition-opacity duration-700"
        style={{ opacity: isCanvasReady ? 1 : 0 }}
      />
      <div className="wallpaper-grain absolute inset-0 pointer-events-none" />
    </div>
  );
}

// ─── Cyber Grid — cursor-aware Three.js shader field ─────────────────────────

function GradientDots({ settings }: { settings: GradientDotsSettings }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const colorsRef = useRef({
    background: hexToRgb(settings.backgroundColor),
    grid: hexToRgb(settings.dotColor),
    pulse: hexToRgb(settings.rippleColor),
  });
  const [isCanvasReady, setIsCanvasReady] = useState(false);

  useEffect(() => {
    colorsRef.current = {
      background: hexToRgb(settings.backgroundColor),
      grid: hexToRgb(settings.dotColor),
      pulse: hexToRgb(settings.rippleColor),
    };
  }, [settings.backgroundColor, settings.dotColor, settings.rippleColor]);

  useEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.domElement.className = "absolute inset-0 h-full w-full transition-opacity duration-700";
    renderer.domElement.style.opacity = "0";
    root.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);
    const targetMouse = new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2);
    const currentMouse = targetMouse.clone();
    const clock = new THREE.Clock();
    const uniforms = {
      iResolution: { value: new THREE.Vector2(1, 1) },
      iTime: { value: 0 },
      iMouse: { value: currentMouse.clone() },
      uBackgroundColor: { value: rgbToVector3(colorsRef.current.background) },
      uGridColor: { value: rgbToVector3(colorsRef.current.grid) },
      uPulseColor: { value: rgbToVector3(colorsRef.current.pulse) },
      uReducedMotion: { value: prefersReducedMotion.matches ? 1 : 0 },
    };
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: CYBER_GRID_VERTEX_SHADER,
      fragmentShader: CYBER_GRID_FRAGMENT_SHADER,
      depthTest: false,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let hasPainted = false;

    const resize = () => {
      const rect = root.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      renderer.setSize(width, height, false);
      uniforms.iResolution.value.set(width, height);
    };

    const setPointerState = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      targetMouse.set(event.clientX - rect.left, rect.height - (event.clientY - rect.top));
    };

    const resetPointerState = () => {
      targetMouse.set(uniforms.iResolution.value.x / 2, uniforms.iResolution.value.y / 2);
    };

    const render = () => {
      const reducedMotion = prefersReducedMotion.matches;
      const colors = colorsRef.current;

      currentMouse.lerp(targetMouse, reducedMotion ? 0.08 : 0.14);
      uniforms.iTime.value = reducedMotion ? Math.min(clock.getElapsedTime(), 0.001) : clock.getElapsedTime();
      uniforms.iMouse.value.copy(currentMouse);
      uniforms.uBackgroundColor.value.copy(rgbToVector3(colors.background));
      uniforms.uGridColor.value.copy(rgbToVector3(colors.grid));
      uniforms.uPulseColor.value.copy(rgbToVector3(colors.pulse));
      uniforms.uReducedMotion.value = reducedMotion ? 1 : 0;

      renderer.render(scene, camera);

      if (!hasPainted) {
        hasPainted = true;
        renderer.domElement.style.opacity = "1";
        setIsCanvasReady(true);
      }
    };

    resize();
    window.addEventListener("pointermove", setPointerState);
    window.addEventListener("resize", resize);
    document.addEventListener("pointerleave", resetPointerState);
    renderer.setAnimationLoop(render);

    return () => {
      renderer.setAnimationLoop(null);
      window.removeEventListener("pointermove", setPointerState);
      window.removeEventListener("resize", resize);
      document.removeEventListener("pointerleave", resetPointerState);
      scene.remove(mesh);
      geometry.dispose();
      material.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode === root) {
        root.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="wallpaper-fallback absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {!isCanvasReady ? <div className="absolute inset-0 bg-[var(--color-desktop)]" /> : null}
      <div className="wallpaper-grain absolute inset-0 pointer-events-none" />
    </div>
  );
}

// ─── Flow Field — simplex-noise particle canvas ───────────────────────────────

function FlowField({ settings }: { settings: FlowFieldSettings }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorsRef = useRef({
    background: hexToRgb(settings.backgroundColor),
    line: hexToRgb(settings.lineColor),
  });
  const [isCanvasReady, setIsCanvasReady] = useState(false);

  useEffect(() => {
    colorsRef.current = {
      background: hexToRgb(settings.backgroundColor),
      line: hexToRgb(settings.lineColor),
    };
  }, [settings.backgroundColor, settings.lineColor]);

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
      const colors = colorsRef.current;
      const backgroundAlpha = reducedMotion ? 0.16 : 0.075;

      context.globalCompositeOperation = "source-over";
      context.fillStyle = rgbToCss(colors.background, backgroundAlpha);
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

        context.strokeStyle = rgbToCss(colors.line, particle.alpha);
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
    <div
      className="wallpaper-fallback absolute inset-0 overflow-hidden"
      style={{ background: settings.backgroundColor }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full transition-opacity duration-500"
        style={{ opacity: isCanvasReady ? 1 : 0 }}
      />
      <div className="wallpaper-grain absolute inset-0 pointer-events-none" />
    </div>
  );
}

const SPOOKY_SMOKE_VERTEX_SHADER = `#version 300 es
in vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const SPOOKY_SMOKE_FRAGMENT_SHADER = `#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_smokeColor;
uniform float u_reducedMotion;

out vec4 outColor;

float random(vec2 p) {
  p = fract(p * vec2(12.9898, 78.233));
  p += dot(p, p + 34.56);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));

  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 1.0;
  mat2 warp = mat2(1.0, -1.2, 0.2, 1.2);

  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p = warp * p * 2.0;
    amplitude *= 0.5;
  }

  return value;
}

void main() {
  float motionScale = mix(1.0, 0.04, u_reducedMotion);
  float time = 660.0 + u_time * motionScale;
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
  vec3 color = vec3(1.0);

  uv.x += 0.25;
  uv *= vec2(2.0, 1.0);

  float noiseField = fbm(uv * 0.28 - vec2(time * 0.01, 0.0));
  noiseField = noise(uv * 3.0 + noiseField * 2.0);

  color.r -= fbm(uv + vec2(0.0, time * 0.015) + noiseField);
  color.g -= fbm(uv * 1.003 + vec2(0.0, time * 0.015) + noiseField + 0.003);
  color.b -= fbm(uv * 1.006 + vec2(0.0, time * 0.015) + noiseField + 0.006);

  color = mix(color, u_smokeColor, dot(color, vec3(0.21, 0.71, 0.07)));
  color = mix(vec3(0.08), color, min(u_time * 0.1, 1.0));
  color = clamp(color, 0.08, 1.0);

  outColor = vec4(color, 1.0);
}
`;

const CYBER_GRID_VERTEX_SHADER = `
void main() {
  gl_Position = vec4(position, 1.0);
}
`;

const CYBER_GRID_FRAGMENT_SHADER = `
precision highp float;

uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
uniform vec3 uBackgroundColor;
uniform vec3 uGridColor;
uniform vec3 uPulseColor;
uniform float uReducedMotion;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
  vec2 mouse = (iMouse - 0.5 * iResolution.xy) / iResolution.y;
  float motionScale = mix(1.0, 0.08, uReducedMotion);
  float time = iTime * 0.2 * motionScale;
  float mouseDist = length(uv - mouse);

  float warp = sin(mouseDist * 18.0 - time * 4.0) * 0.024;
  warp *= smoothstep(0.34, 0.0, mouseDist) * (1.0 - uReducedMotion);
  uv += warp;

  vec2 gridUv = abs(fract(uv * 10.0) - 0.5);
  float line = pow(1.0 - min(gridUv.x, gridUv.y), 54.0);
  float crossFade = smoothstep(0.04, 0.0, max(gridUv.x, gridUv.y));
  line = max(line, crossFade * 0.22);

  float pulse = 0.44 + sin(time * 2.0) * 0.12;
  vec3 color = uBackgroundColor * 0.62;
  color += uGridColor * line * pulse;

  float energy = sin(uv.x * 20.0 + time * 5.0) * sin(uv.y * 20.0 + time * 3.0);
  energy = smoothstep(0.82, 1.0, energy);
  color += uPulseColor * energy * line * 0.42;

  float glow = smoothstep(0.14, 0.0, mouseDist);
  color += mix(uGridColor, vec3(1.0), 0.35) * glow * 0.2 * (1.0 - uReducedMotion * 0.65);
  color += random(uv + time * 0.1) * 0.018;

  gl_FragColor = vec4(color, 1.0);
}
`;

function compileShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);

  if (!shader) {
    return null;
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function hexToRgb(hex: string) {
  const normalized = hex.trim().replace("#", "");
  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((character) => character + character)
          .join("")
      : normalized.padEnd(6, "0").slice(0, 6);
  const value = Number.parseInt(full, 16);

  if (Number.isNaN(value)) {
    return { r: 0.65, g: 0.55, b: 0.98 };
  }

  return {
    r: ((value >> 16) & 255) / 255,
    g: ((value >> 8) & 255) / 255,
    b: (value & 255) / 255,
  };
}

function rgbToVector3(color: ReturnType<typeof hexToRgb>) {
  return new THREE.Vector3(color.r, color.g, color.b);
}

function rgbToCss(color: ReturnType<typeof hexToRgb>, alpha = 1) {
  const red = Math.round(color.r * 255);
  const green = Math.round(color.g * 255);
  const blue = Math.round(color.b * 255);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

type Particle = {
  x: number;
  y: number;
  velocity: number;
  life: number;
  alpha: number;
  width: number;
};

function createParticle(): Particle {
  return {
    x: 0,
    y: 0,
    velocity: 0.6 + Math.random() * 1.8,
    life: 0,
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
