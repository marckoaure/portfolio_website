import type { MetadataRoute } from "next";
import { profile } from "@/data/profile";

// Single-page site: one URL. Section anchors are not separate pages.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: profile.siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
