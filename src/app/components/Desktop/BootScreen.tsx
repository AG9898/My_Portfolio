"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const BOOT_DURATION_MS = 2400;
const FADE_DURATION_SECONDS = 0.4;

function AppleLogo() {
  return (
    <Image
      src="/strawberry-logo.png"
      alt=""
      aria-hidden="true"
      width={128}
      height={128}
      style={{ mixBlendMode: "screen" }}
    />
  );
}

export default function BootScreen() {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isMounted, setIsMounted] = useState(true);
  const hasStartedFade = useRef(false);

  useEffect(() => {
    const start = performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const nextProgress = Math.min(((now - start) / BOOT_DURATION_MS) * 100, 100);

      setProgress(nextProgress);

      if (nextProgress >= 100 && !hasStartedFade.current) {
        hasStartedFade.current = true;
        setIsFading(true);
      }

      if (nextProgress < 100 || !hasStartedFade.current) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <motion.div
      aria-label="Boot sequence"
      className="fixed inset-0 z-[100] bg-black"
      initial={{ opacity: 1 }}
      animate={{ opacity: isFading ? 0 : 1 }}
      transition={{ duration: FADE_DURATION_SECONDS, ease: "easeOut" }}
      onAnimationComplete={() => {
        if (isFading) {
          setIsMounted(false);
        }
      }}
    >
      <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2">
        <AppleLogo />
      </div>

      <div
        className="absolute left-1/2 h-1 w-[176px] -translate-x-1/2 overflow-hidden rounded-full bg-white/15"
        style={{ top: "calc(50% + 64px)" }}
        aria-hidden="true"
      >
        <div
          className="h-full rounded-full bg-white/85"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </motion.div>
  );
}
