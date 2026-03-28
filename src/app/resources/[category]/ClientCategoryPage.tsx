/**
 * ClientCategoryPage - Client-side category page with filters
 *
 * Manages filter state, API calls, and renders resources for a category
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import HeroHeader from '@/components/resources/HeroHeader';
import FiltersBar from '@/components/resources/FiltersBar';
import ResourceCardGrid from '@/components/resources/ResourceCardGrid';
import { useResourceFilters } from '@/hooks/useResourceFilters';
import { getResources, ResourceQueryParams } from '@/services/resourceService';
import { ResourceCategory, Resource } from '@/types/resources';

interface ClientCategoryPageProps {
  category: ResourceCategory;
  initialResources: Resource[];
  initialFeatured: Resource[];
  initialTotal: number;
}

export default function ClientCategoryPage({
  category,
  initialResources,
  initialFeatured,
  initialTotal,
}: ClientCategoryPageProps) {
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(initialTotal);

  // Override default category filter with current category
  const { filters, debouncedQuery, updateFilter, resetFilters } = useResourceFilters();

  /**
   * Fetch resources based on current filters
   */
  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      const params: ResourceQueryParams = {
        category: category.id, // Always use this category
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
    } catch (error) {
      console.error('Failed to fetch resources:', error);
    } finally {
      setLoading(false);
    }
  }, [category.id, filters, debouncedQuery]);

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
    new Set(resources.flatMap((r) => r.type))
  ).sort();

  return (
    <>
      {/* Back Navigation */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link
          href="/resources"
          className="inline-flex items-center gap-2 text-sm font-medium transition-colors duration-200 hover:opacity-70"
          style={{ color: 'var(--accent)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Resources
        </Link>
      </div>

      {/* Hero Header */}
      <HeroHeader
        title={category.name}
        subtitle={category.description}
        totalCount={totalCount}
      />

      {/* Filters Bar */}
      <FiltersBar
        filters={filters}
        onFilterChange={updateFilter}
        onReset={() => {
          resetFilters();
          // Reset to this category
          updateFilter('category', category.id);
        }}
        availableTypes={availableTypes}
      />

      {/* Resource Grid */}
      <section className="py-12" style={{ backgroundColor: 'var(--surface)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ResourceCardGrid
            resources={resources}
            loading={loading}
            totalCount={totalCount}
          />
        </div>
      </section>
    </>
  );
}
