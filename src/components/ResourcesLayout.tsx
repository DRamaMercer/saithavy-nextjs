import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";
import { categories } from "@/lib/resourcesData";
import { Resource } from "@/types/resources";
import CategoryFilter from "@/components/CategoryFilter";
import ResourceCard from "@/components/ResourceCard";

type Props = {
  selectedCategory: string;
  filteredResources: Resource[];
  featuredResources: Resource[];
  resourceCounts: Record<string, number>;
  totalDownloads: number;
  totalResources: number;
};

export default function ResourcesLayout({
  selectedCategory,
  filteredResources,
  featuredResources,
  resourceCounts,
  totalDownloads,
  totalResources,
}: Props) {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <header className="mb-12 text-center">
          <h1
            className="font-[family-name:var(--font-poppins)] font-bold text-4xl md:text-5xl mb-6"
            style={{ color: "var(--heading)" }}
          >
            Resource <span className="text-gradient">Hub</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8" style={{ color: "var(--foreground)" }}>
            Free, actionable tools and templates I&apos;ve built over a decade of leading remote teams and scaling businesses.
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: "var(--accent)" }}>
                {totalResources}+
              </div>
              <div className="text-sm" style={{ color: "var(--foreground)" }}>
                Resources
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: "var(--accent)" }}>
                {(totalDownloads / 1000).toFixed(0)}K+
              </div>
              <div className="text-sm" style={{ color: "var(--foreground)" }}>
                Downloads
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: "var(--accent)" }}>
                {categories.length - 1}
              </div>
              <div className="text-sm" style={{ color: "var(--foreground)" }}>
                Categories
              </div>
            </div>
          </div>
        </header>

        {/* Featured Resources Section - hide if category is selected, let's keep it clean */}
        {selectedCategory === "all" && (
          <section className="mb-16">
            <h2 className="font-[family-name:var(--font-poppins)] font-bold text-2xl mb-6 flex items-center gap-2" style={{ color: "var(--heading)" }}>
              <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
              Featured Resources
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredResources.slice(0, 3).map((resource) => (
                <ResourceCard key={`feat-${resource.id}`} resource={resource} />
              ))}
            </div>
          </section>
        )}

        {/* Category Filter */}
        <section className="mb-12">
          <CategoryFilter resourceCounts={resourceCounts} activeCategory={selectedCategory} />
        </section>

        {/* Resources Grid */}
        <section>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-12" style={{ color: "var(--foreground)" }}>
              <p className="text-lg mb-4">No resources found in this category.</p>
              <Link
                href="/resources"
                className="text-sm font-semibold underline"
                style={{ color: "var(--accent)" }}
              >
                View all resources
              </Link>
            </div>
          )}
        </section>

        {/* Premium Upgrade Teaser */}
        <div className="mt-20 p-10 rounded-3xl text-center relative overflow-hidden" style={{ backgroundColor: "var(--surface-alt)" }}>
          <div className="absolute inset-0 opacity-10" style={{ background: "radial-gradient(circle at center, var(--accent) 0%, transparent 70%)" }} />
          <h3 className="font-[family-name:var(--font-poppins)] font-bold text-2xl md:text-3xl mb-4 relative z-10" style={{ color: "var(--heading)" }}>
            Need custom implementation?
          </h3>
          <p className="max-w-xl mx-auto mb-8 relative z-10" style={{ color: "var(--foreground)" }}>
            If your organization needs hands-on help implementing asynchronous workflows or AI operations, let&apos;s talk.
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-white transition-all transform hover:scale-105 shadow-lg relative z-10"
            style={{ backgroundColor: "var(--accent)" }}
          >
            Book a Strategy Call
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}
