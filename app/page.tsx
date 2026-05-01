"use client";
import Link from "next/link";
import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { useLang } from "@/components/LangProvider";

export default function LandingPage() {
  return (
    <Suspense fallback={null}>
      <Landing />
    </Suspense>
  );
}

function Landing() {
  const params = useSearchParams();
  const { t } = useLang();

  const challengeRef = useMemo(() => {
    const beatStr = params.get("beat");
    const from = params.get("from");
    const beat = beatStr ? parseInt(beatStr, 10) : NaN;
    if (!from || !Number.isFinite(beat) || beat <= 0) return null;
    return {
      beat,
      from: from.replace(/^@/, "").slice(0, 32),
    };
  }, [params]);

  const playHref = challengeRef
    ? `/play?beat=${challengeRef.beat}&from=${encodeURIComponent(challengeRef.from)}`
    : "/play";

  return (
    <section className="relative min-h-[100dvh] flex flex-col">
      <div className="absolute inset-0 -z-10 bg-black" />
      <div className="absolute -z-10 inset-x-0 top-0 h-[60%] bg-gradient-to-b from-white/[0.04] via-transparent to-transparent" />
      <div className="absolute -z-10 left-1/2 top-[38%] -translate-x-1/2 w-[120%] aspect-square rounded-full bg-white/[0.03] blur-3xl" />

      <header className="px-6 pt-8 flex items-start justify-between">
        <Logo />
        <Link
          href="/leaderboard"
          className="mt-3 text-[10px] tracking-[0.4em] uppercase text-ink/55 hover:text-ink transition-colors"
        >
          {t("leaderboard")}
        </Link>
      </header>

      {challengeRef ? (
        <ChallengeHero data={challengeRef} playHref={playHref} />
      ) : (
        <DefaultHero playHref={playHref} />
      )}

      <footer className="px-6 pb-8 text-center text-[10px] tracking-[0.4em] uppercase text-ink/35">
        Etienne · {new Date().getFullYear()}
      </footer>
    </section>
  );
}

function DefaultHero({ playHref }: { playHref: string }) {
  const { t, lang } = useLang();
  return (
    <div className="flex-1 px-6 flex flex-col justify-center text-center pt-12 pb-12">
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-[10px] tracking-[0.5em] uppercase text-ink/55"
      >
        {t("landing_eyebrow")}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.9 }}
        className="font-display text-[52px] leading-[1.04] tracking-tight mt-5"
      >
        {lang === "ar" ? (
          <>
            {t("landing_title_1")}{" "}
            <span className="italic">{t("landing_title_2")}</span>
            <br />
            {t("landing_title_3")}
          </>
        ) : (
          <>
            {t("landing_title_1")}
            <br />
            <span className="italic">{t("landing_title_2")}</span>{" "}
            {t("landing_title_3")}
          </>
        )}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.9 }}
        className="font-display italic text-ink/60 mt-6 text-lg"
      >
        {t("landing_tagline")}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.7 }}
        className="mt-14 grid place-items-center"
      >
        <div className="relative w-[220px] h-[220px] grid place-items-center">
          <div className="absolute inset-0 rounded-full bg-white/[0.05] blur-2xl animate-breathe" />
          <Link
            href={playHref}
            className="relative w-[180px] h-[180px] rounded-full bg-white text-black grid place-items-center text-center transition-transform hover:scale-[1.02]"
          >
            <div>
              <span className="block text-[10px] tracking-[0.5em] uppercase text-black/60">
                {t("landing_play_eyebrow")}
              </span>
              <span className="block font-display text-3xl mt-1">
                {t("landing_play_label")}
              </span>
              <span className="block text-[10px] tracking-[0.4em] uppercase text-black/55 mt-1">
                {t("landing_play_meta")}
              </span>
            </div>
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.9 }}
        className="mt-14 grid grid-cols-3 gap-3 text-[11px] text-ink/65"
      >
        <Pillar n="01" t={t("pillar_01_t")} s={t("pillar_01_s")} />
        <Pillar n="02" t={t("pillar_02_t")} s={t("pillar_02_s")} />
        <Pillar n="03" t={t("pillar_03_t")} s={t("pillar_03_s")} />
      </motion.div>
    </div>
  );
}

function ChallengeHero({
  data: cref,
  playHref,
}: {
  data: { beat: number; from: string };
  playHref: string;
}) {
  const { t } = useLang();
  return (
    <div className="flex-1 px-6 flex flex-col justify-center text-center pt-10 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="inline-flex justify-center"
      >
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white text-black text-[10px] tracking-[0.3em] uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-black/70" />
          {t("challenge_chip")}
        </span>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.8 }}
        className="text-[10px] tracking-[0.5em] uppercase text-ink/55 mt-7"
      >
        {t("challenge_dropped", { name: cref.from })}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.9 }}
        className="font-display text-[56px] leading-[1.04] tracking-tight mt-3"
      >
        {t("challenge_beat_pre")}{" "}
        <span className="italic" dir="ltr">
          {cref.beat.toLocaleString()}
        </span>
        <br />
        {t("challenge_beat_post")}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.8 }}
        className="font-display italic text-ink/65 mt-6 text-lg max-w-sm mx-auto"
      >
        {t("challenge_sub", { name: cref.from })}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.7 }}
        className="mt-12 grid place-items-center"
      >
        <Link href={playHref} className="btn-primary px-12 py-5 text-[13px]">
          {t("challenge_accept")}
        </Link>
      </motion.div>

      <Link
        href="/play"
        className="mt-6 text-[10px] tracking-[0.4em] uppercase text-ink/45 hover:text-ink transition-colors"
      >
        {t("challenge_pick_own")}
      </Link>
    </div>
  );
}

function Pillar({ n, t, s }: { n: string; t: string; s: string }) {
  return (
    <div className="rounded-2xl tile p-4">
      <p className="font-display text-2xl text-ink/35">{n}</p>
      <p className="text-[12px] tracking-[0.3em] uppercase text-ink mt-1">{t}</p>
      <p className="font-display italic text-ink/60 text-[14px] mt-2 leading-tight">{s}</p>
    </div>
  );
}
