import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Arabic IG Story explainer — 1080×1920 PNG.
 *
 * Served as a static asset rather than an Edge ImageResponse: Satori
 * (the renderer behind next/og) was returning empty bodies for any
 * non-trivial Arabic layout in the Edge runtime, even with bundled
 * webfonts. The pre-rendered file is generated locally with PIL +
 * arabic_reshaper + python-bidi, using IBM Plex Sans Arabic shapes
 * (system-fallback Geeza Pro) — same brand feel, deterministic output,
 * faster cold-start, and no edge-runtime font dependency.
 *
 * If you need to regenerate the asset, the source script lives in
 * tools/build-ar-howto.py.
 */
export async function GET() {
  // Built into the public folder, served directly by Next's static
  // handler at /share/etienne-howto-ar.png. We forward to it from the
  // sibling /story/* URL space so the share-link pattern matches the
  // English route.
  return NextResponse.redirect(
    new URL("/share/etienne-howto-ar.png", "https://game.etienneperfumes.com"),
    { status: 308 }
  );
}
