import { NextRequest, NextResponse } from "next/server";
import { appendScore } from "@/lib/serverStore";
import { parseIdentity } from "@/lib/identity";
import type { ChallengeId, ScoreEntry } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clean(v: unknown, max = 64): string {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, max);
}

const NO_CACHE = {
  "Cache-Control": "no-store, max-age=0, must-revalidate",
  "CDN-Cache-Control": "no-store",
  "Vercel-CDN-Cache-Control": "no-store",
};

export async function POST(req: NextRequest) {
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {}

  // Identity is the IG handle (or pre-`@` form). We re-validate server-side
  // so a tampered client can't sneak in malformed handles.
  const handleRaw = clean(body.handle, 64) || clean(body.name, 64);
  const id = parseIdentity(handleRaw);
  if (id.errorCode) {
    return NextResponse.json(
      { error: "Invalid handle", code: id.errorCode },
      { status: 400, headers: NO_CACHE }
    );
  }

  const challenge = clean(body.challenge, 16) as ChallengeId;
  const perfume = clean(body.perfume, 32);
  const score = Math.max(0, Math.min(99999, Math.floor(Number(body.score) || 0)));

  if (!["signature", "quick", "classic", "master"].includes(challenge)) {
    return NextResponse.json(
      { error: "Invalid challenge" },
      { status: 400, headers: NO_CACHE }
    );
  }

  const entry: ScoreEntry = {
    id: crypto.randomUUID(),
    name: id.canonical,
    handle: id.handle,
    score,
    challenge,
    perfume,
    createdAt: Date.now(),
  };

  const result = await appendScore(entry);
  if (result.alreadyPlayed) {
    // 409 — caller should treat the existing entry as authoritative and
    // not retry. The current /results page falls through to a graceful
    // "you already played" view.
    return NextResponse.json(
      { ok: false, alreadyPlayed: true, entry: result.entry },
      { status: 409, headers: NO_CACHE }
    );
  }
  return NextResponse.json(
    { ok: true, entry: result.entry },
    { headers: NO_CACHE }
  );
}
