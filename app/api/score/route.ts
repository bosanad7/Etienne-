import { NextRequest, NextResponse } from "next/server";
import { appendScore } from "@/lib/serverStore";
import type { ChallengeId, ScoreEntry } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clean(v: unknown, max = 64): string {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, max);
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {}
  const name = clean(body.name, 32);
  const handle = clean(body.handle, 32);
  const challenge = clean(body.challenge, 16) as ChallengeId;
  const perfume = clean(body.perfume, 32);
  const score = Math.max(0, Math.min(99999, Math.floor(Number(body.score) || 0)));

  if (
    !name ||
    !["signature", "quick", "classic", "master"].includes(challenge)
  ) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const entry: ScoreEntry = {
    id: crypto.randomUUID(),
    name,
    handle: handle || undefined,
    score,
    challenge,
    perfume,
    createdAt: Date.now(),
  };
  await appendScore(entry);
  return NextResponse.json({ ok: true, entry });
}
