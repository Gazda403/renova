import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import AboutAndTransformations from "@/components/AboutAndTransformations";
import Testimonials from "@/components/Testimonials";
import FAQSection from "@/components/FAQSection";
import ContactAndFooter from "@/components/ContactAndFooter";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ServicesSection />
      <AboutAndTransformations />
      <Testimonials />
      <FAQSection />
      <ContactAndFooter />
    </main>
  );
}
