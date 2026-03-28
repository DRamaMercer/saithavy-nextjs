/**
 * PillarCardsRow - Category pillar cards for navigation
 *
 * Horizontal scrollable row of category cards
 * Clicking navigates to category page (NOT filter)
 */

"use client";

import Link from "next/link";
import { ArrowRight, Navigation } from "lucide-react";
import { ResourceCategory } from "@/types/resources";

interface PillarCardsRowProps {
  categories: ResourceCategory[];
}

export default function PillarCardsRow({ categories }: PillarCardsRowProps) {
  // Filter out 'all' category
  const pillarCategories = categories.filter((cat) => cat.id !== "all");

  return (
    <section className="py-12" style={{ backgroundColor: "var(--surface)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2
            className="font-[family-name:var(--font-poppins)] font-bold text-2xl md:text-3xl"
            style={{ color: "var(--heading)" }}
          >
            Browse by Category
          </h2>

          {/* Scroll Hint */}
          <div
            className="hidden md:flex items-center text-sm"
            style={{ color: "var(--foreground)" }}
          >
            <Navigation className="w-4 h-4 mr-1" />
            Scroll or click to explore
          </div>
        </div>

        {/* Scrollable Row */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
          {pillarCategories.map((category) => (
            <Link
              key={category.id}
              href={`/resources/${category.id}`}
              className="flex-shrink-0 w-56"
            >
              <div
                className="rounded-xl p-6 h-full transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer border-2 border-transparent hover:border-[var(--accent)]"
                style={{ backgroundColor: "var(--surface-alt)" }}
              >
                {/* Icon */}
                <div className="text-4xl mb-4">{category.icon}</div>

                {/* Name */}
                <h3
                  className="font-[family-name:var(--font-poppins)] font-bold text-lg mb-2"
                  style={{ color: "var(--heading)" }}
                >
                  {category.name}
                </h3>

                {/* Description */}
                <p
                  className="text-sm mb-4 line-clamp-2"
                  style={{ color: "var(--foreground)" }}
                >
                  {category.description}
                </p>

                {/* Count Badge */}
                <span
                  className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white"
                  style={{
                    background: `linear-gradient(135deg, ${category.gradient})`,
                  }}
                >
                  {category.resourceCount} Resources
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile Scroll Hint */}
        <div
          className="flex md:hidden items-center justify-center mt-4 text-sm"
          style={{ color: "var(--foreground)" }}
        >
          <ArrowRight className="w-4 h-4 mr-1" />
          Swipe to see more
        </div>
      </div>
    </section>
  );
}
