import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import TechStack from "@/components/TechStack";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <main className="flex-1">
        <Hero />
        <About />
        <Projects />
        <TechStack />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
