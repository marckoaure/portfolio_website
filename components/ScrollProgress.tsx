"use client";

import { motion, useMotionTemplate, useScroll } from "motion/react";

// A 2px bar across the very top that grows with how far down the page you are.
// scrollYProgress is 0 at the top and 1 at the bottom; we scale the bar's
// width from the left edge with it. Transform-only, so it never triggers
// layout, and it maps 1:1 to the scroll position (no easing) because it is
// a readout, not a transition.
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const transform = useMotionTemplate`scaleX(${scrollYProgress})`;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-0.5 origin-left bg-fg"
      style={{ transform }}
    />
  );
}
