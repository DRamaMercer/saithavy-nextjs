/**
 * LeadMagnetSpotlight - Prominent featured lead magnet section
 *
 * Displays a category-specific lead magnet with gradient background and CTA
 */

import React from "react";
import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";

interface LeadMagnetSpotlightProps {
  categoryId: string;
  categoryName: string;
}

interface LeadMagnetConfig {
  slug: string;
  title: string;
  description: string;
  benefit: string;
  accentColor: string;
  gradientFrom: string;
  gradientTo: string;
}

// Lead magnet mapping configuration
const LEAD_MAGNET_MAPPING: Record<string, LeadMagnetConfig> = {
  "ai-automation": {
    slug: "ai-innovation",
    title: "AI Innovation Playbook",
    description:
      "Your complete 90-day roadmap to automating your business and scaling with AI",
    benefit: "automate your workflow",
    accentColor: "#8B5CF6",
    gradientFrom: "from-purple-600",
    gradientTo: "to-indigo-700",
  },
  "mindful-leadership": {
    slug: "mindful-leadership",
    title: "Mindful Leadership Guide",
    description:
      "Master presence, reduce burnout, and lead with clarity in 90 days",
    benefit: "transform your leadership",
    accentColor: "#06B6D4",
    gradientFrom: "from-cyan-600",
    gradientTo: "to-teal-700",
  },
  "personal-growth": {
    slug: "personal-transformation",
    title: "Personal Transformation Toolkit",
    description:
      "Build lasting habits, overcome limiting beliefs, and unlock your potential",
    benefit: "accelerate your growth",
    accentColor: "#F59E0B",
    gradientFrom: "from-amber-600",
    gradientTo: "to-orange-700",
  },
  "remote-work": {
    slug: "remote-work-mastery",
    title: "Remote Work Mastery Guide",
    description:
      "Stay productive, maintain work-life balance, and thrive in distributed teams",
    benefit: "master remote productivity",
    accentColor: "#10B981",
    gradientFrom: "from-emerald-600",
    gradientTo: "to-green-700",
  },
  "resilience-building": {
    slug: "resilience-toolkit",
    title: "Resilience Builder Toolkit",
    description:
      "Build mental toughness, navigate adversity, and emerge stronger",
    benefit: "build unshakeable resilience",
    accentColor: "#EC4899",
    gradientFrom: "from-pink-600",
    gradientTo: "to-rose-700",
  },
};

export default function LeadMagnetSpotlight({
  categoryId,
  categoryName: _categoryName,
}: LeadMagnetSpotlightProps) {
  const config = LEAD_MAGNET_MAPPING[categoryId];

  // Hide spotlight if no lead magnet exists for this category
  if (!config) {
    return null;
  }

  return (
    <section className="relative overflow-hidden">
      {/* Gradient Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${config.gradientFrom} ${config.gradientTo} opacity-100`}
      />

      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Content */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-12">
          {/* Featured Badge */}
          <div className="flex items-center justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold">
              <Star className="w-4 h-4 fill-current" />
              FEATURED RESOURCE
            </div>
          </div>

          {/* Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-4">
            Get the Free {config.title}
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-600 text-center mb-8 max-w-2xl mx-auto leading-relaxed">
            {config.description}
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              90-day roadmap
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              Actionable templates
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              Expert strategies
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <Link
              href={`/lead-magnets/${config.slug}`}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Get the Free Guide
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>

          {/* Trust Badge */}
          <p className="text-center text-sm text-gray-500 mt-6">
            No credit card required • Instant access • Expert-curated
          </p>
        </div>
      </div>
    </section>
  );
}
