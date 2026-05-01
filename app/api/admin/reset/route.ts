import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * One-shot leaderboard wipe — clears every score row and every player
 * registration so the board starts empty for the public launch.
 *
 * Auth: matches the existing /api/admin/dedupe scheme — pass the admin
 * token as the `admin` query param. The default token (etienne-admin)
 * is overridden by the ADMIN_TOKEN env var in production.
 *
 * Touched keys:
 *   etienne:leaderboard:v2  — sorted set (rank by score)
 *   etienne:players:v2      — hash (full row per player)
 *   etienne:leaderboard:v1  — legacy sorted set, if present
 *
 * GET returns the current size for sanity-check; POST does the wipe.
 * Idempotent — running it twice on an empty board is a no-op.
 */

const LB_KEY = "etienne:leaderboard:v2";
const PLAYERS_KEY = "etienne:players:v2";
const LB_KEY_LEGACY = "etienne:leaderboard:v1";

const NO_CACHE = {
  "Cache-Control": "no-store, max-age=0, must-revalidate",
  "CDN-Cache-Control": "no-store",
  "Vercel-CDN-Cache-Control": "no-store",
};

function authed(token: string | null): boolean {
  const required = process.env.ADMIN_TOKEN || "etienne-admin";
  return Boolean(token && token === required);
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("admin");
  if (!authed(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const v2 = await kv.zcard(LB_KEY);
  const v1 = await kv.zcard(LB_KEY_LEGACY);
  return NextResponse.json(
    { v2_count: v2 ?? 0, v1_count: v1 ?? 0 },
    { headers: NO_CACHE }
  );
}

export async function POST(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("admin");
  if (!authed(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const v2_before = (await kv.zcard(LB_KEY)) ?? 0;
  const v1_before = (await kv.zcard(LB_KEY_LEGACY)) ?? 0;

  // Drop the v2 sorted set and the companion hash. We do not iterate-and-
  // delete each player row because kv.del removes the whole hash atomically.
  await kv.del(LB_KEY);
  await kv.del(PLAYERS_KEY);
  await kv.del(LB_KEY_LEGACY);

  return NextResponse.json(
    {
      ok: true,
      cleared: {
        v2_rows: v2_before,
        v1_rows: v1_before,
      },
    },
    { headers: NO_CACHE }
  );
}
