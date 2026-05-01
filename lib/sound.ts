"use client";

/**
 * Premium-feel answer feedback tones, generated on the fly with Web Audio API.
 *
 * Why generated, not MP3:
 *   - Zero filesize cost, zero network round-trip
 *   - No DMCA / licensing surface
 *   - "Subtle, not arcade" is easier to achieve with a single sine + envelope
 *     than with most stock SFX
 *
 * Tones:
 *   correct  soft chime — sine 880Hz → 1320Hz over 200ms, exp decay
 *   wrong    soft thunk — sine 220Hz, 150ms, exp decay, lowpass at 800Hz
 *
 * Both peak around -14 dBFS so they don't startle on phone speakers.
 *
 * iOS Safari autoplay policy requires the AudioContext to be created/resumed
 * inside a user-gesture handler. We lazily create the context on the first
 * play() call (which itself happens during a tap), so it never tries to make
 * sound before the user has touched the screen.
 *
 * Mute preference is read on every play() so toggling takes effect instantly
 * across question advances and persists across reloads.
 */

const STORAGE_KEY = "etienne:sound";

export function isSoundOn(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    if (v === null) return true; // default ON
    return v === "on";
  } catch {
    return true;
  }
}

export function setSoundOn(on: boolean): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
  } catch {
    // storage unavailable (private mode etc.) — fail silent, sound still
    // works for the rest of this session
  }
}

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (ctx) {
    // resume in case it was suspended after losing focus
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Ctor: typeof AudioContext | undefined =
    window.AudioContext ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).webkitAudioContext;
  if (!Ctor) return null;
  try {
    ctx = new Ctor();
    return ctx;
  } catch {
    return null;
  }
}

/** Soft positive chime — tone glide with exponential amplitude decay. */
export function playCorrect(): void {
  if (!isSoundOn()) return;
  const ac = getCtx();
  if (!ac) return;

  const now = ac.currentTime;
  const dur = 0.22;

  const osc = ac.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(880, now);
  osc.frequency.exponentialRampToValueAtTime(1320, now + 0.16);

  const gain = ac.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.18, now + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

  osc.connect(gain).connect(ac.destination);
  osc.start(now);
  osc.stop(now + dur + 0.02);
}

/** Soft negative thunk — low sine with lowpass filter and quick decay. */
export function playWrong(): void {
  if (!isSoundOn()) return;
  const ac = getCtx();
  if (!ac) return;

  const now = ac.currentTime;
  const dur = 0.18;

  const osc = ac.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(220, now);
  osc.frequency.exponentialRampToValueAtTime(160, now + dur);

  const lp = ac.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 800;

  const gain = ac.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.16, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

  osc.connect(lp).connect(gain).connect(ac.destination);
  osc.start(now);
  osc.stop(now + dur + 0.02);
}

/**
 * Optional: prime the context on a known user gesture. Calling this from a
 * tap handler before the first answer will avoid the very first tone being
 * cut off on slow iOS devices. Safe to call many times — it's idempotent.
 */
export function primeSound(): void {
  const ac = getCtx();
  if (!ac) return;
  if (ac.state === "suspended") void ac.resume();
}
