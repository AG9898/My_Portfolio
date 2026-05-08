"use client";

/**
 * Wallpaper — tahoe-dawn CSS radial gradient with animated blobs and grain overlay.
 *
 * The CSS gradient is the server-rendered static layer (also acts as the fallback
 * for V1_013 when simplex-noise canvas is added). Two blob divs animate on 24s and
 * 32s cycles per docs/styling.md. A grain overlay uses an inline SVG feTurbulence
 * filter at opacity 0.06.
 *
 * prefers-reduced-motion: animation-play-state is paused so blobs freeze in place.
 */
export default function Wallpaper() {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      aria-hidden="true"
      style={{
        // tahoe-dawn gradient — static fallback for SSR and the future canvas layer
        background:
          "radial-gradient(120% 90% at 80% 10%, #ff8a3c 0%, #ff5b8a 22%, #a15bff 48%, #2b3bd6 72%, #0a0a18 100%)",
        backgroundColor: "#0a0a0f",
      }}
    >
      {/* Blob 1 — 24s drift, warm orange/amber tones */}
      <div
        className="wallpaper-blob wallpaper-blob-1"
        style={{
          position: "absolute",
          width: "60%",
          height: "70%",
          top: "30%",
          left: "-10%",
          background:
            "radial-gradient(50% 60% at 20% 80%, rgba(255,200,120,0.25), transparent 60%)",
          animation: "wallpaper-drift1 24s ease-in-out infinite alternate",
          willChange: "transform",
        }}
      />

      {/* Blob 2 — 32s drift, cool blue/violet tones */}
      <div
        className="wallpaper-blob wallpaper-blob-2"
        style={{
          position: "absolute",
          width: "55%",
          height: "65%",
          top: "-10%",
          right: "-5%",
          background:
            "radial-gradient(40% 50% at 80% 30%, rgba(120,140,255,0.30), transparent 60%)",
          animation: "wallpaper-drift2 32s ease-in-out infinite alternate",
          willChange: "transform",
        }}
      />

      {/* Grain overlay — SVG feTurbulence, opacity 0.06 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.06,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23grain)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
