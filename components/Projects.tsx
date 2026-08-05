import { projects } from "@/data/projects";
import SectionLabel from "./SectionLabel";
import ProjectCard from "./ProjectCard";

export default function Projects() {
  return (
    <section
      id="projects"
      className="px-6 sm:px-10 lg:px-20 py-24 sm:py-32 border-t border-[#262626]"
    >
      <div className="mx-auto w-full max-w-6xl">
        <SectionLabel>Projects</SectionLabel>

        <p className="max-w-xl text-lg text-[#b5b5b5]">
          A curated collection of things I&apos;ve built and researched — growing
          over time.
        </p>

        <div className="mt-8 divide-y divide-[#262626]">
          {projects.map((project) => (
            <ProjectCard key={project.num} project={project} />
          ))}
        </div>

        <p className="mt-12 font-mono text-xs tracking-widest uppercase text-[#5a5a5a]">
          More projects coming soon…
        </p>
      </div>
    </section>
  );
}
