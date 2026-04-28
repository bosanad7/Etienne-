"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { useLang } from "@/components/LangProvider";
import type { ScoreEntry } from "@/lib/types";
import { ACTIVE_CHALLENGE } from "@/lib/challenges";
import { displayLabel } from "@/lib/identity";
import { loadProfile } from "@/lib/storage";

export default function Leaderboard() {
  const { t } = useLang();
  const [entries, setEntries] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<{ name: string; handle?: string } | null>(null);

  useEffect(() => {
    setMe(loadProfile());
    fetch("/api/leaderboard", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        const all = (data.entries ?? []) as ScoreEntry[];
        setEntries(all.filter((e) => e.challenge === ACTIVE_CHALLENGE.id));
      })
      .finally(() => setLoading(false));
  }, []);

  const myKey = useMemo(() => {
    if (!me) return null;
    return (me.handle ? `@${me.handle.replace(/^@/, "")}` : me.name).toLowerCase();
  }, [me]);

  function isMe(e: ScoreEntry) {
    if (!myKey) return false;
    return displayLabel(e).toLowerCase() === myKey;
  }

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3, 10);

  return (
    <section className="px-6 pt-8 pb-24 min-h-[100dvh]">
      <header className="flex items-center justify-between">
        <Link
          href="/"
          className="text-[10px] tracking-[0.4em] uppercase text-ink/55 hover:text-ink transition-colors"
        >
          {t("arrow_back")} {t("home")}
        </Link>
        <Logo className="scale-75" />
        <span className="w-10" />
      </header>

      <div className="text-center mt-12">
        <p className="text-[10px] tracking-[0.5em] uppercase text-ink/55">
          {t("leaderboard_eyebrow")}
        </p>
        <h1 className="font-display text-[44px] mt-3 leading-[1.05]">
          {t("leaderboard_title")}
        </h1>
        <p className="font-display italic text-ink/60 mt-3 text-base">
          {t("leaderboard_subtitle")}
        </p>
        {!loading && entries.length > 0 && (
          <p className="text-[10px] tracking-[0.4em] uppercase text-ink/45 mt-4 tabular-nums">
            {entries.length === 1
              ? t("players_count_one")
              : t("players_count_many", { n: entries.length })}
          </p>
        )}
      </div>

      {loading ? (
        <div className="mt-10 p-8 text-center text-ink/55 text-[12px] tracking-[0.4em] uppercase">
          {t("loading")}
        </div>
      ) : entries.length === 0 ? (
        <div className="mt-10 p-10 text-center rounded-3xl tile">
          <p className="font-display italic text-ink/70">{t("no_scores")}</p>
          <Link href="/play" className="btn-primary inline-block mt-6">
            {t("play")}
          </Link>
        </div>
      ) : (
        <>
          {top3.length > 0 && (
            <div className="mt-10 space-y-3">
              {top3.map((e, i) => (
                <PodiumCard
                  key={e.id}
                  rank={i + 1}
                  entry={e}
                  isMe={isMe(e)}
                />
              ))}
            </div>
          )}

          {rest.length > 0 && (
            <div className="mt-6 rounded-3xl tile divide-y divide-white/8 overflow-hidden">
              {rest.map((e, i) => {
                const rank = i + 4;
                const mine = isMe(e);
                return (
                  <div
                    key={e.id}
                    className={`flex items-center gap-3 px-4 py-3.5 ${
                      mine ? "bg-white/[0.06]" : ""
                    }`}
                  >
                    <div
                      className="w-7 text-center font-display text-[15px] text-ink/55 tabular-nums"
                      dir="ltr"
                    >
                      {rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-display text-[15px] leading-tight truncate"
                        dir="ltr"
                      >
                        {displayLabel(e)}
                        {mine && (
                          <span className="ms-2 text-[9px] tracking-[0.3em] uppercase text-ink/55 align-middle">
                            {t("you")}
                          </span>
                        )}
                      </p>
                    </div>
                    <p
                      className="font-display text-lg leading-none tabular-nums"
                      dir="ltr"
                    >
                      {e.score.toLocaleString()}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {entries.length > 10 && (
            <p className="text-center mt-6 text-[10px] tracking-[0.4em] uppercase text-ink/45">
              {t("more_competing", { n: entries.length - 10 })}
            </p>
          )}
        </>
      )}

      <div className="mt-10 text-center">
        <Link href="/play" className="btn-primary inline-block">
          {t("play_to_climb")}
        </Link>
      </div>
    </section>
  );
}

function PodiumCard({
  rank,
  entry,
  isMe,
}: {
  rank: number;
  entry: ScoreEntry;
  isMe: boolean;
}) {
  const { t } = useLang();
  const isFirst = rank === 1;
  const baseClass = isFirst
    ? "bg-white text-black"
    : "bg-white/[0.04] border border-white/25 text-ink";
  const labelClass = isFirst ? "text-black/60" : "text-ink/55";
  const scoreClass = isFirst ? "text-black" : "text-ink";
  const youBadgeClass = isFirst
    ? "border border-black/30 text-black/70"
    : "border border-white/30 text-ink/70";
  const podiumLabel =
    rank === 1 ? t("champion") : rank === 2 ? t("runner_up") : t("third");

  return (
    <div
      className={`relative rounded-3xl px-5 py-5 ${baseClass} ${
        isMe ? "ring-1 ring-white/40" : ""
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`shrink-0 w-12 h-12 rounded-full grid place-items-center font-display text-xl tabular-nums ${
            isFirst
              ? "bg-black text-white"
              : "border border-white/40 text-ink"
          }`}
          dir="ltr"
        >
          {rank}
        </div>

        <div className="flex-1 min-w-0">
          <p className={`text-[9px] tracking-[0.4em] uppercase ${labelClass}`}>
            {podiumLabel}
          </p>
          <p
            className="font-display text-[22px] leading-tight mt-0.5 truncate flex items-center gap-2"
            dir="ltr"
          >
            <span className="truncate">{displayLabel(entry)}</span>
            {isMe && (
              <span
                className={`text-[8px] tracking-[0.3em] uppercase px-1.5 py-0.5 rounded ${youBadgeClass}`}
              >
                {t("you")}
              </span>
            )}
          </p>
        </div>

        <div className="text-end">
          <p
            className={`font-display text-3xl leading-none tabular-nums ${scoreClass}`}
            dir="ltr"
          >
            {entry.score.toLocaleString()}
          </p>
          <p className={`text-[9px] tracking-[0.3em] uppercase mt-1 ${labelClass}`}>
            {t("pts")}
          </p>
        </div>
      </div>
    </div>
  );
}
