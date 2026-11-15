"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

// The lines shown one after another, like a short self-introduction.
const phrases = ["Hey!", "I am", "Gianne Marcko G. Aure"];

// How long each line stays before the next one (ms). About 2 s in total:
// long enough to read, short enough that it never feels like a loading wall.
const HOLD = [600, 600, 750];

export default function Preloader({
  onFinish,
  skip = false,
}: {
  onFinish?: () => void;
  /** true when this session already watched the intro: render nothing. */
  skip?: boolean;
}) {
  const [loading, setLoading] = useState(true); // is the panel still showing?
  const [index, setIndex] = useState(0); // which phrase we're on
  const reduce = useReducedMotion();

  // Step through the phrases. After the last one, lift the curtain and
  // tell whoever is listening (the Hero) that the intro is finished.
  useEffect(() => {
    if (skip) return;
    const isLast = index === phrases.length - 1;

    const id = setTimeout(() => {
      if (isLast) {
        setLoading(false);
        // Remember for this tab so reloads go straight to the page.
        try {
          sessionStorage.setItem("introSeen", "1");
        } catch {}
        onFinish?.(); // broadcast "done!" exactly as the curtain starts lifting
      } else {
        setIndex((i) => i + 1);
      }
    }, HOLD[index]);

    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, skip]);

  // Stop the page behind from scrolling while the panel is up.
  useEffect(() => {
    document.body.style.overflow = loading && !skip ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [loading, skip]);

  if (skip) return null;

  const move = reduce ? 0 : 14; // how far each line slides (0 for reduced motion)

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="preloader"
          // `preloader` lets the inline script in layout.tsx hide this panel
          // before React loads when the session has already seen it.
          className="preloader fixed inset-0 z-[100] flex items-center justify-center bg-bg px-6"
          // exit = how the whole panel leaves: slide up like a curtain (or fade).
          exit={reduce ? { opacity: 0 } : { transform: "translateY(-100%)" }}
          transition={{
            duration: reduce ? 0.3 : 0.7,
            ease: [0.23, 1, 0.32, 1], // strong ease-out
          }}
        >
          {/* mode="wait" makes each line fully leave before the next arrives */}
          <AnimatePresence mode="wait">
            <motion.span
              key={index}
              className="text-center font-semibold tracking-tight text-fg text-[clamp(1.75rem,7vw,4.5rem)]"
              initial={{ opacity: 0, transform: `translateY(${move}px)` }}
              animate={{ opacity: 1, transform: "translateY(0px)" }}
              exit={{ opacity: 0, transform: `translateY(${-move}px)` }}
              transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            >
              {phrases[index]}
            </motion.span>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
