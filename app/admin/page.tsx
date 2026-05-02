"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import type { Question, ScoreEntry, Stage, Trait } from "@/lib/types";

const TRAITS: Trait[] = [
  "fresh",
  "warm",
  "sensual",
  "clean",
  "soft",
  "free",
  "refined",
  "curious",
];

interface Editing {
  id?: string;
  stage: Stage;
  prompt: string;
  options: string[];
  answer: number;
  trait?: Trait;
}

const empty = (): Editing => ({
  stage: 1,
  prompt: "",
  options: ["", "", "", ""],
  answer: 0,
  trait: undefined,
});

export default function Admin() {
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<"questions" | "leaderboard" | "campaign">("questions");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [leaderboard, setLeaderboard] = useState<ScoreEntry[]>([]);
  const [editing, setEditing] = useState<Editing>(empty());
  const [filter, setFilter] = useState<"all" | "1" | "2" | "3">("all");
  const [discount, setDiscount] = useState("");

  useEffect(() => {
    const t = sessionStorage.getItem("etienne.admin.token");
    if (t) {
      setToken(t);
      tryAuth(t);
    }
  }, []);

  async function tryAuth(t: string) {
    const res = await fetch("/api/questions?admin=" + encodeURIComponent(t));
    if (res.ok) {
      const data = await res.json();
      setQuestions(data.questions ?? []);
      setAuthed(true);
      sessionStorage.setItem("etienne.admin.token", t);
      const lb = await fetch("/api/leaderboard");
      const ldata = await lb.json();
      setLeaderboard(ldata.entries ?? []);
      const stored = localStorage.getItem("etienne.admin.discount");
      if (stored) setDiscount(stored);
    } else {
      sessionStorage.removeItem("etienne.admin.token");
      setAuthed(false);
      alert("Invalid token. Set ADMIN_TOKEN in your env (or use the dev fallback).");
    }
  }

  async function reload() {
    const res = await fetch("/api/questions?admin=" + encodeURIComponent(token));
    const data = await res.json();
    setQuestions(data.questions ?? []);
  }

  async function save() {
    if (!editing.prompt.trim() || editing.options.some((o) => !o.trim())) {
      alert("Fill the prompt and all four options.");
      return;
    }
    const body = {
      action: editing.id ? "update" : "create",
      question: { ...editing, id: editing.id ?? crypto.randomUUID() },
    };
    const res = await fetch(`/api/questions?admin=${encodeURIComponent(token)}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setEditing(empty());
      reload();
    } else {
      alert("Save failed.");
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this question?")) return;
    await fetch(`/api/questions?admin=${encodeURIComponent(token)}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "delete", id }),
    });
    reload();
  }

  function exportCsv() {
    if (leaderboard.length === 0) return;
    const headers = ["name", "handle", "score", "challenge", "perfume", "createdAt"];
    const rows = leaderboard.map((e) =>
      [
        csv(e.name),
        csv(e.handle ?? ""),
        e.score,
        e.challenge,
        e.perfume,
        new Date(e.createdAt).toISOString(),
      ].join(",")
    );
    const blob = new Blob([[headers.join(","), ...rows].join("\n")], {
      type: "text/csv",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "etienne-leaderboard.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = useMemo(() => {
    if (filter === "all") return questions;
    return questions.filter((q) => String(q.stage) === filter);
  }, [questions, filter]);

  if (!authed) {
    return (
      <section className="px-6 pt-8 pb-12 min-h-[100dvh] flex flex-col">
        <header className="flex items-center justify-between">
          <Link href="/" className="text-[10px] tracking-[0.4em] uppercase text-ink/60">
            ← Home
          </Link>
          <Logo className="scale-75" />
          <span className="w-10" />
        </header>
        <div className="my-auto rounded-3xl tile p-6">
          <p className="text-[10px] tracking-[0.5em] uppercase text-ink/55">
            Admin Access
          </p>
          <h1 className="font-display text-3xl mt-2">House Atelier</h1>
          <p className="text-sm text-ink/70 mt-2">
            Enter the admin token to manage questions, the leaderboard, and the
            campaign code.
          </p>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Admin token"
            className="w-full mt-4 px-4 py-3 rounded-2xl bg-white/70 border border-ink/10 outline-none focus:border-ink/40 text-[15px]"
          />
          <button
            onClick={() => tryAuth(token)}
            className="btn-primary w-full mt-3"
          >
            Enter
          </button>
          <p className="text-[11px] text-ink/50 mt-3 leading-relaxed">
            Tip: set <code>ADMIN_TOKEN</code> in <code>.env.local</code>. In dev
            without one set, use <code>etienne-admin</code>.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-5 pt-6 pb-24 min-h-[100dvh]">
      <header className="flex items-center justify-between">
        <Link href="/" className="text-[10px] tracking-[0.4em] uppercase text-ink/60">
          ← Home
        </Link>
        <Logo className="scale-75" />
        <button
          onClick={() => {
            sessionStorage.removeItem("etienne.admin.token");
            setAuthed(false);
            setToken("");
          }}
          className="text-[10px] tracking-[0.4em] uppercase text-ink/60"
        >
          Sign out
        </button>
      </header>

      <h1 className="font-display text-4xl mt-6">Atelier</h1>

      <nav className="mt-4 flex gap-2 overflow-x-auto no-scrollbar">
        {(["questions", "leaderboard", "campaign"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-[11px] tracking-[0.3em] uppercase border ${
              tab === t
                ? "bg-ink text-cream border-ink"
                : "bg-white/60 border-ink/15 text-ink/70"
            }`}
          >
            {t}
          </button>
        ))}
      </nav>

      {tab === "questions" && (
        <>
          <div className="rounded-3xl tile p-5 mt-5">
            <p className="text-[10px] tracking-[0.4em] uppercase text-ink/55">
              {editing.id ? "Edit question" : "New question"}
            </p>
            <select
              className="mt-3 w-full px-3 py-2 rounded-xl border border-ink/15 bg-white/70 text-[14px]"
              value={editing.stage}
              onChange={(e) =>
                setEditing((s) => ({ ...s, stage: Number(e.target.value) as Stage }))
              }
            >
              <option value={1}>Stage 1 — Scent Basics</option>
              <option value={2}>Stage 2 — Etienne Discovery</option>
              <option value={3}>Stage 3 — Master of Scent</option>
            </select>
            <textarea
              className="mt-3 w-full px-3 py-2 rounded-xl border border-ink/15 bg-white/70 text-[14px] min-h-[80px]"
              value={editing.prompt}
              onChange={(e) => setEditing((s) => ({ ...s, prompt: e.target.value }))}
              placeholder="Question prompt"
            />
            {editing.options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => setEditing((s) => ({ ...s, answer: i }))}
                  className={`w-9 h-9 rounded-full text-[12px] grid place-items-center border ${
                    editing.answer === i
                      ? "bg-ink text-cream border-ink"
                      : "border-ink/20 text-ink/70"
                  }`}
                  aria-label={`Mark option ${"ABCD"[i]} correct`}
                >
                  {"ABCD"[i]}
                </button>
                <input
                  className="flex-1 px-3 py-2 rounded-xl border border-ink/15 bg-white/70 text-[14px]"
                  value={opt}
                  onChange={(e) =>
                    setEditing((s) => {
                      const opts = s.options.slice();
                      opts[i] = e.target.value;
                      return { ...s, options: opts };
                    })
                  }
                  placeholder={`Option ${"ABCD"[i]}`}
                />
              </div>
            ))}
            <select
              className="mt-3 w-full px-3 py-2 rounded-xl border border-ink/15 bg-white/70 text-[14px]"
              value={editing.trait ?? ""}
              onChange={(e) =>
                setEditing((s) => ({
                  ...s,
                  trait: (e.target.value || undefined) as Trait | undefined,
                }))
              }
            >
              <option value="">No trait weight</option>
              {TRAITS.map((t) => (
                <option key={t} value={t}>
                  Trait: {t}
                </option>
              ))}
            </select>
            <div className="flex gap-2 mt-4">
              <button onClick={save} className="btn-primary flex-1">
                {editing.id ? "Update" : "Add"}
              </button>
              {editing.id && (
                <button onClick={() => setEditing(empty())} className="btn-ghost">
                  Cancel
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <p className="text-[10px] tracking-[0.4em] uppercase text-ink/55">
              {questions.length} questions
            </p>
            <select
              className="px-3 py-1 rounded-full border border-ink/15 bg-white/70 text-[12px]"
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
            >
              <option value="all">All stages</option>
              <option value="1">Stage 1</option>
              <option value="2">Stage 2</option>
              <option value="3">Stage 3</option>
            </select>
          </div>

          <ul className="mt-3 space-y-2">
            {filtered.map((q) => (
              <li key={q.id} className="rounded-2xl tile p-4">
                <p className="text-[10px] tracking-[0.4em] uppercase text-ink/50">
                  Stage {q.stage} · {q.trait ?? "—"}
                </p>
                <p className="font-display text-lg mt-1">{q.prompt}</p>
                <p className="text-[12px] text-ink/65 mt-1">
                  Answer:{" "}
                  <span className="text-ink">
                    {"ABCD"[q.answer]}. {q.options[q.answer]}
                  </span>
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    className="btn-ghost"
                    onClick={() =>
                      setEditing({
                        id: q.id,
                        stage: q.stage,
                        prompt: q.prompt,
                        options: q.options.slice(),
                        answer: q.answer,
                        trait: q.trait,
                      })
                    }
                  >
                    Edit
                  </button>
                  <button className="btn-ghost" onClick={() => remove(q.id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {tab === "leaderboard" && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <p className="text-[10px] tracking-[0.4em] uppercase text-ink/55">
              {leaderboard.length} entries
            </p>
            <button onClick={exportCsv} className="btn-ghost">
              Export CSV
            </button>
          </div>
          <ul className="rounded-3xl tile divide-y divide-ink/10 overflow-hidden">
            {leaderboard.map((e, i) => (
              <li key={e.id} className="p-4 flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-ink/5 grid place-items-center text-[12px]">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-lg truncate">
                    {e.name}{" "}
                    {e.handle && (
                      <span className="text-ink/50 text-[12px]">
                        {e.handle.startsWith("@") ? e.handle : `@${e.handle}`}
                      </span>
                    )}
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-ink/55">
                    {e.challenge} · {e.perfume}
                  </p>
                </div>
                <p className="font-display text-xl">{e.score}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === "campaign" && (
        <div className="mt-6 rounded-3xl tile p-5">
          <p className="text-[10px] tracking-[0.4em] uppercase text-ink/55">
            Campaign code
          </p>
          <p className="text-[12px] text-ink/70 mt-1">
            Shown on the results screen. Stored locally for the demo.
          </p>
          <input
            value={discount}
            onChange={(e) => setDiscount(e.target.value.toUpperCase())}
            className="w-full mt-3 px-4 py-3 rounded-2xl bg-white/70 border border-ink/10 outline-none focus:border-ink/40 text-[15px]"
          />
          <button
            onClick={() => {
              localStorage.setItem("etienne.admin.discount", discount);
              alert("Saved.");
            }}
            className="btn-primary mt-3"
          >
            Save
          </button>
        </div>
      )}
    </section>
  );
}

function csv(v: string) {
  const needs = /[",\n]/.test(v);
  return needs ? `"${v.replace(/"/g, '""')}"` : v;
}
