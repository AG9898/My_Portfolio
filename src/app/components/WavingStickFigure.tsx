"use client";

export default function WavingStickFigure() {
  return (
    <div className="flex justify-center my-6">
      <svg
        width="120"
        height="180"
        viewBox="0 0 120 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Head */}
        <circle cx="60" cy="40" r="36" fill="#fff" stroke="#222" strokeWidth="5" />
        {/* Eyes */}
        <ellipse cx="48" cy="44" rx="7" ry="14" fill="#444" />
        <ellipse cx="72" cy="44" rx="7" ry="14" fill="#444" />
        {/* Body */}
        <rect x="52" y="76" width="16" height="48" rx="8" fill="#fff" stroke="#222" strokeWidth="5" />
        {/* Left Arm */}
        <path d="M54 90 Q30 110 44 140" stroke="#222" strokeWidth="7" fill="none" strokeLinecap="round" />
        {/* Right Arm (waving) */}
        <g className="waving-hand">
          <path d="M66 90 Q100 100 80 140" stroke="#222" strokeWidth="7" fill="none" strokeLinecap="round" />
          {/* Hand (circle) */}
          <circle cx="80" cy="140" r="8" fill="#fff" stroke="#222" strokeWidth="5" />
        </g>
        {/* Left Leg */}
        <path d="M58 124 Q50 160 60 172" stroke="#222" strokeWidth="7" fill="none" strokeLinecap="round" />
        {/* Right Leg */}
        <path d="M62 124 Q70 160 60 172" stroke="#222" strokeWidth="7" fill="none" strokeLinecap="round" />
        {/* Feet */}
        <ellipse cx="60" cy="174" rx="14" ry="4" fill="#222" />
      </svg>
      <style jsx>{`
        .waving-hand {
          transform-origin: 66px 90px;
          animation: wave-hand 1.2s infinite ease-in-out;
        }
        @keyframes wave-hand {
          0% { transform: rotate(0deg); }
          10% { transform: rotate(15deg); }
          20% { transform: rotate(35deg); }
          30% { transform: rotate(15deg); }
          40% { transform: rotate(35deg); }
          50% { transform: rotate(15deg); }
          60% { transform: rotate(0deg); }
          100% { transform: rotate(0deg); }
        }
      `}</style>
    </div>
  );
} 