// Uppercase monospace micro-label used above each section (ABOUT, PROJECTS...).
//
// `as="h2"` makes the label the section's real heading for screen readers and
// search engines. Use it in sections that have no other <h2> (Experience,
// Tech Stack, Bump Me). It looks identical either way.
//
// The rule beside the label carries `label-line`: when the label sits inside
// a <Reveal>, the line draws in from the left (see globals.css).
export default function SectionLabel({
  children,
  as: Tag = "span",
}: {
  children: string;
  as?: "span" | "h2";
}) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <Tag className="font-mono text-xs font-normal tracking-[0.25em] text-muted uppercase">
        {children}
      </Tag>
      <span className="label-line h-px flex-1 bg-line" />
    </div>
  );
}
