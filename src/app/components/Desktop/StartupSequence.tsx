"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { PORTFOLIO_LOGO_DARK_SRC } from "../logoAssets";

const BOOT_DURATION_MS = 2400;
const BOOT_FADE_DURATION_SECONDS = 0.4;
const SIGN_IN_DURATION_MS = 1350;
const STARTUP_SESSION_KEY = "portfolio-startup-complete";

type StartupPhase = "checking" | "boot" | "login" | "signing-in" | "done";

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

function useCurrentDate() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());

    const timerId = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(timerId);
  }, []);

  return now;
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

function LoginPanel({
  phase,
  reduceMotion,
  onEnter,
}: {
  phase: StartupPhase;
  reduceMotion: boolean;
  onEnter: () => void;
}) {
  const now = useCurrentDate();
  const isSigningIn = phase === "signing-in";

  const dateLabel = useMemo(() => {
    if (!now) {
      return "";
    }

    return new Intl.DateTimeFormat(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
    }).format(now);
  }, [now]);

  const timeLabel = useMemo(() => {
    if (!now) {
      return "";
    }

    return new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
    }).format(now);
  }, [now]);

  useEffect(() => {
    if (phase !== "login") {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        return;
      }

      onEnter();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onEnter, phase]);

  return (
    <motion.button
      key="login"
      type="button"
      aria-label={isSigningIn ? "Signing in" : "Click to enter desktop"}
      className="absolute inset-0 cursor-default overflow-hidden text-white outline-none"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: reduceMotion ? 1 : 1.015 }}
      transition={{ duration: reduceMotion ? 0.12 : 0.45, ease: "easeOut" }}
      onClick={onEnter}
      disabled={isSigningIn}
    >
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.14),transparent_28%),linear-gradient(180deg,rgba(0,0,0,0.70),rgba(0,0,0,0.94))]" />

      <motion.div
        className="absolute left-0 right-0 top-[9vh] flex flex-col items-center text-center"
        animate={{
          y: isSigningIn && !reduceMotion ? -14 : 0,
          opacity: isSigningIn ? 0.56 : 1,
        }}
        transition={{ duration: reduceMotion ? 0.12 : 0.45, ease: "easeOut" }}
      >
        <div className="text-[clamp(3.25rem,9vw,7.5rem)] font-semibold leading-none tracking-normal drop-shadow-[0_4px_24px_rgba(0,0,0,0.42)]">
          {timeLabel}
        </div>
        <div className="mt-3 text-[clamp(1rem,2vw,1.35rem)] font-medium text-white/90 drop-shadow-[0_2px_12px_rgba(0,0,0,0.38)]">
          {dateLabel}
        </div>
      </motion.div>

      <div
        data-login-cluster="true"
        className="absolute left-1/2 top-1/2 w-[min(360px,88vw)] -translate-x-1/2 -translate-y-1/2"
      >
        <motion.div
          className="flex flex-col items-center text-center"
          animate={{
            y: isSigningIn && !reduceMotion ? -8 : 0,
            scale: isSigningIn && !reduceMotion ? 0.985 : 1,
          }}
          transition={{ duration: reduceMotion ? 0.12 : 0.35, ease: "easeOut" }}
        >
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-white/30 bg-white/15 shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
            <PortfolioLogo size={96} />
          </div>
          <div className="mt-5 text-[1.35rem] font-semibold tracking-normal text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.42)]">
            Aden Guo
          </div>

          <div className="mt-4 h-10 w-[240px] overflow-hidden rounded-full border border-white/22 bg-white/18 px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_12px_40px_rgba(0,0,0,0.22)] backdrop-blur-2xl">
            {isSigningIn ? (
              <div className="flex h-full items-center justify-center gap-2" aria-hidden="true">
                <span className="h-2 w-2 rounded-full bg-white/88" />
                <span className="h-2 w-2 rounded-full bg-white/88" />
                <span className="h-2 w-2 rounded-full bg-white/88" />
                <span className="h-2 w-2 rounded-full bg-white/88" />
                <span className="h-2 w-2 rounded-full bg-white/88" />
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-sm font-medium text-white/88">
                Click to enter
              </div>
            )}
          </div>

          <AnimatePresence>
            {isSigningIn ? (
              <motion.div
                key="loading"
                className="mt-4 h-1 w-[176px] overflow-hidden rounded-full bg-white/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="h-full rounded-full bg-white/90"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: reduceMotion ? 0.18 : 1.05, ease: "easeInOut" }}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.button>
  );
}

export default function StartupSequence() {
  const [phase, setPhase] = useState<StartupPhase>("checking");
  const [progress, setProgress] = useState(0);
  const reduceMotion = useReducedMotion() ?? false;
  const hasStartedBoot = useRef(false);
  const hasStartedSignIn = useRef(false);

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
        setPhase("login");
      }, reduceMotion ? 80 : 180);
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [phase, reduceMotion]);

  const handleEnter = () => {
    if (phase !== "login" || hasStartedSignIn.current) {
      return;
    }

    hasStartedSignIn.current = true;
    setPhase("signing-in");

    window.setTimeout(
      () => {
        setSessionStartupComplete();
        setPhase("done");
      },
      reduceMotion ? 260 : SIGN_IN_DURATION_MS,
    );
  };

  if (phase === "done") {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden bg-black"
      data-startup-sequence="true"
    >
      <AnimatePresence mode="wait">
        {phase === "boot" || phase === "checking" ? (
          <BootPanel progress={progress} reduceMotion={reduceMotion} />
        ) : (
          <LoginPanel phase={phase} reduceMotion={reduceMotion} onEnter={handleEnter} />
        )}
      </AnimatePresence>
    </div>
  );
}
