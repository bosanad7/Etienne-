import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { PERFUMES } from "@/lib/perfumes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface InMsg {
  role: "user" | "assistant";
  content: string;
}

const HOUSE_KNOWLEDGE = `You are the **Etienne Scent Guide** — the in-house concierge for Etienne Perfumes.

Brand voice:
- Elegant, warm, modern, minimal. Confident without bragging. Short sentences. A touch of poetry.
- Speak like a sommelier who actually wants you to enjoy the wine. Never childish. Never salesy.
- 1–3 short paragraphs maximum, OR a tight list of 2–4 bullets. Never both.
- Use specific scent language ("powdery", "salted", "dry-down") instead of generic adjectives.

Rules:
- Only answer questions about: Etienne perfumes, fragrance & scent (notes, families, layering, gifting, occasions, care), and helping the user understand their quiz result.
- If asked about anything outside that scope, gently redirect: acknowledge the question in one short line, then offer something scent-related that fits the user's mood.
- Never invent perfumes outside the seven listed below. Never invent prices, ingredients, or claims.
- If the user shares a quiz result in context, weave it in naturally. Do not robotically restate it.

The Etienne house — seven products:

${PERFUMES.map(
  (p) => `• **${p.name}** — _${p.tagline}_
  Description: ${p.description}
  Top: ${p.notes.top.join(", ")} | Heart: ${p.notes.heart.join(", ")} | Base: ${p.notes.base.join(", ")}
  Mood: ${p.mood.join(", ")}.`
).join("\n\n")}

Pairing intuition (use, don't recite):
- Fresh & energetic → River
- Sun, salt, openness → Tidal
- Soft, tender, second-skin → Wild Cotton
- Pressed, polished, daytime polish → Linen
- Sensual, slow, candlelit → After Hours
- Confident signature, woody-amber → Etienne
- Curious, undecided, gifting an explorer → Discovery Kit

Format:
- Address the user warmly but directly. No "Hello, dear customer" — just speak.
- Avoid emojis. Avoid exclamation points unless the user used one first.
- End with one specific next step (a perfume to try, a question to clarify their mood) when natural — never required.`;

function fallbackReply(messages: InMsg[], context: unknown): string {
  const last = messages[messages.length - 1]?.content?.toLowerCase() ?? "";

  // Build a simple keyword-driven response so the assistant still works
  // even without an ANTHROPIC_API_KEY set.
  const matches: string[] = [];
  for (const p of PERFUMES) {
    if (last.includes(p.name.toLowerCase()) || last.includes(p.slug)) matches.push(p.name);
  }
  if (matches.length) {
    const p = PERFUMES.find(
      (x) => x.name.toLowerCase() === matches[0].toLowerCase()
    )!;
    return `${p.name} — ${p.tagline}\n\n${p.description}\n\nMood: ${p.mood.join(", ")}.`;
  }

  if (/(gift|present|birthday|mother|father|partner)/.test(last)) {
    return "For a curious gift, the Discovery Kit is the warmest entry — six miniatures of the house in a felt-lined case. If you know the recipient leans soft and tender, Wild Cotton is a quiet love letter. If they own the room, Etienne signature.";
  }
  if (/(fresh|summer|hot|aquatic|citrus|clean)/.test(last)) {
    return "If you want fresh, two paths: River (fig leaf, mint, white musk — bright and kinetic) or Tidal (sea salt, neroli, driftwood — slower, more sun-warmed). Linen is the cleanest of the three — pressed cotton in a bottle.";
  }
  if (/(dark|night|sensual|date|evening|warm|oud)/.test(last)) {
    return "After Hours is built for that — dark plum, damask rose, smoked oud and vanilla. Slow, magnetic, made for low light. If you want it without the smoke, Etienne signature carries the warmth in a more polished frame.";
  }
  if (/(result|score|match|signature|quiz)/.test(last) && context) {
    try {
      const c = context as { perfume?: { name?: string; tagline?: string }; level?: { title?: string } };
      const name = c.perfume?.name ?? "your match";
      const line = c.perfume?.tagline ?? "";
      const lvl = c.level?.title ?? "";
      return `Your quiz placed you at ${lvl}. ${name}${line ? ` — ${line}` : ""} reflects what you answered: confident on the choices that matter, generous on the ones that mattered less. Wear it on skin for an hour before judging — it's the dry-down that tells the truth.`;
    } catch {}
  }
  return "I'm here for fragrance. Tell me a mood, a moment, or a person to dress in scent — and I'll point you to the right Etienne.";
}

/**
 * Server-side gate matching the layout's UI gate. When the env flag is
 * off (default at launch) we 503 the endpoint so a direct curl can't
 * bill Anthropic — even though the floating UI is hidden, the endpoint
 * URL would otherwise still be reachable.
 *
 *   Re-enable: set NEXT_PUBLIC_SCENT_GUIDE_ENABLED=true in Vercel and
 *   redeploy. The same flag controls UI visibility too.
 */
function chatEnabled(): boolean {
  return process.env.NEXT_PUBLIC_SCENT_GUIDE_ENABLED === "true";
}

export async function POST(req: NextRequest) {
  if (!chatEnabled()) {
    return NextResponse.json(
      { error: "Scent Guide is currently unavailable." },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  const body = await req.json().catch(() => ({}));
  const messages: InMsg[] = Array.isArray(body.messages) ? body.messages : [];
  const context = body.context;

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return NextResponse.json({ reply: fallbackReply(messages, context) });
  }

  try {
    const client = new Anthropic({ apiKey: key });
    const sys: Array<{
      type: "text";
      text: string;
      cache_control?: { type: "ephemeral" };
    }> = [
      {
        type: "text",
        text: HOUSE_KNOWLEDGE,
        cache_control: { type: "ephemeral" },
      },
    ];
    if (context) {
      sys.push({
        type: "text",
        text: `Player's quiz result (use as context, never recite verbatim):\n${JSON.stringify(
          context
        ).slice(0, 1500)}`,
      });
    }

    const safeMsgs = messages
      .filter((m) => m && (m.role === "user" || m.role === "assistant"))
      .slice(-8)
      .map((m) => ({
        role: m.role,
        content: String(m.content ?? "").slice(0, 1500),
      }));

    const resp = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 350,
      system: sys,
      messages: safeMsgs,
    });

    const reply =
      resp.content
        .map((b) => (b.type === "text" ? b.text : ""))
        .join("\n")
        .trim() || "I'm here when you'd like to talk.";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("chat error", err);
    return NextResponse.json({ reply: fallbackReply(messages, context) });
  }
}
