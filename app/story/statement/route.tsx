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
        {/* halo behind device */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            left: 80,
            top: 880,
            width: 920,
            height: 720,
            borderRadius: 9999,
            background: "rgba(255,255,255,0.06)",
            filter: "blur(140px)",
          }}
        />
        {/* spotlight from top */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(255,255,255,0.10), transparent 60%)",
          }}
        />
        {/* grain */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.04) 1.2px, transparent 1.2px)",
            backgroundSize: "14px 14px",
          }}
        />

        {/* Top — É monogram + ETIENNE wordmark, left aligned */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 110,
            left: 96,
            alignItems: "center",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 76,
              height: 76,
              borderRadius: 9999,
              background: "#FFFFFF",
              color: "#000000",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 44,
              fontWeight: 700,
            }}
          >
            É
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: 28,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 26,
                letterSpacing: 14,
                fontWeight: 600,
              }}
            >
              ETIENNE
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 14,
                letterSpacing: 8,
                color: "rgba(255,255,255,0.55)",
                marginTop: 6,
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              Perfumes
            </div>
          </div>
        </div>

        {/* Hero — three line headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "absolute",
            top: 280,
            left: 96,
            right: 96,
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 130,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 0.96,
              textTransform: "uppercase",
            }}
          >
            FIND YOUR
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 130,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 0.96,
              textTransform: "uppercase",
              marginTop: 8,
            }}
          >
            SIGNATURE
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 130,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 0.96,
              textTransform: "uppercase",
              marginTop: 8,
            }}
          >
            SCENT.
          </div>
        </div>

        {/* Phone mockup — tilted slightly, showing /results reveal */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 880,
            left: "50%",
            transform: "translateX(-50%) rotate(-2deg)",
            width: 460,
            height: 760,
            background: "#0A0A0A",
            border: "1px solid rgba(255,255,255,0.22)",
            borderRadius: 56,
            padding: 14,
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
              borderRadius: 44,
              padding: 50,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 12,
                letterSpacing: 8,
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.5)",
                fontWeight: 500,
              }}
            >
              Your Signature
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 56,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                marginTop: 14,
                lineHeight: 1.0,
              }}
            >
              Connoisseur.
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 13,
                letterSpacing: 6,
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.65)",
                marginTop: 16,
                fontWeight: 500,
              }}
            >
              Warm · Sensual · Refined
            </div>

            {/* score ring */}
            <div
              style={{
                display: "flex",
                width: 220,
                height: 220,
                borderRadius: 9999,
                marginTop: 32,
                border: "1px solid rgba(255,255,255,0.22)",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontSize: 11,
                    letterSpacing: 6,
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.5)",
                    fontWeight: 500,
                  }}
                >
                  Score
                </div>
                <div
                  style={{
                    display: "flex",
                    fontSize: 64,
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    marginTop: 4,
                  }}
                >
                  1,420
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hairline above CTA */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: 280,
            left: "50%",
            transform: "translateX(-50%)",
            width: 80,
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
            zIndex: 1,
          }}
        />

        {/* Tagline */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: 220,
            left: 0,
            right: 0,
            justifyContent: "center",
            fontSize: 22,
            letterSpacing: 14,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.85)",
            fontWeight: 600,
            zIndex: 1,
          }}
        >
          Beat the top score
        </div>

        {/* Pill CTA */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: 110,
            left: 0,
            right: 0,
            justifyContent: "center",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "26px 60px",
              borderRadius: 9999,
              background: "#FFFFFF",
              color: "#000000",
              fontSize: 22,
              letterSpacing: 12,
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            Play Now →
          </div>
        </div>

        {/* URL */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: 56,
            left: 0,
            right: 0,
            justifyContent: "center",
            fontSize: 14,
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
        "Content-Disposition":
          'inline; filename="etienne-story-statement.png"',
      },
    }
  );
}
