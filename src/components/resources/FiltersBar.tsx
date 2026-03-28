/**
 * FiltersBar - Advanced filter toolbar with sticky behavior
 *
 * Search input, sort dropdown, type filter chips, tag selector
 * Sticky below navigation/header
 */

'use client';

import { useState } from 'react';
import { Search, X, ChevronDown, Filter } from 'lucide-react';

interface FiltersBarProps {
  filters: {
    category: string;
    type: string;
    sort: 'newest' | 'popular' | 'relevance';
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
  availableTypes = ['PDF', 'Template', 'Guide', 'Audio', 'Video', 'Checklist', 'Workbook', 'Assessment', 'Framework'],
  availableTags = [],
}: FiltersBarProps) {
  const [tagSelectorOpen, setTagSelectorOpen] = useState(false);

  const hasActiveFilters =
    filters.category !== 'all' ||
    filters.type !== 'all' ||
    filters.sort !== 'newest' ||
    filters.q !== '' ||
    filters.tags.length > 0;

  return (
    <div
      className="sticky top-16 z-40 border-b backdrop-blur-md transition-all duration-300"
      style={{
        backgroundColor: 'rgba(var(--surface-rgb), 0.95)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
              style={{ color: 'var(--foreground)' }}
            />
            <input
              type="text"
              placeholder="Search resources..."
              value={filters.q}
              onChange={(e) => onFilterChange('q', e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200"
              style={{
                backgroundColor: 'var(--surface-alt)',
                borderColor: 'var(--border)',
                color: 'var(--foreground)',
              }}
            />
            {filters.q && (
              <button
                onClick={() => onFilterChange('q', '')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="w-5 h-5 hover:opacity-70" style={{ color: 'var(--foreground)' }} />
              </button>
            )}
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap gap-3 items-center">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={filters.sort}
                onChange={(e) => onFilterChange('sort', e.target.value)}
                className="appearance-none pr-8 pl-4 py-2 rounded-lg border focus:outline-none focus:ring-2 cursor-pointer text-sm font-medium"
                style={{
                  backgroundColor: 'var(--surface-alt)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)',
                }}
              >
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="relevance">Relevance</option>
              </select>
              <ChevronDown
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: 'var(--foreground)' }}
              />
            </div>

            {/* Type Filter Chips */}
            <div className="flex gap-2">
              <FilterChip
                label="All"
                active={filters.type === 'all'}
                onClick={() => onFilterChange('type', 'all')}
              />
              {availableTypes.slice(0, 4).map((type) => (
                <FilterChip
                  key={type}
                  label={type}
                  active={filters.type === type}
                  onClick={() => onFilterChange('type', type)}
                />
              ))}
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={onReset}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-[var(--surface-alt)]"
                style={{ color: 'var(--accent)' }}
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
                style={{ backgroundColor: 'var(--accent)' }}
                onClick={() => {
                  const newTags = filters.tags.filter((t) => t !== tag);
                  onFilterChange('tags', newTags);
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
        active
          ? 'text-white shadow-md'
          : 'hover:bg-[var(--surface-alt)]'
      }`}
      style={{
        backgroundColor: active ? 'var(--accent)' : 'var(--surface)',
        color: active ? 'white' : 'var(--foreground)',
      }}
    >
      {label}
    </button>
  );
}
