"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

const services = [
  {
    title: "AI Automation Consulting",
    description:
      "Help businesses automate workflows with AI to save time, reduce costs, and innovate faster while maintaining the human touch that matters most.",
    features: [
      "Workflow optimization",
      "AI implementation strategy",
      "Team training & support",
    ],
    iconBg: "var(--heading)",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
      />
    ),
  },
  {
    title: "Remote Work Transition",
    description:
      "Guide professionals and teams to thrive in remote work environments with proven strategies for productivity, collaboration, and work-life integration.",
    features: [
      "Remote work strategy",
      "Productivity systems",
      "Team culture building",
    ],
    iconBg: "var(--accent)",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
      />
    ),
  },
  {
    title: "Content & Resources",
    description:
      "Writing articles, guides, and tools to empower your personal and professional growth with actionable insights and proven strategies.",
    features: [
      "Growth guides & frameworks",
      "Practical tools & templates",
      "Community & support",
    ],
    iconBg: "var(--highlight)",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    ),
  },
];

export default function ServicesSection() {
  const sectionRef = useScrollReveal<HTMLDivElement>();

  return (
    <section
      id="services"
      className="py-20"
      style={{
        background:
          "linear-gradient(to bottom right, rgba(26,54,93,0.04), rgba(192,86,33,0.04))",
      }}
      ref={sectionRef}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            className="reveal-text font-[family-name:var(--font-poppins)] font-bold text-3xl md:text-5xl mb-6"
            style={{ color: "var(--heading)" }}
          >
            How I Can Help You
          </h2>
          <p
            className="reveal-text text-xl max-w-3xl mx-auto"
            style={{ color: "var(--foreground)" }}
          >
            Transform your approach to work and life with proven strategies for
            authentic growth and sustainable success.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.title}
              className="reveal-text rounded-2xl p-8 shadow-lg card-hover"
              style={{ backgroundColor: "var(--surface)" }}
            >
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center mb-6"
                style={{ backgroundColor: service.iconBg }}
              >
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {service.icon}
                </svg>
              </div>
              <h3
                className="font-[family-name:var(--font-poppins)] font-bold text-xl mb-4"
                style={{ color: "var(--heading)" }}
              >
                {service.title}
              </h3>
              <p
                className="mb-6 leading-relaxed"
                style={{ color: "var(--foreground)" }}
              >
                {service.description}
              </p>
              <ul
                className="text-sm mb-6 space-y-2"
                style={{ color: "var(--foreground)" }}
              >
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      style={{ color: "var(--highlight)" }}
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className="inline-flex items-center font-[family-name:var(--font-poppins)] font-semibold transition-colors duration-200"
                style={{ color: "var(--accent)" }}
              >
                Learn More
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
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
