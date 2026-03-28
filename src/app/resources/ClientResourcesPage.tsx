/**
 * ClientResourcesPage - Client-side resources page with hooks and interactivity
 *
 * Manages filter state, API calls, and renders all resource hub components
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import HeroHeader from "@/components/resources/HeroHeader";
import FeaturedGrid from "@/components/resources/FeaturedGrid";
import PillarCardsRow from "@/components/resources/PillarCardsRow";
import FiltersBar from "@/components/resources/FiltersBar";
import ResourceCardGrid from "@/components/resources/ResourceCardGrid";
import ScrollToTop from "@/components/ScrollToTop";
import { useResourceFilters } from "@/hooks/useResourceFilters";
import { getResources, ResourceQueryParams } from "@/services/resourceService";
import { ResourceCategory, Resource } from "@/types/resources";
import { clientLogger } from "@/lib/client-logger";

interface ClientResourcesPageProps {
  initialCategories: ResourceCategory[];
  initialFeatured: Resource;
  initialSupporting: Resource[];
  initialTotal: number;
}

export default function ClientResourcesPage({
  initialCategories,
  initialFeatured,
  initialSupporting,
  initialTotal,
}: ClientResourcesPageProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] =
    useState<ResourceCategory[]>(initialCategories);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(initialTotal);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  const { filters, debouncedQuery, updateFilter, resetFilters } =
    useResourceFilters();

  /**
   * Fetch resources based on current filters
   */
  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      const params: ResourceQueryParams = {
        category: filters.category,
        page: filters.page,
        limit: 12,
        type: filters.type,
        sort: filters.sort,
        q: debouncedQuery,
        tags: filters.tags,
      };

      const response = await getResources(params);
      setResources(response.resources);
      setTotalCount(response.totalCount);
      setCategories(response.categories);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);

      // Extract all unique tags from resources
      const allTags = new Set<string>();
      response.resources.forEach((resource) => {
        if (resource.keywords) {
          resource.keywords.forEach((tag) => allTags.add(tag));
        }
      });
      setAvailableTags(Array.from(allTags).sort());
    } catch (_error) {
      clientLogger.error(
        "Failed to fetch resources",
        { component: "ClientResourcesPage", filters },
      );
    } finally {
      setLoading(false);
    }
  }, [filters, debouncedQuery]);

  /**
   * Refetch resources when filters change
   */
  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  /**
   * Get available resource types for filter chips
   */
  const availableTypes = Array.from(
    new Set(resources.flatMap((r) => r.type)),
  ).sort();

  return (
    <>
      {/* Hero Header */}
      <HeroHeader
        title="Resource Hub"
        subtitle="Guides, templates, and tools for personal and professional growth"
        totalCount={totalCount}
      />

      {/* Featured Section */}
      <FeaturedGrid featured={initialFeatured} supporting={initialSupporting} />

      {/* Pillar/Category Cards */}
      <PillarCardsRow categories={categories} />

      {/* Filters Bar */}
      <FiltersBar
        filters={filters}
        onFilterChange={updateFilter}
        onReset={resetFilters}
        availableTypes={availableTypes}
        availableTags={availableTags}
      />

      {/* Resource Grid */}
      <section className="py-12" style={{ backgroundColor: "var(--surface)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ResourceCardGrid
            resources={resources}
            loading={loading}
            totalCount={totalCount}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => updateFilter("page", page.toString())}
          />
        </div>
      </section>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </>
  );
}
