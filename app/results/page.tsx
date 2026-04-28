"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import PerfumeCard from "@/components/PerfumeCard";
import ShareCard from "@/components/ShareCard";
import { useLang } from "@/components/LangProvider";
import { loadProfile, loadResult, clearPlay, recordScore } from "@/lib/storage";
import { topTraitKeys, topTraitLabels, type LevelKey } from "@/lib/matchScent";
import type { ChallengeId, Perfume, ScoreEntry, Trait } from "@/lib/types";
import type { StringKey } from "@/lib/i18n";

interface Result {
  score: number;
  accuracy: number;
  level: { key?: LevelKey; title: string; blurb: string };
  perfume: Perfume;
  challenge: ChallengeId;
  traits?: Record<Trait, number>;
}

type SubmitState = "idle" | "submitting" | "done" | "error";

export default function Results() {
  const router = useRouter();
  const { t } = useLang();
  const [result, setResult] = useState<Result | null>(null);
  const [counter, setCounter] = useState(0);
  const [profile, setProfile] = useState<{ name: string; handle?: string } | null>(null);
  const [submit, setSubmit] = useState<SubmitState>("idle");
  const [rank, setRank] = useState<number | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [pointsToClimb, setPointsToClimb] = useState<number | null>(null);
  const [previousBest, setPreviousBest] = useState<number | null>(null);
  const [topScore, setTopScore] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const r = loadResult<Result>();
    if (!r) {
      router.replace("/");
      return;
    }
    const p = loadProfile();
    if (!p?.name) {
      router.replace("/play");
      return;
    }
    setResult(r);
    setProfile(p);
    setPreviousBest(recordScore(r.challenge, r.score));
  }, [router]);

  useEffect(() => {
    if (!result) return;
    let raf = 0;
    const start = Date.now();
    const dur = 1500;
    const step = () => {
      const t = Math.min(1, (Date.now() - start) / dur);
      setCounter(Math.round(result.score * easeOut(t)));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [result]);

  useEffect(() => {
    if (!result || !profile || submit !== "idle") return;
    let cancelled = false;
    setSubmit("submitting");
    (async () => {
      try {
        const res = await fetch("/api/score", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            name: profile.name,
            handle: profile.handle,
            score: result.score,
            challenge: result.challenge,
            perfume: result.perfume.slug,
          }),
        });
        const data = (await res.json()) as { ok?: boolean; entry?: ScoreEntry };
        if (cancelled) return;
        if (!res.ok || !data.entry) {
          setSubmit("error");
          return;
        }
        const entryId = data.entry.id;
        const lb = await fetch("/api/leaderboard", { cache: "no-store" });
        const board = (await lb.json()) as { entries: ScoreEntry[] };
        if (cancelled) return;
        const filtered = board.entries.filter(
          (e) => e.challenge === result.challenge
        );
        const idx = filtered.findIndex((e) => e.id === entryId);
        const myRank = idx >= 0 ? idx + 1 : null;
        setRank(myRank);
        setTotal(filtered.length);
        setTopScore(filtered[0]?.score ?? null);
        if (myRank && myRank > 1) {
          const above = filtered[idx - 1];
          if (above) setPointsToClimb(Math.max(1, above.score - result.score + 1));
        }
        setSubmit("done");
      } catch {
        if (!cancelled) setSubmit("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [result, profile, submit]);

  const traitKeys = useMemo<Trait[]>(() => {
    if (!result?.traits) return [];
    return topTraitKeys(result.traits, 3);
  }, [result]);

  const traitLabelsLocalized = useMemo(
    () => traitKeys.map((k) => t(`trait_${k}` as StringKey)),
    [traitKeys, t]
  );

  // English labels for the share card (campaign asset stays in EN)
  const traitLabelsEn = useMemo(
    () => (result?.traits ? topTraitLabels(result.traits, 3) : []),
    [result]
  );

  const localizedLevel = useMemo(() => {
    if (!result) return { title: "", blurb: "" };
    const key = result.level.key;
    if (key) {
      return {
        title: t(`level_${key}_title` as StringKey),
        blurb: t(`level_${key}_blurb` as StringKey),
      };
    }
    return { title: result.level.title, blurb: result.level.blurb };
  }, [result, t]);

  const delta = useMemo(() => {
    if (!result || previousBest === null) return null;
    return result.score - previousBest;
  }, [result, previousBest]);

  function buildChallengeUrl(): string {
    if (!result || !profile) return "";
    const base =
      typeof window !== "undefined" ? window.location.origin : "https://game.etienneperfumes.com";
    const fromParam = profile.handle
      ? profile.handle.replace(/^@/, "")
      : profile.name;
    const params = new URLSearchParams({
      from: fromParam,
      beat: String(result.score),
    });
    return `${base}/?${params.toString()}`;
  }

  async function shareCard() {
    if (!cardRef.current || !result) return;
    const { toPng } = await import("html-to-image");
    const node = cardRef.current;
    try {
      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 1,
        canvasWidth: 1080,
        canvasHeight: 1920,
      });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "etienne-result.png", { type: "image/png" });
      const text = `My signature is ${result.perfume.name}. What's yours? ${buildChallengeUrl()}`;

      const nav = navigator as Navigator & {
        canShare?: (data: { files?: File[]; url?: string; text?: string }) => boolean;
        share?: (data: { files?: File[]; url?: string; title?: string; text?: string }) => Promise<void>;
      };
      if (nav.share && nav.canShare && nav.canShare({ files: [file] })) {
        await nav.share({
          files: [file],
          title: "My Etienne Signature",
          text,
        });
      } else if (nav.share) {
        await nav.share({ title: "My Etienne Signature", text, url: buildChallengeUrl() });
      } else {
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = "etienne-result.png";
        a.click();
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function challengeFriend() {
    const url = buildChallengeUrl();
    if (!url) return;
    const text = `I scored ${result?.score} on Etienne. Beat me. ${url}`;
    const nav = navigator as Navigator & {
      share?: (data: { url?: string; title?: string; text?: string }) => Promise<void>;
    };
    try {
      if (nav.share) {
        await nav.share({ title: "Beat my Etienne score", text, url });
        return;
      }
    } catch {}
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  function playAgain() {
    clearPlay();
    router.push("/play");
  }
  function askAI() {
    window.dispatchEvent(new CustomEvent("etienne:open-guide"));
  }

  if (!result || !profile) {
    return (
      <div className="min-h-[100dvh] grid place-items-center text-ink/55 text-[12px] tracking-[0.4em] uppercase">
        {t("curating")}
      </div>
    );
  }

  const displayName = profile.handle
    ? profile.handle.startsWith("@")
      ? profile.handle
      : `@${profile.handle}`
    : profile.name;


  return (
    <section className="relative px-6 pt-8 pb-32 min-h-[100dvh] overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-black" />
      <div className="absolute -z-10 inset-x-0 top-0 h-[55%] bg-gradient-to-b from-white/[0.05] via-transparent to-transparent" />
      <div className="absolute -z-10 left-1/2 top-[28%] -translate-x-1/2 w-[140%] aspect-square rounded-full bg-white/[0.025] blur-3xl" />

      <header className="flex items-center justify-between">
        <Link
          href="/"
          className="text-[10px] tracking-[0.4em] uppercase text-ink/55 hover:text-ink transition-colors"
        >
          {t("arrow_back")} {t("home")}
        </Link>
        <Logo className="scale-75" />
        <Link
          href="/leaderboard"
          className="text-[10px] tracking-[0.4em] uppercase text-ink/55 hover:text-ink transition-colors"
        >
          {t("board")}
        </Link>
      </header>

      <div className="text-center mt-16">
        <Reveal delay={0.0}>
          <div className="hairline w-12 mx-auto" />
        </Reveal>
        <Reveal delay={0.15}>
          <p
            className="text-[10px] tracking-[0.5em] uppercase text-ink/55 mt-7"
            dir="ltr"
          >
            {displayName}
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <p className="text-[10px] tracking-[0.5em] uppercase text-ink/45 mt-4">
            {t("your_signature")}
          </p>
        </Reveal>
        <Reveal delay={0.45} y={20}>
          <h1 className="font-display text-[58px] leading-[1.04] mt-3">
            {localizedLevel.title}.
          </h1>
        </Reveal>

        {traitLabelsLocalized.length > 0 && (
          <Reveal delay={0.65}>
            <p className="text-[12px] tracking-[0.42em] uppercase text-ink/65 mt-4">
              {traitLabelsLocalized.join(" · ")}
            </p>
          </Reveal>
        )}

        <Reveal delay={0.85}>
          <p className="font-display italic text-ink/65 mt-5 text-lg max-w-sm mx-auto leading-snug">
            {localizedLevel.blurb}
          </p>
        </Reveal>

        <Reveal delay={1.05} scale>
          <div className="mt-12 grid place-items-center">
            <div className="relative w-[210px] h-[210px] rounded-full grid place-items-center">
              <div
                className="absolute inset-0 rounded-full"
                style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.18)" }}
              />
              <div
                className="absolute inset-3 rounded-full"
                style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)" }}
              />
              <div className="text-center relative">
                <p className="text-[9px] tracking-[0.5em] uppercase text-ink/55">
                  {t("score")}
                </p>
                <p className="font-display text-6xl mt-1 tabular-nums">{counter}</p>
                <p className="text-[10px] tracking-[0.4em] uppercase text-ink/55 mt-2">
                  {Math.round(result.accuracy * 100)}% {t("accuracy_label")}
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {delta !== null && (
          <Reveal delay={1.25}>
            <p
              className={`mt-5 text-[11px] tracking-[0.35em] uppercase ${
                delta > 0 ? "text-ink/85" : delta < 0 ? "text-ink/45" : "text-ink/55"
              }`}
            >
              {delta > 0 && <>{t("delta_up", { n: delta.toLocaleString() })}</>}
              {delta === 0 && <>{t("delta_eq")}</>}
              {delta < 0 && previousBest !== null && (
                <>{t("delta_down", { n: previousBest.toLocaleString() })}</>
              )}
            </p>
          </Reveal>
        )}

        <Reveal delay={1.35}>
          <div className="mt-7 flex flex-col items-center gap-3 min-h-[40px]">
            {submit === "submitting" && (
              <span className="text-[10px] tracking-[0.4em] uppercase text-ink/45">
                {t("saving")}
              </span>
            )}
            {submit === "done" && rank !== null && (
              <>
                <Link
                  href="/leaderboard"
                  className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/25 hover:border-white/60 transition-colors"
                >
                  <span className="text-[10px] tracking-[0.4em] uppercase text-ink/55">
                    {t("rank")}
                  </span>
                  <span className="font-display text-base tabular-nums" dir="ltr">
                    {rank}
                    {total ? <span className="text-ink/40"> / {total}</span> : null}
                  </span>
                  {pointsToClimb !== null && (
                    <span className="text-[10px] tracking-[0.4em] uppercase text-ink/55">
                      +{pointsToClimb} {t("points_to_climb")}
                    </span>
                  )}
                </Link>
                <p className="font-display italic text-ink/70 text-[15px] mt-1">
                  {rank === 1
                    ? t("rank_top1")
                    : rank <= 3
                    ? t("rank_top3")
                    : rank <= 10
                    ? t("rank_top10", { n: pointsToClimb ?? 0 })
                    : total
                    ? t("rank_below", { n: rank, total })
                    : t("on_the_board")}
                </p>
                {topScore !== null && rank > 1 && (
                  <p className="text-[10px] tracking-[0.4em] uppercase text-ink/45">
                    {t("leader_label")} · {topScore.toLocaleString()} {t("pts")}
                  </p>
                )}
              </>
            )}
            {submit === "done" && rank === null && (
              <span className="text-[10px] tracking-[0.4em] uppercase text-ink/45">
                {t("score_saved")}
              </span>
            )}
            {submit === "error" && (
              <span className="text-[10px] tracking-[0.4em] uppercase text-cocoa">
                {t("score_save_error")}
              </span>
            )}
          </div>
        </Reveal>
      </div>

      <Reveal delay={1.5}>
        <div className="mt-16">
          <div className="flex items-center gap-3 justify-center">
            <span className="hairline w-12" />
            <p className="text-[10px] tracking-[0.5em] uppercase text-ink/55">
              {t("your_match")}
            </p>
            <span className="hairline w-12" />
          </div>
          <div className="mt-7">
            <PerfumeCard perfume={result.perfume} />
          </div>
        </div>
      </Reveal>

      <Reveal delay={1.65}>
        <div className="mt-12 grid gap-3">
          <button onClick={playAgain} className="btn-primary w-full">
            {t("play_again")}
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={challengeFriend} className="btn-ghost">
              {copied ? t("copied") : t("challenge_friend")}
            </button>
            <button onClick={shareCard} className="btn-ghost">
              {t("share_story")}
            </button>
          </div>
          <button onClick={askAI} className="btn-ghost w-full">
            {t("ask_guide")}
          </button>
        </div>
      </Reveal>

      <p className="text-center mt-10 text-[10px] tracking-[0.4em] uppercase text-ink/45">
        {t("discount_code")}
      </p>

      {/* Share card stays English — campaign asset */}
      <div className="fixed -left-[3000px] top-0 pointer-events-none" aria-hidden>
        <ShareCard
          ref={cardRef}
          perfume={result.perfume}
          level={{ title: result.level.title, blurb: result.level.blurb }}
          score={result.score}
          name={profile.name}
          handle={profile.handle}
          traits={traitLabelsEn}
          accuracy={result.accuracy}
        />
      </div>

    </section>
  );
}

function Reveal({
  children,
  delay,
  y = 14,
  scale = false,
}: {
  children: React.ReactNode;
  delay: number;
  y?: number;
  scale?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y, ...(scale ? { scale: 0.96 } : {}) }}
      animate={{ opacity: 1, y: 0, ...(scale ? { scale: 1 } : {}) }}
      transition={{ delay, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}
