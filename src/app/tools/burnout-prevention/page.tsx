import type { Metadata } from "next";
import dynamic from "next/dynamic";
import LeadMagnetHero from "@/components/lead-magnets/LeadMagnetHero";
import BenefitCard from "@/components/lead-magnets/BenefitCard";
import TestimonialCard from "@/components/lead-magnets/TestimonialCard";

const BurnoutAssessment = dynamic(
  () => import("@/components/lead-magnets/BurnoutAssessment"),
  {
    loading: () => (
      <div className="max-w-2xl mx-auto animate-pulse">
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full" />
        </div>
        <div className="rounded-2xl p-8 shadow-lg bg-white dark:bg-slate-800">
          <div className="h-8 w-64 bg-slate-200 dark:bg-slate-700 rounded mb-6" />
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="h-5 w-full max-w-sm bg-slate-200 dark:bg-slate-700 rounded mb-3" />
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <div
                      key={j}
                      className="h-9 w-20 bg-slate-200 dark:bg-slate-700 rounded-lg"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
);

export const metadata: Metadata = {
  title: "Burnout Prevention Readiness Assessment",
  description:
    "Take this free assessment to discover your burnout risk zone, identify weak prevention systems, and get a personalized 90-day burnout prevention strategy.",
};

const benefits = [
  {
    iconName: "Target",
    title: "Identify Your Burnout Risk Zone",
    description:
      "Pinpoint which areas of your work life are pushing you toward burnout with a data-driven risk analysis across four critical dimensions.",
  },
  {
    iconName: "Shield",
    title: "Discover Your Weakest Prevention Systems",
    description:
      "Uncover which recovery and prevention habits are missing from your routine, so you know exactly where to focus your energy.",
  },
  {
    iconName: "Calendar",
    title: "Get a Personalized 90-Day Action Plan",
    description:
      "Receive a step-by-step roadmap tailored to your results, with weekly actions designed to build sustainable burnout prevention habits.",
  },
  {
    iconName: "TrendingUp",
    title: "Track Your Progress Over Time",
    description:
      "Retake the assessment quarterly to measure improvement and adjust your prevention strategy as your role and workload evolve.",
  },
];

const testimonials = [
  {
    text: "This assessment opened my eyes to recovery habits I had completely neglected. The 90-day plan helped me set real boundaries and I feel re-energized at work for the first time in years.",
    name: "Priya Mehta",
    role: "Engineering Manager",
    rating: 5,
  },
  {
    text: "I was skeptical at first, but the results were surprisingly accurate. I shared it with my entire team and we now use it as a quarterly check-in tool.",
    name: "David Chen",
    role: "Product Lead",
    rating: 5,
  },
  {
    text: "The assessment is quick, insightful, and actionable. Within two weeks of following the plan, my sleep improved and I stopped dreading Monday mornings.",
    name: "Amara Osei",
    role: "Operations Director",
    rating: 5,
  },
];

export default function BurnoutPreventionPage() {
  return (
    <>
      {/* Hero Section */}
      <LeadMagnetHero
        badge={{ iconName: "Sparkles", text: "Free Assessment" }}
        title="Burnout Prevention"
        subtitle="Readiness Assessment"
        description="Answer 4 sections to get your personalized 90-day burnout prevention strategy"
        primaryButtonText="Start Assessment"
        primaryButtonHref="#assessment"
        stats={{ leaders: 2400, rating: 4.8 }}
        colors={{
          primary: "var(--accent)",
          secondary: "var(--heading)",
          accent: "var(--accent)",
        }}
      />

      {/* What You'll Learn Section */}
      <section className="py-20" style={{ backgroundColor: "var(--surface-alt)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="font-bold text-3xl sm:text-4xl mb-4"
              style={{ color: "var(--heading)" }}
            >
              What You&apos;ll Discover
            </h2>
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: "var(--foreground)" }}
            >
              A 5-minute assessment that gives you clarity on where you stand and
              exactly what to do next.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <BenefitCard
                key={benefit.title}
                iconName={benefit.iconName}
                title={benefit.title}
                description={benefit.description}
                color="text-[var(--accent)]"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Assessment Section */}
      <section id="assessment" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="font-bold text-3xl sm:text-4xl mb-4"
              style={{ color: "var(--heading)" }}
            >
              Take the Assessment
            </h2>
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: "var(--foreground)" }}
            >
              Answer honestly across 4 sections. There are no right or wrong
              answers — only insights to help you thrive.
            </p>
          </div>

          <BurnoutAssessment />
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20" style={{ backgroundColor: "var(--surface-alt)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="font-bold text-3xl sm:text-4xl mb-4"
              style={{ color: "var(--heading)" }}
            >
              What Others Are Saying
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.name}
                text={testimonial.text}
                name={testimonial.name}
                role={testimonial.role}
                rating={testimonial.rating}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
