"use client";
import { useEffect, useState } from "react";
import { useLang } from "@/components/LangProvider";
import { isSoundOn, setSoundOn, primeSound } from "@/lib/sound";

/**
 * Small pill toggle that mirrors the LangToggle visual language.
 * Sits to the logical-LEFT of LangToggle in the top-right cluster on
 * the gameplay screen. Tap toggles mute and persists to localStorage.
 *
 * The first tap also primes the AudioContext (iOS autoplay policy
 * requires AC creation/resume to happen inside a user gesture).
 */
export default function SoundToggle() {
  const { t } = useLang();
  const [on, setOn] = useState(true);

  useEffect(() => {
    setOn(isSoundOn());
  }, []);

  function toggle() {
    const next = !on;
    setOn(next);
    setSoundOn(next);
    if (next) primeSound();
  }

  return (
    <div className="fixed top-4 z-[60] end-20 select-none">
      <button
        onClick={toggle}
        aria-pressed={on}
        aria-label={t("aria_sound_toggle")}
        title={on ? t("sound_on") : t("sound_off")}
        className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/15 bg-black/55 backdrop-blur-md text-ink/80 hover:text-ink transition-colors"
      >
        {on ? <SpeakerOn /> : <SpeakerOff />}
      </button>
    </div>
  );
}

function SpeakerOn() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 9.5h3l5-4v13l-5-4H5v-5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M16.5 8.5c1.2 1 1.8 2.2 1.8 3.5s-.6 2.5-1.8 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SpeakerOff() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 9.5h3l5-4v13l-5-4H5v-5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M17 9l4 4M21 9l-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
