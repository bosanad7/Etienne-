import { NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/serverStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const NO_CACHE = {
  "Cache-Control": "no-store, max-age=0, must-revalidate",
  "CDN-Cache-Control": "no-store",
  "Vercel-CDN-Cache-Control": "no-store",
};

export async function GET() {
  const entries = await getLeaderboard();
  return NextResponse.json({ entries }, { headers: NO_CACHE });
}
