"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLang } from "@/components/LangProvider";

interface Msg {
  role: "user" | "assistant";
  text: string;
}

export default function ScentGuide() {
  const { t } = useLang();
  const welcome = useMemo<Msg>(
    () => ({ role: "assistant", text: t("guide_welcome") }),
    [t]
  );
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([welcome]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Refresh welcome message text when the language changes (only the seed,
  // not history, so user-typed messages stay).
  useEffect(() => {
    setMsgs((prev) =>
      prev.length === 1 && prev[0].role === "assistant"
        ? [welcome]
        : prev
    );
  }, [welcome]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [msgs, open]);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("etienne:open-guide", handler);
    return () => window.removeEventListener("etienne:open-guide", handler);
  }, []);

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || busy) return;
    setInput("");
    const next: Msg[] = [...msgs, { role: "user", text: content }];
    setMsgs(next);
    setBusy(true);

    let context: unknown = null;
    try {
      const raw = localStorage.getItem("etienne.result");
      if (raw) context = JSON.parse(raw);
    } catch {}

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.text })),
          context,
        }),
      });
      const data = await res.json();
      setMsgs((m) => [
        ...m,
        { role: "assistant", text: data.reply ?? t("guide_default") },
      ]);
    } catch {
      setMsgs((m) => [
        ...m,
        { role: "assistant", text: t("guide_error") },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {/* floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open Etienne Scent Guide"
        className="fixed z-50 bottom-5 right-5 w-14 h-14 rounded-full bg-white text-black grid place-items-center shadow-soft transition-transform hover:scale-105"
      >
        <span className="font-display text-xl">É</span>
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-white/80 animate-breathe" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed z-50 bottom-24 right-3 left-3 sm:left-auto sm:w-[380px] rounded-3xl bg-black/95 backdrop-blur-xl border border-white/10 shadow-soft overflow-hidden flex flex-col max-h-[78dvh]"
          >
            <header className="px-5 py-4 border-b border-white/8 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white text-black grid place-items-center font-display text-lg">
                É
              </div>
              <div>
                <p className="text-[10px] tracking-[0.4em] uppercase text-ink/50">
                  {t("guide_eyebrow")}
                </p>
                <p className="font-display text-xl text-ink leading-none">
                  {t("guide_title")}
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="ms-auto text-ink/45 hover:text-ink text-2xl leading-none transition-colors"
                aria-label={t("guide_close")}
              >
                ×
              </button>
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
              {msgs.map((m, i) => (
                <Bubble key={i} role={m.role}>
                  {m.text}
                </Bubble>
              ))}
              {busy && (
                <Bubble role="assistant">
                  <Dots />
                </Bubble>
              )}
            </div>

            <Suggestions onPick={(p) => send(p)} disabled={busy} />

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="border-t border-white/8 p-3 flex items-center gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("guide_input_placeholder")}
                dir="auto"
                className="flex-1 px-4 py-3 rounded-full bg-white/[0.04] border border-white/10 outline-none focus:border-white/40 text-[14px] text-ink placeholder:text-ink/35 transition-colors"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="btn-primary disabled:opacity-30 px-5"
              >
                {t("guide_send")}
              </button>
            </form>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

function Bubble({
  role,
  children,
}: {
  role: "user" | "assistant";
  children: React.ReactNode;
}) {
  const mine = role === "user";
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[82%] px-4 py-3 rounded-2xl text-[14px] leading-relaxed whitespace-pre-wrap ${
          mine
            ? "bg-white text-black rounded-br-sm"
            : "bg-white/[0.05] border border-white/10 text-ink rounded-bl-sm"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function Dots() {
  return (
    <span className="inline-flex gap-1">
      <Dot delay={0} />
      <Dot delay={0.15} />
      <Dot delay={0.3} />
    </span>
  );
}
function Dot({ delay }: { delay: number }) {
  return (
    <motion.span
      className="w-1.5 h-1.5 rounded-full bg-white/55 inline-block"
      animate={{ y: [0, -3, 0] }}
      transition={{ repeat: Infinity, duration: 0.9, delay }}
    />
  );
}

function Suggestions({
  onPick,
  disabled,
}: {
  onPick: (s: string) => void;
  disabled: boolean;
}) {
  const { t } = useLang();
  const items = [
    t("suggestion_1"),
    t("suggestion_2"),
    t("suggestion_3"),
    t("suggestion_4"),
  ];
  return (
    <div className="flex gap-2 px-3 py-3 border-t border-white/8 overflow-x-auto no-scrollbar">
      {items.map((s) => (
        <button
          key={s}
          disabled={disabled}
          onClick={() => onPick(s)}
          className="shrink-0 text-[12px] px-3 py-2 rounded-full border border-white/15 bg-white/[0.03] text-ink/80 hover:border-white/40 hover:text-ink disabled:opacity-30 transition-colors"
        >
          {s}
        </button>
      ))}
    </div>
  );
}
