import Link from "next/link";
import HeroSection from "@/components/sections/HeroSection";
import ContactSection from "@/components/sections/ContactSection";

// ISR: Revalidate every hour for homepage updates
export const revalidate = 3600;

export default function HomePage() {
  return (
    <>
      <HeroSection />

      {/* Quick Intro */}
      <section className="py-20" style={{ backgroundColor: "var(--surface)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="font-[family-name:var(--font-poppins)] font-bold text-3xl md:text-4xl mb-6"
            style={{ color: "var(--heading)" }}
          >
            Empowering Authentic Growth
          </h2>
          <p
            className="text-lg md:text-xl leading-relaxed mb-8 max-w-2xl mx-auto"
            style={{ color: "var(--foreground)" }}
          >
            I help individuals and businesses embrace transformation through AI
            automation, remote work strategies, and authentic leadership.
          </p>
          <Link
            href="/about"
            className="inline-flex items-center px-8 py-4 rounded-lg font-[family-name:var(--font-poppins)] font-semibold text-white transition-all duration-200 hover:opacity-90 hover:scale-105 transform"
            style={{ backgroundColor: "var(--accent)" }}
          >
            Learn My Story
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* Services Preview */}
      <section
        className="py-20"
        style={{
          background:
            "linear-gradient(to bottom right, rgba(26,54,93,0.04), rgba(192,86,33,0.04))",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-center font-[family-name:var(--font-poppins)] font-bold text-3xl md:text-4xl mb-12"
            style={{ color: "var(--heading)" }}
          >
            What I Offer
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "AI Automation",
                desc: "Streamline workflows and boost productivity with intelligent automation strategies.",
                emoji: "🤖",
              },
              {
                title: "Remote Work Coaching",
                desc: "Transform your team's remote work experience with proven frameworks.",
                emoji: "🌍",
              },
              {
                title: "Growth Resources",
                desc: "Access guides, templates, and tools for personal and professional development.",
                emoji: "📚",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl p-8 shadow-md card-hover text-center"
                style={{ backgroundColor: "var(--surface)" }}
              >
                <div className="text-4xl mb-4">{item.emoji}</div>
                <h3
                  className="font-[family-name:var(--font-poppins)] font-bold text-xl mb-3"
                  style={{ color: "var(--heading)" }}
                >
                  {item.title}
                </h3>
                <p style={{ color: "var(--foreground)" }}>{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/about#services"
              className="inline-flex items-center font-[family-name:var(--font-poppins)] font-semibold transition-colors duration-200"
              style={{ color: "var(--accent)" }}
            >
              View All Services
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20"
        style={{
          background:
            "linear-gradient(135deg, var(--heading) 0%, var(--accent) 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-[family-name:var(--font-poppins)] font-bold text-3xl md:text-4xl text-white dark:text-gray-900 mb-6">
            Ready to Start Your Transformation?
          </h2>
          <p className="text-lg text-gray-100 dark:text-gray-800 mb-8 max-w-2xl mx-auto">
            Let&apos;s work together to unlock your potential and create
            meaningful, sustainable change.
          </p>
          <Link
            href="#contact"
            className="inline-flex items-center px-8 py-4 rounded-lg font-[family-name:var(--font-poppins)] font-semibold transition-all duration-200 hover:opacity-90 hover:scale-105 transform"
            style={{ backgroundColor: "white", color: "#1a365d" }}
          >
            Get in Touch
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <ContactSection />
    </>
  );
}
