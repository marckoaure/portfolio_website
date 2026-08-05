// -----------------------------------------------------------------------------
// Your personal info. Edit anything here and the whole site updates.
// -----------------------------------------------------------------------------

export const profile = {
  firstName: "Gianne Marcko",
  lastName: "Aure",
  fullName: "Gianne Marcko G. Aure",

  // Shown in the hero + browser tab
  role: "Computer Engineering Student",
  tagline: "Building intelligent systems across software, hardware & AI.",

  availableForWork: true,

  // About section bio (first person)
  bio: [
    "I'm an incoming 4th-year BS Computer Engineering student at Cavite State University (Indang Campus), drawn to the space where software meets hardware.",
    "I've led an AI road-safety research system, built a self-balancing robot from scratch, and I'm now learning modern web development by building this site. I'm looking for an internship where I can turn what I've studied into real, hands-on work.",
  ],

  location: "Cavite / Metro Manila, Philippines",
  // IANA timezone used for the live local clock
  timezone: "Asia/Manila",

  email: "marckoaure@gmail.com",
  phone: "09542853459",

  github: "https://github.com/marckoaure",
  linkedin: "https://www.linkedin.com/in/aure-gianne-marcko-g-280123297/",

  // Put the file in /public and this button will download it
  resume: "/resume.pdf",
  headshot: "/headshot.png",

  // About-section animated counters
  stats: [
    { label: "Projects", value: 3, suffix: "" },
    { label: "Technologies", value: 12, suffix: "+" },
    { label: "Years Coding", value: 3, suffix: "" },
  ],
};

// Grouped skills for the Tech Stack section.
// Each item can optionally carry a URL (renders an external-link arrow).
export const techStack: {
  group: string;
  items: { name: string; url?: string }[];
}[] = [
  {
    group: "Languages & Tools",
    items: [
      { name: "Python", url: "https://www.python.org/" },
      { name: "Verilog" },
      { name: "Microsoft Excel" },
    ],
  },
  {
    group: "Frameworks & Libraries",
    items: [
      { name: "Flask", url: "https://flask.palletsprojects.com/" },
      { name: "TensorFlow / Keras", url: "https://www.tensorflow.org/" },
      { name: "OpenCV", url: "https://opencv.org/" },
    ],
  },
  {
    group: "Core Competencies",
    items: [
      { name: "Deep Learning" },
      { name: "Digital Logic Design" },
      { name: "Embedded Systems" },
      { name: "Data Analytics" },
    ],
  },
  {
    group: "Currently Learning",
    items: [
      { name: "TypeScript", url: "https://www.typescriptlang.org/" },
      { name: "React", url: "https://react.dev/" },
      { name: "Next.js", url: "https://nextjs.org/" },
      { name: "Tailwind CSS", url: "https://tailwindcss.com/" },
    ],
  },
];
