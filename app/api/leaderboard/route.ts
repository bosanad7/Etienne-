import { NextRequest, NextResponse } from "next/server";
import { getLeaderboard, hasPlayed, playerKey } from "@/lib/serverStore";
import { parseIdentity } from "@/lib/identity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const NO_CACHE = {
  "Cache-Control": "no-store, max-age=0, must-revalidate",
  "CDN-Cache-Control": "no-store",
  "Vercel-CDN-Cache-Control": "no-store",
};

export async function GET(req: NextRequest) {
  // ?check=<handle> — gate probe used by the /play start screen to find
  // out whether this Instagram handle has already played a round. Returns
  // { played: bool, entry?: ScoreEntry, rank?: number } so the UI can
  // either let them start or show the "you already played" view.
  const checkRaw = req.nextUrl.searchParams.get("check");
  if (checkRaw !== null) {
    const id = parseIdentity(checkRaw);
    if (id.errorCode) {
      return NextResponse.json(
        { played: false, error: id.errorCode },
        { status: 400, headers: NO_CACHE }
      );
    }
    const key = playerKey({ handle: id.handle });
    const existing = await hasPlayed(key);
    if (!existing) {
      return NextResponse.json({ played: false }, { headers: NO_CACHE });
    }
    // Compute rank — cheap because the board is capped at 200 rows.
    const all = await getLeaderboard();
    const idx = all.findIndex((e) => playerKey(e) === key);
    const rank = idx >= 0 ? idx + 1 : null;
    return NextResponse.json(
      { played: true, entry: existing, rank, total: all.length },
      { headers: NO_CACHE }
    );
  }

  const entries = await getLeaderboard();
  return NextResponse.json({ entries }, { headers: NO_CACHE });
}
