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
    so the bottles sit in the lower portion of the canvas, then lay
    text over the dark upper region — the photo IS the dark backdrop,
    no extra fill needed beyond a soft gradient that strengthens text
    contrast.

    Bottles peek out at the bottom so the post reads as "look at the
    product" + "play the quiz" in a single frame.

Dependencies:
    pip install Pillow arabic_reshaper python-bidi
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import arabic_reshaper
from bidi.algorithm import get_display
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PHOTO = Path(__file__).resolve().parent / "etienne-discovery-photo.jpeg"
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
    """Scale + crop the source photo to fill 1080×1350, biased toward
    the bottom so the bottles stay visible. Apply a top→middle dark
    gradient so text reads cleanly over the fabric area."""
    src = Image.open(PHOTO).convert("RGB")
    sw, sh = src.size

    # Scale to cover 1080 wide
    scale = W / sw
    new_w = int(sw * scale)
    new_h = int(sh * scale)
    src = src.resize((new_w, new_h), Image.LANCZOS)

    # Crop top so bottles end up at the bottom of the frame
    overflow = new_h - H
    if overflow > 0:
        src = src.crop((0, overflow, new_w, new_h))
    elif overflow < 0:
        # Pad below with black if photo is shorter than canvas
        canvas = Image.new("RGB", (W, H), (0, 0, 0))
        canvas.paste(src, (0, 0))
        src = canvas

    # Slight cool tone tweak — photo is already dark, just darken upper
    # third for text legibility.
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    # Vertical gradient: black → transparent over top 70% of canvas.
    grad_h = int(H * 0.62)
    for y in range(grad_h):
        a = int(180 * (1 - y / grad_h))  # 180 at top → 0 at fade-out
        od.line([(0, y), (W, y)], fill=(0, 0, 0, a))

    src = src.convert("RGBA")
    src = Image.alpha_composite(src, overlay)
    return src.convert("RGB")


def draw_centered(d: ImageDraw.ImageDraw, text: str, y: int, font, fill) -> None:
    bb = d.textbbox((0, 0), text, font=font)
    d.text(((W - (bb[2] - bb[0])) // 2, y), text, font=font, fill=fill)


def render_en(bg: Image.Image) -> Image.Image:
    img = bg.copy()
    d = ImageDraw.Draw(img, "RGBA")

    # ETIENNE wordmark
    draw_centered(d, " ".join(list("ETIENNE")), 110, f(LATIN, 36, idx=1), (255, 255, 255))
    draw_centered(d, "T H E   Q U I Z", 168, f(LATIN, 16, idx=0), (255, 255, 255, 170))

    # hairline
    d.line([(W // 2 - 40, 220), (W // 2 + 40, 220)], fill=(255, 255, 255, 150))

    # hero — bigger, sits in the dark fabric upper half
    draw_centered(d, "Find your", 290, f(LATIN, 92, idx=1), (255, 255, 255))
    draw_centered(d, "signature.", 400, f(LATIN, 92, idx=1), (255, 255, 255))

    # caption
    draw_centered(d, "A 10-question scent quiz",
                  528, f(LATIN, 26), (255, 255, 255, 200))

    # CTA strip at the very bottom — thin dark band keeps the URL
    # legible regardless of which bottle sits behind it.
    band_h = 84
    band = Image.new("RGBA", (W, band_h), (0, 0, 0, 230))
    img.paste(band, (0, H - band_h), band)
    d2 = ImageDraw.Draw(img, "RGBA")
    draw_centered(d2, "PLAY  ·  GAME.ETIENNEPERFUMES.COM",
                  H - band_h + 30, f(LATIN, 22, idx=1), (255, 255, 255))

    return img


def render_ar(bg: Image.Image) -> Image.Image:
    img = bg.copy()
    d = ImageDraw.Draw(img, "RGBA")

    # ETIENNE wordmark (Latin)
    draw_centered(d, " ".join(list("ETIENNE")), 110, f(LATIN, 36, idx=1),
                  (255, 255, 255))
    # Arabic kicker
    draw_centered(d, ar("الاختبار"), 168, f(AR_FONT, 26), (255, 255, 255, 170))

    d.line([(W // 2 - 40, 220), (W // 2 + 40, 220)], fill=(255, 255, 255, 150))

    # hero
    draw_centered(d, ar("اكتشف"), 290, f(AR_FONT, 92), (255, 255, 255))
    draw_centered(d, ar("بصمتك."), 410, f(AR_FONT, 110), (255, 255, 255))

    # caption
    draw_centered(d, ar("اختبار عطور من ١٠ أسئلة"), 560, f(AR_FONT, 30),
                  (255, 255, 255, 200))

    # CTA band — Arabic words + Latin URL, both centered
    band_h = 84
    band = Image.new("RGBA", (W, band_h), (0, 0, 0, 230))
    img.paste(band, (0, H - band_h), band)
    d2 = ImageDraw.Draw(img, "RGBA")
    ar_part = ar("العب الآن")
    sep = "  ·  "
    url = "GAME.ETIENNEPERFUMES.COM"
    af = f(AR_FONT, 26)
    sf = f(LATIN, 22, idx=1)
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
