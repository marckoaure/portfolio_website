import { createClient, type SanityClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";

// Read-only client for fetching published project content from Sanity.
// `null` when the env vars are not set (e.g. a Vercel project without them):
// createClient() throws on a missing projectId, which would crash the whole
// build instead of letting fetchProjects() fall back to data/projects.ts.
export const sanityClient: SanityClient | null = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true, // fast, cached reads of published content
    })
  : null;
