#!/usr/bin/env python3
"""
Regenerate the Arabic IG-Story explainer PNG.

Output:
    public/share/etienne-howto-ar.png  (1080 × 1920)

The Edge ImageResponse pipeline at /story/howto-ar wouldn't render
non-trivial Arabic layouts (Satori returned empty bodies even with
bundled webfonts), so we render statically with PIL + arabic_reshaper
+ python-bidi, using macOS's built-in Geeza Pro for Arabic shapes and
Helvetica for Latin segments.

Dependencies:
    pip install Pillow arabic_reshaper python-bidi

Run from anywhere — paths are absolute.
"""
from PIL import Image, ImageDraw, ImageFont
import arabic_reshaper
from bidi.algorithm import get_display
import random
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "share" / "etienne-howto-ar.png"

LATIN = "/System/Library/Fonts/Supplemental/Helvetica.ttc"
AR_FONT = "/System/Library/Fonts/GeezaPro.ttc"

W, H = 1080, 1920


def ar(text: str) -> str:
    """Reshape + bidi-reorder so PIL renders joined Arabic glyphs in
    the right visual order."""
    return get_display(arabic_reshaper.reshape(text))


def f(path: str, size: int, idx: int = 0) -> ImageFont.FreeTypeFont:
    try:
        return ImageFont.truetype(path, size, index=idx)
    except Exception:
        return ImageFont.truetype(path, size)


def main() -> None:
    img = Image.new("RGB", (W, H), (0, 0, 0))
    d = ImageDraw.Draw(img, "RGBA")

    # subtle grain — matches the live game backdrop
    random.seed(7)
    for _ in range(8000):
        d.point((random.randrange(0, W), random.randrange(0, H)), fill=(255, 255, 255, 9))

    # top vignette
    for y in range(0, 720):
        alpha = int(15 * (1 - y / 720))
        d.line([(0, y), (W, y)], fill=(255, 255, 255, alpha))

    def cx(text: str, y: int, font, fill) -> None:
        bb = d.textbbox((0, 0), text, font=font)
        d.text(((W - (bb[2] - bb[0])) // 2, y), text, font=font, fill=fill)

    # ETIENNE Latin wordmark — letter-spaced
    cx(" ".join(list("ETIENNE")), 240, f(LATIN, 38, idx=1), (255, 255, 255))
    # Arabic kicker
    cx(ar("الاختبار"), 305, f(AR_FONT, 32), (255, 255, 255, 140))

    # hairline 1
    d.line([(W // 2 - 40, 380), (W // 2 + 40, 380)], fill=(255, 255, 255, 140))

    # hero
    cx(ar("اكتشف"), 450, f(AR_FONT, 110), (255, 255, 255))
    cx(ar("بصمتك."), 590, f(AR_FONT, 150), (255, 255, 255))

    # sub-tagline
    cx(ar("اختبار عطور من ١٠ أسئلة"), 780, f(AR_FONT, 38), (255, 255, 255, 160))

    # hairline 2
    d.line([(W // 2 - 30, 870), (W // 2 + 30, 870)], fill=(255, 255, 255, 100))

    # 3 step rows — number circle on the right (RTL), title + sub right-aligned
    def step(top: int, num: str, title: str, sub: str) -> None:
        cx_, cy = W - 90 - 42, top + 42
        d.ellipse([cx_ - 42, cy - 42, cx_ + 42, cy + 42], outline=(255, 255, 255, 75), width=2)
        nshaped = ar(num)
        nf = f(AR_FONT, 38)
        nb = d.textbbox((0, 0), nshaped, font=nf)
        d.text(
            (cx_ - (nb[2] - nb[0]) // 2, cy - (nb[3] - nb[1]) // 2 - 4),
            nshaped, font=nf, fill=(255, 255, 255, 220),
        )
        title_right = W - 90 - 84 - 30
        tshaped = ar(title)
        tf = f(AR_FONT, 42)
        tb = d.textbbox((0, 0), tshaped, font=tf)
        d.text((title_right - (tb[2] - tb[0]), top + 8), tshaped, font=tf, fill=(255, 255, 255))

        # subtitle word-wrap
        sf = f(AR_FONT, 28)
        max_w = W - 180 - 84 - 30
        cur = ""
        lines: list[str] = []
        for w in sub.split(" "):
            test = (cur + " " + w).strip()
            bb = d.textbbox((0, 0), ar(test), font=sf)
            if bb[2] - bb[0] > max_w and cur:
                lines.append(cur)
                cur = w
            else:
                cur = test
        if cur:
            lines.append(cur)
        yy = top + 76
        for ln in lines:
            ls = ar(ln)
            bb = d.textbbox((0, 0), ls, font=sf)
            d.text((title_right - (bb[2] - bb[0]), yy), ls, font=sf, fill=(255, 255, 255, 160))
            yy += 44

    # NOTE: avoid em-dashes (—), embedded Latin words inside Arabic, and
    # arrow glyphs (←/→) — Geeza Pro lacks those code points and they
    # render as boxes. The copy below is intentionally restricted to
    # glyphs the macOS system Arabic font can shape.
    step(940, "١", "أدخل حسابك",
         "سجّل دخولك بحساب إنستغرام، ولكل حساب لعبة واحدة فقط.")
    step(1180, "٢", "عشرة أسئلة، عشرون ثانية لكل سؤال",
         "كلما أجبت أسرع وبشكل صحيح، كسبت نقاط بونص أكبر.")
    step(1440, "٣", "تعرّف على بصمتك",
         "نطابق ذوقك مع أحد عطورنا الستة، ونضعك على لوحة الصدارة.")

    # CTA — Arabic words only (no arrow — Geeza lacks the glyph)
    cx(ar("العب الآن"), H - 290, f(AR_FONT, 42), (255, 255, 255, 240))
    # URL — Latin, letter-spaced
    cx(" ".join(list("GAME.ETIENNEPERFUMES.COM")), H - 200, f(LATIN, 22), (255, 255, 255, 120))

    OUT.parent.mkdir(parents=True, exist_ok=True)
    img.save(OUT)
    print(f"wrote {OUT}")


if __name__ == "__main__":
    main()
