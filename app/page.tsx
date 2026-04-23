// app/page.tsx
import Navigation from "./components/Navigation";
import HeroSection from "./components/HeroSection";
import WorksSection from "./components/WorksSection";
import SkillsSection from "./components/SkillsSection";
import AboutSection from "./components/AboutSection";
import ContactFooter from "./components/ContactFooter";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <HeroSection />
        <WorksSection />
        <SkillsSection />
        <AboutSection />
        <ContactFooter />
      </main>
    </>
  );
}
