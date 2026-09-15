// app/page.tsx
import Navigation from "./components/Navigation";
import HeroSection from "./components/HeroSection";
import WorksSection from "./components/WorksSection";
import SkillsSection from "./components/SkillsSection";
import ServicesSection from "./components/ServicesSection";
import AboutSection from "./components/AboutSection";
import ContactFooter from "./components/ContactFooter";
import SectionDivider from "./components/SectionDivider";
import Marquee from "./components/Marquee";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <HeroSection />
        <SectionDivider />
        <WorksSection />
        <Marquee />
        <SkillsSection />
        <SectionDivider />
        <ServicesSection />
        <SectionDivider />
        <AboutSection />
        <SectionDivider />
        <ContactFooter />
      </main>
    </>
  );
}
