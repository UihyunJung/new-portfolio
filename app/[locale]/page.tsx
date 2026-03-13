import HeroSection from '@components/@organisms/HeroSection';
import AboutSection from '@components/@organisms/AboutSection';
import SkillsSection from '@components/@organisms/SkillsSection';
import ExperienceSection from '@components/@organisms/ExperienceSection';
import ProjectsSection from '@components/@organisms/ProjectsSection';
import ContactSection from '@components/@organisms/ContactSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
      <ProjectsSection />
      <ContactSection />
    </>
  );
}
