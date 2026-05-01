import type { Challenge, Stage } from "./types";

/**
 * Single challenge mode for the Etienne IG campaign.
 * 10 questions, 20s each — competitive scoring.
 */
export const CHALLENGES: Challenge[] = [
  {
    id: "signature",
    name: "Signature Challenge",
    questions: 10,
    description: "Ten questions. Twenty seconds each. One signature.",
    badge: "10 Q",
  },
];

export const CHALLENGE_BY_ID = Object.fromEntries(
  CHALLENGES.map((c) => [c.id, c])
);

/** Active challenge — there is only one. */
export const ACTIVE_CHALLENGE = CHALLENGES[0];

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------
//
// Per question:    100 base + up to 50 time bonus  (max 150)
// Total possible:  1,500 points across 10 questions
// Wrong/expired:   0 points

/** Seconds allowed per question. Single source of truth for the countdown
 * UI and the speed-bonus formula. */
export const QUESTION_TIMER = 20;

/** Base points for a correct answer. */
export const CORRECT_POINTS = 100;

/** Maximum time bonus added on top of base for an instant correct answer. */
export const SPEED_BONUS_MAX = 50;

/**
 * Legacy stage-keyed maps remain so existing question data ({stage: 1|2|3})
 * still type-checks. Game logic no longer uses them.
 */
export const STAGE_TIMER: Record<Stage, number> = {
  1: QUESTION_TIMER,
  2: QUESTION_TIMER,
  3: QUESTION_TIMER,
};
export const STAGE_WEIGHT: Record<Stage, number> = {
  1: CORRECT_POINTS,
  2: CORRECT_POINTS,
  3: CORRECT_POINTS,
};
export const TIME_BONUS_MAX: Record<Stage, number> = {
  1: SPEED_BONUS_MAX,
  2: SPEED_BONUS_MAX,
  3: SPEED_BONUS_MAX,
};
