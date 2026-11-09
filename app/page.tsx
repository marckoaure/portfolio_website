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

export default function Home() {
  return (
    <IntroProvider>
      <ScrollProgress />
      <SideNav />
      <MobileNav />
      <main className="flex-1">
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
