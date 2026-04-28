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
import type { PlayState } from "@/lib/types";
import type { StringKey } from "@/lib/i18n";

const ERR_KEY: Record<IdentityError, StringKey> = {
  required: "err_required",
  too_long: "err_too_long",
  no_handle: "err_no_handle",
  invalid_chars: "err_invalid_chars",
};

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
    if (p.handle) setRaw(p.handle.startsWith("@") ? p.handle : `@${p.handle}`);
    else setRaw(p.name ?? "");
  }, []);

  function start(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);

    const parsed = parseIdentity(raw);
    if (parsed.errorCode || !parsed.name) {
      setErrorKey(parsed.errorCode ? ERR_KEY[parsed.errorCode] : "err_required");
      return;
    }

    saveProfile({ name: parsed.name, handle: parsed.handle });

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
    setRaw(v);
    if (touched) {
      const parsed = parseIdentity(v);
      setErrorKey(parsed.errorCode ? ERR_KEY[parsed.errorCode] : "");
    }
  }

  const isHandle = raw.trim().startsWith("@");
  const live = parseIdentity(raw);
  const canBegin = !live.errorCode && !!live.name;

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
            {isHandle ? t("label_handle") : t("label_name")}
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
            <input
              id="ident"
              autoFocus
              inputMode="text"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="words"
              spellCheck={false}
              maxLength={22}
              value={raw}
              onChange={(e) => onChange(e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder={t("placeholder_input")}
              dir="auto"
              className="w-full bg-transparent px-5 py-4 text-[18px] outline-none placeholder:text-ink/35"
            />
            {raw && (
              <span className="absolute end-4 top-1/2 -translate-y-1/2 text-[10px] tracking-[0.3em] uppercase text-ink/45">
                {isHandle ? t("suffix_handle") : t("suffix_name")}
              </span>
            )}
          </div>
          <div className="min-h-[20px] mt-2 text-[12px] text-cocoa">
            {errorKey ? t(errorKey as StringKey) : ""}
          </div>

          <button
            type="submit"
            disabled={!canBegin}
            className="btn-primary w-full mt-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {t("btn_begin")} {t("arrow_fwd")}
          </button>
        </form>

        <p className="text-[11px] text-ink/45 text-center mt-8 leading-relaxed">
          {t("legal")}
        </p>
      </motion.div>
    </section>
  );
}
