"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { SECTIONS } from "@/data/sections";

// Phone/tablet navigation (the LineSidebar is desktop-only). A round button
// mirrors the theme toggle on the other side; it opens a full-screen list of
// sections that staggers in, and closes once a section is picked.
export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  // Lock page scroll + close on Escape while the menu is open.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const goTo = (id: string) => {
    setOpen(false);
    // Let the overlay start fading before the page jumps, so the two motions
    // don't fight. 60 ms is below what anyone perceives as a delay.
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 60);
  };

  const rise = reduce ? "translateY(0px)" : "translateY(8px)";

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="fixed left-5 top-5 z-[60] flex h-10 w-10 items-center justify-center rounded-full border border-line bg-bg text-fg transition-colors hover:border-fg"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          aria-hidden
        >
          <path d="M4 8h16M4 16h16" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[85] flex flex-col bg-bg px-6 pb-10 pt-24 sm:px-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="fixed right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-bg text-fg transition-colors hover:border-fg"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                aria-hidden
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
              Menu
            </span>

            <ul className="mt-6 flex flex-col divide-y divide-line">
              {SECTIONS.map((s, i) => (
                <motion.li
                  key={s.id}
                  initial={{ opacity: 0, transform: rise }}
                  animate={{ opacity: 1, transform: "translateY(0px)" }}
                  transition={{
                    duration: 0.3,
                    ease: [0.23, 1, 0.32, 1],
                    delay: 0.05 * i,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => goTo(s.id)}
                    className="flex w-full items-baseline gap-4 py-4 text-left"
                  >
                    <span className="font-mono text-xs text-faint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-3xl font-semibold tracking-tight text-fg">
                      {s.label}
                    </span>
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
