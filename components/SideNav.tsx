"use client";

import { useEffect, useRef, useState } from "react";
import LineSidebar from "./LineSidebar";
import { SECTIONS } from "@/data/sections";

export default function SideNav() {
  const [active, setActive] = useState(0);
  // While a click-triggered scroll is animating, ignore scroll-spy so the
  // highlight doesn't flicker through every section on the way.
  const suppressSpy = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (suppressSpy.current) return;
      const line = window.innerHeight * 0.35;
      let current = 0;
      for (let i = 0; i < SECTIONS.length; i++) {
        const el = document.getElementById(SECTIONS[i].id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= line) current = i;
      }

      // At the bottom of the page, the last section is active — it may sit too
      // low to ever push its top past the reference line otherwise.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) current = SECTIONS.length - 1;

      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const goTo = (index: number) => {
    const el = document.getElementById(SECTIONS[index].id);
    if (!el) return;

    // Instant highlight + suppress the spy during the smooth scroll.
    setActive(index);
    suppressSpy.current = true;

    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top, behavior: "smooth" });

    window.setTimeout(() => {
      suppressSpy.current = false;
    }, 800);
  };

  return (
    <div className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 lg:block">
      <LineSidebar
        items={SECTIONS.map((s) => s.label)}
        active={active}
        onItemClick={goTo}
        accentColor="var(--fg)"
        textColor="var(--muted)"
        markerColor="var(--faint)"
        markerLength={36}
        itemGap={22}
        fontSize={0.95}
        proximityRadius={90}
        maxShift={16}
      />
    </div>
  );
}
