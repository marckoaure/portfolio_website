"use client";

import { useEffect, useRef, useState } from "react";

// Animated number that counts up from 0 the first time it scrolls into view.
export default function StatCounter({
  value,
  suffix = "",
  label,
}: {
  value: number;
  suffix?: string;
  label: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const duration = 1200;
          const start = performance.now();

          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            // ease-out for a nicer settle
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * value));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="flex flex-col">
      <span className="text-4xl sm:text-5xl font-semibold tabular-nums tracking-tight">
        {count}
        {suffix}
      </span>
      <span className="mt-2 font-mono text-xs tracking-[0.2em] text-[#8a8a8a] uppercase">
        {label}
      </span>
    </div>
  );
}
