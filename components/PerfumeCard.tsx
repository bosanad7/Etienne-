"use client";
import type { Perfume } from "@/lib/types";
import { motion } from "framer-motion";

export default function PerfumeCard({ perfume }: { perfume: Perfume }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="rounded-3xl overflow-hidden tile relative"
    >
      <div className="h-48 w-full relative grid place-items-center bg-gradient-to-b from-white/[0.06] via-white/[0.02] to-transparent">
        <div
          className="absolute inset-0 opacity-30"
          style={{ backgroundImage: "var(--grain)", backgroundSize: "5px 5px" }}
        />
        <BottleSilhouette />
      </div>
      <div className="p-7">
        <p className="text-[10px] tracking-[0.4em] uppercase text-ink/55">Etienne</p>
        <h3 className="font-display text-3xl text-ink mt-1">{perfume.name}</h3>
        <p className="font-display italic text-ink/65 mt-1">{perfume.tagline}</p>
        <p className="text-[14px] text-ink/75 mt-4 leading-relaxed">
          {perfume.description}
        </p>
        <div className="hairline w-12 my-6" />
        <div className="grid grid-cols-3 gap-3 text-[11px]">
          <NoteCol label="Top" notes={perfume.notes.top} />
          <NoteCol label="Heart" notes={perfume.notes.heart} />
          <NoteCol label="Base" notes={perfume.notes.base} />
        </div>
        <a
          href={perfume.shopUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mt-7 inline-block w-full text-center"
        >
          Shop {perfume.name}
        </a>
      </div>
    </motion.div>
  );
}

function NoteCol({ label, notes }: { label: string; notes: string[] }) {
  return (
    <div>
      <p className="text-[9px] tracking-[0.3em] uppercase text-ink/45 mb-2">
        {label}
      </p>
      <ul className="space-y-1">
        {notes.map((n) => (
          <li key={n} className="font-display text-[14px] text-ink/85 leading-tight">
            {n}
          </li>
        ))}
      </ul>
    </div>
  );
}

function BottleSilhouette() {
  return (
    <svg
      width="74"
      height="116"
      viewBox="0 0 74 116"
      fill="none"
      className="drop-shadow-[0_18px_30px_rgba(0,0,0,0.6)]"
    >
      <rect x="28" y="2" width="18" height="12" rx="2" fill="rgba(255,255,255,0.85)" />
      <rect x="24" y="14" width="26" height="6" rx="1" fill="rgba(255,255,255,0.7)" />
      <rect
        x="10"
        y="22"
        width="54"
        height="84"
        rx="10"
        fill="rgba(255,255,255,0.06)"
        stroke="rgba(255,255,255,0.45)"
      />
      <rect
        x="14"
        y="40"
        width="46"
        height="22"
        rx="2"
        fill="rgba(255,255,255,0.92)"
      />
      <text
        x="37"
        y="55"
        textAnchor="middle"
        fontFamily="IBM Plex Sans, system-ui, sans-serif"
        fontSize="10"
        fontWeight="500"
        fill="#000000"
        letterSpacing="2"
      >
        ETIENNE
      </text>
    </svg>
  );
}
