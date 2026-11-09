"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

// The lines shown one after another, like a short self-introduction.
const phrases = ["Hey!", "I am", "Gianne Marcko G. Aure"];

export default function Preloader({ onFinish }: { onFinish?: () => void }) {
  const [loading, setLoading] = useState(true); // is the panel still showing?
  const [index, setIndex] = useState(0); // which phrase we're on
  const reduce = useReducedMotion();

  // Step through the phrases. After the last one, lift the curtain and
  // tell whoever is listening (the Hero) that the intro is finished.
  useEffect(() => {
    const isLast = index === phrases.length - 1;
    const delay = isLast ? 1400 : 1000; // let the final name linger a bit

    const id = setTimeout(() => {
      if (isLast) {
        setLoading(false);
        onFinish?.(); // broadcast "done!" exactly as the curtain starts lifting
      } else {
        setIndex((i) => i + 1);
      }
    }, delay);

    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  // Stop the page behind from scrolling while the panel is up.
  useEffect(() => {
    document.body.style.overflow = loading ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [loading]);

  const move = reduce ? 0 : 14; // how far each line slides (0 for reduced motion)

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-bg px-6"
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
              transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            >
              {phrases[index]}
            </motion.span>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
