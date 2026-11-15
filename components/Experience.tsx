import { experience } from "@/data/profile";
import SectionLabel from "./SectionLabel";
import Reveal from "./Reveal";

export default function Experience() {
  return (
    <section
      id="experience"
      className="px-6 sm:px-10 lg:px-20 py-24 sm:py-32 border-t border-line"
    >
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <SectionLabel as="h2">Experience</SectionLabel>
        </Reveal>

        <div className="divide-y divide-line">
          {experience.map((job, i) => (
            <Reveal key={`${job.role}-${job.company}`} delay={i * 80}>
              {/* `group` lets the children react when the row is hovered.
                  Nothing the visitor reads moves: only a thin accent line
                  draws down the left edge and the date brightens. */}
              <article className="group relative grid gap-4 py-10 sm:grid-cols-[12rem_1fr] sm:gap-10">
                <span
                  aria-hidden
                  className="pointer-events-none absolute -left-4 top-10 bottom-10 w-px origin-top scale-y-0 bg-fg transition-transform duration-300 ease-strong group-hover:scale-y-100"
                />

                {/* Date range (+ hours, if any) */}
                <div className="font-mono text-xs tracking-widest uppercase sm:pt-1">
                  <span className="text-muted transition-colors duration-200 group-hover:text-fg">
                    {job.period}
                  </span>
                  {job.hours && (
                    <span className="mt-1 block text-faint">{job.hours}</span>
                  )}
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-fg">
                    {job.role}
                  </h3>
                  <p className="mt-1 text-muted">{job.company}</p>

                  <ul className="mt-5 max-w-2xl space-y-3">
                    {job.points.map((point, j) => (
                      <li
                        key={j}
                        className="relative pl-5 text-base sm:text-lg leading-relaxed text-subtle"
                      >
                        <span className="absolute left-0 top-[0.65em] h-1 w-1 rounded-full bg-faint" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
