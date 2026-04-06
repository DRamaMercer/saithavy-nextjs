/**
 * useResourceFilters - Hook for managing resource filter state
 *
 * Handles search, filtering, sorting, pagination with URL sync
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";

export interface ResourceFilters {
  category: string;
  type: string;
  sort: "newest" | "popular" | "relevance";
  q: string;
  tags: string[];
  page: number;
}

const DEFAULT_FILTERS: ResourceFilters = {
  category: "all",
  type: "all",
  sort: "newest",
  q: "",
  tags: [],
  page: 1,
};

export function useResourceFilters(options?: { skipURLSync?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { skipURLSync = false } = options || {};

  // Initialize filters from URL (check both path params and query params)
  const [filters, setFilters] = useState<ResourceFilters>(() => {
    const sortValue = searchParams.get("sort");
    const validSortValues: ResourceFilters["sort"][] = ["newest", "popular", "relevance"];
    
    return {
      category: searchParams.get("category") || DEFAULT_FILTERS.category,
      type: searchParams.get("type") || DEFAULT_FILTERS.type,
      sort:
        (sortValue && validSortValues.includes(sortValue as ResourceFilters["sort"])
          ? sortValue as ResourceFilters["sort"]
          : DEFAULT_FILTERS.sort),
      q: searchParams.get("q") || DEFAULT_FILTERS.q,
      tags: searchParams.getAll("tags").length > 0 
        ? searchParams.getAll("tags") as string[] 
        : DEFAULT_FILTERS.tags,
      page: parseInt(searchParams.get("page") || "1", 10),
    };
  });

  // Update category from pathname after mount (client-side only)
  useEffect(() => {
    const categoryMatch = pathname.match(/\/resources\/([^/?]+)/);
    if (categoryMatch && categoryMatch[1] !== "category" && categoryMatch[1] !== "all") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Safe pattern: updating state based on route change
      setFilters((prev) => ({
        ...prev,
        category: categoryMatch[1],
      }));
    }
  }, [pathname]);

  // Debounced search query
  const debouncedQuery = useDebounce(filters.q, 300);

  /**
   * Update URL with current filters
   * Only updates on /resources page, not on /resources/[category] pages
   */
  const updateURL = useCallback(
    (newFilters: Partial<ResourceFilters>) => {
      // Skip URL sync if explicitly requested or if on a category page
      if (skipURLSync) {
        return;
      }

      // Check if we're on a category page
      if (pathname !== "/resources" && pathname.startsWith("/resources/")) {
        // On a category page - don't update URL
        return;
      }

      const params = new URLSearchParams();

      const updated = { ...filters, ...newFilters };

      if (updated.category && updated.category !== "all") {
        params.set("category", updated.category);
      }
      if (updated.type && updated.type !== "all") {
        params.set("type", updated.type);
      }
      if (updated.sort && updated.sort !== "newest") {
        params.set("sort", updated.sort);
      }
      if (updated.q) {
        params.set("q", updated.q);
      }
      if (updated.tags.length > 0) {
        updated.tags.forEach((tag) => params.append("tags", tag));
      }
      if (updated.page && updated.page > 1) {
        params.set("page", updated.page.toString());
      }

      const queryString = params.toString();
      const newPath = `/resources${queryString ? `?${queryString}` : ""}`;

      router.push(newPath, { scroll: false });
    },
    [filters, router, skipURLSync, pathname],
  );

  /**
   * Update a single filter
   */
  const updateFilter = useCallback((key: string, value: string | string[]) => {
    setFilters((prev) => {
      const updated = { ...prev, [key]: value };

      // Reset page when changing filters (except pagination)
      if (key !== "page") {
        updated.page = 1;
      }

      return updated;
    });
  }, []);

  /**
   * Update multiple filters at once
   */
  const updateFilters = useCallback((updates: Partial<ResourceFilters>) => {
    setFilters((prev) => {
      const updated = { ...prev, ...updates };

      // Reset page when changing filters (except pagination)
      if (!updates.page) {
        updated.page = 1;
      }

      return updated;
    });
  }, []);

  /**
   * Reset all filters to default
   */
  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    router.push("/resources", { scroll: false });
  }, [router]);

  /**
   * Toggle tag filter
   */
  const toggleTag = useCallback((tag: string) => {
    setFilters((prev) => {
      const tags = prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag];

      return { ...prev, tags, page: 1 };
    });
  }, []);

  // Sync URL when filters change
  useEffect(() => {
    updateURL(filters);
  }, [filters, updateURL]);

  return {
    filters,
    debouncedQuery,
    updateFilter,
    updateFilters,
    resetFilters,
    toggleTag,
  };
}
