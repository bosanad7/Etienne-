#!/usr/bin/env python3
"""
Campaign — HERO POST, Arabic.

Mirrors build-campaign-hero.py composition (cinematic dark, photo-
anchored, type stack below) with Arabic copy and IBM Plex Sans
Arabic — the official Plex Arabic companion to the Latin family,
preserving the same editorial voice.

Output:
    public/share/campaign-hero-ar.png   (1080×1350, 4:5 IG feed)
"""
from PIL import Image, ImageDraw, ImageFont
import arabic_reshaper
from bidi.algorithm import get_display
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PHOTO = ROOT / "tools" / "etienne-discovery-photo.jpeg"
FONTS = ROOT / "tools" / "fonts"
WORDMARK = ROOT / "public" / "brand" / "etienne-wordmark-white@2x.png"
OUT = ROOT / "public" / "share" / "campaign-hero-ar.png"
OUT.parent.mkdir(parents=True, exist_ok=True)

W, H = 1080, 1350


def plex(weight: int, size: int, italic: bool = False) -> ImageFont.FreeTypeFont:
    suffix = "-italic" if italic else ""
    return ImageFont.truetype(str(FONTS / f"plex-{weight}{suffix}.ttf"), size)


def plex_ar(weight: int, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(FONTS / f"plex-ar-{weight}.ttf"), size)


def ar(text: str) -> str:
    """Reshape + bidi-reorder so PIL renders Arabic glyphs in the
    correct visual order with proper letter-joining forms."""
    return get_display(arabic_reshaper.reshape(text))


def make_canvas() -> tuple[Image.Image, int]:
    """Same composition as the EN hero — bottles bottom-aligned to the
    photo zone, soft side vignette, fade band into the type zone."""
    photo_h = int(H * 0.62)
    canvas = Image.new("RGB", (W, H), (0, 0, 0))

    src = Image.open(PHOTO).convert("RGB")
    sw, sh = src.size
    scale = W / sw
    new_w = W
    new_h = int(sh * scale)
    src = src.resize((new_w, new_h), Image.LANCZOS)

    if new_h > photo_h:
        src = src.crop((0, new_h - photo_h, new_w, new_h))
    canvas.paste(src, (0, 0))

    # Side vignette
    vig = Image.new("RGBA", (W, photo_h), (0, 0, 0, 0))
    vd = ImageDraw.Draw(vig)
    for x in range(140):
        a = int(70 * (1 - x / 140))
        vd.line([(x, 0), (x, photo_h)], fill=(0, 0, 0, a))
        vd.line([(W - 1 - x, 0), (W - 1 - x, photo_h)], fill=(0, 0, 0, a))
    canvas_rgba = canvas.convert("RGBA")
    canvas_rgba.paste(vig, (0, 0), vig)

    # Fade band photo→type
    blend = Image.new("RGBA", (W, 80), (0, 0, 0, 0))
    bd = ImageDraw.Draw(blend)
    for y in range(80):
        a = int(255 * (y / 80))
        bd.line([(0, y), (W, y)], fill=(0, 0, 0, a))
    canvas_rgba.paste(blend, (0, photo_h - 30), blend)

    return canvas_rgba.convert("RGB"), photo_h


def draw_centered(d, text, y, font, fill, tracking_em: float = 0):
    if tracking_em == 0:
        bb = d.textbbox((0, 0), text, font=font)
        d.text(((W - (bb[2] - bb[0])) // 2, y), text, font=font, fill=fill)
        return
    extra = int(font.size * tracking_em)
    widths = []
    for ch in text:
        bb = d.textbbox((0, 0), ch, font=font)
        widths.append(bb[2] - bb[0])
    total = sum(widths) + extra * (len(text) - 1)
    x = (W - total) // 2
    for i, ch in enumerate(text):
        d.text((x, y), ch, font=font, fill=fill)
        x += widths[i] + extra


def draw_centered_ar_with_latin(d, ar_text: str, latin_text: str, y: int,
                                 ar_font, latin_font, fill, sep: str = "  —  "):
    """Render '<latin> <sep> <ar>' centred, with the Latin segment in
    Plex Sans Latin and the Arabic segment in Plex Sans Arabic. Avoids
    relying on a single font's ability to shape both scripts at once."""
    ar_shaped = ar(ar_text)
    aw = d.textbbox((0, 0), ar_shaped, font=ar_font)[2]
    sw = d.textbbox((0, 0), sep, font=latin_font)[2]
    lw = d.textbbox((0, 0), latin_text, font=latin_font)[2]
    total = lw + sw + aw
    x = (W - total) // 2
    # Vertical alignment: nudge Arabic up a touch so x-heights align
    d.text((x, y), latin_text, font=latin_font, fill=fill)
    d.text((x + lw, y), sep, font=latin_font, fill=fill)
    d.text((x + lw + sw, y - 4), ar_shaped, font=ar_font, fill=fill)


def paste_wordmark(img: Image.Image, target_height: int, top: int) -> None:
    """Centre the ETIENNE wordmark PNG (white-on-transparent),
    scaled to the requested height."""
    mark = Image.open(WORDMARK).convert("RGBA")
    mw, mh = mark.size
    scale = target_height / mh
    new_w = int(mw * scale)
    mark = mark.resize((new_w, target_height), Image.LANCZOS)
    img.paste(mark, ((W - new_w) // 2, top), mark)


def main() -> None:
    img, photo_h = make_canvas()

    rule_y = photo_h + 56
    d = ImageDraw.Draw(img, "RGBA")
    d.line([(W // 2 - 22, rule_y), (W // 2 + 22, rule_y)],
           fill=(255, 255, 255, 200))

    # ETIENNE wordmark image — replaces the letter-spaced text version
    paste_wordmark(img, target_height=44, top=rule_y + 28)
    d = ImageDraw.Draw(img, "RGBA")

    # Eyebrow — اللعبة (Plex Arabic)
    draw_centered(d, ar("اللعبة"),
                  rule_y + 92, plex_ar(500, 20), (255, 255, 255, 220))

    # Hero — العب · سجّل · اربح
    # Plex Sans Arabic is missing U+00B7 (middle dot), U+2014 (em-dash)
    # and U+2022 (bullet) — they all rendered as tofu. We compose the
    # lockup manually: render each Arabic word in Plex AR, render the
    # dot separators in Plex Latin (which carries them cleanly), and
    # paint right-to-left from the centred lockup's right edge. Dot is
    # nudged down a couple of px so it sits on the Arabic baseline
    # rather than the Latin x-height.
    hero_words = ["العب", "سجّل", "اربح"]
    word_font = plex_ar(500, 60)
    sep_font = plex(400, 60)
    sep = " · "
    word_widths = []
    for w in hero_words:
        bb = d.textbbox((0, 0), ar(w), font=word_font)
        word_widths.append(bb[2] - bb[0])
    sep_w = d.textbbox((0, 0), sep, font=sep_font)[2]
    total_w = sum(word_widths) + sep_w * (len(hero_words) - 1)
    # First word sits on the RIGHT (read first in RTL), so paint from
    # the right edge inward.
    cursor = (W + total_w) // 2
    hero_y = rule_y + 138
    for i, word in enumerate(hero_words):
        ww = word_widths[i]
        cursor -= ww
        d.text((cursor, hero_y), ar(word), font=word_font, fill=(255, 255, 255))
        if i < len(hero_words) - 1:
            cursor -= sep_w
            d.text((cursor, hero_y + 6), sep, font=sep_font, fill=(255, 255, 255, 220))

    # Body line — تربح (win) replaces the previous تفتح (unlock) for a
    # punchier competitive verb that mirrors the EN 'win' more directly.
    draw_centered(
        d,
        ar("أعلى النتائج تربح طقم عطور حصري"),
        rule_y + 250,
        plex_ar(400, 26),
        (255, 255, 255, 180),
    )

    # Bottom rule + URL (stays Latin, letter-spaced)
    base_rule_y = H - 84
    d.line([(W // 2 - 22, base_rule_y), (W // 2 + 22, base_rule_y)],
           fill=(255, 255, 255, 130))
    draw_centered(d, "GAME.ETIENNEPERFUMES.COM",
                  base_rule_y + 26, plex(500, 14),
                  (255, 255, 255, 160), tracking_em=0.36)

    img.save(OUT)
    print("wrote", OUT)


if __name__ == "__main__":
    main()
