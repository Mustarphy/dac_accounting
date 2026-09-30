import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import TrustSection from "@/components/home/TrustSection";
import AboutPreview from "@/components/home/AboutPreview";
import ServicesPreview from "@/components/home/ServicesPreview";
import KnowledgePreview from "@/components/home/KnowledgePreview";
import FinalCTA from "@/components/home/FinalCTA";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TrustSection />
        <AboutPreview />
        <ServicesPreview />
        <KnowledgePreview />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
