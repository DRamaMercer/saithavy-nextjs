"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const BurnoutAssessment = dynamic(() => import("./BurnoutAssessment"), {
  loading: () => <div className="animate-pulse h-64 bg-[var(--surface)] rounded-2xl" />,
});

interface Tab {
  id: string;
  label: string;
  icon: string;
}

const tabs: Tab[] = [
  { id: "assessment", label: "Assessment", icon: "clipboard" },
  { id: "boundaries", label: "Boundaries", icon: "shield" },
  { id: "renewal", label: "Renewal", icon: "heart" },
  { id: "resilience", label: "Resilience", icon: "zap" },
  { id: "support", label: "Support", icon: "users" },
];

const icons: Record<string, React.ReactNode> = {
  clipboard: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  shield: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  heart: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  zap: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  users: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
};

export default function BurnoutGuideTabs() {
  const [activeTab, setActiveTab] = useState("assessment");

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-8 p-2 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all ${
              activeTab === tab.id
                ? "bg-[var(--accent)] text-white shadow-lg"
                : "text-[var(--foreground)] hover:bg-[var(--surface-alt)]"
            }`}
          >
            {icons[tab.icon]}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "assessment" && (
          <div>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-[var(--heading)] mb-2">
                Burnout Prevention Readiness Assessment
              </h3>
              <p className="text-[var(--foreground)]">
                Answer honestly across 4 sections. Your results will guide you to the right pillars below.
              </p>
            </div>
            <BurnoutAssessment />
          </div>
        )}

        {activeTab === "boundaries" && (
          <PillarContent
            title="Pillar 1: Boundaries"
            subtitle="Boundaries make sustainable leadership possible."
            sections={[
              {
                title: "Time Boundaries",
                items: [
                  "Define work hours and communicate them clearly",
                  "Protect personal time fiercely",
                  "Have a shutdown ritual at end of each workday",
                  "Schedule breaks between meetings",
                  "Take one full day off per week with NO work",
                ],
              },
              {
                title: "Energy Boundaries",
                items: [
                  "Know your peak energy hours and protect them",
                  "Identify your top 3 energy drains",
                  "Identify your top 3 energy renewers",
                  "Schedule renewal activities like meetings",
                ],
              },
              {
                title: "Communication Boundaries",
                items: [
                  "Set clear response time expectations",
                  "Communicate boundaries to your team",
                  "Establish do-not-disturb protocols",
                  "Say no to misaligned requests",
                ],
              },
            ]}
          />
        )}

        {activeTab === "renewal" && (
          <PillarContent
            title="Pillar 2: Renewal"
            subtitle="You cannot withdraw energy indefinitely without depositing back."
            sections={[
              {
                title: "Physical Renewal",
                items: [
                  "Get 7-8 hours of sleep regularly",
                  "Move your body 3-5 times per week",
                  "Eat in a way that sustains energy",
                  "Take regular breaks during the workday",
                ],
              },
              {
                title: "Mental Renewal",
                items: [
                  "Engage in activities that use different mental muscles",
                  "Have creative outlets outside work",
                  "Practice continuous learning for growth, not obligation",
                  "Protect time for deep thinking and reflection",
                ],
              },
              {
                title: "Emotional Renewal",
                items: [
                  "Have regular meaningful conversations",
                  "Practice self-compassion when you fall short",
                  "Process emotions instead of suppressing them",
                  "Find meaning beyond work",
                ],
              },
            ]}
          />
        )}

        {activeTab === "resilience" && (
          <PillarContent
            title="Pillar 3: Resilience Practices"
            subtitle="Resilience is the capacity to recover quickly from difficulties."
            sections={[
              {
                title: "Daily Practices",
                items: [
                  "Start day with intention, not reactive mode",
                  "Have a grounding practice for when stressed",
                  "Practice gratitude regularly",
                  "Reflect on what is going well",
                  "Connect with your why regularly",
                ],
              },
              {
                title: "In-the-Moment Resets",
                items: [
                  "Know your early warning signs of stress",
                  "Have a 60-second reset practice",
                  "Name emotions without being overwhelmed",
                  "Have strategies for re-regulating after activation",
                ],
              },
            ]}
          />
        )}

        {activeTab === "support" && (
          <PillarContent
            title="Pillar 4: Support Systems"
            subtitle="No leader sustains alone. We need support."
            sections={[
              {
                title: "Professional Support",
                items: [
                  "Have a mentor or trusted advisor",
                  "Have a peer support group or network",
                  "Have a coach or therapist (or know how to access one)",
                  "Delegate effectively and ask for help",
                  "Build team capability, not dependency",
                ],
              },
              {
                title: "Personal Support",
                items: [
                  "Have close relationships where you can be vulnerable",
                  "Maintain friendships outside work",
                  "Have people who will tell you the truth",
                  "Stay connected to community or causes you care about",
                ],
              },
            ]}
          />
        )}
      </div>
    </div>
  );
}

function PillarContent({
  title,
  subtitle,
  sections,
}: {
  title: string;
  subtitle: string;
  sections: { title: string; items: string[] }[];
}) {
  return (
    <div>
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-[var(--heading)] mb-2">{title}</h3>
        <p className="text-lg text-[var(--foreground)] italic">{subtitle}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <div
            key={section.title}
            className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm"
          >
            <h4 className="font-bold text-lg text-[var(--heading)] mb-4">
              {section.title}
            </h4>
            <ul className="space-y-3">
              {section.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 mt-0.5 rounded border-2 border-[var(--accent)] flex-shrink-0" />
                  <span className="text-[var(--foreground)] text-sm leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
