"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useDialogFocus } from "@/lib/useDialogFocus";

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

// ---------------------------------------------------------------------------
// Web geometry, computed once. Everything is deterministic (seeded) so the
// server and the browser draw exactly the same shapes.
// ---------------------------------------------------------------------------
const frac = (n: number) => n - Math.floor(n);
const rand = (i: number, seed: number) => frac(Math.sin(i * seed) * 43758.5453);

// The web LINE: two silk strands twisted round each other like rope, joined
// by short cross-ties. Drawn in a 40 x 1000 box that is stretched to the
// height of the screen, so its top end is always off-screen.
const LINE_BOX = { w: 40, h: 1000 };
const twist = (phase: number) => {
  const pts: string[] = [];
  for (let y = 0; y <= LINE_BOX.h; y += 10) {
    const x = LINE_BOX.w / 2 + 7 * Math.sin((2 * Math.PI * y) / 90 + phase);
    pts.push(`${x.toFixed(1)} ${y}`);
  }
  return "M " + pts.join(" L ");
};
const LINE_A = twist(0);
const LINE_B = twist(Math.PI);
// A tie wherever the two strands are furthest apart (every half twist).
const LINE_TIES = Array.from({ length: 22 }, (_, k) => {
  const y = 22.5 + k * 45;
  const lean = (rand(k, 12.9898) - 0.5) * 6;
  return `M 13 ${(y - lean).toFixed(1)} L 27 ${(y + lean).toFixed(1)}`;
}).join(" ");

// The SPLAT: where the web lands on the clip. Spokes fan out from the hit
// point (longer downward, across the clip; shorter upward, round the line),
// tied together by two sagging rungs like a real orb web.
const SPLAT_BOX = { w: 240, h: 120, cx: 120, cy: 60 };
const SPLAT_SPOKES = Array.from({ length: 13 }, (_, i) => {
  const angle = (i / 13) * Math.PI * 2 + (rand(i, 12.9898) - 0.5) * 0.35;
  const reach = Math.sin(angle) > 0 ? 1 : 0.45;
  const len = (38 + rand(i, 78.233) * 52) * reach;
  return {
    x: SPLAT_BOX.cx + Math.cos(angle) * len * 1.25,
    y: SPLAT_BOX.cy + Math.sin(angle) * len,
    // a frayed thread carrying on past the end of the spoke
    fx: SPLAT_BOX.cx + Math.cos(angle + 0.25) * len * 1.25 * 1.18,
    fy: SPLAT_BOX.cy + Math.sin(angle + 0.25) * len * 1.18,
  };
});
const rung = (f: number) => {
  const at = (i: number) => {
    const sp = SPLAT_SPOKES[i % SPLAT_SPOKES.length];
    return {
      x: SPLAT_BOX.cx + (sp.x - SPLAT_BOX.cx) * f,
      y: SPLAT_BOX.cy + (sp.y - SPLAT_BOX.cy) * f,
    };
  };
  let d = `M ${at(0).x.toFixed(1)} ${at(0).y.toFixed(1)}`;
  for (let i = 0; i < SPLAT_SPOKES.length; i++) {
    const p0 = at(i);
    const p1 = at(i + 1);
    // control point = the midpoint pulled toward the centre, so each span sags
    const mx = (p0.x + p1.x) / 2;
    const my = (p0.y + p1.y) / 2;
    const cx = mx + (SPLAT_BOX.cx - mx) * 0.22;
    const cy = my + (SPLAT_BOX.cy - my) * 0.22;
    d += ` Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
  }
  return d;
};
const SPLAT_RUNGS = [rung(0.4), rung(0.72)];

// LEFTOVERS: a few loose threads that drift down where the clip used to be.
const LEFTOVERS = Array.from({ length: 6 }, (_, i) => {
  const x = -46 + i * 18 + (rand(i, 39.3467) - 0.5) * 10;
  const len = 12 + rand(i, 93.9898) * 20;
  const lean = (rand(i, 51.123) - 0.5) * 12;
  return { x1: x, y1: 0, x2: x + lean, y2: len, o: 0.35 + rand(i, 7.77) * 0.4 };
});

// Timeline of the pull, in seconds. One place to tune the feel.
const PULL = {
  total: 0.9, // whole sequence
  shot: 0.12, // web travels from the top of the screen to the clip
};

export default function Handshake() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false); // web-pull in progress
  const cached = useSyncExternalStore(subscribeNoop, readCachedCount, () => 0);
  const [live, setLive] = useState<number | null>(null); // null = not fetched yet
  const count = live ?? cached;
  const videoRef = useRef<HTMLVideoElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialogFocus(dialogRef, open);
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
      reduce ? 260 : PULL.total * 1000 + 50
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
        className="press mt-6 inline-flex items-center gap-2 rounded-full border border-fg bg-fg px-8 py-4 text-base font-medium text-bg hover:bg-transparent hover:text-fg"
      >
        Bump me <span aria-hidden></span>
      </button>

      <p className="mt-5 font-mono text-xs tracking-[0.2em] uppercase text-muted">
        {count.toLocaleString()} {count === 1 ? "bump" : "bumps"}
      </p>

      {/* Center-screen popup: plays the clip once, then a web yanks it away.

          The pull, in order (see PULL for the timing):
            1. the web line shoots DOWN from above the screen and hits the clip
            2. a splat sticks to the clip, which squashes from the hit
            3. the slack line snaps taut and the clip stretches toward the pull
            4. the clip is hauled up, swinging from the point the web grabbed
            5. a few loose threads drift down where it was */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={startClose}
            role="dialog"
            aria-modal="true"
            aria-label="Handshake video"
          >
            {/* Static frame: marks where the clip sits and never moves, so the
                leftover threads stay behind when the clip is pulled away. */}
            <div
              ref={dialogRef}
              tabIndex={-1}
              className="relative w-full max-w-lg outline-none"
              onClick={(e) => e.stopPropagation()}
            >
              {closing && !reduce && (
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-0"
                  initial={{ opacity: 0, transform: "translateY(0px)" }}
                  animate={{
                    opacity: [0, 0.8, 0],
                    transform: [
                      "translateY(0px)",
                      "translateY(6px)",
                      "translateY(34px)",
                    ],
                  }}
                  transition={{
                    delay: 0.42,
                    duration: 0.48,
                    times: [0, 0.25, 1],
                    ease: "easeOut",
                  }}
                >
                  <svg width="1" height="1" className="block overflow-visible">
                    <g stroke="white" strokeLinecap="round">
                      {LEFTOVERS.map((t, i) => (
                        <line
                          key={i}
                          x1={t.x1}
                          y1={t.y1}
                          x2={t.x2}
                          y2={t.y2}
                          strokeWidth="0.8"
                          opacity={t.o}
                        />
                      ))}
                    </g>
                  </svg>
                </motion.div>
              )}

              {/* MOVER: only travels up and down. The line hangs from it, so
                  the line stays vertical while the clip swings underneath. */}
              <motion.div
                initial={{
                  opacity: 0,
                  transform: reduce
                    ? "translateY(0px) scale(1)"
                    : "translateY(0px) scale(0.94)",
                }}
                animate={
                  closing
                    ? reduce
                      ? { opacity: 0, transition: { duration: 0.2 } }
                      : {
                          // opacity must be stated: a key that drops out
                          // of `animate` is animated back to its `initial`
                          // value (0), which faded the clip out mid-pull.
                          opacity: 1,
                          // hit pushes it down, the taut line lifts it a
                          // little, then the hard pull (accelerating)
                          transform: [
                            "translateY(0px) scale(1)",
                            "translateY(0px) scale(1)",
                            "translateY(6px) scale(1)",
                            "translateY(-6px) scale(1)",
                            "translateY(-10px) scale(1)",
                            "translateY(-1700px) scale(1)",
                          ],
                          transition: {
                            duration: PULL.total,
                            times: [0, 0.133, 0.21, 0.3, 0.44, 1],
                            ease: [
                              "linear",
                              "easeOut",
                              "easeInOut",
                              "linear",
                              [0.32, 0, 0.67, 0],
                            ],
                          },
                        }
                    : {
                        opacity: 1,
                        transform: "translateY(0px) scale(1)",
                        transition: {
                          duration: 0.25,
                          ease: [0.23, 1, 0.32, 1],
                        },
                      }
                }
              >
                {/* 1. The web line. Grows from its top end (off-screen) down
                    to the clip, at constant speed like a projectile. */}
                {closing && !reduce && (
                  <motion.div
                    aria-hidden
                    className="pointer-events-none absolute bottom-full left-1/2 h-[110vh] w-10 -translate-x-1/2"
                    style={{ transformOrigin: "50% 0%" }}
                    initial={{ transform: "scaleY(0.02)" }}
                    animate={{ transform: "scaleY(1)" }}
                    transition={{ duration: PULL.shot, ease: "linear" }}
                  >
                    {/* 3. Slack to taut: squeezing the twist sideways pulls
                        the two strands into one tight rope. */}
                    <motion.div
                      className="h-full w-full"
                      initial={{ transform: "scaleX(1)" }}
                      animate={{
                        transform: ["scaleX(1)", "scaleX(1)", "scaleX(0.45)"],
                      }}
                      transition={{
                        duration: 0.4,
                        times: [0, 0.55, 1],
                        ease: ["linear", [0.23, 1, 0.32, 1]],
                      }}
                    >
                      <svg
                        viewBox={`0 0 ${LINE_BOX.w} ${LINE_BOX.h}`}
                        preserveAspectRatio="none"
                        className="block h-full w-full overflow-visible"
                      >
                        <g
                          stroke="white"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          filter="url(#webGlow)"
                        >
                          <path d={LINE_A} strokeWidth="2.4" opacity="0.95" vectorEffect="non-scaling-stroke" />
                          <path d={LINE_B} strokeWidth="1.8" opacity="0.75" vectorEffect="non-scaling-stroke" />
                          <path d={LINE_TIES} strokeWidth="1" opacity="0.5" vectorEffect="non-scaling-stroke" />
                        </g>
                      </svg>
                    </motion.div>
                  </motion.div>
                )}

                {/* CLIP: pivots at its top centre, the point the web grabbed. */}
                <motion.div
                  style={{ transformOrigin: "50% 0%" }}
                  initial={{ transform: "rotate(0deg) scale(1, 1)" }}
                  animate={
                    closing && !reduce
                      ? {
                          // squash from the hit, stretch toward the pull,
                          // then swing like a weight on a line as it shrinks
                          transform: [
                            "rotate(0deg) scale(1, 1)",
                            "rotate(0deg) scale(1, 1)",
                            "rotate(0deg) scale(1.03, 0.95)",
                            "rotate(-1.5deg) scale(0.98, 1.05)",
                            "rotate(1deg) scale(0.98, 1.05)",
                            "rotate(-10deg) scale(0.75, 0.8)",
                            "rotate(8deg) scale(0.5, 0.5)",
                          ],
                          transition: {
                            duration: PULL.total,
                            times: [0, 0.133, 0.21, 0.3, 0.44, 0.72, 1],
                            ease: [
                              "linear",
                              "easeOut",
                              "easeOut",
                              "easeInOut",
                              "easeIn",
                              "easeOut",
                            ],
                          },
                        }
                      : { transform: "rotate(0deg) scale(1, 1)" }
                  }
                >
                  {/* 2. The splat, stuck on the clip at the hit point. */}
                  {closing && !reduce && (
                    <motion.div
                      aria-hidden
                      className="pointer-events-none absolute left-1/2 top-0 z-10 w-60 -translate-x-1/2 -translate-y-1/2"
                      initial={{ opacity: 0, transform: "scale(0.5)" }}
                      animate={{ opacity: 1, transform: "scale(1)" }}
                      transition={{
                        delay: PULL.shot,
                        duration: 0.09,
                        ease: [0.23, 1, 0.32, 1],
                      }}
                    >
                      <svg
                        viewBox={`0 0 ${SPLAT_BOX.w} ${SPLAT_BOX.h}`}
                        className="block w-full overflow-visible"
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
                        <g
                          stroke="white"
                          fill="none"
                          strokeLinecap="round"
                          filter="url(#webGlow)"
                        >
                          {SPLAT_SPOKES.map((sp, i) => (
                            <g key={i}>
                              <line
                                x1={SPLAT_BOX.cx}
                                y1={SPLAT_BOX.cy}
                                x2={sp.x}
                                y2={sp.y}
                                strokeWidth="1.1"
                                opacity="0.8"
                              />
                              <line
                                x1={sp.x}
                                y1={sp.y}
                                x2={sp.fx}
                                y2={sp.fy}
                                strokeWidth="0.6"
                                opacity="0.35"
                              />
                            </g>
                          ))}
                          {SPLAT_RUNGS.map((d, i) => (
                            <path
                              key={i}
                              d={d}
                              strokeWidth="0.7"
                              opacity={0.55 - i * 0.15}
                            />
                          ))}
                          {/* the knot where the line meets the clip */}
                          <circle
                            cx={SPLAT_BOX.cx}
                            cy={SPLAT_BOX.cy}
                            r="7"
                            fill="white"
                            stroke="none"
                            opacity="0.3"
                          />
                          <circle
                            cx={SPLAT_BOX.cx}
                            cy={SPLAT_BOX.cy}
                            r="3.5"
                            fill="white"
                            stroke="none"
                          />
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
