import ProjectsGrid from "./ProjectsGrid";
import CertFolder from "./CertFolder";
import Reveal from "./Reveal";
import { fetchProjects } from "@/sanity/fetchProjects";
import { profile } from "@/data/profile";

export default async function Projects() {
  const projects = await fetchProjects();

  return (
    <section
      id="projects"
      className="px-6 sm:px-10 lg:px-20 shell py-24 sm:py-32 border-t border-line"
    >
      <div className="mx-auto w-full max-w-6xl">
        {/* Header: label + line + the certifications folder */}
        <Reveal>
          <div className="mb-8 flex items-center gap-4">
            <h2 className="whitespace-nowrap font-mono text-xs font-normal uppercase tracking-[0.25em] text-muted">
              Projects &amp; Certifications
            </h2>
            <span className="label-line h-px flex-1 bg-line" />
            <CertFolder />
          </div>
        </Reveal>

        <Reveal delay={60}>
          <p className="max-w-xl text-lg text-subtle">
            A curated collection of things I&apos;ve built and researched — growing
            over time. Hover to tilt, click for details, or open the folder above
            for my certifications.
          </p>
        </Reveal>

        {/* Each card reveals on its own (staggered) inside the grid */}
        <div className="mt-10">
          <ProjectsGrid projects={projects} />
        </div>

        <Reveal>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="link-u mt-12 font-mono text-xs tracking-widest uppercase text-muted transition-colors hover:text-fg"
          >
            More on GitHub ↗
          </a>
        </Reveal>
      </div>
    </section>
  );
}
