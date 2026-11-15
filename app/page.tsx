import IntroProvider from "@/components/IntroProvider";
import SideNav from "@/components/SideNav";
import MobileNav from "@/components/MobileNav";
import ScrollProgress from "@/components/ScrollProgress";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import TechStack from "@/components/TechStack";
import Contact from "@/components/Contact";
import BumpMe from "@/components/BumpMe";
import Footer from "@/components/Footer";
import { profile } from "@/data/profile";

// Structured data: tells search engines this page is about a person and
// which profiles belong to them (can show as a richer search result).
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.fullName,
  url: profile.siteUrl,
  image: `${profile.siteUrl}${profile.headshot}`,
  jobTitle: profile.role,
  description: profile.tagline,
  affiliation: {
    "@type": "CollegeOrUniversity",
    name: "Cavite State University",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Tagaytay City",
    addressRegion: "Cavite",
    addressCountry: "PH",
  },
  sameAs: [profile.github, profile.linkedin, profile.facebook],
};

export default function Home() {
  return (
    <IntroProvider>
      <ScrollProgress />
      <SideNav />
      <MobileNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main id="main" className="flex-1">
        <Hero />
        <About />
        <Projects />
        <Experience />
        <TechStack />
        <Contact />
        <BumpMe />
      </main>
      <Footer />
    </IntroProvider>
  );
}
