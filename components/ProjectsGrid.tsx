"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Project } from "@/data/projects";
import TiltedCard from "./TiltedCard";

export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<Project | null>(null);

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
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {projects.map((p) => (
          <TiltedCard
            key={p.num}
            onClick={() => setActive(p)}
            className="rounded-2xl"
          >
            <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-line">
              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.image}
                  alt={p.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                // Placeholder until a screenshot is uploaded in Sanity.
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-line to-bg">
                  <span className="font-mono text-7xl font-bold text-faint2 opacity-40">
                    {p.num}
                  </span>
                </div>
              )}

              {/* Title bar, popped forward for a 3D feel */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 [transform:translateZ(30px)]">
                <div className="font-mono text-[10px] tracking-widest uppercase text-white/70">
                  {p.num} · {p.year}
                </div>
                <div className="mt-1 text-sm font-semibold text-white line-clamp-2">
                  {p.title}
                </div>
              </div>
            </div>
          </TiltedCard>
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
          >
            <motion.div
              className="relative max-h-[85vh] w-full max-w-lg overflow-auto rounded-2xl border border-line bg-bg p-6 sm:p-8"
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
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-fg hover:text-fg"
              >
                ×
              </button>

              {active.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={active.image}
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
                    className="text-fg underline-offset-4 hover:underline"
                  >
                    Live ↗
                  </a>
                )}
                {active.github && (
                  <a
                    href={active.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-fg underline-offset-4 hover:underline"
                  >
                    Code ↗
                  </a>
                )}
                {!active.live && !active.github && (
                  <span className="text-faint">Details coming soon</span>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
