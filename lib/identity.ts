/**
 * Strict Instagram-handle identity.
 *
 * Players sign in with their IG @username. One handle = one player on the
 * leaderboard. Free-text names are no longer accepted.
 *
 * Validation mirrors Instagram's own rules:
 *   - 1..30 characters after the optional leading '@'
 *   - letters, digits, periods, underscores only
 *   - cannot start or end with a period
 *   - cannot contain consecutive periods
 *
 * The optional leading '@' is tolerated and stripped silently. A canonical
 * lowercase form is used as the dedup key; the display form keeps the
 * '@' prefix.
 */

export type IdentityError =
  | "required"
  | "too_long"
  | "no_handle"
  | "invalid_chars";

export interface Identity {
  /** Canonical key — lowercased, no '@'. Empty when invalid. */
  canonical: string;
  /** Display form — '@username', original casing preserved. Empty when invalid. */
  handle: string;
  /** Compatibility — same as `canonical`. Older code reads `name`. */
  name: string;
  error?: string;
  errorCode?: IdentityError;
}

const MAX = 30; // Instagram's own ceiling
const HANDLE_RE = /^[A-Za-z0-9._]+$/;

export function parseIdentity(raw: string): Identity {
  const trimmed = raw.trim().replace(/^@+/, "");

  if (!trimmed) {
    return {
      canonical: "",
      handle: "",
      name: "",
      error: "Add your Instagram handle.",
      errorCode: "required",
    };
  }
  if (trimmed.length > MAX) {
    return {
      canonical: "",
      handle: "",
      name: "",
      error: `Keep it under ${MAX} characters.`,
      errorCode: "too_long",
    };
  }
  if (!HANDLE_RE.test(trimmed)) {
    return {
      canonical: "",
      handle: "",
      name: "",
      error: "Letters, numbers, dots and underscores only.",
      errorCode: "invalid_chars",
    };
  }
  if (trimmed.startsWith(".") || trimmed.endsWith(".") || trimmed.includes("..")) {
    return {
      canonical: "",
      handle: "",
      name: "",
      error: "Dots can't start, end, or repeat.",
      errorCode: "invalid_chars",
    };
  }

  const canonical = trimmed.toLowerCase();
  return {
    canonical,
    handle: `@${trimmed}`,
    name: canonical,
  };
}

/** What we display on the leaderboard for an entry. Always '@handle'. */
export function displayLabel(entry: { name?: string; handle?: string }): string {
  if (entry.handle) {
    return entry.handle.startsWith("@") ? entry.handle : `@${entry.handle}`;
  }
  // Legacy fallback for old rows that had only `name`.
  return entry.name ? `@${entry.name.replace(/^@+/, "")}` : "—";
}
