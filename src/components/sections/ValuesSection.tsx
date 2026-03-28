"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

const values = [
  {
    title: "Authenticity",
    subtitle: "Stay true to yourself",
    description:
      "Staying true to myself and encouraging others to do the same. I believe that embracing your true self is the first step to genuine growth and meaningful success.",
    frontGradient:
      "linear-gradient(to bottom right, #1a365d, rgba(26,54,93,0.9))",
    borderColor: "#1a365d",
    titleColor: "#1a365d",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    ),
  },
  {
    title: "Resilience",
    subtitle: "Strength through adversity",
    description:
      "I've learned to see challenges as opportunities. Every setback can make us stronger—this anti-fragile mindset is at the heart of everything I do.",
    frontGradient:
      "linear-gradient(to bottom right, #c05621, rgba(192,86,33,0.9))",
    borderColor: "#c05621",
    titleColor: "#c05621",
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
    title: "Growth Mindset",
    subtitle: "Continuous evolution",
    description:
      "I champion a lifelong learner mentality. Every experience—good or bad—is a chance to learn, adapt, and evolve into a better version of yourself.",
    frontGradient:
      "linear-gradient(to bottom right, #68d391, rgba(104,211,145,0.9))",
    borderColor: "#68d391",
    titleColor: "#68d391",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    ),
  },
  {
    title: "Innovation",
    subtitle: "Pushing boundaries",
    description:
      "Pushing boundaries and leveraging new ideas like AI to create meaningful change. Innovation isn't just about technology—it's about thinking differently.",
    frontGradient:
      "linear-gradient(to bottom right, #718096, rgba(113,128,150,0.9))",
    borderColor: "#718096",
    titleColor: "#718096",
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
    title: "Mindful Leadership",
    subtitle: "Leading with empathy",
    description:
      "Leading with empathy and presence, ensuring well-being isn't sacrificed for success. True leadership serves both people and purpose.",
    frontGradient: "linear-gradient(to bottom right, #1a365d, #68d391)",
    borderColor: "#1a365d",
    titleColor: "#1a365d",
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
    title: "Community",
    subtitle: "Growing together",
    description:
      "Building connections and fostering collaboration. We rise by lifting others, and true success is measured by the positive impact we have on our community.",
    frontGradient: "linear-gradient(to bottom right, #c05621, #68d391)",
    borderColor: "#c05621",
    titleColor: "#c05621",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    ),
  },
];

export default function ValuesSection() {
  const sectionRef = useScrollReveal<HTMLDivElement>();

  return (
    <section
      id="values"
      className="py-20"
      style={{ backgroundColor: "var(--surface)" }}
      ref={sectionRef}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            className="reveal-text font-[family-name:var(--font-poppins)] font-bold text-3xl md:text-5xl mb-6"
            style={{ color: "var(--heading)" }}
          >
            Core Values
          </h2>
          <p
            className="reveal-text text-xl max-w-3xl mx-auto"
            style={{ color: "var(--foreground)" }}
          >
            These principles guide everything I do and shape how I help others
            grow.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value) => (
            <div
              key={value.title}
              className="reveal-text value-card h-80 cursor-pointer"
            >
              <div className="value-card-inner">
                {/* Front */}
                <div
                  className="value-card-front text-white p-8 flex flex-col justify-center"
                  style={{ background: value.frontGradient }}
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                  >
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {value.icon}
                    </svg>
                  </div>
                  <h3 className="font-[family-name:var(--font-poppins)] font-bold text-2xl text-center mb-4">
                    {value.title}
                  </h3>
                  <p className="text-center text-gray-200">{value.subtitle}</p>
                </div>

                {/* Back */}
                <div
                  className="value-card-back border-2 p-8 flex flex-col justify-center"
                  style={{
                    backgroundColor: "var(--surface)",
                    borderColor: value.borderColor,
                  }}
                >
                  <h3
                    className="font-[family-name:var(--font-poppins)] font-bold text-xl mb-4"
                    style={{
                      color:
                        value.titleColor === "#1a365d"
                          ? "var(--heading)"
                          : value.titleColor,
                    }}
                  >
                    {value.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--foreground)" }}
                  >
                    {value.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
