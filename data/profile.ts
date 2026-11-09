// -----------------------------------------------------------------------------
// Your personal info. Edit anything here and the whole site updates.
// -----------------------------------------------------------------------------

export const profile = {
  // Public URL of the deployed site (used for Open Graph, sitemap, robots).
  siteUrl: "https://marckoaure.vercel.app",

  firstName: "Gianne Marcko",
  lastName: "Aure",
  fullName: "Gianne Marcko G. Aure",

  // Shown in the hero + browser tab
  role: "Computer Engineering Student",
  tagline: "Building intelligent systems across software, hardware & AI.",

  availableForWork: true,

  // About section bio (first person). Typed out on hover in the About section.
  bio: [
    "I am currently a 4th year Computer Engineering student at Cavite State University - Main (Indang) Campus, who wants to take record and have something to look back of how much things I did on creating both software and hardware projects. This will serve as a record book of my work, experiences, projects, and ultimately my overall progress as I explore and venture more about the things that my course does.",
  ],

  location: "Tagaytay City, Cavite, Philippines",
  // IANA timezone used for the live local clock
  timezone: "Asia/Manila",

  email: "marckoaure@gmail.com",
  phone: "09542853459",

  github: "https://github.com/marckoaure",
  linkedin: "https://www.linkedin.com/in/aure-gianne-marcko-g-280123297/",
  facebook: "https://www.facebook.com/giannemarcko.aure/",

  // Put the file in /public and this button will download it
  resume: "/resume.pdf",
  headshot: "/headshot.png",

  // About-section animated counters
  stats: [
    { label: "Projects", value: 4, suffix: "" },
    { label: "Technologies", value: 15, suffix: "+" },
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
      { name: "PHP", url: "https://www.php.net/" },
      { name: "JavaScript", url: "https://developer.mozilla.org/docs/Web/JavaScript" },
      { name: "HTML / CSS", url: "https://developer.mozilla.org/docs/Web/HTML" },
      { name: "Verilog" },
      { name: "MySQL", url: "https://www.mysql.com/" },
      { name: "Git / GitHub", url: "https://github.com/" },
      { name: "Microsoft Office" },
    ],
  },
  {
    group: "Frameworks & Libraries",
    items: [
      { name: "Laravel", url: "https://laravel.com/" },
      { name: "Flask", url: "https://flask.palletsprojects.com/" },
      { name: "TensorFlow / Keras", url: "https://www.tensorflow.org/" },
      { name: "OpenCV", url: "https://opencv.org/" },
    ],
  },
  {
    group: "Core Competencies",
    items: [
      { name: "Full-Stack Web Development" },
      { name: "Database Management" },
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

// Work experience for the Experience section. Newest first.
export const experience: {
  role: string;
  company: string;
  period: string;
  hours?: string;
  points: string[];
}[] = [
  {
    role: "Software Development Intern",
    company: "Algorithmics Learning Hub",
    period: "June – July 2026",
    hours: "240 hours",
    points: [
      "Developed the Algorithmics Student Information System (ASIS), a Laravel and MySQL web application, as part of a five-member team to digitize the center's manual enrollment and student-record operations.",
      "Taught Python, Scratch, and robotics (UARO, AIKIRO, Robokit) classes to students aged 10-18 after passing the in-house assistant-teacher certification exam.",
      "Maintained IT operations through hardware troubleshooting, equipment inventory, and document processing, while supporting front-desk and marketing tasks.",
    ],
  },
  {
    role: "Crew Member",
    company: "McDonald's Philippines",
    period: "August 2025 – March 2026",
    points: [
      "Coordinated with a team of 8-10 crew members to fulfill high-volume customer orders during peak service hours, consistently meeting store speed-of-service targets.",
      "Adapted efficiently across multiple stations (lobby, kitchen, and maintenance), demonstrating flexibility and the ability to perform under pressure.",
    ],
  },
];
