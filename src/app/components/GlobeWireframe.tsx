"use client";

export default function GlobeWireframe() {
  return (
    <div className="flex justify-center my-6">
      <svg
        className="animate-spin-slow"
        width="160"
        height="160"
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 0 8px #fff2)' }}
      >
        <g stroke="#fff" strokeWidth="1" opacity="0.8">
          <ellipse cx="80" cy="80" rx="78" ry="78" />
          <ellipse cx="80" cy="80" rx="78" ry="38" />
          <ellipse cx="80" cy="80" rx="78" ry="18" />
          <ellipse cx="80" cy="80" rx="78" ry="58" />
          <ellipse cx="80" cy="80" rx="38" ry="78" />
          <ellipse cx="80" cy="80" rx="18" ry="78" />
          <ellipse cx="80" cy="80" rx="58" ry="78" />
          <ellipse cx="80" cy="80" rx="78" ry="78" transform="rotate(30 80 80)" />
          <ellipse cx="80" cy="80" rx="78" ry="78" transform="rotate(60 80 80)" />
          <ellipse cx="80" cy="80" rx="78" ry="78" transform="rotate(90 80 80)" />
          <ellipse cx="80" cy="80" rx="78" ry="78" transform="rotate(120 80 80)" />
          <ellipse cx="80" cy="80" rx="78" ry="78" transform="rotate(150 80 80)" />
        </g>
      </svg>
      <style jsx>{`
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
} 