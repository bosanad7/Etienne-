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
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: FONT,
          gap: 60,
          padding: 80,
        }}
      >
        <div style={{ display: "flex", fontSize: 32, letterSpacing: 18, fontWeight: 600 }}>
          ETIENNE
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "rgba(255,255,255,0.55)" }}>
          الاختبار
        </div>
        <div style={{ display: "flex", fontSize: 130, fontWeight: 600 }}>
          بصمتك.
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "rgba(255,255,255,0.62)" }}>
          اختبار عطور من ١٠ أسئلة
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row-reverse",
            alignItems: "center",
            gap: 24,
            marginTop: 60,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 84,
              height: 84,
              borderRadius: 9999,
              border: "1px solid rgba(255,255,255,0.3)",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
            }}
          >
            ١
          </div>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 600 }}>
            أدخل حسابك
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 32, fontWeight: 600 }}>
          العب الآن ←
        </div>
      </div>
    ),
    { ...SIZE }
  );
}
