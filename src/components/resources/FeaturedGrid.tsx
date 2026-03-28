/**
 * FeaturedGrid - Featured resources section with 70/30 layout
 *
 * Left: Large featured card (70%)
 * Right: Stacked supporting cards (30%)
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { Resource } from "@/types/resources";
import ResourcePreviewModal from "./ResourcePreviewModal";

interface FeaturedGridProps {
  featured?: Resource;
  supporting?: Resource[];
}

export default function FeaturedGrid({
  featured,
  supporting = [],
}: FeaturedGridProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null,
  );

  const handleOpenModal = (resource: Resource) => {
    setSelectedResource(resource);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedResource(null);
  };

  if (!featured) {
    return null;
  }

  return (
    <>
      <section className="py-12" style={{ backgroundColor: "var(--surface)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="font-[family-name:var(--font-poppins)] font-bold text-2xl md:text-3xl mb-8"
            style={{ color: "var(--heading)" }}
          >
            Featured Resources
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Large Featured Card (70%) */}
            <div className="md:col-span-2">
              <FeaturedCard
                resource={featured}
                large
                onPreview={() => handleOpenModal(featured)}
              />
            </div>

            {/* Stacked Supporting Cards (30%) */}
            <div className="space-y-4">
              {supporting.slice(0, 3).map((resource) => (
                <FeaturedCard
                  key={resource.id}
                  resource={resource}
                  large={false}
                  onPreview={() => handleOpenModal(resource)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Resource Preview Modal */}
      {selectedResource && (
        <ResourcePreviewModal
          resource={selectedResource}
          isOpen={modalOpen}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}

interface FeaturedCardProps {
  resource: Resource;
  large: boolean;
  onPreview: () => void;
}

function FeaturedCard({ resource, large, onPreview }: FeaturedCardProps) {
  if (large) {
    return (
      <div
        className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
        style={{ backgroundColor: "var(--surface)" }}
        onClick={onPreview}
      >
        <div className="p-8">
          {/* Category Badge */}
          <div className="mb-4">
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white uppercase tracking-wide"
              style={{
                background:
                  "linear-gradient(135deg, var(--heading), var(--accent))",
              }}
            >
              {resource.type}
            </span>
          </div>

          {/* Title */}
          <h3
            className="font-[family-name:var(--font-poppins)] font-bold text-xl md:text-2xl mb-4"
            style={{ color: "var(--heading)" }}
          >
            {resource.title}
          </h3>

          {/* Description */}
          <p
            className="text-base leading-relaxed mb-6 line-clamp-2"
            style={{ color: "var(--foreground)" }}
          >
            {resource.description}
          </p>

          {/* CTA Button */}
          <button
            className="inline-flex items-center px-6 py-3 rounded-lg font-[family-name:var(--font-poppins)] font-semibold text-white transition-all duration-200 hover:opacity-90 hover:scale-105 transform"
            style={{ backgroundColor: "var(--accent)" }}
          >
            View Resource
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border border-transparent hover:border-[var(--accent)]"
      style={{ backgroundColor: "var(--surface)" }}
      onClick={onPreview}
    >
      {/* Title */}
      <h3
        className="font-[family-name:var(--font-poppins)] font-semibold text-base mb-2 line-clamp-2"
        style={{ color: "var(--heading)" }}
      >
        {resource.title}
      </h3>

      {/* Type Badge */}
      <span
        className="inline-block px-2 py-1 rounded text-xs font-medium text-white"
        style={{ backgroundColor: "var(--accent)" }}
      >
        {resource.type}
      </span>
    </div>
  );
}
