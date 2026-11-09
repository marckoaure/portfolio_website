"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { certifications, type Certification } from "@/data/certifications";
import Folder from "./Folder";

export default function CertFolder() {
  const [open, setOpen] = useState(false); // popup open
  const [active, setActive] = useState<Certification | null>(null); // selected cert
  const [folderKey, setFolderKey] = useState(0); // remount to reset the folder

  const closeAll = () => {
    setOpen(false);
    setActive(null);
    setFolderKey((k) => k + 1);
  };

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (active) setActive(null);
      else closeAll();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, active]);

  const n = certifications.length;

  return (
    <>
      {/* Folder trigger in the section header */}
      <div className="shrink-0" title="Open my certifications">
        <Folder
          key={folderKey}
          size={0.55}
          color="#6c6c6c"
          onToggle={(o) => {
            if (o) setOpen(true);
          }}
        />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeAll}
          >
            <motion.div
              className="relative w-full max-w-3xl rounded-2xl border border-line bg-bg p-6 sm:p-10"
              initial={{ opacity: 0, transform: "scale(0.96)" }}
              animate={{ opacity: 1, transform: "scale(1)" }}
              exit={{ opacity: 0, transform: "scale(0.96)" }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={closeAll}
                aria-label="Close"
                className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-fg hover:text-fg"
              >
                ×
              </button>

              {!active ? (
                // The certificates as papers coming out of the folder
                <>
                  <div className="font-mono text-xs uppercase tracking-widest text-muted">
                    Certifications
                  </div>
                  <p className="mt-1 text-sm text-faint">
                    Click a certificate to view it.
                  </p>

                  <div className="mt-10 flex flex-wrap items-start justify-center gap-4">
                    {certifications.map((c, i) => {
                      const rot = (i - (n - 1) / 2) * 3; // gentle scatter
                      return (
                        <motion.button
                          key={c.name}
                          type="button"
                          onClick={() => setActive(c)}
                          initial={{ opacity: 0, y: 20, rotate: 0 }}
                          animate={{ opacity: 1, y: 0, rotate: rot }}
                          whileHover={{ rotate: 0, y: -6, scale: 1.03 }}
                          transition={{ delay: 0.05 + i * 0.06, duration: 0.3 }}
                          className="w-40 rounded-lg border border-line bg-fg/[0.03] p-4 text-left shadow-xl"
                        >
                          <div className="font-mono text-[10px] uppercase tracking-widest text-faint">
                            {String(i + 1).padStart(2, "0")}
                          </div>
                          <div className="mt-2 text-sm font-semibold leading-snug text-fg line-clamp-4">
                            {c.name}
                          </div>
                          <div className="mt-2 text-xs text-muted">
                            {c.issuer}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </>
              ) : (
                // A single certificate, opened up
                <>
                  <button
                    type="button"
                    onClick={() => setActive(null)}
                    className="font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-fg"
                  >
                    ← Back
                  </button>

                  {active.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={active.image}
                      alt={active.name}
                      className="mt-5 w-full rounded-xl border border-line object-contain"
                    />
                  ) : (
                    <div className="mt-5 flex aspect-[4/3] w-full items-center justify-center rounded-xl border border-dashed border-line bg-gradient-to-br from-line to-bg text-center">
                      <span className="font-mono text-xs uppercase tracking-widest text-faint">
                        Certificate image coming soon
                      </span>
                    </div>
                  )}

                  <div className="mt-6 text-sm text-muted">{active.issuer}</div>
                  <h3 className="mt-1 text-xl sm:text-2xl font-semibold tracking-tight text-fg">
                    {active.name}
                  </h3>

                  <div className="mt-6 font-mono text-xs uppercase tracking-widest">
                    {active.url ? (
                      <a
                        href={active.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-fg underline-offset-4 hover:underline"
                      >
                        View credential ↗
                      </a>
                    ) : (
                      <span className="text-faint">
                        Credential link coming soon
                      </span>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
