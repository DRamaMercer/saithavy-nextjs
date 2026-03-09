"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

const pillars = [
  {
    title: "Inspire",
    description:
      "Igniting passion and purpose in others through authentic storytelling and leadership.",
    color: "var(--highlight)",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    ),
  },
  {
    title: "Empower",
    description:
      "Providing tools and strategies for sustainable growth and authentic living.",
    color: "var(--accent)",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
      />
    ),
  },
  {
    title: "Transform",
    description:
      "Facilitating meaningful change through resilience and anti-fragile mindsets.",
    color: "var(--heading)",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    ),
  },
];

export default function MissionSection() {
  const sectionRef = useScrollReveal<HTMLDivElement>();

  return (
    <section
      id="mission"
      className="py-20"
      style={{ backgroundColor: "var(--surface)" }}
      ref={sectionRef}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            className="reveal-text font-[family-name:var(--font-poppins)] font-bold text-3xl md:text-5xl mb-6"
            style={{ color: "var(--heading)" }}
          >
            My Mission
          </h2>
          <p className="reveal-text text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: "var(--foreground)" }}>
            To inspire and empower individuals to live authentically, embracing
            resilience and anti-fragility as pathways to personal and
            professional transformation.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="reveal-text text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: pillar.color }}
              >
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {pillar.icon}
                </svg>
              </div>
              <h3
                className="font-[family-name:var(--font-poppins)] font-semibold text-xl mb-2"
                style={{ color: "var(--heading)" }}
              >
                {pillar.title}
              </h3>
              <p style={{ color: "var(--foreground)" }}>{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
