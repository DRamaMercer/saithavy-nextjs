/**
 * FiltersBar - Advanced filter toolbar with sticky behavior
 *
 * Search input, sort dropdown, type filter chips, tag selector
 * Sticky below navigation/header
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, ChevronDown, Filter } from "lucide-react";

interface FiltersBarProps {
  filters: {
    category: string;
    type: string;
    sort: "newest" | "popular" | "relevance";
    q: string;
    tags: string[];
  };
  onFilterChange: (key: string, value: string | string[]) => void;
  onReset: () => void;
  availableTypes?: string[];
  availableTags?: string[];
}

export default function FiltersBar({
  filters,
  onFilterChange,
  onReset,
  availableTypes = [
    "PDF",
    "Template",
    "Guide",
    "Audio",
    "Video",
    "Checklist",
    "Workbook",
    "Assessment",
    "Framework",
  ],
  availableTags = [],
}: FiltersBarProps) {
  const [tagSelectorOpen, setTagSelectorOpen] = useState(false);
  const tagSelectorRef = useRef<HTMLDivElement>(null);

  // Close tag selector when clicking outside
  useEffect(() => {
    let mounted = true;
    function handleClickOutside(event: MouseEvent) {
      if (
        mounted &&
        tagSelectorRef.current &&
        !tagSelectorRef.current.contains(event.target as Node)
      ) {
        setTagSelectorOpen(false);
      }
    }

    if (tagSelectorOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        mounted = false;
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [tagSelectorOpen]);

  const hasActiveFilters =
    filters.category !== "all" ||
    filters.type !== "all" ||
    filters.sort !== "newest" ||
    filters.q !== "" ||
    filters.tags.length > 0;

  return (
    <div
      className="sticky top-16 z-40 border-b backdrop-blur-md transition-all duration-300"
      style={{
        backgroundColor: "rgba(var(--surface-rgb), 0.95)",
        borderColor: "var(--border)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
              style={{ color: "var(--foreground)" }}
            />
            <input
              type="text"
              placeholder="Search resources..."
              value={filters.q}
              onChange={(e) => onFilterChange("q", e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200"
              style={{
                backgroundColor: "var(--surface-alt)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            />
            {filters.q && (
              <button
                onClick={() => onFilterChange("q", "")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X
                  className="w-5 h-5 hover:opacity-70"
                  style={{ color: "var(--foreground)" }}
                />
              </button>
            )}
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap gap-3 items-center">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={filters.sort}
                onChange={(e) => onFilterChange("sort", e.target.value)}
                className="appearance-none pr-8 pl-4 py-2 rounded-lg border focus:outline-none focus:ring-2 cursor-pointer text-sm font-medium"
                style={{
                  backgroundColor: "var(--surface-alt)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              >
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="relevance">Relevance</option>
              </select>
              <ChevronDown
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: "var(--foreground)" }}
              />
            </div>

            {/* Type Filter Chips */}
            <div className="flex gap-2">
              <FilterChip
                label="All"
                active={filters.type === "all"}
                onClick={() => onFilterChange("type", "all")}
              />
              {availableTypes.slice(0, 4).map((type) => (
                <FilterChip
                  key={type}
                  label={type}
                  active={filters.type === type}
                  onClick={() => onFilterChange("type", type)}
                />
              ))}
            </div>

            {/* Tag Selector */}
            {availableTags && availableTags.length > 0 && (
              <div className="relative" ref={tagSelectorRef}>
                <button
                  onClick={() => setTagSelectorOpen(!tagSelectorOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors duration-200 hover:bg-[var(--surface-alt)]"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                >
                  <Filter className="w-4 h-4" />
                  Tags
                  {filters.tags.length > 0 && (
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: "var(--accent)" }}
                    >
                      {filters.tags.length}
                    </span>
                  )}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${tagSelectorOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Tag Dropdown */}
                {tagSelectorOpen && (
                  <div
                    className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border z-50"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <div className="p-2 max-h-64 overflow-y-auto">
                      {availableTags.map((tag) => {
                        const isSelected = filters.tags.includes(tag);
                        return (
                          <button
                            key={tag}
                            onClick={() => {
                              const newTags = filters.tags.includes(tag)
                                ? filters.tags.filter((t) => t !== tag)
                                : [...filters.tags, tag];
                              onFilterChange("tags", newTags);
                            }}
                            className="w-full text-left px-3 py-2 rounded-md text-sm transition-colors hover:bg-[var(--surface-alt)] flex items-center justify-between"
                          >
                            <span style={{ color: "var(--foreground)" }}>
                              {tag}
                            </span>
                            {isSelected && (
                              <svg
                                className="w-4 h-4 text-[var(--accent)]"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {filters.tags.length > 0 && (
                      <div
                        className="px-2 pb-2 pt-1 border-t"
                        style={{ borderColor: "var(--border)" }}
                      >
                        <button
                          onClick={() => onFilterChange("tags", [])}
                          className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-[var(--accent)] hover:bg-[var(--surface-alt)]"
                        >
                          Clear all tags
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={onReset}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-[var(--surface-alt)]"
                style={{ color: "var(--accent)" }}
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Active Tags */}
        {filters.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {filters.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium text-white cursor-pointer hover:opacity-80 transition-opacity"
                style={{ backgroundColor: "var(--accent)" }}
                onClick={() => {
                  const newTags = filters.tags.filter((t) => t !== tag);
                  onFilterChange("tags", newTags);
                }}
              >
                {tag}
                <X className="w-3 h-3" />
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function FilterChip({ label, active, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
        active ? "text-white shadow-md" : "hover:bg-[var(--surface-alt)]"
      }`}
      style={{
        backgroundColor: active ? "var(--accent)" : "var(--surface)",
        color: active ? "white" : "var(--foreground)",
      }}
    >
      {label}
    </button>
  );
}
