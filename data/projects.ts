// -----------------------------------------------------------------------------
// PROJECTS
// To add a new project: copy one block, paste it at the TOP of the array,
// bump the `num`, and fill in the fields. That's the whole workflow.
// Leave `live` / `github` / `image` out (or as undefined) if you don't have
// them yet — the UI handles missing ones gracefully.
// -----------------------------------------------------------------------------

export type Project = {
  num: string; // e.g. "01"
  year: string; // e.g. "2025"
  title: string;
  role?: string; // your role on the project
  desc: string; // one to two sentences
  tech: string[]; // tags
  live?: string; // live/demo URL
  github?: string; // repo URL
  image?: string; // /screenshots/foo.png (in /public)
};

export const projects: Project[] = [
  {
    num: "01",
    year: "2026",
    title: "Algorithmics Student Information System (ASIS)",
    role: "Full-Stack Developer & System Management Lead",
    desc: "A Laravel and MySQL web system that replaced manual enrollment and record-keeping, featuring role-based admin and teacher dashboards with clickable stat cards linked to filtered student records. Built the System Management module (user management, activity-log audit trail, and record archive/restore) and automated encoding of 2024-2026 student records with a Python script.",
    tech: ["Laravel", "PHP", "MySQL", "Python"],
    live: undefined,
    github: undefined,
    image: undefined,
  },
  {
    num: "02",
    year: "2025",
    title: "Pi-Tech Smart CCTV System",
    role: "Founder, Lead Researcher & Systems Architect",
    desc: "An AI-powered road-incident detection and emergency-response system for the Philippines. Designed the full system blueprint — hardware integration, solar power, and real-time computer-vision pipelines for autonomous emergency dispatch.",
    tech: ["Python", "TensorFlow / Keras", "OpenCV", "Embedded / Hardware"],
    live: undefined,
    github: undefined,
    image: undefined,
  },
  {
    num: "03",
    year: "2024",
    title: "Self-Balancing Robot",
    role: "Project Lead, Programmer & Hardware Builder",
    desc: "Designed and built a two-wheeled self-balancing robot from the ground up. Handled embedded programming and physical assembly, tuning PID control to hold stable equilibrium under varied load.",
    tech: ["Embedded C / Python", "PID Control", "Hardware"],
    live: undefined,
    github: undefined,
    image: undefined,
  },
  {
    num: "04",
    year: "2024",
    title: "DO: Get the Stuff Done — Mobile App",
    role: "Co-Developer",
    desc: "A productivity mobile app for planning and tracking daily tasks. Contributed core feature coding and kept functionality consistent across modules.",
    tech: ["Mobile", "React Native"],
    live: undefined,
    github: undefined,
    image: undefined,
  },
];
