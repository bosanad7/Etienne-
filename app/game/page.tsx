"use client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Timer from "@/components/Timer";
import ProgressBar from "@/components/ProgressBar";
import { useLang } from "@/components/LangProvider";
import { loadPlay, loadProfile, savePlay, saveResult } from "@/lib/storage";
import {
  ACTIVE_CHALLENGE,
  CORRECT_POINTS,
  QUESTION_TIMER,
  SPEED_BONUS_MAX,
} from "@/lib/challenges";
import { summarizePlay } from "@/lib/matchScent";
import { displayLabel } from "@/lib/identity";
import { localizedQuestion } from "@/lib/questionLocale";
import type { PlayState, ScoreEntry, Trait } from "@/lib/types";

export default function GamePage() {
  const router = useRouter();
  const { t, lang } = useLang();
  const [state, setState] = useState<PlayState | null>(null);
  const [chosen, setChosen] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [questionStart, setQuestionStart] = useState<number>(Date.now());
  const [chaseTarget, setChaseTarget] = useState<{
    label: string;
    score: number;
  } | null>(null);

  useEffect(() => {
    const s = loadPlay();
    if (!s) {
      router.replace("/play");
      return;
    }
    setState(s);
    setQuestionStart(Date.now());
  }, [router]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/leaderboard", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const all = (data.entries ?? []) as ScoreEntry[];
        const leader = all.find((e) => e.challenge === ACTIVE_CHALLENGE.id);
        if (!leader) return;
        const me = loadProfile();
        const meKey = me
          ? (me.handle ? `@${me.handle.replace(/^@/, "")}` : me.name).toLowerCase()
          : null;
        if (meKey && displayLabel(leader).toLowerCase() === meKey) return;
        setChaseTarget({ label: displayLabel(leader), score: leader.score });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const current = state?.questions[state.index];
  const total = state?.questions.length ?? 0;

  const localized = useMemo(
    () => (current ? localizedQuestion(current, lang) : null),
    [current, lang]
  );

  if (!state || !current || !localized) {
    return (
      <div className="min-h-[100dvh] grid place-items-center text-ink/60 text-sm">
        {t("loading")}
      </div>
    );
  }

  function handlePick(i: number) {
    if (revealed || !state || !current) return;
    const correct = i === current.answer;
    const tookMs = Date.now() - questionStart;
    const elapsedSec = tookMs / 1000;
    const remaining = Math.max(0, QUESTION_TIMER - elapsedSec);
    const bonus = correct
      ? Math.round((remaining / QUESTION_TIMER) * SPEED_BONUS_MAX)
      : 0;
    const base = correct ? CORRECT_POINTS : 0;
    const gained = base + bonus;

    setChosen(i);
    setRevealed(true);

    const traits = { ...state.traitScores };
    if (correct && current.trait) {
      traits[current.trait as Trait] = (traits[current.trait as Trait] ?? 0) + 1;
    }

    const updated: PlayState = {
      ...state,
      score: state.score + gained,
      correct: state.correct + (correct ? 1 : 0),
      traitScores: traits,
      answers: [
        ...state.answers,
        { questionId: current.id, chosen: i, correct, tookMs },
      ],
    };
    setState(updated);
    savePlay(updated);

    window.setTimeout(() => advance(updated), 900);
  }

  function handleExpire() {
    if (revealed || !state || !current) return;
    const tookMs = Date.now() - questionStart;
    setChosen(null);
    setRevealed(true);
    const updated: PlayState = {
      ...state,
      answers: [
        ...state.answers,
        { questionId: current.id, chosen: -1, correct: false, tookMs },
      ],
    };
    setState(updated);
    savePlay(updated);
    window.setTimeout(() => advance(updated), 1100);
  }

  function advance(s: PlayState) {
    const next = s.index + 1;
    if (next >= s.questions.length) {
      const summary = summarizePlay(s);
      saveResult({
        score: s.score,
        accuracy: summary.accuracy,
        level: summary.level,
        perfume: summary.perfume,
        challenge: s.challenge,
        traits: s.traitScores,
        answers: s.answers,
        finishedAt: Date.now(),
      });
      router.push("/results");
      return;
    }
    const newState: PlayState = { ...s, index: next };
    setState(newState);
    savePlay(newState);
    setChosen(null);
    setRevealed(false);
    setQuestionStart(Date.now());
  }

  const correctOptionText = localized.options[current.answer];

  return (
    <section className="min-h-[100dvh] flex flex-col px-5 pt-6 pb-8">
      <header className="flex items-center justify-between">
        <button
          onClick={() => {
            if (confirm(t("confirm_quit"))) {
              router.replace("/");
            }
          }}
          className="text-[10px] tracking-[0.4em] uppercase text-ink/55"
        >
          {t("quit")}
        </button>
        <div className="text-center min-w-0 px-2">
          <p className="text-[10px] tracking-[0.4em] uppercase text-ink/55">
            {t("score")}
          </p>
          <p className="font-display text-2xl leading-none tabular-nums">
            {state.score}
          </p>
          {chaseTarget && (
            <p
              className="mt-1.5 text-[9px] tracking-[0.2em] uppercase text-ink/45 truncate max-w-[160px] mx-auto"
              title={`${t("top_chase_prefix")} · ${chaseTarget.label} · ${chaseTarget.score.toLocaleString()}`}
            >
              <span>{t("top_chase_prefix")}</span> ·{" "}
              <span dir="ltr">{chaseTarget.label}</span> ·{" "}
              <span className="tabular-nums text-ink/65" dir="ltr">
                {chaseTarget.score.toLocaleString()}
              </span>
            </p>
          )}
        </div>
        <Timer
          total={QUESTION_TIMER}
          onExpire={handleExpire}
          resetKey={`${state.index}-${revealed}`}
          paused={revealed}
        />
      </header>

      <div className="mt-7">
        <ProgressBar current={state.index + 1} total={total} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mt-10"
        >
          <p className="text-[10px] tracking-[0.5em] uppercase text-ink/50">
            {t("question")} {state.index + 1} / {total}
          </p>
          <h2 className="font-display text-[28px] leading-tight mt-3 text-ink">
            {localized.prompt}
          </h2>

          <div className="mt-6 space-y-3">
            {localized.options.map((opt, i) => {
              const isPicked = chosen === i;
              const isCorrect = revealed && i === current.answer;
              const isWrong = revealed && isPicked && i !== current.answer;
              return (
                <motion.button
                  key={i}
                  whileTap={{ scale: revealed ? 1 : 0.98 }}
                  disabled={revealed}
                  onClick={() => handlePick(i)}
                  className={`answer ${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}`}
                >
                  <span className="marker">{"ABCD"[i]}</span>
                  <span className="text-[15px] text-ink leading-snug">{opt}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6 text-center"
          >
            {chosen === null ? (
              <p className="font-display italic text-warm text-lg">
                {t("times_up")}
              </p>
            ) : chosen === current.answer ? (
              <p className="font-display italic text-ink text-lg">
                {t("confident")}
              </p>
            ) : (
              <p className="font-display italic text-ink/60 text-lg">
                {t("not_this_time_pre")}{" "}
                <span className="text-ink not-italic font-medium">
                  {correctOptionText}
                </span>
                .
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
