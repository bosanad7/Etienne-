#!/usr/bin/env python3
"""
Boost stories — two IG Stories (1080×1920) to drive the second wave of plays.

Aesthetic: clinical scoreboard meets niche fragrance counter. Pure black,
IBM Plex Sans, hairline rules, a single restrained gold accent. Le Labo /
Byredo / Bloomberg-terminal restraint. No gradients, no drop shadows, no
buttons that look like buttons.

Outputs:
    public/share/story-boost-leaderboard.png   1080×1920
    public/share/story-boost-highlights.png    1080×1920

Live data is read at build time from the production leaderboard, so the
numbers are correct at the moment you generate the asset.
"""
from __future__ import annotations

import json
import urllib.request
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
FONTS = ROOT / "tools" / "fonts"
WORDMARK = ROOT / "public" / "brand" / "etienne-wordmark-white@2x.png"
OUT_DIR = ROOT / "public" / "share"
OUT_DIR.mkdir(parents=True, exist_ok=True)

W, H = 1080, 1920

# ── Palette ───────────────────────────────────────────────────────────────
BG = (0, 0, 0)
INK = (242, 238, 230)        # off-white body
DIM = (122, 117, 110)        # mid-grey eyebrow / labels
HAIR = (40, 38, 33)           # hairline rule
GOLD = (217, 183, 121)        # single accent — D9B779

PERFUMES = {
    "etienne": "Etienne",
    "river": "River",
    "tidal": "Tidal",
    "wild-cotton": "Wild Cotton",
    "linen": "Linen",
    "after-hours": "After Hours",
    "discovery-kit": "Discovery Kit",
}


def plex(weight: int, size: int, italic: bool = False) -> ImageFont.FreeTypeFont:
    suffix = "-italic" if italic else ""
    return ImageFont.truetype(str(FONTS / f"plex-{weight}{suffix}.ttf"), size)


def fetch_live() -> dict:
    url = "https://game.etienneperfumes.com/api/leaderboard?limit=1000"
    with urllib.request.urlopen(url, timeout=10) as r:
        return json.loads(r.read().decode())


def draw_tracked(
    draw: ImageDraw.ImageDraw,
    xy: tuple[int, int],
    text: str,
    font: ImageFont.FreeTypeFont,
    fill: tuple[int, int, int],
    tracking: int = 0,
    anchor: str = "lt",
) -> int:
    """Draw text with letter-spacing. Returns total width painted.
    `anchor` supports lt (default), lm, mm, rt, rm — like PIL anchors but
    we implement ourselves so tracking is correct.
    """
    x, y = xy
    if not text:
        return 0
    glyphs = []
    total_w = 0
    for ch in text:
        bbox = font.getbbox(ch)
        gw = bbox[2] - bbox[0]
        glyphs.append((ch, gw))
        total_w += gw
    total_w += tracking * (len(text) - 1)

    # Adjust x for horizontal anchor
    if anchor[0] == "m":
        x -= total_w // 2
    elif anchor[0] == "r":
        x -= total_w
    # vertical anchor
    if len(anchor) > 1 and anchor[1] == "m":
        # use ascent/descent from font metrics
        ascent, descent = font.getmetrics()
        y -= (ascent + descent) // 2

    cursor = x
    for ch, gw in glyphs:
        draw.text((cursor, y), ch, font=font, fill=fill)
        cursor += gw + tracking
    return total_w


def hairline(draw: ImageDraw.ImageDraw, y: int, x0: int = 80, x1: int = W - 80, color=HAIR) -> None:
    draw.line([(x0, y), (x1, y)], fill=color, width=2)


def paste_wordmark(canvas: Image.Image, y: int, target_w: int = 200) -> None:
    wm = Image.open(WORDMARK).convert("RGBA")
    sw, sh = wm.size
    scale = target_w / sw
    wm = wm.resize((target_w, int(sh * scale)), Image.LANCZOS)
    # Slight reduction in opacity for editorial restraint
    alpha = wm.split()[3]
    alpha = alpha.point(lambda p: int(p * 0.92))
    wm.putalpha(alpha)
    x = (W - target_w) // 2
    canvas.paste(wm, (x, y), wm)


def add_grain(canvas: Image.Image, strength: int = 6) -> Image.Image:
    """Subtle film grain. Only over dark regions — keeps the type crisp."""
    import random
    px = canvas.load()
    random.seed(7)
    for y in range(0, H, 2):
        for x in range(0, W, 2):
            r, g, b = px[x, y]
            n = random.randint(-strength, strength)
            px[x, y] = (
                max(0, min(255, r + n)),
                max(0, min(255, g + n)),
                max(0, min(255, b + n)),
            )
    return canvas


# ────────────────────────────────────────────────────────────────────────
# STORY 1 — RUNNING SCOREBOARD
# ────────────────────────────────────────────────────────────────────────
def build_leaderboard_story(data: dict) -> Path:
    entries = sorted(data["entries"], key=lambda x: -x["score"])[:5]

    canvas = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(canvas)

    # ── Header zone ───────────────────────────────────────────────
    paste_wordmark(canvas, y=170, target_w=220)

    # Live indicator: gold dot + LIVE label, centred
    y = 320
    dot_r = 7
    label = "LIVE  —  TOP FIVE"
    f_label = plex(500, 24)
    label_w = sum(f_label.getbbox(c)[2] - f_label.getbbox(c)[0] for c in label) + 320 * (len(label) - 1) // 100
    # Just compute via draw_tracked twice — once for measurement
    # We'll center by computing label width with tracking
    tracking = 4
    total = sum(f_label.getbbox(c)[2] - f_label.getbbox(c)[0] for c in label) + tracking * (len(label) - 1)
    block_w = dot_r * 2 + 22 + total
    start_x = (W - block_w) // 2
    cy = y + 12
    draw.ellipse(
        [(start_x, cy - dot_r), (start_x + dot_r * 2, cy + dot_r)],
        fill=GOLD,
    )
    draw_tracked(draw, (start_x + dot_r * 2 + 22, y), label, f_label, DIM, tracking=tracking)

    # ── Editorial display — two-line lockup ────────────────────────
    y = 410
    f_disp = plex(400, 110)
    draw_tracked(draw, (W // 2, y), "THE", f_disp, INK, tracking=14, anchor="mt")
    draw_tracked(draw, (W // 2, y + 130), "LEADERBOARD", f_disp, INK, tracking=14, anchor="mt")

    # Italic supporting line
    y_sub = y + 290
    f_it = plex(400, 32, italic=True)
    draw_tracked(draw, (W // 2, y_sub), "running now — be on it.", f_it, DIM, tracking=2, anchor="mt")

    # ── Hairline above the table ───────────────────────────────────
    table_top = 850
    hairline(draw, table_top - 30)

    # ── Five rows: rank · handle · score ───────────────────────────
    f_rank = plex(500, 38)
    f_handle = plex(500, 42)
    f_score = plex(500, 56)
    f_hint = plex(400, 22, italic=True)

    row_h = 130
    pad_x = 90

    for i, e in enumerate(entries):
        ry = table_top + i * row_h + 24

        # Rank — gold for #1, dim for the rest
        rank_color = GOLD if i == 0 else DIM
        draw_tracked(draw, (pad_x, ry + 22), f"{i+1:02d}", f_rank, rank_color, tracking=4)

        # Handle — full IG handle, tracked subtly
        handle = e["handle"]
        if len(handle) > 22:
            handle = handle[:22] + "…"
        draw_tracked(draw, (pad_x + 110, ry + 18), handle, f_handle, INK, tracking=1)

        # Score — right-aligned, tabular feel, subtle gold for the leader
        score_color = GOLD if i == 0 else INK
        score_text = f"{e['score']:,}"
        draw_tracked(
            draw,
            (W - pad_x, ry + 8),
            score_text,
            f_score,
            score_color,
            tracking=2,
            anchor="rt",
        )

        # Faint perfume label under the handle
        perfume_label = PERFUMES.get(e.get("perfume", ""), "—").upper()
        draw_tracked(draw, (pad_x + 110, ry + 78), perfume_label, f_hint, DIM, tracking=6)

        # Hairline under each row except the last
        if i < len(entries) - 1:
            hairline(draw, ry + row_h - 18)

    # ── Footer block — total + CTA ─────────────────────────────────
    total_players = len(data["entries"])
    foot_y = table_top + 5 * row_h + 90
    hairline(draw, foot_y - 50)

    f_meta = plex(400, 24)
    draw_tracked(
        draw,
        (W // 2, foot_y),
        f"{total_players} PLAYING  —  ONE TRY EACH",
        f_meta,
        DIM,
        tracking=8,
        anchor="mt",
    )

    # Big CTA italic
    f_cta = plex(400, 40, italic=True)
    draw_tracked(draw, (W // 2, foot_y + 80), "Take the top spot.", f_cta, INK, tracking=2, anchor="mt")

    # Small URL
    f_url = plex(500, 26)
    draw_tracked(
        draw,
        (W // 2, foot_y + 180),
        "GAME.ETIENNEPERFUMES.COM",
        f_url,
        GOLD,
        tracking=10,
        anchor="mt",
    )

    canvas = add_grain(canvas, strength=4)

    out = OUT_DIR / "story-boost-leaderboard.png"
    canvas.save(out, "PNG", optimize=True)
    return out


# ────────────────────────────────────────────────────────────────────────
# STORY 2 — THE NUMBERS / HIGHLIGHTS
# ────────────────────────────────────────────────────────────────────────
def build_highlights_story(data: dict) -> Path:
    entries = sorted(data["entries"], key=lambda x: -x["score"])
    total = len(entries)
    top = entries[0] if entries else {"handle": "—", "score": 0}
    avg = round(sum(e["score"] for e in entries) / total) if total else 0

    from collections import Counter
    counts = Counter(e.get("perfume", "—") for e in entries)
    top_perfume_slug, top_perfume_n = counts.most_common(1)[0] if counts else ("—", 0)
    top_perfume_name = PERFUMES.get(top_perfume_slug, "—").upper()

    canvas = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(canvas)

    # ── Header ────────────────────────────────────────────────────
    paste_wordmark(canvas, y=170, target_w=220)

    # Eyebrow
    f_eye = plex(500, 24)
    draw_tracked(
        draw,
        (W // 2, 320),
        "THE GAME  —  IN MOTION",
        f_eye,
        DIM,
        tracking=8,
        anchor="mt",
    )

    # Display lockup
    f_disp = plex(400, 110)
    draw_tracked(draw, (W // 2, 410), "TODAY", f_disp, INK, tracking=14, anchor="mt")
    draw_tracked(draw, (W // 2, 540), "SO  FAR", f_disp, INK, tracking=14, anchor="mt")

    # Italic line under display
    f_it = plex(400, 32, italic=True)
    draw_tracked(
        draw,
        (W // 2, 700),
        "the running totals.",
        f_it,
        DIM,
        tracking=2,
        anchor="mt",
    )

    # ── Stats stack ───────────────────────────────────────────────
    stats = [
        (f"{total}", "PLAYERS COMPETING"),
        (f"{top['score']:,}", "TOP SCORE"),
        (top["handle"], "LEADING THE BOARD"),
        (top_perfume_name, f"MOST-MATCHED SCENT  —  {top_perfume_n}× SO FAR"),
    ]

    y = 870
    block_h = 200
    f_num = plex(500, 92)
    f_handle_num = plex(500, 64)  # smaller for handles since they're long
    f_label = plex(400, 22)

    pad_x = 90
    for i, (value, label) in enumerate(stats):
        sy = y + i * block_h
        # Top hairline of each block
        hairline(draw, sy)

        # Number / value — gold for the score, off-white otherwise
        is_handle = value.startswith("@")
        is_score = value.replace(",", "").isdigit()
        font = f_handle_num if is_handle else f_num
        # Gold accent only on the headline TOP SCORE number
        color = GOLD if is_score and value == f"{top['score']:,}" else INK

        draw_tracked(
            draw,
            (pad_x, sy + 36),
            value,
            font,
            color,
            tracking=2 if not is_handle else 1,
        )

        # Label — small caps right
        draw_tracked(
            draw,
            (W - pad_x, sy + 70),
            label,
            f_label,
            DIM,
            tracking=6,
            anchor="rt",
        )

    # Closing hairline under last block
    hairline(draw, y + len(stats) * block_h)

    # ── Footer CTA ────────────────────────────────────────────────
    foot_y = y + len(stats) * block_h + 70

    f_cta = plex(400, 40, italic=True)
    draw_tracked(
        draw,
        (W // 2, foot_y),
        "Seven perfumes. One is yours.",
        f_cta,
        INK,
        tracking=2,
        anchor="mt",
    )

    f_url = plex(500, 26)
    draw_tracked(
        draw,
        (W // 2, foot_y + 110),
        "GAME.ETIENNEPERFUMES.COM",
        f_url,
        GOLD,
        tracking=10,
        anchor="mt",
    )

    canvas = add_grain(canvas, strength=4)

    out = OUT_DIR / "story-boost-highlights.png"
    canvas.save(out, "PNG", optimize=True)
    return out


def main() -> None:
    print("→ fetching live leaderboard")
    data = fetch_live()
    print(f"  {len(data['entries'])} players in")

    p1 = build_leaderboard_story(data)
    print(f"✓ wrote {p1.relative_to(ROOT)}")

    p2 = build_highlights_story(data)
    print(f"✓ wrote {p2.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
