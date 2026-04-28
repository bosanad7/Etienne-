"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DEFAULT_LANG,
  type Lang,
  LANGS,
  type StringKey,
  tr,
} from "@/lib/i18n";

const KEY = "etienne.lang";

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (key: StringKey, vars?: Record<string, string | number>) => string;
  dir: "ltr" | "rtl";
}

const Ctx = createContext<LangCtx | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  // hydrate from localStorage once on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored === "en" || stored === "ar") setLangState(stored);
    } catch {}
  }, []);

  // sync <html lang> + <html dir> whenever lang changes
  useEffect(() => {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(KEY, l);
    } catch {}
  }, []);

  const toggle = useCallback(() => {
    setLang(lang === "en" ? "ar" : "en");
  }, [lang, setLang]);

  const value = useMemo<LangCtx>(
    () => ({
      lang,
      setLang,
      toggle,
      t: (key, vars) => tr(lang, key, vars),
      dir: lang === "ar" ? "rtl" : "ltr",
    }),
    [lang, setLang, toggle]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLang(): LangCtx {
  const v = useContext(Ctx);
  if (!v) {
    // Defensive fallback so nothing crashes if a component renders outside the
    // provider during HMR or weird Suspense boundaries.
    return {
      lang: DEFAULT_LANG,
      setLang: () => {},
      toggle: () => {},
      t: (key, vars) => tr(DEFAULT_LANG, key, vars),
      dir: "ltr",
    };
  }
  return v;
}

export { LANGS };
