"use client";

export default function WavingGuy() {
  return (
    <div className="flex justify-center my-6">
      <svg
        width="120"
        height="140"
        viewBox="0 0 120 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Head */}
        <circle cx="60" cy="40" r="28" fill="#ffe0b2" stroke="#222" strokeWidth="2" />
        {/* Body */}
        <rect x="44" y="68" width="32" height="40" rx="16" fill="#90caf9" stroke="#222" strokeWidth="2" />
        {/* Left Arm (waving) */}
        <g className="waving-arm">
          <rect x="18" y="60" width="28" height="10" rx="5" fill="#ffe0b2" stroke="#222" strokeWidth="2" />
          {/* Hand */}
          <circle cx="18" cy="65" r="7" fill="#ffe0b2" stroke="#222" strokeWidth="2" />
        </g>
        {/* Right Arm */}
        <rect x="76" y="60" width="28" height="10" rx="5" fill="#ffe0b2" stroke="#222" strokeWidth="2" />
        <circle cx="104" cy="65" r="7" fill="#ffe0b2" stroke="#222" strokeWidth="2" />
        {/* Eyes */}
        <ellipse cx="52" cy="40" rx="3" ry="4" fill="#222" />
        <ellipse cx="68" cy="40" rx="3" ry="4" fill="#222" />
        {/* Smile */}
        <path d="M52 52 Q60 60 68 52" stroke="#222" strokeWidth="2" fill="none" />
      </svg>
      <style jsx>{`
        .waving-arm {
          transform-origin: 32px 65px;
          animation: wave-hand 1.2s infinite ease-in-out;
        }
        @keyframes wave-hand {
          0% { transform: rotate(0deg); }
          10% { transform: rotate(-10deg); }
          20% { transform: rotate(-25deg); }
          30% { transform: rotate(-10deg); }
          40% { transform: rotate(-25deg); }
          50% { transform: rotate(-10deg); }
          60% { transform: rotate(0deg); }
          100% { transform: rotate(0deg); }
        }
      `}</style>
    </div>
  );
} 