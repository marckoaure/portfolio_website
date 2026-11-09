"use client";

import {
  SiPython,
  SiPhp,
  SiJavascript,
  SiTypescript,
  SiHtml5,
  SiCss,
  SiLaravel,
  SiFlask,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiTensorflow,
  SiOpencv,
  SiMysql,
  SiGit,
  SiGithub,
} from "react-icons/si";
import SectionLabel from "./SectionLabel";
import LogoLoop, { type LogoItem } from "./LogoLoop";

// Small text "logo" for technologies without a brand icon.
function TextLogo({ label }: { label: string }) {
  return (
    <span
      style={{ fontSize: "0.55em" }}
      className="font-semibold tracking-tight whitespace-nowrap"
    >
      {label}
    </span>
  );
}

const row1: LogoItem[] = [
  { node: <SiPython />, title: "Python", href: "https://www.python.org" },
  { node: <SiPhp />, title: "PHP", href: "https://www.php.net" },
  {
    node: <SiJavascript />,
    title: "JavaScript",
    href: "https://developer.mozilla.org/docs/Web/JavaScript",
  },
  {
    node: <SiTypescript />,
    title: "TypeScript",
    href: "https://www.typescriptlang.org",
  },
  {
    node: <SiHtml5 />,
    title: "HTML5",
    href: "https://developer.mozilla.org/docs/Web/HTML",
  },
  {
    node: <SiCss />,
    title: "CSS",
    href: "https://developer.mozilla.org/docs/Web/CSS",
  },
  { node: <TextLogo label="Verilog" />, title: "Verilog" },
];

const row2: LogoItem[] = [
  { node: <SiLaravel />, title: "Laravel", href: "https://laravel.com" },
  { node: <SiFlask />, title: "Flask", href: "https://flask.palletsprojects.com" },
  { node: <SiReact />, title: "React", href: "https://react.dev" },
  { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
  {
    node: <SiTailwindcss />,
    title: "Tailwind CSS",
    href: "https://tailwindcss.com",
  },
  {
    node: <SiTensorflow />,
    title: "TensorFlow / Keras",
    href: "https://www.tensorflow.org",
  },
  { node: <SiOpencv />, title: "OpenCV", href: "https://opencv.org" },
];

const row3: LogoItem[] = [
  { node: <SiMysql />, title: "MySQL", href: "https://www.mysql.com" },
  { node: <SiGit />, title: "Git", href: "https://git-scm.com" },
  { node: <SiGithub />, title: "GitHub", href: "https://github.com/marckoaure" },
  { node: <TextLogo label="MS Office" />, title: "Microsoft Office" },
];

export default function TechStack() {
  return (
    <section
      id="tech"
      className="px-6 sm:px-10 lg:px-20 py-24 sm:py-32 border-t border-line"
    >
      <div className="mx-auto w-full max-w-6xl">
        <SectionLabel>Tech Stack</SectionLabel>

        <p className="max-w-xl text-lg text-subtle">
          Technologies I&apos;ve worked with across software and hardware
          projects.
        </p>

        <div className="mt-14 space-y-10">
          <LogoLoop logos={row1} direction="left" speed={55} ariaLabel="Languages" />
          <LogoLoop
            logos={row2}
            direction="right"
            speed={50}
            ariaLabel="Frameworks and libraries"
          />
          <LogoLoop logos={row3} direction="left" speed={45} ariaLabel="Tools and databases" />
        </div>

        {/* Core competencies (no logos) */}
        <p className="mt-14 text-sm leading-relaxed text-faint">
          <span className="font-mono uppercase tracking-widest text-muted">
            Also
          </span>{" "}
          Full-Stack Web Development &middot; Database Management &middot; Deep
          Learning &middot; Digital Logic Design &middot; Embedded Systems
          &middot; Data Analytics
        </p>
      </div>
    </section>
  );
}
