# Etienne — Find Your Signature

A premium, mobile-first trivia experience for **Etienne Perfumes**. Players choose a challenge, move through three stages of scent trivia under a live countdown, and are matched with a signature Etienne perfume on a share-ready results screen. A floating **Scent Guide** (Claude-powered) answers questions in the brand's voice.

Built with **Next.js 14 (App Router) + TypeScript + Tailwind + Framer Motion**. Persistence is JSON files under `data/` so the project runs locally with zero infrastructure.

## Getting started

```bash
cd etienne-trivia
npm install
cp .env.example .env.local   # optional — set ANTHROPIC_API_KEY for live AI
npm run dev
# open http://localhost:3000 — open DevTools → device toolbar → iPhone for the intended experience
```

The Scent Guide works without an API key (falls back to a curated response system). Setting `ANTHROPIC_API_KEY` in `.env.local` upgrades it to live Claude conversations with prompt caching on the brand knowledge block.

## What's inside

| Route | What it is |
| --- | --- |
| `/` | Landing — hero, "Play Now" portal, three-pillar promise |
| `/play` | Challenge selection (Quick / Classic / Master) |
| `/game` | Trivia gameplay — animated transitions, ring timer, stage intros |
| `/results` | Score animation, performance level, signature perfume match, save-score, share card, replay actions |
| `/leaderboard` | Top scores |
| `/admin` | Add/edit/delete questions, manage stages, view leaderboard, export CSV, manage campaign code |

| API | What it does |
| --- | --- |
| `POST /api/chat` | Etienne Scent Guide — Claude with prompt-cached system, falls back gracefully |
| `GET  /api/leaderboard` | Public top scores |
| `POST /api/score` | Submit a score |
| `GET  /api/questions?admin=…` | Admin: list questions |
| `POST /api/questions?admin=…` | Admin: create / update / delete |

## Game mechanics

- **Three stages**: Scent Basics → Etienne Discovery → Master of Scent.
- **Timer**: 20s / 15s / 10s per stage, with elegant ring countdown.
- **Scoring**: stage-weighted base + diminishing time bonus, so faster confident answers score higher.
- **Signature match**: each question carries a *trait* tag (`fresh`, `warm`, `sensual`, `clean`, `soft`, `free`, `refined`, `curious`). Correct answers accumulate trait scores; the matcher computes a normalised similarity against each perfume's trait weights and selects the closest. High-accuracy plays nudge toward the **Etienne** signature; low-engagement plays land on the **Discovery Kit**.
- **Performance level**: `Master of Scent` ≥ 90%, `Connoisseur` ≥ 70%, `Explorer` ≥ 50%, otherwise `Curious Beginner`.

## Brand notes

- Palette: cream `#F4EFE6`, beige `#E5DBC9`, ink `#1B1714`, soft gold `#C9A66B`, warm brown `#9C7A4F`.
- Fonts: Cormorant Garamond (display) + Inter (body) loaded from Google Fonts.
- Subtle film-grain texture on the body, hairline gold dividers, gold-ring borders on featured tiles.
- Bottle silhouette + share card are SVG/HTML — no external image assets required.

## Admin

Visit `/admin`, enter the token. In dev (no env var set), the token is `etienne-admin`. Add `ADMIN_TOKEN=…` to `.env.local` to override.

## Adding more questions

Either:

1. Use the in-app `/admin` editor (writes to `data/questions.json`), or
2. Hand-edit `data/questions.json` — each entry is `{ id, stage, prompt, options[4], answer, trait? }`.

There are 60 sample questions across three stages — well above the 50-question minimum.

## Tech notes

- The share card is rendered offscreen at full Instagram-story dimensions (1080 × 1920) and exported via `html-to-image`. On iOS Safari it triggers the native share sheet; on desktop it downloads the PNG.
- All player state (current round, last result, profile name/handle) persists in `localStorage`, so refreshes never lose progress.
- The chat route uses Claude Haiku 4.5 (`claude-haiku-4-5-20251001`) for fast, cheap responses, with `cache_control: ephemeral` on the brand knowledge block so repeat conversations only pay full-token cost once.
