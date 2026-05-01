import { ImageResponse } from "next/og";

export const runtime = "edge";

const SIZE = { width: 1080, height: 1920 } as const;
const FONT =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

/**
 * Arabic IG Story explainer — 1080×1920 PNG, RTL.
 *
 * Mirrors /story/howto in structure (brand → hero → 3 steps → CTA) but
 * runs in Arabic with row-reverse step layout so the number circle sits
 * on the right and a left-pointing arrow on the CTA. Arabic glyphs use
 * Vercel's runtime fallback — bundling a bundled webfont was failing
 * the Edge handler with an empty body, and the fallback shapes Arabic
 * acceptably for marketing-asset use.
 *
 * Top 240px and bottom 220px are kept clear of content so IG's own
 * Story chrome doesn't cover anything important.
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

        {/* ETIENNE wordmark — Latin */}
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
        {/* Arabic kicker */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 318,
            left: 0,
            right: 0,
            justifyContent: "center",
            fontSize: 24,
            letterSpacing: 4,
            color: "rgba(255,255,255,0.55)",
            fontWeight: 500,
            zIndex: 1,
          }}
        >
          الاختبار
        </div>

        {/* hairline 1 */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 388,
            left: "50%",
            width: 80,
            height: 1,
            marginLeft: -40,
            backgroundImage:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)",
            zIndex: 1,
          }}
        />

        {/* hero */}
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
            fontSize: 30,
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
            width: 60,
            height: 1,
            marginLeft: -30,
            backgroundImage:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
            zIndex: 1,
          }}
        />

        <Step
          top={920}
          n="١"
          title="أدخل حسابك"
          sub="سجّل دخولك بحساب إنستغرام — لعبة واحدة لكل حساب."
        />
        <Step
          top={1180}
          n="٢"
          title="عشرة أسئلة، عشرون ثانية لكل سؤال"
          sub="الإجابات الأسرع تكسبك نقاط بونص أكبر."
        />
        <Step
          top={1440}
          n="٣"
          title="تعرّف على بصمتك"
          sub="نطابق ذوقك مع أحد عطور ETIENNE الستة — ونضعك على لوحة الصدارة."
        />

        {/* CTA — left-pointing arrow follows RTL reading order */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: 250,
            left: 0,
            right: 0,
            justifyContent: "center",
            fontSize: 32,
            letterSpacing: 8,
            color: "rgba(255,255,255,0.92)",
            fontWeight: 600,
            zIndex: 1,
          }}
        >
          العب الآن ←
        </div>

        {/* URL — Latin */}
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
        flexDirection: "row-reverse",
        alignItems: "flex-start",
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
          fontSize: 32,
          fontWeight: 500,
          flexShrink: 0,
          marginLeft: 36,
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
            fontSize: 40,
            fontWeight: 600,
            color: "#FFFFFF",
            lineHeight: 1.25,
            justifyContent: "flex-end",
            width: "100%",
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: "rgba(255,255,255,0.6)",
            fontWeight: 400,
            marginTop: 14,
            lineHeight: 1.55,
            justifyContent: "flex-end",
            width: "100%",
            textAlign: "right",
          }}
        >
          {sub}
        </div>
      </div>
    </div>
  );
}
