export type Stage = 1 | 2 | 3;

export type Trait =
  | "fresh"
  | "warm"
  | "sensual"
  | "clean"
  | "soft"
  | "free"
  | "refined"
  | "curious";

export interface Question {
  id: string;
  stage: Stage;
  prompt: string;
  options: string[];
  answer: number; // index of correct option
  // weighting toward perfume traits when answered correctly OR chosen
  trait?: Trait;
  hint?: string;
  // Optional Arabic translations. Same option order as `options`, so
  // `answer` index remains valid. Falls back to English per-question if absent.
  prompt_ar?: string;
  options_ar?: string[];
}

/**
 * Live challenge id: `signature`. Legacy ids ("quick" | "classic" | "master")
 * are kept in the type so old leaderboard rows still deserialize cleanly.
 */
export type ChallengeId = "signature" | "quick" | "classic" | "master";

export interface Challenge {
  id: ChallengeId;
  name: string;
  questions: number;
  description: string;
  badge: string;
}

export interface Perfume {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  notes: { top: string[]; heart: string[]; base: string[] };
  mood: string[];
  traits: Partial<Record<Trait, number>>;
  shopUrl: string;
  accent: string; // tailwind gradient class
}

export interface ScoreEntry {
  id: string;
  name: string;
  handle?: string;
  score: number;
  challenge: ChallengeId;
  perfume: string;
  createdAt: number;
}

export interface PlayState {
  challenge: ChallengeId;
  questions: Question[];
  index: number;
  score: number;
  correct: number;
  traitScores: Record<Trait, number>;
  startedAt: number;
  answers: { questionId: string; chosen: number; correct: boolean; tookMs: number }[];
}
