"use client";

import { useRef, type ReactNode } from "react";
import { useInView } from "motion/react";

// Fades + rises its children the FIRST time they scroll into view, then
// leaves them alone (re-animating on every pass fights the reader).
//
// The motion itself is a CSS transition (see `.reveal` in globals.css) and
// this component only flips a data attribute. Two reasons:
//  1. CSS transitions run off the main thread, so they stay smooth while the
//     page is still loading images and scripts.
//  2. The visible state sets `transform: none`, so anything inside that uses
//     `position: fixed` (the project popup, the handshake video) still
//     positions against the viewport once the reveal has finished. A lingering
//     transform on an ancestor would break that.
export default function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  /** Stagger offset in ms for items in a group (use 50–80 ms steps). */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Fire when the element is ~80px into the viewport so it is actually seen.
  const inView = useInView(ref, { once: true, margin: "0px 0px -80px 0px" });

  return (
    <div
      ref={ref}
      className={`reveal ${className}`.trim()}
      data-visible={inView || undefined}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
