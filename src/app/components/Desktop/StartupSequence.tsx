"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { PORTFOLIO_LOGO_DARK_SRC } from "../logoAssets";

const BOOT_DURATION_MS = 2400;
const BOOT_FADE_DURATION_SECONDS = 0.4;
const STARTUP_SESSION_KEY = "portfolio-startup-complete";

type StartupPhase = "checking" | "boot" | "fading-out" | "done";

function PortfolioLogo({ size = 128 }: { size?: number }) {
  return (
    <Image
      src={PORTFOLIO_LOGO_DARK_SRC}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      priority
    />
  );
}

function getSessionStartupComplete() {
  try {
    return window.sessionStorage.getItem(STARTUP_SESSION_KEY) === "true";
  } catch {
    return false;
  }
}

function setSessionStartupComplete() {
  try {
    window.sessionStorage.setItem(STARTUP_SESSION_KEY, "true");
  } catch {
    // Storage can be unavailable in private or locked-down browser contexts.
  }
}

function BootPanel({
  progress,
  reduceMotion,
}: {
  progress: number;
  reduceMotion: boolean;
}) {
  return (
    <motion.div
      key="boot"
      aria-label="Boot sequence"
      className="absolute inset-0 bg-black"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0.12 : BOOT_FADE_DURATION_SECONDS, ease: "easeOut" }}
    >
      <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2">
        <PortfolioLogo />
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

export default function StartupSequence() {
  const [phase, setPhase] = useState<StartupPhase>("checking");
  const [progress, setProgress] = useState(0);
  const reduceMotion = useReducedMotion() ?? false;
  const hasStartedBoot = useRef(false);

  useEffect(() => {
    if (getSessionStartupComplete()) {
      setPhase("done");
      return;
    }

    setPhase("boot");
  }, []);

  useEffect(() => {
    if (phase !== "boot" || hasStartedBoot.current) {
      return;
    }

    hasStartedBoot.current = true;
    const duration = reduceMotion ? 500 : BOOT_DURATION_MS;
    const start = performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const nextProgress = Math.min(((now - start) / duration) * 100, 100);
      setProgress(nextProgress);

      if (nextProgress < 100) {
        frameId = requestAnimationFrame(tick);
        return;
      }

      window.setTimeout(() => {
        setSessionStartupComplete();
        setPhase("fading-out");
      }, reduceMotion ? 80 : 180);
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [phase, reduceMotion]);

  // The boot panel stays mounted through its fade so the desktop is revealed
  // underneath; only then does the overlay leave the tree entirely.
  const handleFadeComplete = useCallback(() => {
    setPhase("done");
  }, []);

  if (phase === "done") {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[100] overflow-hidden"
      data-startup-sequence="true"
    >
      <AnimatePresence mode="wait" onExitComplete={handleFadeComplete}>
        {phase === "checking" || phase === "boot" ? (
          <BootPanel progress={progress} reduceMotion={reduceMotion} />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
