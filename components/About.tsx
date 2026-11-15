"use client";

import { useRef } from "react";
import Image from "next/image";
import { useInView } from "motion/react";
import { profile } from "@/data/profile";
import SectionLabel from "./SectionLabel";
import StatCounter from "./StatCounter";
import TextType from "./TextType";
import Reveal from "./Reveal";

export default function About() {
  const bioText = profile.bio.join(" ");
  const bioRef = useRef<HTMLDivElement>(null);

  // The bio types itself out the first time about a third of it is on screen.
  // It used to wait for a mouse hover, which hid the text from anyone who did
  // not think to hover (and from every keyboard user).
  const started = useInView(bioRef, { once: true, amount: 0.3 });

  return (
    <section
      id="about"
      className="px-6 sm:px-10 lg:px-20 shell py-24 sm:py-32 border-t border-line"
    >
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <SectionLabel>About</SectionLabel>
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:gap-20 items-start">
          <div ref={bioRef} className="max-w-2xl">
            <Reveal variant="clip">
              <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-fg">
                About Me
              </h2>
            </Reveal>

            {/* An invisible copy reserves the space (so nothing jumps as the
                text types) and carries the real text for screen readers / SEO. */}
            <div className="relative mt-6 text-lg sm:text-2xl leading-relaxed">
              <p className="opacity-0 select-none">{bioText}</p>

              <div className="absolute inset-0 text-fg" aria-hidden="true">
                {started && (
                  <TextType
                    text={bioText}
                    typingSpeed={10}
                    loop={false}
                    showCursor
                    cursorCharacter="_"
                    cursorBlinkDuration={0.6}
                    className="text-fg"
                    cursorClassName="text-muted"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Photo */}
          <Reveal delay={80} className="order-first lg:order-none">
            <div className="relative h-40 w-40 sm:h-52 sm:w-52 overflow-hidden rounded-2xl border border-line grayscale transition-[filter] duration-500 hover:grayscale-0">
              <Image
                src={profile.headshot}
                alt={profile.fullName}
                fill
                sizes="208px"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>

        {/* Animated stat counters, staggered in left to right */}
        <div className="mt-20 grid grid-cols-3 gap-6 border-t border-line pt-12">
          {profile.stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 70}>
              <StatCounter
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
