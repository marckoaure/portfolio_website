// Uppercase monospace micro-label used above each section (ABOUT, PROJECTS...).

export default function SectionLabel({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <span className="font-mono text-xs tracking-[0.25em] text-[#8a8a8a] uppercase">
        {children}
      </span>
      <span className="h-px flex-1 bg-[#262626]" />
    </div>
  );
}
