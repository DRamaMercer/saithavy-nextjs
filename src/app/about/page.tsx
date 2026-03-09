import type { Metadata } from "next";
import MissionSection from "@/components/sections/MissionSection";
import TimelineSection from "@/components/sections/TimelineSection";
import ValuesSection from "@/components/sections/ValuesSection";
import ServicesSection from "@/components/sections/ServicesSection";
import ContactSection from "@/components/sections/ContactSection";

export const metadata: Metadata = {
  title: "About",
  description:
    "Discover Saithavy's journey of resilience, growth, and empowering others to live authentically through remote work and AI automation.",
};

export default function AboutPage() {
  return (
    <>
      {/* About Hero */}
      <section
        className="pt-24 pb-16 hero-bg"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className="font-[family-name:var(--font-poppins)] font-bold text-4xl md:text-6xl mb-6"
            style={{ color: "var(--heading)" }}
          >
            About <span className="text-gradient">Saithavy</span>
          </h1>
          <p
            className="text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto"
            style={{ color: "var(--foreground)" }}
          >
            A journey of resilience, authentic growth, and empowering others to
            live and work on their own terms.
          </p>
        </div>
      </section>

      <MissionSection />
      <TimelineSection />
      <ValuesSection />
      <ServicesSection />
      <ContactSection />
    </>
  );
}
