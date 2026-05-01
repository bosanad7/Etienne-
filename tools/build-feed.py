#!/usr/bin/env python3
"""
IG Feed (1080×1350, 4:5 portrait) explainer cards over the Discovery
Kit photograph as background. Renders both English and Arabic variants.

Output:
    public/share/etienne-howto-feed-en.png
    public/share/etienne-howto-feed-ar.png

Layout strategy:
    The source photo has the bottles at the bottom and a near-black
    fabric field across the top two-thirds. We crop and scale-to-fill
    so the bottles sit in the lower portion of the canvas, then layer
    over the dark upper region:

      - the actual ETIENNE wordmark (PNG, white-on-transparent)
      - hero hook
      - 3 compact explainer bullets describing the game
      - URL strip at the very bottom

Dependencies:
    pip install Pillow arabic_reshaper python-bidi
"""
from PIL import Image, ImageDraw, ImageFont
import arabic_reshaper
from bidi.algorithm import get_display
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PHOTO = Path(__file__).resolve().parent / "etienne-discovery-photo.jpeg"
WORDMARK = ROOT / "public" / "brand" / "etienne-wordmark-white@2x.png"
OUT_DIR = ROOT / "public" / "share"
OUT_DIR.mkdir(parents=True, exist_ok=True)

LATIN = "/System/Library/Fonts/Supplemental/Helvetica.ttc"
AR_FONT = "/System/Library/Fonts/GeezaPro.ttc"

W, H = 1080, 1350


def f(path: str, size: int, idx: int = 0) -> ImageFont.FreeTypeFont:
    try:
        return ImageFont.truetype(path, size, index=idx)
    except Exception:
        return ImageFont.truetype(path, size)


def ar(text: str) -> str:
    """Reshape + bidi-reorder Arabic so PIL renders joined glyphs in
    correct visual order."""
    return get_display(arabic_reshaper.reshape(text))


def make_background() -> Image.Image:
    """Scale + crop the source photo to fill 1080×1350 with bottles
    pinned to the bottom. Apply a top-half darkening gradient so text
    reads cleanly over the fabric area."""
    src = Image.open(PHOTO).convert("RGB")
    sw, sh = src.size

    scale = W / sw
    new_w = int(sw * scale)
    new_h = int(sh * scale)
    src = src.resize((new_w, new_h), Image.LANCZOS)

    overflow = new_h - H
    if overflow > 0:
        src = src.crop((0, overflow, new_w, new_h))
    elif overflow < 0:
        canvas = Image.new("RGB", (W, H), (0, 0, 0))
        canvas.paste(src, (0, 0))
        src = canvas

    # Two overlays: a heavy top fade for the hero, plus a softer band
    # behind the explainer rows (y≈480–700) so they stay readable even
    # when the bottle caps start to appear in the bg.
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    grad_h = int(H * 0.55)
    for y in range(grad_h):
        t = y / grad_h
        a = int(220 * (1 - t) ** 1.3)
        od.line([(0, y), (W, y)], fill=(0, 0, 0, a))
    # Mid-band hold (covers the explainer rows specifically)
    mid_top, mid_bot = 480, 720
    for y in range(mid_top, mid_bot):
        # ease in at the top, ease out at the bottom for a clean blend
        if y < mid_top + 40:
            t = (y - mid_top) / 40
            a = int(120 * t)
        elif y > mid_bot - 60:
            t = (mid_bot - y) / 60
            a = int(120 * t)
        else:
            a = 120
        od.line([(0, y), (W, y)], fill=(0, 0, 0, a))

    src = src.convert("RGBA")
    src = Image.alpha_composite(src, overlay)
    return src.convert("RGB")


def paste_wordmark(img: Image.Image, target_height: int, top: int) -> None:
    """Paste the ETIENNE wordmark PNG (white on transparent) centered
    horizontally at the given top, scaled to the requested height."""
    mark = Image.open(WORDMARK).convert("RGBA")
    mw, mh = mark.size
    scale = target_height / mh
    new_w = int(mw * scale)
    mark = mark.resize((new_w, target_height), Image.LANCZOS)
    img.paste(mark, ((W - new_w) // 2, top), mark)


def draw_centered(d: ImageDraw.ImageDraw, text: str, y: int, font, fill) -> None:
    bb = d.textbbox((0, 0), text, font=font)
    d.text(((W - (bb[2] - bb[0])) // 2, y), text, font=font, fill=fill)


# -----------------------------------------------------------------------
# English
# -----------------------------------------------------------------------

def render_en(bg: Image.Image) -> Image.Image:
    img = bg.copy()
    # Real wordmark — replaces the previous letter-spaced text.
    paste_wordmark(img, target_height=48, top=68)
    d = ImageDraw.Draw(img, "RGBA")

    # kicker beneath the wordmark
    draw_centered(d, "T H E   Q U I Z", 134, f(LATIN, 15, idx=0),
                  (255, 255, 255, 180))

    # hairline
    d.line([(W // 2 - 36, 174), (W // 2 + 36, 174)],
           fill=(255, 255, 255, 150))

    # hero — compact 2-line lockup
    draw_centered(d, "Find your", 210, f(LATIN, 76, idx=1), (255, 255, 255))
    draw_centered(d, "signature scent.", 300,
                  f(LATIN, 76, idx=1), (255, 255, 255))

    # caption (single line, broader explainer)
    draw_centered(d, "A 10-question scent quiz.  We match you to one of six.",
                  410, f(LATIN, 21), (255, 255, 255, 210))

    # 3 numbered explainer rows — packed tight, ending well above the
    # bottle caps which start around y≈700 in the cropped photo.
    rows = [
        ("01", "Sign in with your Instagram handle"),
        ("02", "Race the clock — faster correct answers earn more"),
        ("03", "Reveal your signature scent + leaderboard rank"),
    ]
    column_x = 90
    label_font = f(LATIN, 20, idx=0)
    n_font = f(LATIN, 15, idx=1)
    y = 490
    for n, label in rows:
        cx, cy = column_x + 22, y + 22
        d.ellipse([cx - 22, cy - 22, cx + 22, cy + 22],
                  outline=(255, 255, 255, 130), width=1)
        nb = d.textbbox((0, 0), n, font=n_font)
        d.text((cx - (nb[2] - nb[0]) // 2,
                cy - (nb[3] - nb[1]) // 2 - 2),
               n, font=n_font, fill=(255, 255, 255, 240))
        d.text((column_x + 60, y + 13), label,
               font=label_font, fill=(255, 255, 255, 240))
        y += 56

    # CTA band at the very bottom
    band_h = 84
    band = Image.new("RGBA", (W, band_h), (0, 0, 0, 235))
    img.paste(band, (0, H - band_h), band)
    d2 = ImageDraw.Draw(img, "RGBA")
    draw_centered(d2, "PLAY NOW  ·  GAME.ETIENNEPERFUMES.COM",
                  H - band_h + 30, f(LATIN, 20, idx=1), (255, 255, 255))

    return img


# -----------------------------------------------------------------------
# Arabic
# -----------------------------------------------------------------------

def render_ar(bg: Image.Image) -> Image.Image:
    img = bg.copy()
    paste_wordmark(img, target_height=48, top=68)
    d = ImageDraw.Draw(img, "RGBA")

    # Arabic kicker
    draw_centered(d, ar("الاختبار"), 134, f(AR_FONT, 22),
                  (255, 255, 255, 180))

    d.line([(W // 2 - 36, 178), (W // 2 + 36, 178)],
           fill=(255, 255, 255, 150))

    # hero
    draw_centered(d, ar("اكتشف"), 210, f(AR_FONT, 78), (255, 255, 255))
    draw_centered(d, ar("بصمتك العطرية."), 312,
                  f(AR_FONT, 78), (255, 255, 255))

    # caption
    draw_centered(d, ar("اختبار عطور من ١٠ أسئلة. نطابقك مع أحد عطورنا الستة."),
                  430, f(AR_FONT, 22), (255, 255, 255, 210))

    # 3 explainer rows — number circle on RIGHT, label right-aligned
    rows = [
        ("١", "سجّل دخولك بحساب إنستغرام"),
        ("٢", "كلما أجبت أسرع، كسبت نقاطًا أكثر"),
        ("٣", "اعرف عطرك وترتيبك على لوحة الصدارة"),
    ]
    column_right = W - 90
    label_font = f(AR_FONT, 22)
    n_font = f(AR_FONT, 18)
    y = 500
    for n, label in rows:
        cx, cy = column_right - 22, y + 22
        d.ellipse([cx - 22, cy - 22, cx + 22, cy + 22],
                  outline=(255, 255, 255, 130), width=1)
        nshaped = ar(n)
        nb = d.textbbox((0, 0), nshaped, font=n_font)
        d.text((cx - (nb[2] - nb[0]) // 2,
                cy - (nb[3] - nb[1]) // 2 - 4),
               nshaped, font=n_font, fill=(255, 255, 255, 240))
        lshaped = ar(label)
        lb = d.textbbox((0, 0), lshaped, font=label_font)
        d.text((column_right - 60 - (lb[2] - lb[0]), y + 13),
               lshaped, font=label_font, fill=(255, 255, 255, 240))
        y += 56

    # CTA band — Arabic words + Latin URL, both centered
    band_h = 84
    band = Image.new("RGBA", (W, band_h), (0, 0, 0, 235))
    img.paste(band, (0, H - band_h), band)
    d2 = ImageDraw.Draw(img, "RGBA")
    ar_part = ar("العب الآن")
    sep = "  ·  "
    url = "GAME.ETIENNEPERFUMES.COM"
    af = f(AR_FONT, 26)
    sf = f(LATIN, 20, idx=1)
    aw = d.textbbox((0, 0), ar_part, font=af)[2]
    sw = d.textbbox((0, 0), sep, font=sf)[2]
    uw = d.textbbox((0, 0), url, font=sf)[2]
    total = aw + sw + uw
    x = (W - total) // 2
    base_y = H - band_h + 28
    d2.text((x, base_y - 4), ar_part, font=af, fill=(255, 255, 255))
    d2.text((x + aw, base_y), sep, font=sf, fill=(255, 255, 255, 200))
    d2.text((x + aw + sw, base_y), url, font=sf, fill=(255, 255, 255))

    return img


def main() -> None:
    bg = make_background()
    en = render_en(bg)
    ar_img = render_ar(bg)
    en.save(OUT_DIR / "etienne-howto-feed-en.png")
    ar_img.save(OUT_DIR / "etienne-howto-feed-ar.png")
    print("wrote:")
    print(" ", OUT_DIR / "etienne-howto-feed-en.png")
    print(" ", OUT_DIR / "etienne-howto-feed-ar.png")


if __name__ == "__main__":
    main()
