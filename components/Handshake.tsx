"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const VIDEO_SRC =
  "/spider-man-homecoming-handshake-peter-and-ned-handshake.mp4";

// Free, no-account shared counter (Abacus). Every visitor increments the
// same central number, so the total tallies everyone's bumps together.
const COUNTER_API = "https://abacus.jasoncameron.dev";
const COUNTER_NS = "gianne-marcko-aure";
const COUNTER_KEY = "portfolio-bumps";

// Last total we saw on a previous visit. Read on the client only (the server
// has no localStorage) so it paints instantly while the live number loads.
const subscribeNoop = () => () => {};
function readCachedCount() {
  try {
    const n = Number(localStorage.getItem("bumpCount"));
    return Number.isNaN(n) ? 0 : n;
  } catch {
    return 0;
  }
}

// A subtle zig-zag silk strand plus stray "split-end" threads, computed once.
const frac = (n: number) => n - Math.floor(n);

const WEB_PTS: { x: number; y: number }[] = (() => {
  const cx = 55;
  const amp = 6; // gentle sway
  const seg = 30;
  const pts = [{ x: cx, y: 0 }];
  let i = 0;
  for (let y = seg; y <= 510; y += seg) {
    // small random wobble so it reads as organic silk, not a rigid zig-zag
    const wob = (frac(Math.sin(i * 91.7) * 4137.1) - 0.5) * 4;
    pts.push({ x: cx + (i % 2 === 0 ? amp : -amp) + wob, y });
    i++;
  }
  pts.push({ x: cx, y: 534 }); // apex of the cone
  return pts;
})();

const WEB_STRAND_D =
  "M " + WEB_PTS.map((p) => `${p.x.toFixed(1)} ${p.y}`).join(" L ");

// stray threads splaying off the strand, like split ends of hair
const WEB_WISPS = WEB_PTS.slice(1, -1).map((p, i) => {
  const r = frac(Math.sin(i * 57.3 + 11) * 7219.4);
  const side = i % 2 === 0 ? -1 : 1;
  return {
    x1: p.x,
    y1: p.y,
    x2: p.x + side * (2 + r * 8),
    y2: p.y + 3 + r * 12,
    w: 0.5 + r * 0.4,
    o: 0.2 + r * 0.22,
  };
});

export default function Handshake() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false); // web-pull in progress
  const cached = useSyncExternalStore(subscribeNoop, readCachedCount, () => 0);
  const [live, setLive] = useState<number | null>(null); // null = not fetched yet
  const count = live ?? cached;
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();

  // Fetch the global bump total on mount. Until it arrives, `count` shows the
  // cached value from the last visit.
  useEffect(() => {
    fetch(`${COUNTER_API}/get/${COUNTER_NS}/${COUNTER_KEY}`)
      .then((r) => (r.ok ? r.json() : { value: 0 }))
      .then((d) => {
        if (typeof d.value === "number") {
          setLive(d.value);
          try {
            localStorage.setItem("bumpCount", String(d.value));
          } catch {}
        }
      })
      .catch(() => {});
  }, []);

  const bump = () => {
    setOpen(true);
    setLive((c) => (c ?? cached) + 1); // optimistic bump so the number moves instantly

    // Increment the shared counter, then trust the real value it returns.
    fetch(`${COUNTER_API}/hit/${COUNTER_NS}/${COUNTER_KEY}`)
      .then((r) => r.json())
      .then((d) => {
        if (typeof d.value === "number") {
          setLive(d.value);
          try {
            localStorage.setItem("bumpCount", String(d.value));
          } catch {}
        }
      })
      .catch(() => {});
  };

  // Every close routes through here so it plays the web-pull exit.
  const startClose = () => setClosing(true);

  // After the web yanks the clip away, actually unmount it.
  useEffect(() => {
    if (!closing) return;
    const t = window.setTimeout(
      () => {
        setOpen(false);
        setClosing(false);
      },
      reduce ? 260 : 1300
    );
    return () => clearTimeout(t);
  }, [closing, reduce]);

  // Lock page scroll + restart the video from the start whenever it opens.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") startClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="flex flex-col items-center text-center">
      <p className="text-2xl sm:text-4xl font-semibold tracking-tight text-fg">
        Liked my Portfolio?
      </p>

      <button
        type="button"
        onClick={bump}
        className="mt-6 inline-flex items-center gap-2 rounded-full border border-fg bg-fg px-8 py-4 text-base font-medium text-bg transition-colors hover:bg-transparent hover:text-fg"
      >
        Bump me <span aria-hidden></span>
      </button>

      <p className="mt-5 font-mono text-xs tracking-[0.2em] uppercase text-muted">
        {count.toLocaleString()} {count === 1 ? "bump" : "bumps"}
      </p>

      {/* Center-screen popup: plays the clip once, then a web yanks it away */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={startClose}
          >
            <motion.div
              className="relative w-full max-w-lg"
              initial={{ opacity: 0, scale: reduce ? 1 : 0.94 }}
              animate={
                closing
                  ? reduce
                    ? { opacity: 0, transition: { duration: 0.2 } }
                    : {
                        // web sticks (jolt), holds a beat, then a slow hard yank
                        opacity: [1, 1, 1, 1, 0],
                        y: [0, -12, 6, 6, -1500],
                        rotate: [0, -1.5, 1.5, 1.5, -18],
                        scale: [1, 1, 1, 1, 0.42],
                        transition: {
                          duration: 1.2,
                          times: [0, 0.1, 0.22, 0.35, 1],
                          ease: ["easeOut", "easeOut", "linear", "easeIn"],
                        },
                      }
                  : {
                      opacity: 1,
                      scale: 1,
                      transition: { duration: 0.25, ease: [0.23, 1, 0.32, 1] },
                    }
              }
              onClick={(e) => e.stopPropagation()}
            >
              {/* The web: shoots up from the clip and sticks, then pulls it up */}
              {closing && !reduce && (
                <motion.div
                  className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2"
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  style={{ transformOrigin: "bottom" }}
                  transition={{ duration: 0.14, ease: "easeOut" }}
                >
                  <svg
                    width="110"
                    height="640"
                    viewBox="0 0 110 640"
                    className="block overflow-visible"
                  >
                    <defs>
                      <filter
                        id="webGlow"
                        x="-60%"
                        y="-60%"
                        width="220%"
                        height="220%"
                      >
                        <feGaussianBlur stdDeviation="1.1" result="b" />
                        <feMerge>
                          <feMergeNode in="b" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {/* subtle silk strand + stray split-end threads */}
                    <g
                      stroke="white"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter="url(#webGlow)"
                    >
                      <path d={WEB_STRAND_D} strokeWidth="1.8" opacity="0.8" />
                      <path
                        d={WEB_STRAND_D}
                        strokeWidth="0.7"
                        opacity="0.45"
                        transform="translate(1.6 0)"
                      />
                      {WEB_WISPS.map((w, i) => (
                        <line
                          key={i}
                          x1={w.x1}
                          y1={w.y1}
                          x2={w.x2}
                          y2={w.y2}
                          strokeWidth={w.w}
                          opacity={w.o}
                        />
                      ))}
                    </g>

                    {/* cone that spreads wider the closer it gets to the clip */}
                    <g
                      stroke="white"
                      fill="none"
                      strokeLinecap="round"
                      filter="url(#webGlow)"
                    >
                      {/* fine fan strands from the apex, with frayed ends */}
                      {Array.from({ length: 11 }).map((_, i) => {
                        const bx = -25 + (i / 10) * 160;
                        const r = frac(Math.sin(i * 33.7) * 2851.3);
                        return (
                          <g key={`f${i}`}>
                            <line x1={55} y1={534} x2={bx} y2={616} strokeWidth="1" opacity="0.55" />
                            {/* split-end wisp continuing past the clip edge */}
                            <line
                              x1={bx}
                              y1={616}
                              x2={bx + (bx - 55) * 0.12}
                              y2={616 + 6 + r * 10}
                              strokeWidth="0.6"
                              opacity="0.3"
                            />
                          </g>
                        );
                      })}
                      {/* faint web rungs across the cone */}
                      {[0.45, 0.75].map((f, i) => {
                        const y = 534 + f * 82;
                        const half = 80 * f;
                        const d = `M ${55 - half} ${y} Q 55 ${y + 5 + 7 * f} ${55 + half} ${y}`;
                        return (
                          <path key={`c${i}`} d={d} strokeWidth="0.7" opacity={0.3 + f * 0.2} />
                        );
                      })}
                      {/* small anchor at the apex */}
                      <circle cx="55" cy="534" r="2.5" fill="white" stroke="none" />
                    </g>
                  </svg>
                </motion.div>
              )}

              {/* The clip (its own rounded/overflow wrapper so the web isn't clipped) */}
              <div className="overflow-hidden rounded-2xl border border-line bg-black">
                <video
                  ref={videoRef}
                  src={VIDEO_SRC}
                  autoPlay
                  muted
                  playsInline
                  onEnded={startClose}
                  className="block w-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
