import type { ChallengeId, Question, Stage } from "./types";
import questionsData from "@/data/questions.json";

const ALL: Question[] = questionsData as Question[];

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickN(stage: Stage, n: number): Question[] {
  const pool = ALL.filter((q) => q.stage === stage);
  return shuffle(pool).slice(0, n);
}

/**
 * 10-question Signature Challenge round.
 * Mixed difficulty — 4 easy, 4 mid, 2 hard — so the run feels varied without
 * front-loading hard questions. Order is also shuffled so consecutive plays
 * never feel identical.
 */
export function buildRound(_challenge: ChallengeId): Question[] {
  const easy = pickN(1, 4);
  const mid = pickN(2, 4);
  const hard = pickN(3, 2);
  return shuffle([...easy, ...mid, ...hard]);
}

export function getAllQuestions(): Question[] {
  return ALL.slice();
}
