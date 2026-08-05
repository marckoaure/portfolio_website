import type { Project } from "@/data/projects";

// External-link arrow shown next to live/repo links.
function Arrow() {
  return <span aria-hidden>↗</span>;
}

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group grid gap-4 py-10 sm:grid-cols-[auto_1fr] sm:gap-10">
      {/* Number */}
      <div className="font-mono text-sm text-[#5a5a5a] sm:pt-2">
        {project.num}
      </div>

      <div>
        {/* Year + tech tags */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] tracking-widest uppercase text-[#8a8a8a]">
          <span>{project.year}</span>
          <span className="text-[#3a3a3a]">/</span>
          {project.tech.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>

        {/* Title */}
        <h3 className="mt-4 text-2xl sm:text-4xl font-semibold tracking-tight text-[#ededed] transition-colors group-hover:text-white">
          {project.title}
        </h3>

        {project.role && (
          <p className="mt-2 text-sm italic text-[#8a8a8a]">{project.role}</p>
        )}

        {/* Description */}
        <p className="mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-[#b5b5b5]">
          {project.desc}
        </p>

        {/* Links (only render what exists) */}
        <div className="mt-6 flex flex-wrap gap-6 font-mono text-xs tracking-widest uppercase">
          {project.live ? (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ededed] underline-offset-4 hover:underline"
            >
              Live <Arrow />
            </a>
          ) : null}
          {project.github ? (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ededed] underline-offset-4 hover:underline"
            >
              Code <Arrow />
            </a>
          ) : null}
          {!project.live && !project.github ? (
            <span className="text-[#5a5a5a]">Details coming soon</span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
