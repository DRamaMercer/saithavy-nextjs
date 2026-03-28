import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";
import { categories } from "@/lib/resourcesData";
import { Resource } from "@/types/resources";
import { memo, useMemo } from "react";
import CategoryFilter from "@/components/CategoryFilter";
import ResourceCard from "@/components/ResourceCard";
import { ErrorBoundary } from "@/components/ErrorBoundary";

type Props = {
  selectedCategory: string;
  filteredResources: Resource[];
  featuredResources: Resource[];
  resourceCounts: Record<string, number>;
  totalDownloads: number;
  totalResources: number;
};

function ResourcesLayout({
  selectedCategory,
  filteredResources,
  featuredResources,
  resourceCounts,
  totalDownloads,
  totalResources,
}: Props) {
  // Memoize calculations to prevent re-computation on every render
  const formattedDownloads = useMemo(
    () => (totalDownloads / 1000).toFixed(0),
    [totalDownloads]
  );

  const categoryCount = useMemo(
    () => categories.length - 1,
    []
  );

  const displayFeaturedResources = useMemo(
    () => featuredResources.slice(0, 3),
    [featuredResources]
  );

  const showFeaturedSection = useMemo(
    () => selectedCategory === "all",
    [selectedCategory]
  );

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <header className="mb-12 text-center">
          <h1
            className="font-poppins font-bold text-4xl md:text-5xl mb-6"
            style={{ color: "var(--heading)" }}
          >
            Resource <span className="text-gradient">Hub</span>
          </h1>
          <p
            className="text-lg md:text-xl max-w-2xl mx-auto mb-8"
            style={{ color: "var(--foreground)" }}
          >
            Free, actionable tools and templates I&apos;ve built over a decade
            of leading remote teams and scaling businesses.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-8" role="list" aria-label="Resource statistics">
            <div className="text-center" role="listitem">
              <div
                className="text-3xl font-bold"
                style={{ color: "var(--accent)" }}
                aria-label={`${totalResources} resources`}
              >
                {totalResources}+
              </div>
              <div className="text-sm" style={{ color: "var(--foreground)" }}>
                Resources
              </div>
            </div>
            <div className="text-center" role="listitem">
              <div
                className="text-3xl font-bold"
                style={{ color: "var(--accent)" }}
                aria-label={`${formattedDownloads} downloads`}
              >
                {formattedDownloads}K+
              </div>
              <div className="text-sm" style={{ color: "var(--foreground)" }}>
                Downloads
              </div>
            </div>
            <div className="text-center" role="listitem">
              <div
                className="text-3xl font-bold"
                style={{ color: "var(--accent)" }}
                aria-label={`${categoryCount} categories`}
              >
                {categoryCount}
              </div>
              <div className="text-sm" style={{ color: "var(--foreground)" }}>
                Categories
              </div>
            </div>
          </div>
        </header>

        {/* Featured Resources Section - hide if category is selected, let's keep it clean */}
        {showFeaturedSection && (
          <section className="mb-16" aria-labelledby="featured-heading">
            <h2
              id="featured-heading"
              className="font-(family-name:--font-poppins) font-bold text-2xl mb-6 flex items-center gap-2"
              style={{ color: "var(--heading)" }}
            >
              <Star className="w-6 h-6 text-amber-500 fill-amber-500" aria-hidden="true" />
              Featured Resources
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayFeaturedResources.map((resource) => (
                <ErrorBoundary key={`feat-${resource.id}`}>
                  <ResourceCard resource={resource} />
                </ErrorBoundary>
              ))}
            </div>
          </section>
        )}

        {/* Category Filter */}
        <section className="mb-12" aria-label="Filter by category">
          <CategoryFilter
            resourceCounts={resourceCounts}
            activeCategory={selectedCategory}
          />
        </section>

        {/* Resources Grid */}
        <section aria-labelledby="resources-heading">
          <h2 id="resources-heading" className="sr-only">
            {selectedCategory === "all" ? "All Resources" : `${selectedCategory} Resources`}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <ErrorBoundary key={resource.id}>
                <ResourceCard resource={resource} />
              </ErrorBoundary>
            ))}
          </div>

          {filteredResources.length === 0 && (
            <div
              className="text-center py-12"
              style={{ color: "var(--foreground)" }}
              role="status"
              aria-live="polite"
            >
              <p className="text-lg mb-4">
                No resources found in this category.
              </p>
              <Link
                href="/resources"
                className="text-sm font-semibold underline focus:outline-none focus:ring-2 focus:ring-amber-500 rounded"
                style={{ color: "var(--accent)" }}
              >
                View all resources
              </Link>
            </div>
          )}
        </section>

        {/* Premium Upgrade Teaser */}
        <div
          className="mt-20 p-10 rounded-3xl text-center relative overflow-hidden"
          style={{ backgroundColor: "var(--surface-alt)" }}
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              background:
                "radial-gradient(circle at center, var(--accent) 0%, transparent 70%)",
            }}
            aria-hidden="true"
          />
          <h3
            className="font-(family-name:--font-poppins) font-bold text-2xl md:text-3xl mb-4 relative z-10"
            style={{ color: "var(--heading)" }}
          >
            Need custom implementation?
          </h3>
          <p
            className="max-w-xl mx-auto mb-8 relative z-10"
            style={{ color: "var(--foreground)" }}
          >
            If your organization needs hands-on help implementing asynchronous
            workflows or AI operations, let&apos;s talk.
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-white transition-all transform hover:scale-105 shadow-lg relative z-10 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            style={{ backgroundColor: "var(--accent)" }}
          >
            Book a Strategy Call
            <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// Memoize to prevent unnecessary re-renders
export default memo(ResourcesLayout, (prevProps, nextProps) => {
  return (
    prevProps.selectedCategory === nextProps.selectedCategory &&
    prevProps.filteredResources.length === nextProps.filteredResources.length &&
    prevProps.featuredResources.length === nextProps.featuredResources.length
  );
});
