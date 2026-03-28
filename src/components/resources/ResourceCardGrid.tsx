/**
 * ResourceCardGrid - Responsive grid of resource cards
 *
 * 3 columns (desktop), 2 (tablet), 1 (mobile)
 * With loading skeletons and empty states
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bookmark, Download, Clock, Target } from 'lucide-react';
import { useResourceSave } from '@/hooks/useResourceSave';
import { Resource } from '@/types/resources';

interface ResourceCardGridProps {
  resources: Resource[];
  loading?: boolean;
  totalCount?: number;
}

export default function ResourceCardGrid({
  resources,
  loading = false,
  totalCount = 0,
}: ResourceCardGridProps) {
  const { isSaved, toggleSave } = useResourceSave();
  const [savedStates, setSavedStates] = useState<Record<string, boolean>>({});

  // Initialize saved states
  useEffect(() => {
    const states: Record<string, boolean> = {};
    resources.forEach((resource) => {
      states[resource.slug] = isSaved(resource.slug);
    });
    setSavedStates(states);
  }, [resources, isSaved]);

  const handleSaveToggle = async (
    e: React.MouseEvent,
    resourceSlug: string
  ) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const newState = await toggleSave(resourceSlug);
      setSavedStates((prev) => ({
        ...prev,
        [resourceSlug]: newState,
      }));
    } catch (error) {
      console.error('Failed to save resource:', error);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl p-6 animate-pulse"
            style={{ backgroundColor: 'var(--surface-alt)' }}
          >
            <div className="h-4 rounded mb-4" style={{ backgroundColor: 'var(--border)' }} />
            <div className="h-6 rounded mb-2 w-3/4" style={{ backgroundColor: 'var(--border)' }} />
            <div className="h-4 rounded mb-4 w-1/2" style={{ backgroundColor: 'var(--border)' }} />
            <div className="space-y-2">
              <div className="h-3 rounded" style={{ backgroundColor: 'var(--border)' }} />
              <div className="h-3 rounded" style={{ backgroundColor: 'var(--border)' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (resources.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="font-[family-name:var(--font-poppins)] font-bold text-xl mb-2" style={{ color: 'var(--heading)' }}>
          No resources found
        </h3>
        <p className="mb-6" style={{ color: 'var(--foreground)' }}>
          Try adjusting your filters or search terms
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            isSaved={savedStates[resource.slug] || false}
            onSaveToggle={handleSaveToggle}
          />
        ))}
      </div>

      {/* Results Count */}
      {totalCount > 0 && (
        <div className="mt-8 text-center" style={{ color: 'var(--foreground)' }}>
          Showing {resources.length} of {totalCount} resources
        </div>
      )}
    </>
  );
}

interface ResourceCardProps {
  resource: any;
  isSaved: boolean;
  onSaveToggle: (e: React.MouseEvent, slug: string) => void;
}

function ResourceCard({ resource, isSaved, onSaveToggle }: ResourceCardProps) {
  return (
    <Link
      href={`/resources/${resource.category}/${resource.slug}`}
      className="group block rounded-xl overflow-hidden border-2 border-transparent hover:border-[var(--accent)] transition-all duration-300 hover:shadow-lg"
      style={{ backgroundColor: 'var(--surface)' }}
    >
      <div className="p-6">
        {/* Header: Type Badge + Save Button */}
        <div className="flex items-start justify-between mb-4">
          <span
            className="inline-block px-2 py-1 rounded text-xs font-semibold text-white"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            {resource.type}
          </span>

          <button
            onClick={(e) => onSaveToggle(e, resource.slug)}
            className="p-1.5 rounded-lg transition-colors duration-200 hover:bg-[var(--surface-alt)]"
            aria-label={isSaved ? 'Remove from saved' : 'Save resource'}
          >
            <Bookmark
              className={`w-5 h-5 transition-colors duration-200 ${
                isSaved ? 'fill-[var(--accent)]' : ''
              }`}
              style={{ color: isSaved ? 'var(--accent)' : 'var(--foreground)' }}
            />
          </button>
        </div>

        {/* Title */}
        <h3 className="font-[family-name:var(--font-poppins)] font-bold text-lg mb-3 line-clamp-2 group-hover:text-[var(--accent)] transition-colors duration-200" style={{ color: 'var(--heading)' }}>
          {resource.title}
        </h3>

        {/* Description */}
        <p
          className="text-sm leading-relaxed mb-4 line-clamp-2"
          style={{ color: 'var(--foreground)' }}
        >
          {resource.description}
        </p>

        {/* Metadata */}
        <div className="flex flex-wrap gap-3 text-xs" style={{ color: 'var(--foreground)' }}>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{resource.timeToRead}</span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="w-3.5 h-3.5" />
            <span>{resource.difficulty}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
