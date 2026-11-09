import { sanityClient } from "./client";
import { projectsQuery } from "./queries";
import { projects as fallbackProjects, type Project } from "@/data/projects";

type SanityRow = {
  _id?: string;
  title?: string;
  year?: string;
  role?: string;
  desc?: string;
  tech?: string[];
  live?: string;
  github?: string;
  image?: string;
};

// Fetch projects from Sanity. If Sanity is empty, misconfigured, or
// unreachable, fall back to the static list so the section never breaks.
export async function fetchProjects(): Promise<Project[]> {
  try {
    const rows = await sanityClient.fetch<SanityRow[]>(
      projectsQuery,
      {},
      { next: { revalidate: 30, tags: ["projects"] } }
    );

    if (!rows || rows.length === 0) return fallbackProjects;

    return rows.map((r, i) => ({
      num: String(i + 1).padStart(2, "0"),
      year: r.year ?? "",
      title: r.title ?? "",
      role: r.role || undefined,
      desc: r.desc ?? "",
      tech: Array.isArray(r.tech) ? r.tech : [],
      live: r.live || undefined,
      github: r.github || undefined,
      image: r.image || undefined,
    }));
  } catch {
    return fallbackProjects;
  }
}
