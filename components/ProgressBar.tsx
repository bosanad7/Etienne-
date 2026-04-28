"use client";
import { motion } from "framer-motion";
import { useLang } from "@/components/LangProvider";

export default function ProgressBar({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const { t, lang } = useLang();
  const pct = Math.min(100, (current / total) * 100);
  return (
    <div className="w-full">
      <div className="flex justify-between items-center text-[10px] tracking-[0.32em] uppercase text-ink/55 mb-2">
        <span>{t("signature_challenge")}</span>
        <span className="tabular-nums" dir="ltr">
          {current} / {total}
        </span>
      </div>
      <div
        className="h-[2px] w-full rounded-full bg-white/10 overflow-hidden"
        // Direction needs to stay LTR so the bar grows from the start side
        // visually consistent regardless of UI direction.
        dir={lang === "ar" ? "rtl" : "ltr"}
      >
        <motion.div
          className="h-full bg-white"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
