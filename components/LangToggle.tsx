"use client";
import { useLang } from "@/components/LangProvider";
import { LANG_LABEL } from "@/lib/i18n";

/**
 * Fixed top-right (logical) language toggle. Pure pill, no popover.
 * Renders as a single segmented EN | AR control — clicking the inactive side
 * switches language. Sits above content via a high z-index.
 */
export default function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div
      className="fixed top-4 z-[60] end-4 select-none"
      role="group"
      aria-label="Language"
    >
      <div className="inline-flex items-center gap-0.5 rounded-full border border-white/15 bg-black/55 backdrop-blur-md px-1 py-1">
        <Btn
          active={lang === "en"}
          onClick={() => setLang("en")}
          label={LANG_LABEL.en}
        />
        <Btn
          active={lang === "ar"}
          onClick={() => setLang("ar")}
          label={LANG_LABEL.ar}
        />
      </div>
    </div>
  );
}

function Btn({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`px-2.5 py-1 rounded-full text-[10px] tracking-[0.2em] uppercase transition-colors ${
        active
          ? "bg-white text-black"
          : "text-ink/55 hover:text-ink"
      }`}
    >
      {label}
    </button>
  );
}
