"use client";
import { useEffect, useState } from "react";
import { ACTIVE_CHALLENGE } from "@/lib/challenges";
import { displayLabel } from "@/lib/identity";
import { useLang } from "@/components/LangProvider";
import type { ScoreEntry } from "@/lib/types";

/**
 * Compact pre-game podium — three rows, minimal, no animation.
 * Hides itself when no scores exist so the screen never shows an empty box.
 */
export default function TopThree() {
  const { t } = useLang();
  const [entries, setEntries] = useState<ScoreEntry[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/leaderboard", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const all = (data.entries ?? []) as ScoreEntry[];
        const filtered = all
          .filter((e) => e.challenge === ACTIVE_CHALLENGE.id)
          .slice(0, 3);
        setEntries(filtered);
      })
      .catch(() => {
        if (!cancelled) setEntries([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (entries === null) {
    return (
      <div className="rounded-2xl tile px-5 py-4">
        <p className="text-[9px] tracking-[0.4em] uppercase text-ink/45 text-center">
          {t("top3_title")}
        </p>
        <div className="mt-3 space-y-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-4 rounded bg-white/[0.04] animate-pulse"
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (entries.length === 0) return null;

  return (
    <div className="rounded-2xl tile px-5 py-4">
      <div className="flex items-center justify-between">
        <p className="text-[9px] tracking-[0.4em] uppercase text-ink/55">
          {t("top3_title")}
        </p>
        <p className="text-[9px] tracking-[0.3em] uppercase text-ink/35 tabular-nums">
          {entries.length === 1
            ? t("top3_count_one")
            : t("top3_count_many", { n: entries.length })}
        </p>
      </div>
      <div className="mt-3 divide-y divide-white/8">
        {entries.map((e, i) => (
          <Row key={e.id} rank={i + 1} entry={e} />
        ))}
      </div>
    </div>
  );
}

function Row({ rank, entry }: { rank: number; entry: ScoreEntry }) {
  const isFirst = rank === 1;
  return (
    <div className="flex items-center gap-3 py-2.5">
      <span
        className={`w-5 text-[12px] tabular-nums ${
          isFirst ? "text-ink" : "text-ink/45"
        }`}
        dir="ltr"
      >
        {rank}
      </span>
      <span
        className={`flex-1 min-w-0 truncate text-[14px] leading-tight ${
          isFirst ? "text-ink font-medium" : "text-ink/80"
        }`}
        dir="ltr"
      >
        {displayLabel(entry)}
      </span>
      <span
        className={`text-[14px] leading-none tabular-nums ${
          isFirst ? "text-ink font-display" : "text-ink/65 font-display"
        }`}
        dir="ltr"
      >
        {entry.score.toLocaleString()}
      </span>
    </div>
  );
}
