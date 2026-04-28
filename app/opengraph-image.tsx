import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Etienne Perfumes — Find Your Signature Scent";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
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
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        }}
      >
        {/* Spotlight glow from top */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(255,255,255,0.10), transparent 65%)",
          }}
        />

        {/* Halo behind hero */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            left: 200,
            top: 240,
            width: 800,
            height: 280,
            borderRadius: 9999,
            background: "rgba(255,255,255,0.045)",
            filter: "blur(120px)",
          }}
        />

        {/* Top-left wordmark */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            position: "absolute",
            top: 64,
            left: 96,
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 30,
              letterSpacing: 14,
              fontWeight: 600,
              color: "#FFFFFF",
            }}
          >
            ETIENNE
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 13,
              letterSpacing: 8,
              color: "rgba(255,255,255,0.55)",
              marginTop: 10,
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            Perfumes
          </div>
        </div>

        {/* Top-right É monogram */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 56,
            right: 96,
            width: 80,
            height: 80,
            borderRadius: 9999,
            background: "#FFFFFF",
            color: "#000000",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 46,
            fontWeight: 700,
            zIndex: 1,
          }}
        />

        {/* É letter (separated so the circle stays a proper flex container) */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 56,
            right: 96,
            width: 80,
            height: 80,
            alignItems: "center",
            justifyContent: "center",
            fontSize: 46,
            fontWeight: 700,
            color: "#000000",
            zIndex: 2,
          }}
        >
          É
        </div>

        {/* Hairline divider */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 232,
            left: "50%",
            transform: "translateX(-50%)",
            width: 90,
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)",
            zIndex: 1,
          }}
        />

        {/* Eyebrow */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 270,
            left: 0,
            right: 0,
            justifyContent: "center",
            fontSize: 16,
            letterSpacing: 14,
            color: "rgba(255,255,255,0.6)",
            textTransform: "uppercase",
            fontWeight: 500,
            zIndex: 1,
          }}
        >
          A Game by Etienne
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 308,
            left: 0,
            right: 0,
            justifyContent: "center",
            fontSize: 76,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            color: "#FFFFFF",
            textAlign: "center",
            zIndex: 1,
          }}
        >
          Find Your Signature Scent
        </div>

        {/* Blurb */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 425,
            left: 200,
            right: 200,
            justifyContent: "center",
            fontSize: 24,
            fontStyle: "italic",
            color: "rgba(255,255,255,0.7)",
            textAlign: "center",
            zIndex: 1,
          }}
        >
          Play the game and find the fragrance that defines you.
        </div>

        {/* Bottom band */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: 56,
            left: 96,
            right: 96,
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 22,
            borderTop: "1px solid rgba(255,255,255,0.18)",
            fontSize: 17,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.7)",
            fontWeight: 500,
            zIndex: 1,
          }}
        >
          <div style={{ display: "flex" }}>game.etienneperfumes.com</div>
          <div style={{ display: "flex" }}>3 stages · 1 signature</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
