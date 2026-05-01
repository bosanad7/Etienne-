"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import TopThree from "@/components/TopThree";
import { useLang } from "@/components/LangProvider";
import { ACTIVE_CHALLENGE } from "@/lib/challenges";
import { buildRound } from "@/lib/buildRound";
import { savePlay, clearPlay, saveProfile, loadProfile } from "@/lib/storage";
import { emptyTraitScores } from "@/lib/matchScent";
import { parseIdentity, type IdentityError } from "@/lib/identity";
import type { PlayState, ScoreEntry } from "@/lib/types";
import type { StringKey } from "@/lib/i18n";

const ERR_KEY: Record<IdentityError, StringKey> = {
  required: "err_required",
  too_long: "err_too_long",
  no_handle: "err_no_handle",
  invalid_chars: "err_invalid_chars",
};

interface CheckResult {
  played: boolean;
  entry?: ScoreEntry;
  rank?: number | null;
  total?: number;
}

export default function PlayPage() {
  return (
    <Suspense fallback={null}>
      <Play />
    </Suspense>
  );
}

function Play() {
  const router = useRouter();
  const params = useSearchParams();
  const { t } = useLang();
  const [raw, setRaw] = useState("");
  const [errorKey, setErrorKey] = useState<StringKey | "">("");
  const [touched, setTouched] = useState(false);
  const [checking, setChecking] = useState(false);
  const [alreadyPlayed, setAlreadyPlayed] = useState<CheckResult | null>(null);

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

  useEffect(() => {
    const p = loadProfile();
    if (!p) return;
    if (p.handle) setRaw(p.handle.replace(/^@+/, ""));
    else if (p.name) setRaw(p.name.replace(/^@+/, ""));
  }, []);

  async function start(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);

    const parsed = parseIdentity(raw);
    if (parsed.errorCode) {
      setErrorKey(ERR_KEY[parsed.errorCode]);
      return;
    }

    // Server-side gate — has this handle already played?
    setChecking(true);
    try {
      const res = await fetch(
        `/api/leaderboard?check=${encodeURIComponent(parsed.canonical)}`,
        { cache: "no-store" }
      );
      const data: CheckResult = await res.json();
      if (data.played) {
        setAlreadyPlayed(data);
        return;
      }
    } catch {
      // Network glitch — fall through and let them play. The /api/score
      // POST still enforces the gate, so they can't double-write.
    } finally {
      setChecking(false);
    }

    saveProfile({ name: parsed.canonical, handle: parsed.handle });

    const questions = buildRound(ACTIVE_CHALLENGE.id);
    const initial: PlayState = {
      challenge: ACTIVE_CHALLENGE.id,
      questions,
      index: 0,
      score: 0,
      correct: 0,
      traitScores: emptyTraitScores(),
      startedAt: Date.now(),
      answers: [],
    };
    clearPlay();
    savePlay(initial);
    router.push("/game");
  }

  function onChange(v: string) {
    // Strip any leading '@' the user types; we render it as a prefix.
    const clean = v.replace(/^@+/, "");
    setRaw(clean);
    if (touched) {
      const parsed = parseIdentity(clean);
      setErrorKey(parsed.errorCode ? ERR_KEY[parsed.errorCode] : "");
    }
  }

  const live = parseIdentity(raw);
  const canBegin = !live.errorCode && !!live.canonical && !checking;

  if (alreadyPlayed && alreadyPlayed.entry) {
    return (
      <AlreadyPlayedView data={alreadyPlayed} />
    );
  }

  return (
    <section className="px-6 pt-8 pb-24 min-h-[100dvh] flex flex-col">
      <header className="flex items-center justify-between">
        <Link
          href="/"
          className="text-[10px] tracking-[0.4em] uppercase text-ink/60 hover:text-ink transition-colors"
        >
          {t("arrow_back")} {t("home")}
        </Link>
        <Logo />
        <span className="w-10" />
      </header>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex flex-col mt-10"
      >
        <div className="text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white text-black text-[10px] tracking-[0.3em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-black/70" />
            {t("signature_challenge")}
          </span>

          {challengeRef && (
            <p className="mt-5 text-[11px] tracking-[0.35em] uppercase text-ink/65">
              {t("target_pre")}{" "}
              <span className="text-ink" dir="ltr">
                {challengeRef.from}
              </span>{" "}
              {t("target_at")}{" "}
              <span className="text-ink" dir="ltr">
                {challengeRef.beat.toLocaleString()}
              </span>
            </p>
          )}

          <h1 className="font-display text-[42px] leading-[1.06] mt-6">
            {t("enter_name_l1")}
            <br />
            {t("enter_name_l2")}
          </h1>
          <p className="text-ink/65 mt-3 text-[15px] max-w-xs mx-auto">
            {t("name_subtitle")}
          </p>

          <div className="mt-7 flex justify-center gap-6 text-[10px] tracking-[0.4em] uppercase text-ink/55 flex-wrap">
            <span>{t("format_q")}</span>
            <span className="text-ink/25">·</span>
            <span>{t("format_t")}</span>
            <span className="text-ink/25">·</span>
            <span>{t("format_r")}</span>
          </div>
        </div>

        <div className="mt-8">
          <TopThree />
        </div>

        <form onSubmit={start} className="mt-7">
          <label
            htmlFor="ident"
            className="block text-[10px] tracking-[0.4em] uppercase text-ink/55 mb-3"
          >
            {t("label_handle")}
          </label>
          <div
            className={`relative rounded-2xl border bg-white/[0.04] transition-colors ${
              errorKey
                ? "border-cocoa/70"
                : canBegin
                ? "border-ink/40"
                : "border-ink/15"
            }`}
          >
            <span
              aria-hidden="true"
              className="absolute start-5 top-1/2 -translate-y-1/2 text-[18px] text-ink/45 select-none pointer-events-none"
              dir="ltr"
            >
              @
            </span>
            <input
              id="ident"
              autoFocus
              inputMode="text"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              maxLength={30}
              value={raw}
              onChange={(e) => onChange(e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder={t("placeholder_input")}
              dir="ltr"
              className="w-full bg-transparent ps-10 pe-5 py-4 text-[18px] outline-none placeholder:text-ink/35"
            />
          </div>
          <div className="min-h-[20px] mt-2 text-[12px] text-cocoa">
            {errorKey ? t(errorKey as StringKey) : ""}
          </div>

          <button
            type="submit"
            disabled={!canBegin}
            className="btn-primary w-full mt-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {checking ? t("loading") : `${t("btn_begin")} ${t("arrow_fwd")}`}
          </button>
        </form>

        <p className="text-[11px] text-ink/45 text-center mt-8 leading-relaxed">
          {t("legal")}
        </p>
      </motion.div>
    </section>
  );
}

function AlreadyPlayedView({ data }: { data: CheckResult }) {
  const { t } = useLang();
  const handle = data.entry?.handle ?? "";
  const score = data.entry?.score ?? 0;
  const rank = data.rank ?? null;
  return (
    <section className="px-6 pt-8 pb-24 min-h-[100dvh] flex flex-col">
      <header className="flex items-center justify-between">
        <Link
          href="/"
          className="text-[10px] tracking-[0.4em] uppercase text-ink/60 hover:text-ink transition-colors"
        >
          {t("arrow_back")} {t("home")}
        </Link>
        <Logo />
        <span className="w-10" />
      </header>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex flex-col items-center justify-center text-center"
      >
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white text-black text-[10px] tracking-[0.3em] uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-black/70" />
          {t("signature_challenge")}
        </span>

        <h1 className="font-display text-[42px] leading-[1.06] mt-7">
          {t("already_played_title")}
        </h1>

        <p className="text-ink/65 mt-4 text-[15px] max-w-xs">
          {t("already_played_sub", { handle })}
        </p>

        <div className="mt-9 tile rounded-3xl px-7 py-6">
          <p className="text-[10px] tracking-[0.4em] uppercase text-ink/55">
            {t("already_played_score")}
          </p>
          <p className="font-display text-[44px] tabular-nums leading-none mt-2">
            {score.toLocaleString()}
          </p>
          {rank !== null && (
            <p className="mt-3 text-[10px] tracking-[0.4em] uppercase text-ink/55">
              {t("rank")} #{rank}
              {data.total ? ` / ${data.total}` : ""}
            </p>
          )}
        </div>

        <Link
          href="/leaderboard"
          className="btn-primary mt-9 px-10 py-4 text-[12px]"
        >
          {t("view_my_score")} {t("arrow_fwd")}
        </Link>
      </motion.div>
    </section>
  );
}
