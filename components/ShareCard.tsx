"use client";
import { forwardRef } from "react";
import type { Perfume } from "@/lib/types";

interface Props {
  perfume: Perfume;
  level: { title: string; blurb: string };
  score: number;
  name?: string;
  handle?: string;
  traits?: string[];
  accuracy?: number;
}

const ShareCard = forwardRef<HTMLDivElement, Props>(function ShareCard(
  { perfume, level, score, name, handle, traits = [], accuracy },
  ref
) {
  const displayName = handle
    ? handle.startsWith("@")
      ? handle
      : `@${handle}`
    : name ?? "—";

  return (
    <div
      ref={ref}
      className="relative w-[1080px] h-[1920px] origin-top-left"
      style={{
        background: "#000000",
        fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
        color: "#FFFFFF",
        overflow: "hidden",
      }}
    >
      {/* spotlight from top */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255,255,255,0.08), transparent 60%)",
        }}
      />
      {/* halo behind hero */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 880,
          transform: "translateX(-50%)",
          width: 1100,
          height: 1100,
          borderRadius: 9999,
          background: "rgba(255,255,255,0.04)",
          filter: "blur(120px)",
        }}
      />
      {/* grain */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.04) 1.5px, transparent 1.5px)",
          backgroundSize: "14px 14px",
          mixBlendMode: "screen",
        }}
      />

      {/* Header — monogram + wordmark */}
      <div
        style={{
          position: "absolute",
          top: 110,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: 9999,
            background: "#FFFFFF",
            color: "#000000",
            display: "grid",
            placeItems: "center",
            fontSize: 64,
            fontWeight: 500,
            letterSpacing: "-0.02em",
          }}
        >
          É
        </div>
        <p
          style={{
            marginTop: 28,
            fontSize: 22,
            letterSpacing: 16,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.6)",
            fontWeight: 500,
          }}
        >
          ETIENNE · Find Your Signature
        </p>
      </div>

      {/* Hairline */}
      <div
        style={{
          position: "absolute",
          top: 460,
          left: "50%",
          transform: "translateX(-50%)",
          width: 90,
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
        }}
      />

      {/* Eyebrow */}
      <p
        style={{
          position: "absolute",
          top: 510,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 22,
          letterSpacing: 14,
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.55)",
          fontWeight: 500,
        }}
      >
        Your Signature
      </p>

      {/* Level title — the emotional anchor */}
      <h1
        style={{
          position: "absolute",
          top: 580,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 168,
          lineHeight: 0.98,
          fontWeight: 500,
          letterSpacing: "-0.03em",
          margin: 0,
        }}
      >
        {level.title}.
      </h1>

      {/* Traits row */}
      {traits.length > 0 && (
        <p
          style={{
            position: "absolute",
            top: 800,
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: 26,
            letterSpacing: 14,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.7)",
            fontWeight: 500,
          }}
        >
          {traits.join("  ·  ")}
        </p>
      )}

      {/* Italic blurb */}
      <p
        style={{
          position: "absolute",
          top: 880,
          left: 120,
          right: 120,
          textAlign: "center",
          fontSize: 36,
          lineHeight: 1.35,
          fontStyle: "italic",
          color: "rgba(255,255,255,0.7)",
          margin: 0,
        }}
      >
        {level.blurb}
      </p>

      {/* Match block — bordered frame */}
      <div
        style={{
          position: "absolute",
          top: 1110,
          left: 96,
          right: 96,
          padding: "56px 64px",
          borderRadius: 36,
          background: "rgba(255,255,255,0.035)",
          border: "1px solid rgba(255,255,255,0.14)",
        }}
      >
        <p
          style={{
            fontSize: 22,
            letterSpacing: 14,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.55)",
            fontWeight: 500,
            margin: 0,
          }}
        >
          Your Match
        </p>
        <p
          style={{
            fontSize: 110,
            marginTop: 14,
            marginBottom: 0,
            fontWeight: 500,
            letterSpacing: "-0.02em",
            lineHeight: 1.0,
          }}
        >
          {perfume.name}
        </p>
        <p
          style={{
            fontStyle: "italic",
            fontSize: 38,
            color: "rgba(255,255,255,0.65)",
            marginTop: 12,
            marginBottom: 0,
          }}
        >
          {perfume.tagline}
        </p>
        <div
          style={{
            marginTop: 36,
            display: "flex",
            gap: 14,
            flexWrap: "wrap",
          }}
        >
          {perfume.mood.slice(0, 4).map((m) => (
            <span
              key={m}
              style={{
                fontSize: 22,
                padding: "10px 20px",
                border: "1px solid rgba(255,255,255,0.28)",
                borderRadius: 999,
                color: "rgba(255,255,255,0.9)",
                letterSpacing: "0.04em",
              }}
            >
              {m}
            </span>
          ))}
        </div>
      </div>

      {/* Footer band — name + score */}
      <div
        style={{
          position: "absolute",
          bottom: 220,
          left: 96,
          right: 96,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          paddingTop: 36,
          borderTop: "1px solid rgba(255,255,255,0.18)",
        }}
      >
        <div>
          <p
            style={{
              fontSize: 20,
              letterSpacing: 12,
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.45)",
              fontWeight: 500,
              margin: 0,
            }}
          >
            Player
          </p>
          <p
            style={{
              fontSize: 50,
              fontWeight: 500,
              letterSpacing: "-0.01em",
              marginTop: 6,
              marginBottom: 0,
            }}
          >
            {displayName}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p
            style={{
              fontSize: 20,
              letterSpacing: 12,
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.45)",
              fontWeight: 500,
              margin: 0,
            }}
          >
            {accuracy !== undefined ? `${Math.round(accuracy * 100)}% acc` : "Score"}
          </p>
          <p
            style={{
              fontSize: 80,
              fontWeight: 500,
              letterSpacing: "-0.01em",
              marginTop: 6,
              marginBottom: 0,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {score.toLocaleString()}
          </p>
        </div>
      </div>

      {/* CTA bar at the very bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 90,
          left: 96,
          right: 96,
          textAlign: "center",
          fontSize: 24,
          letterSpacing: 10,
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.85)",
          fontWeight: 500,
          paddingTop: 24,
          borderTop: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        Find yours · game.etienneperfumes.com
      </div>
    </div>
  );
});

export default ShareCard;
