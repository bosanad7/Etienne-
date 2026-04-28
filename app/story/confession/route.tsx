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
        {/* grain — heavier for emotional warmth */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.045) 1.4px, transparent 1.4px)",
            backgroundSize: "12px 12px",
          }}
        />
        {/* very faint center glow */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            left: 140,
            top: 460,
            width: 800,
            height: 600,
            borderRadius: 9999,
            background: "rgba(255,255,255,0.025)",
            filter: "blur(140px)",
          }}
        />

        {/* Top — É monogram centered */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "absolute",
            top: 200,
            left: 0,
            right: 0,
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
              fontSize: 14,
              letterSpacing: 10,
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.55)",
              fontWeight: 500,
              marginTop: 22,
            }}
          >
            ETIENNE PERFUMES
          </div>
        </div>

        {/* hero — soft italic question, three lines */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "absolute",
            top: 480,
            left: 96,
            right: 96,
            alignItems: "flex-start",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 124,
              fontStyle: "italic",
              fontWeight: 400,
              letterSpacing: "-0.03em",
              lineHeight: 1.0,
              color: "rgba(255,255,255,0.92)",
            }}
          >
            “Who are
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 124,
              fontStyle: "italic",
              fontWeight: 400,
              letterSpacing: "-0.03em",
              lineHeight: 1.0,
              color: "rgba(255,255,255,0.92)",
              marginTop: 14,
            }}
          >
            you
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 124,
              fontStyle: "italic",
              fontWeight: 400,
              letterSpacing: "-0.03em",
              lineHeight: 1.0,
              color: "rgba(255,255,255,0.92)",
              marginTop: 14,
            }}
          >
            in scent?”
          </div>
        </div>

        {/* phone mockup — vertical, showing the reveal */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 1010,
            left: "50%",
            transform: "translateX(-50%)",
            width: 380,
            height: 540,
            background: "#0A0A0A",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: 50,
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
              borderRadius: 40,
              padding: 36,
            }}
          >
            <div
              style={{
                display: "flex",
                width: 44,
                height: 1,
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
              }}
            />
            <div
              style={{
                display: "flex",
                fontSize: 11,
                letterSpacing: 8,
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.55)",
                marginTop: 18,
                fontWeight: 500,
              }}
            >
              Your Signature
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 50,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                marginTop: 14,
                lineHeight: 1.0,
              }}
            >
              Explorer.
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 18,
                fontStyle: "italic",
                color: "rgba(255,255,255,0.65)",
                marginTop: 20,
                lineHeight: 1.4,
                textAlign: "center",
                paddingLeft: 8,
                paddingRight: 8,
              }}
            >
              You're learning the language of scent.
            </div>

            {/* small score chip */}
            <div
              style={{
                display: "flex",
                width: 130,
                height: 130,
                borderRadius: 9999,
                marginTop: 24,
                border: "1px solid rgba(255,255,255,0.22)",
                alignItems: "center",
                justifyContent: "center",
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
                    fontSize: 9,
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
                    fontSize: 44,
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    marginTop: 4,
                  }}
                >
                  980
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* bottom italic copy */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "absolute",
            bottom: 220,
            left: 0,
            right: 0,
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 28,
              fontStyle: "italic",
              color: "rgba(255,255,255,0.75)",
              fontWeight: 400,
            }}
          >
            Ten questions.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              fontStyle: "italic",
              color: "rgba(255,255,255,0.75)",
              fontWeight: 400,
              marginTop: 6,
            }}
          >
            One signature.
          </div>
        </div>

        {/* CTA — soft link, not button */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: 130,
            left: 0,
            right: 0,
            justifyContent: "center",
            fontSize: 18,
            letterSpacing: 14,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.85)",
            fontWeight: 500,
            zIndex: 1,
          }}
        >
          begin →
        </div>

        {/* URL */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: 70,
            left: 0,
            right: 0,
            justifyContent: "center",
            fontSize: 14,
            letterSpacing: 10,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.35)",
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
          'inline; filename="etienne-story-confession.png"',
      },
    }
  );
}
