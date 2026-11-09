// The page's sections, in order. Shared by the desktop side-nav and the
// mobile menu so they can never disagree. Each `id` must match the `id` on
// that section's <section> element.
export const SECTIONS = [
  { label: "Home", id: "home" },
  { label: "About", id: "about" },
  { label: "Projects", id: "projects" },
  { label: "Experience", id: "experience" },
  { label: "Tech Stack", id: "tech" },
  { label: "Contact", id: "contact" },
  { label: "Bump Me", id: "bump" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];
