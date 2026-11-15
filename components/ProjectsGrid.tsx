"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Project } from "@/data/projects";
import TiltedCard from "./TiltedCard";
import Reveal from "./Reveal";
import { useDialogFocus } from "@/lib/useDialogFocus";
import { sized } from "@/lib/sanityImage";

export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<Project | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  // Keyboard users: focus moves into the popup, stays there, and returns to
  // the card that opened it.
  useDialogFocus(dialogRef, active !== null);

  // Lock scroll + close on Escape while the detail popup is open.
  useEffect(() => {
    document.body.style.overflow = active ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  return (
    <>
      {/* 2-up on phones so a card is a glance, not a whole screen; wraps
          naturally as more projects are added. */}
      <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        {projects.map((p, i) => (
          // Each card reveals on its own; the delay restarts every 4 cards so
          // a long list never makes the last card wait.
          <Reveal key={p.num} delay={(i % 4) * 70}>
          <TiltedCard
            onClick={() => setActive(p)}
            className="group rounded-2xl"
          >
            <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-line transition-colors duration-200 group-hover:border-faint">
              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={sized(p.image, 800)}
                  alt={p.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              ) : (
                // Placeholder until a screenshot is uploaded in Sanity.
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-line to-bg">
                  <span className="font-mono text-5xl sm:text-7xl font-bold text-faint2 opacity-40">
                    {p.num}
                  </span>
                </div>
              )}

              {/* Title bar, popped forward for a 3D feel */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3 sm:p-4 [transform:translateZ(30px)]">
                <div className="font-mono text-[10px] tracking-widest uppercase text-white/70">
                  {p.num} · {p.year}
                </div>
                <div className="mt-1 text-xs sm:text-sm font-semibold text-white line-clamp-2">
                  {p.title}
                </div>
                {/* Affordance: says the card is clickable. Slides in on hover
                    or keyboard focus; always shown on touch screens, which
                    have no hover. */}
                <div className="mt-2 translate-y-1 font-mono text-[10px] uppercase tracking-widest text-white/80 opacity-0 transition-[opacity,translate] duration-200 ease-strong group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100">
                  View details →
                </div>
              </div>
            </div>
          </TiltedCard>
          </Reveal>
        ))}
      </div>

      {/* Detail popup */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setActive(null)}
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
          >
            <motion.div
              ref={dialogRef}
              tabIndex={-1}
              className="relative max-h-[85vh] w-full max-w-lg overflow-auto rounded-2xl border border-line bg-bg p-6 outline-none sm:p-8"
              initial={{ opacity: 0, transform: "scale(0.95)" }}
              animate={{ opacity: 1, transform: "scale(1)" }}
              exit={{ opacity: 0, transform: "scale(0.96)" }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActive(null)}
                aria-label="Close"
                className="press absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-line text-muted hover:border-fg hover:text-fg"
              >
                ×
              </button>

              {active.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={sized(active.image, 1200)}
                  alt={active.title}
                  className="mb-6 w-full rounded-xl object-cover"
                />
              )}

              <div className="font-mono text-xs tracking-widest uppercase text-muted">
                {active.num} · {active.year}
              </div>
              <h3 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-fg">
                {active.title}
              </h3>
              {active.role && (
                <p className="mt-1 text-sm italic text-muted">{active.role}</p>
              )}

              <div className="mt-4 flex flex-wrap gap-2 font-mono text-[11px] tracking-widest uppercase text-muted">
                {active.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-line px-3 py-1"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <p className="mt-5 text-base leading-relaxed text-subtle">
                {active.desc}
              </p>

              <div className="mt-6 flex flex-wrap gap-6 font-mono text-xs tracking-widest uppercase">
                {active.live && (
                  <a
                    href={active.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-u text-fg"
                  >
                    Live ↗
                  </a>
                )}
                {active.github && (
                  <a
                    href={active.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-u text-fg"
                  >
                    Code ↗
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
