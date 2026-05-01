import { promises as fs } from "fs";
import path from "path";
import os from "os";
import { kv } from "@vercel/kv";
import baseQuestions from "@/data/questions.json";
import type { Question, ScoreEntry } from "./types";

/**
 * Storage layer.
 *
 * In production (Vercel) we use Upstash Redis via @vercel/kv:
 *
 *   Questions
 *     etienne:questions:v1   single JSON blob — kv.set/get
 *
 *   Leaderboard (v2 schema, deduped — one row per player)
 *     etienne:leaderboard:v2 sorted set — member = canonical playerKey, score = best
 *     etienne:players:v2     hash       — key    = canonical playerKey, value = full entry
 *
 *   Legacy (read-only, for migration)
 *     etienne:leaderboard:v1 sorted set — member = JSON.stringify(entry)  (could duplicate)
 *
 * In local dev (no KV env vars), we fall back to JSON files in /data with a
 * /tmp shadow when the project dir is read-only.
 */

const HAS_KV = Boolean(
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
);

const Q_KEY = "etienne:questions:v1";
const LB_KEY = "etienne:leaderboard:v2";
const PLAYERS_KEY = "etienne:players:v2";
const LB_KEY_LEGACY = "etienne:leaderboard:v1";

const dataDir = path.join(process.cwd(), "data");
const questionsPath = path.join(dataDir, "questions.json");
const leaderboardPath = path.join(dataDir, "leaderboard.json");
const tmpQuestionsPath = path.join(os.tmpdir(), "etienne-questions.json");
const tmpLeaderboardPath = path.join(os.tmpdir(), "etienne-leaderboard.json");

const MAX_ENTRIES = 200;

// =============================================================================
// Player identity
// =============================================================================

/**
 * Canonical id for a player. Collapses "Nat", "nat", "@Nat", " @nat ", "@NAT"
 * all to "nat" so that repeat plays update the same row instead of stacking
 * duplicates. If both name and handle are present, handle takes precedence.
 */
export function playerKey(entry: { name?: string; handle?: string }): string {
  const fromHandle = (entry.handle ?? "")
    .replace(/^@+/, "")
    .trim()
    .toLowerCase();
  if (fromHandle) return fromHandle;
  return (entry.name ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

// =============================================================================
// Questions
// =============================================================================

export async function getQuestions(): Promise<Question[]> {
  if (HAS_KV) {
    const stored = await kv.get<Question[]>(Q_KEY);
    if (stored && Array.isArray(stored) && stored.length) return stored;
    const seed = baseQuestions as Question[];
    await kv.set(Q_KEY, seed);
    return seed;
  }
  return readJsonPreferShadow<Question[]>(questionsPath, tmpQuestionsPath, []);
}

export async function setQuestions(qs: Question[]): Promise<void> {
  if (HAS_KV) {
    await kv.set(Q_KEY, qs);
    return;
  }
  await writeJsonResilient(questionsPath, tmpQuestionsPath, qs);
}

// =============================================================================
// Leaderboard — upsert-if-higher, deduped per canonical player key
// =============================================================================

export async function getLeaderboard(): Promise<ScoreEntry[]> {
  if (HAS_KV) {
    const ids = (await kv.zrange(LB_KEY, 0, MAX_ENTRIES - 1, {
      rev: true,
    })) as string[];
    if (!ids || ids.length === 0) return [];
    const map = (await kv.hmget(PLAYERS_KEY, ...ids)) as Record<
      string,
      unknown
    > | null;
    if (!map) return [];
    const ordered: ScoreEntry[] = [];
    for (const id of ids) {
      const v = map[id];
      const decoded = decodeMember(v);
      if (decoded) ordered.push(decoded);
    }
    return ordered;
  }
  return readJsonPreferShadow<ScoreEntry[]>(
    leaderboardPath,
    tmpLeaderboardPath,
    []
  );
}

/** Result shape for `appendScore`. `alreadyPlayed === true` means the
 * caller's request was rejected because this player already has a row on
 * the board; the returned `entry` is the existing one, not the rejected
 * incoming one. */
export interface AppendScoreResult {
  entry: ScoreEntry;
  alreadyPlayed: boolean;
}

/**
 * Has this player key already played? Used by /api/leaderboard?check=…
 * to gate the start screen before the user finishes a round.
 */
export async function hasPlayed(key: string): Promise<ScoreEntry | null> {
  if (!key) return null;
  if (HAS_KV) {
    const cur = await kv.hget<ScoreEntry>(PLAYERS_KEY, key);
    return cur ?? null;
  }
  const list = await readJsonPreferShadow<ScoreEntry[]>(
    leaderboardPath,
    tmpLeaderboardPath,
    []
  );
  return list.find((e) => playerKey(e) === key) ?? null;
}

/**
 * Save a score for a player. POLICY: one play per Instagram handle.
 * If a row already exists for this player key, the incoming submission is
 * REJECTED (alreadyPlayed = true) and the existing row is returned. The
 * board is append-only from a player's perspective — first signature
 * sticks.
 *
 * The board is capped at MAX_ENTRIES — when full, the lowest scores are
 * trimmed and their player rows removed from the companion hash.
 */
export async function appendScore(entry: ScoreEntry): Promise<AppendScoreResult> {
  const key = playerKey(entry);
  if (!key) {
    // Defensive: missing handle. The API validator already rejects this.
    return { entry, alreadyPlayed: false };
  }

  if (HAS_KV) {
    const existing = await kv.hget<ScoreEntry>(PLAYERS_KEY, key);
    if (existing) {
      return { entry: existing, alreadyPlayed: true };
    }

    await kv.zadd(LB_KEY, { score: entry.score, member: key });
    await kv.hset(PLAYERS_KEY, { [key]: entry });

    const total = await kv.zcard(LB_KEY);
    if (total > MAX_ENTRIES) {
      const cutoff = total - MAX_ENTRIES;
      const drop = (await kv.zrange(LB_KEY, 0, cutoff - 1)) as string[];
      if (Array.isArray(drop) && drop.length) {
        await kv.zremrangebyrank(LB_KEY, 0, cutoff - 1);
        await kv.hdel(PLAYERS_KEY, ...drop);
      }
    }
    return { entry, alreadyPlayed: false };
  }

  // FS fallback (local dev) — one play per key, first wins.
  const list = await readJsonPreferShadow<ScoreEntry[]>(
    leaderboardPath,
    tmpLeaderboardPath,
    []
  );
  const idx = list.findIndex((e) => playerKey(e) === key);
  if (idx >= 0) {
    return { entry: list[idx], alreadyPlayed: true };
  }
  list.push(entry);
  list.sort((a, b) => b.score - a.score);
  await writeJsonResilient(
    leaderboardPath,
    tmpLeaderboardPath,
    list.slice(0, MAX_ENTRIES)
  );
  return { entry, alreadyPlayed: false };
}

/**
 * One-shot migration: read the legacy v1 sorted set, dedupe by canonical
 * playerKey keeping each player's highest score, write the result into the
 * v2 schema. Idempotent — safe to run multiple times.
 *
 * Returns counts so an admin can verify the migration.
 */
export async function migrateLeaderboard(): Promise<{
  scanned: number;
  uniquePlayers: number;
  v1Cleared: boolean;
}> {
  if (!HAS_KV) {
    return { scanned: 0, uniquePlayers: 0, v1Cleared: false };
  }

  const raw = (await kv.zrange(LB_KEY_LEGACY, 0, -1)) as unknown[];
  const entries: ScoreEntry[] = (raw ?? [])
    .map(decodeMember)
    .filter((x): x is ScoreEntry => x !== null);

  const best = new Map<string, ScoreEntry>();
  for (const e of entries) {
    const key = playerKey(e);
    if (!key) continue;
    const cur = best.get(key);
    if (!cur || e.score > cur.score) best.set(key, e);
  }

  if (best.size > 0) {
    // Replace v2 contents wholesale to ensure idempotency. (Don't merge with
    // any garbage that might already be in v2 — the v1 data is the truth.)
    const existingV2Ids = (await kv.zrange(LB_KEY, 0, -1)) as string[];
    if (Array.isArray(existingV2Ids) && existingV2Ids.length) {
      await kv.zremrangebyrank(LB_KEY, 0, -1);
      await kv.hdel(PLAYERS_KEY, ...existingV2Ids);
    }

    const zaddArgs = Array.from(best.entries()).map(([key, e]) => ({
      score: e.score,
      member: key,
    }));
    if (zaddArgs.length === 1) {
      await kv.zadd(LB_KEY, zaddArgs[0]);
    } else {
      await kv.zadd(LB_KEY, zaddArgs[0], ...zaddArgs.slice(1));
    }

    const hsetObj: Record<string, ScoreEntry> = {};
    for (const [key, e] of best) hsetObj[key] = e;
    await kv.hset(PLAYERS_KEY, hsetObj);
  }

  // Optionally drop the legacy set so it can't drift. Keep this intentional
  // — if anything went wrong the v1 data is still reconstructable from logs,
  // so we delete it to keep the system clean.
  let v1Cleared = false;
  if (entries.length > 0) {
    await kv.del(LB_KEY_LEGACY);
    v1Cleared = true;
  }

  return {
    scanned: entries.length,
    uniquePlayers: best.size,
    v1Cleared,
  };
}

// =============================================================================
// Helpers
// =============================================================================

function decodeMember(raw: unknown): ScoreEntry | null {
  if (raw && typeof raw === "object") return raw as ScoreEntry;
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as ScoreEntry;
    } catch {
      return null;
    }
  }
  return null;
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const r = await fs.readFile(file, "utf8");
    return JSON.parse(r) as T;
  } catch {
    return fallback;
  }
}

async function readJsonPreferShadow<T>(
  primary: string,
  shadow: string,
  fallback: T
): Promise<T> {
  try {
    const r = await fs.readFile(shadow, "utf8");
    return JSON.parse(r) as T;
  } catch {
    return readJson<T>(primary, fallback);
  }
}

async function writeJsonResilient(
  primary: string,
  shadow: string,
  data: unknown
): Promise<void> {
  const payload = JSON.stringify(data, null, 2);
  try {
    await fs.mkdir(path.dirname(primary), { recursive: true });
    await fs.writeFile(primary, payload, "utf8");
    return;
  } catch (err: unknown) {
    const code = (err as NodeJS.ErrnoException)?.code;
    if (code !== "EROFS" && code !== "EACCES" && code !== "EPERM") throw err;
    await fs.writeFile(shadow, payload, "utf8");
  }
}
