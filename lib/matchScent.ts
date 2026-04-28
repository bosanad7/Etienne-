import { PERFUMES } from "./perfumes";
import type { ChallengeId, Perfume, PlayState, Trait } from "./types";

export const TRAIT_KEYS: Trait[] = [
  "fresh",
  "warm",
  "sensual",
  "clean",
  "soft",
  "free",
  "refined",
  "curious",
];

export function emptyTraitScores(): Record<Trait, number> {
  return TRAIT_KEYS.reduce((acc, k) => {
    acc[k] = 0;
    return acc;
  }, {} as Record<Trait, number>);
}

const TRAIT_LABELS: Record<Trait, string> = {
  fresh: "Fresh",
  warm: "Warm",
  sensual: "Sensual",
  clean: "Clean",
  soft: "Soft",
  free: "Free",
  refined: "Refined",
  curious: "Curious",
};

/** Top n traits by score — returns Trait keys for display. Falls back to a
 * sensible default when the player accumulated nothing. */
export function topTraitKeys(traits: Record<Trait, number>, n = 3): Trait[] {
  const sorted = (Object.entries(traits) as [Trait, number][])
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([k]) => k);
  if (sorted.length) return sorted;
  return ["curious", "soft", "free"];
}

/** English labels for top traits — kept for share card / OG image use. */
export function topTraitLabels(
  traits: Record<Trait, number>,
  n = 3
): string[] {
  return topTraitKeys(traits, n).map((k) => TRAIT_LABELS[k]);
}

/**
 * Match the player to a perfume by computing cosine-like similarity between
 * the player's accumulated trait scores and each perfume's trait weights.
 */
export function matchPerfume(
  traits: Record<Trait, number>,
  challenge: ChallengeId,
  accuracy: number // 0..1
): Perfume {
  const totalTrait = Object.values(traits).reduce((s, v) => s + v, 0);

  // If the player barely engaged (very low accuracy and few trait points),
  // the Discovery Kit is the warm, encouraging match.
  if (totalTrait <= 1 && accuracy < 0.4) {
    return PERFUMES.find((p) => p.slug === "discovery-kit")!;
  }

  let best: Perfume = PERFUMES[0];
  let bestScore = -Infinity;

  for (const p of PERFUMES) {
    if (p.slug === "discovery-kit") continue; // reserved for low-engagement
    let score = 0;
    let pMag = 0;
    for (const k of TRAIT_KEYS) {
      const t = traits[k] ?? 0;
      const w = p.traits[k] ?? 0;
      score += t * w;
      pMag += w * w;
    }
    // normalize by perfume's own weight magnitude so heavier-weighted profiles
    // don't always win
    const norm = score / Math.sqrt(pMag || 1);

    // accuracy nudge — confident players lean toward "Etienne" signature
    const signatureBoost =
      p.slug === "etienne" ? accuracy * 1.5 : challenge === "master" ? accuracy * 0.4 : 0;

    const finalScore = norm + signatureBoost;
    if (finalScore > bestScore) {
      bestScore = finalScore;
      best = p;
    }
  }
  return best;
}

export type LevelKey = "master" | "connoisseur" | "explorer" | "beginner";

export function performanceLevel(
  accuracy: number,
  _challenge: ChallengeId
): { key: LevelKey; title: string; blurb: string } {
  if (accuracy >= 0.9) {
    return {
      key: "master",
      title: "Master of Scent",
      blurb:
        "You read fragrance the way sommeliers read wine. Etienne sees you — clearly.",
    };
  }
  if (accuracy >= 0.7) {
    return {
      key: "connoisseur",
      title: "Connoisseur",
      blurb: "A trained nose and a confident hand. You know what you like.",
    };
  }
  if (accuracy >= 0.5) {
    return {
      key: "explorer",
      title: "Explorer",
      blurb:
        "You're learning the language of scent. Keep wandering — it suits you.",
    };
  }
  return {
    key: "beginner",
    title: "Curious Beginner",
    blurb:
      "Every great nose started here. The Discovery Kit will be your first teacher.",
  };
}

export function summarizePlay(play: PlayState) {
  const total = play.questions.length;
  const accuracy = total === 0 ? 0 : play.correct / total;
  const level = performanceLevel(accuracy, play.challenge);
  const perfume = matchPerfume(play.traitScores, play.challenge, accuracy);
  return { total, accuracy, level, perfume };
}
