"use client";
import type { ChallengeId, PlayState } from "./types";

const KEY = "etienne.play";
const RESULT_KEY = "etienne.result";
const PROFILE_KEY = "etienne.profile";
const BEST_KEY = "etienne.bests"; // best score per challenge

export function savePlay(state: PlayState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function loadPlay(): PlayState | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PlayState;
  } catch {
    return null;
  }
}

export function clearPlay() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}

export function saveResult(result: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(RESULT_KEY, JSON.stringify(result));
}

export function loadResult<T = unknown>(): T | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(RESULT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function saveProfile(p: { name: string; handle?: string }) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
}

export function loadProfile(): { name: string; handle?: string } | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(PROFILE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

type BestMap = Partial<Record<ChallengeId, number>>;

export function loadBest(challenge: ChallengeId): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(BEST_KEY);
    const map: BestMap = raw ? JSON.parse(raw) : {};
    return map[challenge] ?? null;
  } catch {
    return null;
  }
}

/** Record a finished score, return the previous best (null on first attempt). */
export function recordScore(
  challenge: ChallengeId,
  score: number
): number | null {
  if (typeof window === "undefined") return null;
  let map: BestMap = {};
  try {
    const raw = localStorage.getItem(BEST_KEY);
    if (raw) map = JSON.parse(raw);
  } catch {}
  const prev = map[challenge] ?? null;
  if (prev === null || score > prev) {
    map[challenge] = score;
    localStorage.setItem(BEST_KEY, JSON.stringify(map));
  }
  return prev;
}
