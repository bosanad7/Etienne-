"use client";
import { useEffect, useRef, useState } from "react";

export default function Timer({
  total,
  onExpire,
  resetKey,
  paused,
}: {
  total: number;
  onExpire: () => void;
  resetKey: string | number;
  paused?: boolean;
}) {
  const [remaining, setRemaining] = useState(total);
  const startedAt = useRef<number>(Date.now());
  const fired = useRef(false);

  useEffect(() => {
    setRemaining(total);
    startedAt.current = Date.now();
    fired.current = false;
  }, [resetKey, total]);

  useEffect(() => {
    if (paused) return;
    let raf = 0;
    const tick = () => {
      const elapsed = (Date.now() - startedAt.current) / 1000;
      const left = Math.max(0, total - elapsed);
      setRemaining(left);
      if (left <= 0 && !fired.current) {
        fired.current = true;
        onExpire();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [resetKey, total, paused, onExpire]);

  const radius = 22;
  const circ = 2 * Math.PI * radius;
  const pct = remaining / total;
  const dash = circ * pct;
  const danger = remaining < total * 0.33;

  return (
    <div className="relative w-[56px] h-[56px] grid place-items-center" aria-label={`${Math.ceil(remaining)} seconds left`}>
      <svg width="56" height="56" className="timer-ring">
        <circle
          cx="28"
          cy="28"
          r={radius}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1.5"
          fill="transparent"
        />
        <circle
          cx="28"
          cy="28"
          r={radius}
          stroke={danger ? "#A0A0A0" : "#FFFFFF"}
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="transparent"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition: "stroke .25s linear" }}
        />
      </svg>
      <span
        className={`absolute font-display text-[18px] tabular-nums ${
          danger ? "text-cocoa" : "text-ink"
        }`}
      >
        {Math.ceil(remaining)}
      </span>
    </div>
  );
}
