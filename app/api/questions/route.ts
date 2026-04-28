import { NextRequest, NextResponse } from "next/server";
import { getQuestions, setQuestions } from "@/lib/serverStore";
import type { Question, Stage } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authed(token: string | null): boolean {
  const required = process.env.ADMIN_TOKEN || "etienne-admin";
  return Boolean(token && token === required);
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("admin");
  if (!authed(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const questions = await getQuestions();
  return NextResponse.json({ questions });
}

export async function POST(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("admin");
  if (!authed(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const list = await getQuestions();

  if (body.action === "delete") {
    const id = String(body.id ?? "");
    const next = list.filter((q) => q.id !== id);
    await setQuestions(next);
    return NextResponse.json({ ok: true, count: next.length });
  }

  if (body.action === "create" || body.action === "update") {
    const q = body.question as Question;
    if (!q || typeof q.prompt !== "string" || !Array.isArray(q.options)) {
      return NextResponse.json({ error: "Invalid question" }, { status: 400 });
    }
    const cleaned: Question = {
      id: q.id || crypto.randomUUID(),
      stage: ((q.stage as Stage) ?? 1) as Stage,
      prompt: q.prompt.trim().slice(0, 280),
      options: q.options.map((o) => String(o).trim().slice(0, 140)).slice(0, 4),
      answer: Math.max(0, Math.min(3, Number(q.answer) || 0)),
      trait: q.trait,
    };
    while (cleaned.options.length < 4) cleaned.options.push("");
    const idx = list.findIndex((x) => x.id === cleaned.id);
    if (idx >= 0) list[idx] = cleaned;
    else list.push(cleaned);
    await setQuestions(list);
    return NextResponse.json({ ok: true, question: cleaned });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
