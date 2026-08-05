import { profile } from "@/data/profile";

export default function Footer() {
  return (
    <footer className="mt-auto px-6 sm:px-10 lg:px-20 py-10 border-t border-[#262626]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-[11px] tracking-widest uppercase text-[#5a5a5a]">
          Programmed by {profile.fullName} using Next.js, TypeScript, Tailwind &
          Three.js
        </p>

        <div className="flex items-center gap-6 font-mono text-[11px] tracking-widest uppercase">
          <a
            href={profile.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8a8a8a] hover:text-[#ededed]"
          >
            Resume ↗
          </a>
          <a href="#home" className="text-[#8a8a8a] hover:text-[#ededed]">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
