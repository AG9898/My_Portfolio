"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Wallpaper from "./Wallpaper";

export default function MobileFallback() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      className="fixed inset-0 isolate flex min-h-dvh items-center justify-center overflow-hidden bg-desktop px-6 py-10 text-label-primary md:hidden"
      aria-label="Mobile portfolio fallback"
    >
      <Wallpaper />
      <div className="absolute inset-0 bg-desktop opacity-45" aria-hidden="true" />

      <div
        className="glass relative z-10 w-full max-w-[360px] rounded-xl border border-glass-edge px-5 py-6 text-center shadow-2xl"
        style={{
          boxShadow:
            "0 22px 70px rgba(0,0,0,0.35), inset 0 1px 0 var(--color-glass-edge)",
        }}
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-chrome text-accent">
          <Monitor size={28} strokeWidth={1.8} />
        </div>
        <h1 className="text-[22px] font-semibold leading-tight">
          Aden Guo Portfolio
        </h1>
        <p className="mt-3 text-[15px] leading-6 text-label-secondary">
          The desktop portfolio opens on tablet and larger screens. Mobile gets
          this focused fallback instead of cramped draggable windows.
        </p>

        <div className="mt-6">
          <a
            className="mx-auto flex h-11 w-full items-center justify-center rounded-lg bg-accent px-3 text-[13px] font-medium text-white"
            href="/cv.pdf"
          >
            Open CV
          </a>
        </div>

        <button
          type="button"
          className="mx-auto mt-5 flex h-9 items-center justify-center gap-2 rounded-lg border border-glass-edge px-3 text-[13px] text-label-primary"
          style={{ background: "var(--color-control-hover)" }}
          onClick={() => setTheme(isLight ? "dark" : "light")}
          disabled={!mounted}
          aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
        >
          {isLight ? <Moon size={15} /> : <Sun size={15} />}
          {isLight ? "Dark" : "Light"}
        </button>
      </div>
    </section>
  );
}
