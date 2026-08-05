import { techStack } from "@/data/profile";
import SectionLabel from "./SectionLabel";

export default function TechStack() {
  return (
    <section
      id="tech"
      className="px-6 sm:px-10 lg:px-20 py-24 sm:py-32 border-t border-[#262626]"
    >
      <div className="mx-auto w-full max-w-6xl">
        <SectionLabel>Tech Stack</SectionLabel>

        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {techStack.map((group) => (
            <div key={group.group}>
              <h3 className="font-mono text-xs tracking-[0.2em] uppercase text-[#8a8a8a]">
                {group.group}
              </h3>
              <ul className="mt-5 space-y-3">
                {group.items.map((item) => (
                  <li key={item.name}>
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-lg text-[#ededed] underline-offset-4 hover:underline"
                      >
                        {item.name}
                        <span aria-hidden className="text-[#5a5a5a] text-sm">
                          ↗
                        </span>
                      </a>
                    ) : (
                      <span className="text-lg text-[#b5b5b5]">{item.name}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
