import dynamic from "next/dynamic";

// Above the fold — eager static imports (critical for LCP)
import HeroSection    from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";

// Below the fold — dynamic imports = separate JS chunks, loaded on demand
const AboutAndTransformations = dynamic(() => import("@/components/AboutAndTransformations"));
const NasaMisija              = dynamic(() => import("@/components/NasaMisija"));
const Testimonials            = dynamic(() => import("@/components/Testimonials"));
const FAQSection              = dynamic(() => import("@/components/FAQSection"));
const ContactAndFooter        = dynamic(() => import("@/components/ContactAndFooter"));

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ServicesSection />
      <AboutAndTransformations />
      <NasaMisija />
      <Testimonials />
      <FAQSection />
      <ContactAndFooter />
    </main>
  );
}

