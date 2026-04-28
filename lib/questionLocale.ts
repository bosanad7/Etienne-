import type { Lang } from "./i18n";
import type { Question } from "./types";

/**
 * Pick the right prompt + options for the active language.
 * Falls back to English per-question if the Arabic translation is missing or
 * incomplete (option count mismatch). Never returns mixed-language options.
 */
export function localizedQuestion(
  q: Question,
  lang: Lang
): { prompt: string; options: string[] } {
  if (
    lang === "ar" &&
    q.prompt_ar &&
    Array.isArray(q.options_ar) &&
    q.options_ar.length === q.options.length &&
    q.options_ar.every((s) => typeof s === "string" && s.trim() !== "")
  ) {
    return { prompt: q.prompt_ar, options: q.options_ar };
  }
  return { prompt: q.prompt, options: q.options };
}
