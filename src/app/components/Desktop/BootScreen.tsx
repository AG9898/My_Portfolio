"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const BOOT_DURATION_MS = 2400;
const FADE_DURATION_SECONDS = 0.4;

function AppleLogo() {
  return (
    <svg
      aria-hidden="true"
      className="h-16 w-16 text-white"
      viewBox="0 0 64 78"
      fill="currentColor"
    >
      <path d="M49.8 39.5c-.1-8.2 6.7-12.2 7-12.4-3.9-5.7-9.8-6.5-11.9-6.6-5-.5-9.8 3-12.4 3-2.7 0-6.8-2.9-11.1-2.8-5.7.1-11 3.4-13.9 8.6-6 10.3-1.5 25.5 4.2 33.8 2.9 4.1 6.3 8.7 10.7 8.5 4.3-.2 5.9-2.7 11.1-2.7s6.6 2.7 11.1 2.6c4.6-.1 7.6-4.1 10.3-8.2 3.3-4.8 4.6-9.5 4.7-9.7-.1 0-9.7-3.7-9.8-14.6Z" />
      <path d="M41.6 15.1c2.4-2.9 4-6.9 3.5-11-3.4.1-7.7 2.3-10.1 5.2-2.2 2.5-4.1 6.7-3.6 10.6 3.8.3 7.8-1.9 10.2-4.8Z" />
    </svg>
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
