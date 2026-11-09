"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { profile } from "@/data/profile";
import SectionLabel from "./SectionLabel";
import StatCounter from "./StatCounter";
import TextType from "./TextType";

export default function About() {
  const bioText = profile.bio.join(" ");
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Desktop reveals on hover. Touch devices have no hover, so there we
  // reveal when the section scrolls into view instead.
  useEffect(() => {
    const canHover = window.matchMedia("(hover: hover)").matches;
    if (canHover) return;

    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setStarted(true),
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      className="px-6 sm:px-10 lg:px-20 py-24 sm:py-32 border-t border-line"
    >
      <div className="mx-auto w-full max-w-6xl">
        <SectionLabel>About</SectionLabel>

        <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:gap-20 items-start">
          {/* Bio — hidden until hovered (or scrolled to on touch) */}
          <div
            ref={ref}
            onMouseEnter={() => setStarted(true)}
            onMouseLeave={() => setStarted(false)}
            className="group max-w-2xl"
          >
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-fg transition-colors">
              About Me
            </h2>

            {/* An invisible copy reserves the space (so nothing jumps as the
                text types) and carries the real text for screen readers / SEO. */}
            <div className="relative mt-6 text-lg sm:text-2xl leading-relaxed">
              <p className="opacity-0 select-none">{bioText}</p>

              <div className="absolute inset-0 text-fg" aria-hidden="true">
                {started ? (
                  <TextType
                    text={bioText}
                    typingSpeed={18}
                    loop={false}
                    showCursor
                    cursorCharacter="_"
                    cursorBlinkDuration={0.6}
                    className="text-fg"
                    cursorClassName="text-muted"
                  />
                ) : (
                  <span className="font-mono text-sm tracking-widest uppercase text-faint">
                    Hover to read
                    <span
                      className="ml-1 text-muted"
                      style={{
                        animation: "caret-blink 0.6s linear infinite",
                      }}
                    >
                      _
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Photo */}
          <div className="order-first lg:order-none">
            <div className="relative h-40 w-40 sm:h-52 sm:w-52 overflow-hidden rounded-2xl border border-line grayscale">
              <Image
                src={profile.headshot}
                alt={profile.fullName}
                fill
                sizes="208px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>

        {/* Animated stat counters */}
        <div className="mt-20 grid grid-cols-3 gap-6 border-t border-line pt-12">
          {profile.stats.map((stat) => (
            <StatCounter
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
