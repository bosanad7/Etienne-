import { ImageResponse } from "next/og";

export const runtime = "edge";

const SIZE = { width: 1080, height: 1920 } as const;

// IBM Plex Sans Arabic (OFL) — matches the typography the live game uses
// for Arabic on the web. Fetched from jsdelivr's @fontsource mirror.
const FONT_REG =
  "https://cdn.jsdelivr.net/npm/@fontsource/ibm-plex-sans-arabic@5.0.13/files/ibm-plex-sans-arabic-arabic-400-normal.woff";
const FONT_MED =
  "https://cdn.jsdelivr.net/npm/@fontsource/ibm-plex-sans-arabic@5.0.13/files/ibm-plex-sans-arabic-arabic-500-normal.woff";
const FONT_BOLD =
  "https://cdn.jsdelivr.net/npm/@fontsource/ibm-plex-sans-arabic@5.0.13/files/ibm-plex-sans-arabic-arabic-600-normal.woff";

/**
 * Arabic IG Story explainer asset — 1080×1920 PNG, RTL.
 *
 * Mirrors /story/howto in structure (brand → hero → 3 steps → CTA) but
 * runs in Arabic with direction:'rtl', a row-reverse step layout so the
 * number circle sits on the right, and a left-pointing arrow on the CTA.
 *
 * Top 240px and bottom 220px are kept clear of content so IG's own
 * Story chrome doesn't cover anything important.
 */
export async function GET() {
  const [reg, med, bold] = await Promise.all([
    fetch(FONT_REG).then((r) => r.arrayBuffer()),
    fetch(FONT_MED).then((r) => r.arrayBuffer()),
    fetch(FONT_BOLD).then((r) => r.arrayBuffer()),
  ]);

  return new ImageResponse(
    (
      <div
        // direction:rtl flips text and inline content; layout positions
        // that use centred absolute placement are direction-independent.
        dir="rtl"
        lang="ar"
        style={{
          width: "100%",
          height: "100%",
          background: "#000000",
          color: "#FFFFFF",
          display: "flex",
          position: "relative",
          fontFamily: "Plex Arabic",
        }}
      >
        {/* grain */}
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

        {/* top vignette */}
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

        {/* ETIENNE wordmark stays Latin */}
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
            top: 318,
            left: 0,
            right: 0,
            justifyContent: "center",
            fontSize: 22,
            letterSpacing: 6,
            color: "rgba(255,255,255,0.55)",
            fontWeight: 500,
            zIndex: 1,
          }}
        >
          الاختبار
        </div>

        {/* hairline */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 388,
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
            top: 470,
            left: 0,
            right: 0,
            justifyContent: "center",
            fontSize: 100,
            color: "#FFFFFF",
            fontWeight: 600,
            letterSpacing: "-0.01em",
            zIndex: 1,
          }}
        >
          اكتشف
        </div>
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 600,
            left: 0,
            right: 0,
            justifyContent: "center",
            fontSize: 130,
            color: "#FFFFFF",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            zIndex: 1,
          }}
        >
          بصمتك.
        </div>

        {/* sub-tagline */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 770,
            left: 0,
            right: 0,
            justifyContent: "center",
            fontSize: 28,
            letterSpacing: 4,
            color: "rgba(255,255,255,0.62)",
            fontWeight: 500,
            zIndex: 1,
          }}
        >
          اختبار عطور من ١٠ أسئلة
        </div>

        {/* hairline 2 */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 850,
            left: "50%",
            transform: "translateX(-50%)",
            width: 60,
            height: 1,
            backgroundImage:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
            zIndex: 1,
          }}
        />

        {/* HOW IT WORKS — 3 steps */}
        <Step
          top={920}
          n="٠١"
          title="أدخل حسابك"
          sub="سجّل دخولك بحساب إنستغرام — لعبة واحدة لكل حساب."
        />
        <Step
          top={1180}
          n="٠٢"
          title="عشرة أسئلة، عشرون ثانية لكل سؤال"
          sub="الإجابات الأسرع تكسبك نقاط بونص أكبر."
        />
        <Step
          top={1440}
          n="٠٣"
          title="تعرّف على بصمتك"
          sub="نطابق ذوقك مع أحد عطور ETIENNE الستة — ونضعك على لوحة الصدارة."
        />

        {/* CTA — arrow points LEFT in RTL */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: 250,
            left: 0,
            right: 0,
            justifyContent: "center",
            fontSize: 30,
            letterSpacing: 8,
            color: "rgba(255,255,255,0.92)",
            fontWeight: 600,
            zIndex: 1,
          }}
        >
          العب الآن ←
        </div>

        {/* URL — Latin, LTR */}
        <div
          dir="ltr"
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
      fonts: [
        { name: "Plex Arabic", data: reg, weight: 400, style: "normal" },
        { name: "Plex Arabic", data: med, weight: 500, style: "normal" },
        { name: "Plex Arabic", data: bold, weight: 600, style: "normal" },
      ],
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
        "Content-Disposition": 'inline; filename="etienne-story-howto-ar.png"',
      },
    }
  );
}

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
        // row-reverse so the number circle sits on the RIGHT in RTL
        flexDirection: "row-reverse",
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
          flexShrink: 0,
        }}
      >
        {n}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          flex: 1,
          paddingTop: 4,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 38,
            fontWeight: 600,
            color: "#FFFFFF",
            lineHeight: 1.25,
            textAlign: "right",
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "rgba(255,255,255,0.6)",
            fontWeight: 400,
            marginTop: 14,
            lineHeight: 1.55,
            maxWidth: 760,
            textAlign: "right",
          }}
        >
          {sub}
        </div>
      </div>
    </div>
  );
}
