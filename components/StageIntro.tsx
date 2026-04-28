"use client";
import { AnimatePresence, motion } from "framer-motion";

const COPY: Record<
  number,
  { title: string; sub: string; line: string }
> = {
  1: {
    title: "Stage I",
    sub: "Scent Basics",
    line: "Begin gently. Lifestyle and the alphabet of perfume.",
  },
  2: {
    title: "Stage II",
    sub: "Etienne Discovery",
    line: "The house, the bottles, the moods. Learn us.",
  },
  3: {
    title: "Stage III",
    sub: "Master of Scent",
    line: "Deeper logic. Quieter notes. Earn the title.",
  },
};

export default function StageIntro({
  stage,
  show,
  onDone,
}: {
  stage: number;
  show: boolean;
  onDone: () => void;
}) {
  const copy = COPY[stage];
  if (!copy) return null;
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key={`stage-${stage}`}
          className="fixed inset-0 z-40 grid place-items-center bg-cream/95 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onAnimationComplete={() => {
            // auto dismiss after 1.6s
            setTimeout(onDone, 1500);
          }}
        >
          <motion.div
            className="text-center px-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="hairline w-16 mx-auto mb-6" />
            <p className="text-[10px] tracking-[0.5em] uppercase text-ink/60">
              {copy.title}
            </p>
            <h2 className="font-display text-5xl text-ink mt-3">{copy.sub}</h2>
            <p className="mt-4 text-ink/70 text-[14px] max-w-xs mx-auto">
              {copy.line}
            </p>
            <div className="hairline w-16 mx-auto mt-6" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
