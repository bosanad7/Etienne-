import { ImageResponse } from "next/og";

export const runtime = "edge";

const SIZE = { width: 1080, height: 1920 } as const;
const FONT =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

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
          position: "relative",
          fontFamily: FONT,
        }}
      >
        {/* grain */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)",
            backgroundSize: "14px 14px",
          }}
        />

        {/* ETIENNE wordmark */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 240,
            left: 0,
            right: 0,
            justifyContent: "center",
            fontSize: 30,
            letterSpacing: 16,
            fontWeight: 600,
            color: "#FFFFFF",
            zIndex: 1,
          }}
        >
          ETIENNE
        </div>

        {/* hairline */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 320,
            left: "50%",
            transform: "translateX(-50%)",
            width: 80,
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)",
            zIndex: 1,
          }}
        />

        {/* hero word — `signature.` */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 620,
            left: 0,
            right: 0,
            justifyContent: "center",
            fontSize: 220,
            fontStyle: "italic",
            fontWeight: 500,
            letterSpacing: "-0.04em",
            color: "#FFFFFF",
            zIndex: 1,
          }}
        >
          signature.
        </div>

        {/* `find yours.` caps */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 920,
            left: 0,
            right: 0,
            justifyContent: "center",
            fontSize: 24,
            letterSpacing: 16,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.55)",
            fontWeight: 500,
            zIndex: 1,
          }}
        >
          find yours.
        </div>

        {/* tiny phone mockup */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 1110,
            left: "50%",
            transform: "translateX(-50%)",
            width: 360,
            height: 540,
            background: "#0A0A0A",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: 44,
            padding: 12,
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              background: "#000000",
              borderRadius: 34,
              padding: 40,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 14,
                letterSpacing: 8,
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.45)",
                fontWeight: 500,
              }}
            >
              A Game by Etienne
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 36,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                marginTop: 24,
                textAlign: "center",
                lineHeight: 1.05,
              }}
            >
              Find your
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 36,
                fontWeight: 500,
                fontStyle: "italic",
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
              }}
            >
              signature
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 36,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
              }}
            >
              scent.
            </div>

            {/* mini play button */}
            <div
              style={{
                display: "flex",
                width: 110,
                height: 110,
                borderRadius: 9999,
                background: "#FFFFFF",
                color: "#000000",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                letterSpacing: 4,
                fontWeight: 600,
                marginTop: 36,
                textTransform: "uppercase",
              }}
            >
              Play
            </div>
          </div>
        </div>

        {/* CTA */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: 200,
            left: 0,
            right: 0,
            justifyContent: "center",
            fontSize: 22,
            letterSpacing: 14,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.85)",
            fontWeight: 500,
            zIndex: 1,
          }}
        >
          play now →
        </div>

        {/* URL */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: 130,
            left: 0,
            right: 0,
            justifyContent: "center",
            fontSize: 16,
            letterSpacing: 10,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.4)",
            fontWeight: 500,
            zIndex: 1,
          }}
        >
          game.etienneperfumes.com
        </div>
      </div>
    ),
    {
      ...SIZE,
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
        "Content-Disposition": 'inline; filename="etienne-story-whisper.png"',
      },
    }
  );
}
