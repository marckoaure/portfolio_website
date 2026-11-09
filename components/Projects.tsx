import ProjectsGrid from "./ProjectsGrid";
import CertFolder from "./CertFolder";
import { fetchProjects } from "@/sanity/fetchProjects";

export default async function Projects() {
  const projects = await fetchProjects();

  return (
    <section
      id="projects"
      className="px-6 sm:px-10 lg:px-20 py-24 sm:py-32 border-t border-line"
    >
      <div className="mx-auto w-full max-w-6xl">
        {/* Header: label + line + the certifications folder */}
        <div className="mb-8 flex items-center gap-4">
          <span className="whitespace-nowrap font-mono text-xs uppercase tracking-[0.25em] text-muted">
            Projects &amp; Certifications
          </span>
          <span className="h-px flex-1 bg-line" />
          <CertFolder />
        </div>

        <p className="max-w-xl text-lg text-subtle">
          A curated collection of things I&apos;ve built and researched — growing
          over time. Hover to tilt, click for details, or open the folder above
          for my certifications.
        </p>

        <div className="mt-10">
          <ProjectsGrid projects={projects} />
        </div>

        <p className="mt-12 font-mono text-xs tracking-widest uppercase text-faint">
          More projects coming soon…
        </p>
      </div>
    </section>
  );
}
