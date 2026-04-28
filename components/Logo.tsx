import React from "react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex flex-col items-center select-none ${className}`}
      aria-label="Etienne Perfumes"
      // Latin wordmark — keep LTR direction even in Arabic UI so the letters
      // sit in correct order, and use inline letter-spacing so the global
      // RTL "kill tracking" rule doesn't strip it.
      dir="ltr"
    >
      <span
        className="text-[22px] leading-none text-ink"
        style={{
          fontWeight: 500,
          letterSpacing: "0.32em",
          fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
        }}
      >
        ETIENNE
      </span>
      <span
        className="mt-2 text-[9px] text-ink/50 uppercase"
        style={{
          letterSpacing: "0.5em",
          fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
        }}
      >
        Perfumes
      </span>
    </div>
  );
}

export function Monogram({ size = 56 }: { size?: number }) {
  return (
    <div
      className="rounded-full grid place-items-center bg-white text-black font-display"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.42,
        fontWeight: 500,
        boxShadow: "0 0 0 1px rgba(255,255,255,0.18)",
      }}
      aria-hidden
    >
      É
    </div>
  );
}
