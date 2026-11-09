"use client";

import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { profile } from "@/data/profile";
import { useIntroDone } from "./IntroProvider";
import Clock from "./Clock";
import ThreeHero from "./ThreeHero";

// Social links shown under the name. Each `path` is a single SVG icon path.
const SOCIALS = [
  {
    label: "LinkedIn",
    href: profile.linkedin,
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  {
    label: "Facebook",
    href: profile.facebook,
    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
  {
    label: "GitHub",
    href: profile.github,
    path: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  },
];

export default function Hero() {
  // true when the visitor has asked their OS to minimize motion.
  // In that case we skip the upward slide and keep only a gentle fade.
  const reduce = useReducedMotion();

  // true once the preloader's curtain starts lifting — our cue to animate in.
  const introDone = useIntroDone();

  // Parallax on scroll: as the hero leaves the top of the viewport, its
  // content drifts down a little and fades, so the hand-off to About is a
  // dissolve instead of a hard cut. scrollYProgress is 0 while the hero is
  // at the top and 1 when its bottom edge reaches the top of the screen.
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  // Function form on purpose: Motion 13 "accelerates" range-based transforms
  // of scroll values into native scroll-driven animations, which did not
  // update opacity here. Plain functions stay on the JS path that works.
  const drift = useTransform(scrollYProgress, (p) => (reduce ? 0 : p * 80));
  const contentTransform = useMotionTemplate`translateY(${drift}px)`;
  const contentOpacity = useTransform(scrollYProgress, (p) =>
    Math.max(0, 1 - p / 0.65)
  );
  // The scroll cue has done its job after the first bit of scrolling.
  const cueOpacity = useTransform(scrollYProgress, (p) =>
    Math.max(0, 1 - p / 0.12)
  );

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-[100svh] flex flex-col justify-center px-6 sm:px-10 lg:px-20 overflow-hidden"
    >
      <ThreeHero />

      <motion.div
        className="relative z-10 mx-auto w-full max-w-6xl"
        style={{ transform: contentTransform, opacity: contentOpacity }}
      >
      <motion.div
        variants={{
          hidden: {
            opacity: 0,
            transform: reduce ? "translateY(0px)" : "translateY(20px)",
          },
          show: { opacity: 1, transform: "translateY(0px)" },
        }}
        initial="hidden"
        // stay hidden until the curtain lifts, then fade up in sync with it
        animate={introDone ? "show" : "hidden"}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
      >
        {/* Availability badge */}
        {profile.availableForWork && (
          <div className="mb-8 inline-flex items-center gap-2 font-mono text-xs tracking-[0.2em] uppercase text-muted">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Available for work
          </div>
        )}

        {/* Name — split across two lines, oversized */}
        <h1 className="font-semibold leading-[0.95] tracking-tight text-[clamp(2.75rem,11vw,9rem)]">
          <span className="block">{profile.firstName}</span>
          <span className="block text-muted">{profile.lastName}</span>
        </h1>

        {/* Social links */}
        <div className="mt-6 flex items-center gap-5">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="text-muted transition-colors hover:text-fg"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d={s.path} />
              </svg>
            </a>
          ))}
        </div>

        {/* Role + tagline */}
        <p className="mt-8 max-w-xl text-lg sm:text-xl text-subtle">
          <span className="text-fg">{profile.role}.</span>{" "}
          {profile.tagline}
        </p>

        {/* Meta row: location + live clock */}
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-xs tracking-widest uppercase text-muted">
          <span>{profile.location}</span>
          <span className="flex items-center gap-2">
            <span className="text-faint">Local</span>
            <Clock />
          </span>
        </div>

        {/* CTAs */}
        <div className="mt-12 flex flex-wrap gap-4">
          <a
            href="#projects"
            className="rounded-full border border-fg px-6 py-3 text-sm font-medium text-bg bg-fg transition-colors hover:bg-transparent hover:text-fg"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="rounded-full border border-line px-6 py-3 text-sm font-medium text-fg transition-colors hover:border-fg"
          >
            Get in Touch
          </a>
        </div>
      </motion.div>
      </motion.div>

      {/* Scroll cue: bobs gently, fades out once the visitor starts scrolling */}
      <motion.div
        aria-hidden
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        style={{ opacity: cueOpacity }}
      >
        <span
          className="block font-mono text-[10px] tracking-[0.3em] uppercase text-faint"
          style={{
            animation: reduce
              ? undefined
              : "scroll-cue 1.8s cubic-bezier(0.77, 0, 0.175, 1) infinite",
          }}
        >
          Scroll ↓
        </span>
      </motion.div>
    </section>
  );
}
