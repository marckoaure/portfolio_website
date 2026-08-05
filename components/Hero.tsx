import { profile } from "@/data/profile";
import Clock from "./Clock";
import ThreeHero from "./ThreeHero";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-[100svh] flex flex-col justify-center px-6 sm:px-10 lg:px-20 overflow-hidden"
    >
      <ThreeHero />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        {/* Availability badge */}
        {profile.availableForWork && (
          <div className="mb-8 inline-flex items-center gap-2 font-mono text-xs tracking-[0.2em] uppercase text-[#8a8a8a]">
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
          <span className="block text-[#8a8a8a]">{profile.lastName}</span>
        </h1>

        {/* Role + tagline */}
        <p className="mt-8 max-w-xl text-lg sm:text-xl text-[#b5b5b5]">
          <span className="text-[#ededed]">{profile.role}.</span>{" "}
          {profile.tagline}
        </p>

        {/* Meta row: location + live clock */}
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-xs tracking-widest uppercase text-[#8a8a8a]">
          <span>{profile.location}</span>
          <span className="flex items-center gap-2">
            <span className="text-[#5a5a5a]">Local</span>
            <Clock />
          </span>
        </div>

        {/* CTAs */}
        <div className="mt-12 flex flex-wrap gap-4">
          <a
            href="#projects"
            className="rounded-full border border-[#ededed] px-6 py-3 text-sm font-medium text-[#0a0a0a] bg-[#ededed] transition-colors hover:bg-transparent hover:text-[#ededed]"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="rounded-full border border-[#262626] px-6 py-3 text-sm font-medium text-[#ededed] transition-colors hover:border-[#ededed]"
          >
            Get in Touch
          </a>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.3em] uppercase text-[#5a5a5a]">
        Scroll ↓
      </div>
    </section>
  );
}
