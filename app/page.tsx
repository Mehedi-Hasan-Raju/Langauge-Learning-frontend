
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import LearningLevels from "../components/LearningLevels";
import BlogSection from "../components/BlogSection";
import AusbildungSection from "../components/AusbildungSection";
import ServicesSection from "../components/ServicesSection";
import MembersSection from "../components/MembersSection";

export default function Home() {
  return (
    <>
      

      <main>
        <HeroSection />


        <LearningLevels />
        <BlogSection />
        <AusbildungSection />
        <ServicesSection />
        <MembersSection />
      </main>
    </>
  );
}