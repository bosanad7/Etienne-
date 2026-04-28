/**
 * Single-input identity: "Your name or @handle".
 * If the trimmed value starts with '@' we treat it as an Instagram handle;
 * otherwise it's a display name. Returns a normalized {name, handle, error}
 * triple so UI and storage stay consistent.
 */

export type IdentityError =
  | "required"
  | "too_long"
  | "no_handle"
  | "invalid_chars";

export interface Identity {
  name: string;
  handle?: string;
  error?: string;
  errorCode?: IdentityError;
}

const MAX = 20;
const HANDLE_RE = /^[A-Za-z0-9._]+$/;

export function parseIdentity(raw: string): Identity {
  const trimmed = raw.trim();
  if (!trimmed)
    return {
      name: "",
      error: "Add a name or @handle to compete.",
      errorCode: "required",
    };
  if (trimmed.length > MAX + 1)
    return {
      name: "",
      error: `Keep it under ${MAX} characters.`,
      errorCode: "too_long",
    };

  if (trimmed.startsWith("@")) {
    const slug = trimmed.slice(1);
    if (!slug)
      return {
        name: "",
        error: "Add the handle after the @.",
        errorCode: "no_handle",
      };
    if (slug.length > MAX)
      return {
        name: "",
        error: `Keep it under ${MAX} characters.`,
        errorCode: "too_long",
      };
    if (!HANDLE_RE.test(slug))
      return {
        name: "",
        error: "Letters, numbers, dots and underscores only.",
        errorCode: "invalid_chars",
      };
    return { name: slug, handle: `@${slug}` };
  }

  if (trimmed.length > MAX) {
    return {
      name: "",
      error: `Keep it under ${MAX} characters.`,
      errorCode: "too_long",
    };
  }
  return { name: trimmed };
}

/** What we display on the leaderboard for an entry. */
export function displayLabel(entry: { name?: string; handle?: string }): string {
  if (entry.handle) {
    return entry.handle.startsWith("@") ? entry.handle : `@${entry.handle}`;
  }
  return entry.name ?? "—";
}
