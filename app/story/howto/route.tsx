import { ImageResponse } from "next/og";

export const runtime = "edge";

const SIZE = { width: 1080, height: 1920 } as const;
const FONT =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

/**
 * IG Story explainer asset — 1080×1920 PNG.
 *
 * One-image walkthrough of how the game works:
 *   - brand lockup
 *   - hero hook
 *   - 3-step "how it works" stack
 *   - URL CTA
 *
 * Top 240px and bottom 220px are kept clear of content so IG's own
 * Story chrome (progress bar / profile bubble at top, "Reply" composer
 * at bottom) doesn't cover anything important.
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
          position: "relative",
          fontFamily: FONT,
        }}
      >
        {/* subtle grain — matches the live game backdrop */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "14px 14px",
          }}
        />

        {/* soft top vignette */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 720,
            backgroundImage:
              "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 100%)",
          }}
        />

        {/* ETIENNE wordmark */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 260,
            left: 0,
            right: 0,
            justifyContent: "center",
            fontSize: 32,
            letterSpacing: 18,
            fontWeight: 600,
            color: "#FFFFFF",
            zIndex: 1,
          }}
        >
          ETIENNE
        </div>
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 312,
            left: 0,
            right: 0,
            justifyContent: "center",
            fontSize: 13,
            letterSpacing: 10,
            color: "rgba(255,255,255,0.5)",
            fontWeight: 500,
            zIndex: 1,
          }}
        >
          THE QUIZ
        </div>

        {/* hairline */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 380,
            left: "50%",
            transform: "translateX(-50%)",
            width: 80,
            height: 1,
            backgroundImage:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)",
            zIndex: 1,
          }}
        />

        {/* hero hook */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 460,
            left: 0,
            right: 0,
            justifyContent: "center",
            fontSize: 92,
            letterSpacing: "-0.03em",
            color: "#FFFFFF",
            fontWeight: 600,
            zIndex: 1,
          }}
        >
          Find your
        </div>
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 570,
            left: 0,
            right: 0,
            justifyContent: "center",
            fontSize: 110,
            fontStyle: "italic",
            fontWeight: 500,
            letterSpacing: "-0.04em",
            color: "#FFFFFF",
            zIndex: 1,
          }}
        >
          signature.
        </div>

        {/* sub-tagline */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 740,
            left: 0,
            right: 0,
            justifyContent: "center",
            fontSize: 26,
            letterSpacing: 8,
            color: "rgba(255,255,255,0.62)",
            fontWeight: 500,
            zIndex: 1,
          }}
        >
          A 10-QUESTION SCENT QUIZ
        </div>

        {/* hairline 2 */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 830,
            left: "50%",
            transform: "translateX(-50%)",
            width: 60,
            height: 1,
            backgroundImage:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
            zIndex: 1,
          }}
        />

        {/* HOW IT WORKS — 3 steps stacked */}
        <Step
          top={910}
          n="01"
          title="Drop your handle"
          sub="Sign in with your Instagram username — one play per handle."
        />
        <Step
          top={1170}
          n="02"
          title="Ten questions, twenty seconds each"
          sub="Faster correct answers earn bigger speed bonuses."
        />
        <Step
          top={1430}
          n="03"
          title="Meet your signature"
          sub="We match your taste to one of six ETIENNE scents — and place you on the leaderboard."
        />

        {/* CTA */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: 250,
            left: 0,
            right: 0,
            justifyContent: "center",
            fontSize: 26,
            letterSpacing: 16,
            color: "rgba(255,255,255,0.92)",
            fontWeight: 500,
            zIndex: 1,
          }}
        >
          PLAY NOW →
        </div>

        {/* URL */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: 180,
            left: 0,
            right: 0,
            justifyContent: "center",
            fontSize: 18,
            letterSpacing: 10,
            color: "rgba(255,255,255,0.45)",
            fontWeight: 500,
            zIndex: 1,
          }}
        >
          GAME.ETIENNEPERFUMES.COM
        </div>
      </div>
    ),
    {
      ...SIZE,
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
        "Content-Disposition": 'inline; filename="etienne-story-howto.png"',
      },
    }
  );
}

/**
 * Single step row — number on the left, title + subtitle on the right.
 * Sits at an absolute `top` so the layout reads like a stacked list
 * regardless of subtitle length wrapping.
 */
function Step({
  top,
  n,
  title,
  sub,
}: {
  top: number;
  n: string;
  title: string;
  sub: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        position: "absolute",
        top,
        left: 90,
        right: 90,
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 36,
        zIndex: 1,
      }}
    >
      <div
        style={{
          display: "flex",
          width: 84,
          height: 84,
          borderRadius: 9999,
          border: "1px solid rgba(255,255,255,0.28)",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(255,255,255,0.85)",
          fontSize: 28,
          fontWeight: 500,
          letterSpacing: 2,
          flexShrink: 0,
        }}
      >
        {n}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          flex: 1,
          paddingTop: 4,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 36,
            fontWeight: 600,
            letterSpacing: "-0.01em",
            color: "#FFFFFF",
            lineHeight: 1.18,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: "rgba(255,255,255,0.6)",
            fontWeight: 400,
            marginTop: 12,
            lineHeight: 1.4,
            maxWidth: 760,
          }}
        >
          {sub}
        </div>
      </div>
    </div>
  );
}
