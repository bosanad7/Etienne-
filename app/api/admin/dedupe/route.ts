import { NextRequest, NextResponse } from "next/server";
import { migrateLeaderboard, getLeaderboard } from "@/lib/serverStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authed(token: string | null): boolean {
  const required = process.env.ADMIN_TOKEN || "etienne-admin";
  return Boolean(token && token === required);
}

const NO_CACHE = {
  "Cache-Control": "no-store, max-age=0, must-revalidate",
  "CDN-Cache-Control": "no-store",
  "Vercel-CDN-Cache-Control": "no-store",
};

/** GET — current v2 leaderboard size (for sanity checking before/after). */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("admin");
  if (!authed(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const entries = await getLeaderboard();
  return NextResponse.json(
    { count: entries.length, entries },
    { headers: NO_CACHE }
  );
}

/** POST — run the v1 → v2 dedupe migration. Idempotent. */
export async function POST(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("admin");
  if (!authed(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const result = await migrateLeaderboard();
  return NextResponse.json({ ok: true, ...result }, { headers: NO_CACHE });
}
