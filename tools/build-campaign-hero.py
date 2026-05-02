#!/usr/bin/env python3
"""
Campaign — HERO POST.

Cinematic, dark, high-contrast, product-centred. The Discovery Kit
photograph anchors the frame; type stays minimal, restrained, IBM Plex
Sans throughout. Aesthetic reference: Le Labo / Maison Margiela
Replica / Byredo — clinical labels, generous negative space, subtle
hierarchy, no advertising-loud headlines.

Output:
    public/share/campaign-hero-en.png   (1080×1350, 4:5 IG feed)

Layout (top→bottom):
    - product photograph (top ~62%) — bottles in lower portion of photo
    - thin hairline divider over a dark band
    - small caps eyebrow      "ETIENNE — THE GAME"
    - editorial spaced lockup "PLAY · SCORE · WIN"
    - italic body line        "Top scores unlock exclusive fragrance sets"
    - bottom rule + URL       "GAME.ETIENNEPERFUMES.COM"
"""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PHOTO = ROOT / "tools" / "etienne-discovery-photo.jpeg"
FONTS = ROOT / "tools" / "fonts"
WORDMARK = ROOT / "public" / "brand" / "etienne-wordmark-white@2x.png"
OUT = ROOT / "public" / "share" / "campaign-hero-en.png"
OUT.parent.mkdir(parents=True, exist_ok=True)

W, H = 1080, 1350


def plex(weight: int, size: int, italic: bool = False) -> ImageFont.FreeTypeFont:
    suffix = "-italic" if italic else ""
    return ImageFont.truetype(str(FONTS / f"plex-{weight}{suffix}.ttf"), size)


def make_canvas() -> Image.Image:
    """Photo fills the top 62% of the canvas; bottom 38% is solid black
    for the type lockup. The bottles in the source image already sit at
    the bottom of the photo, so we pin the photo's bottom to the
    photo-zone's bottom — bottles end up exactly at the dark/photo seam."""
    photo_h = int(H * 0.62)
    canvas = Image.new("RGB", (W, H), (0, 0, 0))

    src = Image.open(PHOTO).convert("RGB")
    sw, sh = src.size

    # Scale to fill width
    scale = W / sw
    new_w = W
    new_h = int(sh * scale)
    src = src.resize((new_w, new_h), Image.LANCZOS)

    # Crop the source so its bottom aligns with photo_h. We keep the
    # bottles in frame by cropping from the TOP only.
    if new_h > photo_h:
        src = src.crop((0, new_h - photo_h, new_w, new_h))
    else:
        # If somehow shorter, place at bottom of photo zone
        canvas.paste(src, (0, photo_h - new_h))
        src = None
    if src is not None:
        canvas.paste(src, (0, 0))

    # Cinematic vignette — subtle darkening from edges
    vig = Image.new("RGBA", (W, photo_h), (0, 0, 0, 0))
    vd = ImageDraw.Draw(vig)
    # left + right vignette
    for x in range(140):
        a = int(70 * (1 - x / 140))
        vd.line([(x, 0), (x, photo_h)], fill=(0, 0, 0, a))
        vd.line([(W - 1 - x, 0), (W - 1 - x, photo_h)], fill=(0, 0, 0, a))
    canvas_rgba = canvas.convert("RGBA")
    canvas_rgba.paste(vig, (0, 0), vig)

    # Soft fade between photo and dark type zone — 80px blend band so
    # there isn't a hard horizontal edge.
    blend = Image.new("RGBA", (W, 80), (0, 0, 0, 0))
    bd = ImageDraw.Draw(blend)
    for y in range(80):
        a = int(255 * (y / 80))
        bd.line([(0, y), (W, y)], fill=(0, 0, 0, a))
    canvas_rgba.paste(blend, (0, photo_h - 30), blend)

    return canvas_rgba.convert("RGB"), photo_h


def draw_centered(d, text, y, font, fill, tracking_em: float = 0):
    """Draw centred text. tracking_em > 0 spreads letters out by
    inserting micro-pixel gaps via a per-letter draw — gives editorial
    'spaced caps' feel without depending on font OpenType features."""
    if tracking_em == 0:
        bb = d.textbbox((0, 0), text, font=font)
        d.text(((W - (bb[2] - bb[0])) // 2, y), text, font=font, fill=fill)
        return

    # Per-letter rendering with extra spacing
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


def paste_wordmark(img: Image.Image, target_height: int, top: int) -> None:
    """Centre the actual ETIENNE wordmark PNG (white-on-transparent),
    scaled to the requested height."""
    mark = Image.open(WORDMARK).convert("RGBA")
    mw, mh = mark.size
    scale = target_height / mh
    new_w = int(mw * scale)
    mark = mark.resize((new_w, target_height), Image.LANCZOS)
    img.paste(mark, ((W - new_w) // 2, top), mark)


def main() -> None:
    img, photo_h = make_canvas()

    # ---- divider above the type stack ---------------------------------
    rule_y = photo_h + 56
    d = ImageDraw.Draw(img, "RGBA")
    d.line([(W // 2 - 22, rule_y), (W // 2 + 22, rule_y)],
           fill=(255, 255, 255, 200))

    # ---- ETIENNE logo (wordmark image) — gets its own moment ---------
    # Replaces the letter-spaced 'ETIENNE' text. The stylised cut-through
    # E's and decorative I make the brand mark instantly recognisable
    # at IG-feed scale.
    paste_wordmark(img, target_height=44, top=rule_y + 28)
    d = ImageDraw.Draw(img, "RGBA")

    # ---- eyebrow: THE GAME -------------------------------------------
    draw_centered(d, "THE GAME",
                  rule_y + 96, plex(500, 14), (255, 255, 255, 200),
                  tracking_em=0.42)

    # ---- main lockup: PLAY · SCORE · WIN -----------------------------
    draw_centered(d, "PLAY  ·  SCORE  ·  WIN",
                  rule_y + 142, plex(500, 48), (255, 255, 255, 255),
                  tracking_em=0.18)

    # ---- italic body line --------------------------------------------
    draw_centered(d,
                  "Top scores win exclusive fragrance sets.",
                  rule_y + 222, plex(400, 22, italic=True),
                  (255, 255, 255, 175))

    # ---- bottom rule + URL -------------------------------------------
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
