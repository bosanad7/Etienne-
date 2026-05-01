import { ImageResponse } from "next/og";

export const runtime = "edge";

const SIZE = { width: 1080, height: 1920 } as const;
const FONT =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

/**
 * Minimal Arabic test — no font bundle. If this returns a real PNG, the
 * pipeline is fine and we can layer the bundled font back. If it 0-bytes
 * the same way, the issue is something else.
 */
export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#000000",
          color: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: FONT,
          fontSize: 100,
        }}
      >
        اختبار عربي
      </div>
    ),
    {
      ...SIZE,
      headers: { "Content-Disposition": 'inline; filename="ar.png"' },
    }
  );
}
