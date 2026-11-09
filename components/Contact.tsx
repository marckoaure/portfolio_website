import { profile } from "@/data/profile";
import SectionLabel from "./SectionLabel";
import Clock from "./Clock";

export default function Contact() {
  const links = [
    { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    { label: "Phone Number", value: profile.phone, href: `tel:${profile.phone}` },
    { label: "LinkedIn", value: "Gianne Marcko Aure", href: profile.linkedin },
  ];

  return (
    <section
      id="contact"
      className="px-6 sm:px-10 lg:px-20 py-24 sm:py-32 border-t border-line"
    >
      <div className="mx-auto w-full max-w-6xl">
        <SectionLabel>Contact</SectionLabel>

        <h2 className="max-w-3xl text-4xl sm:text-6xl font-semibold tracking-tight leading-tight">
          Let&apos;s build something.{" "}
          <span className="text-muted">
            Open to internships & collaboration.
          </span>
        </h2>

        <a
          href={`mailto:${profile.email}`}
          className="mt-10 inline-block text-xl sm:text-3xl text-fg underline underline-offset-8 decoration-faint2 transition-colors hover:decoration-fg"
        >
          {profile.email}
        </a>

        {/* Link grid */}
        <div className="mt-16 grid gap-8 sm:grid-cols-3 border-t border-line pt-10">
          {links.map((link) => (
            <div key={link.label}>
              <div className="font-mono text-xs tracking-[0.2em] uppercase text-faint">
                {link.label}
              </div>
              <a
                href={link.href}
                target={link.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="mt-2 inline-block text-fg underline-offset-4 hover:underline"
              >
                {link.value}
              </a>
            </div>
          ))}
        </div>

        {/* Location + availability + time */}
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-xs tracking-widest uppercase text-muted">
          <span>{profile.location}</span>
          <span className="flex items-center gap-2">
            <span className="text-faint">Local</span>
            <Clock />
          </span>
          {profile.availableForWork && (
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Available
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
