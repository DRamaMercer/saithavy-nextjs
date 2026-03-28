"use client";

import { useState, memo, useCallback, useMemo } from "react";
import Link from "next/link";
import { Clock, Target, Download, CheckCircle2, Lock, Tag } from "lucide-react";
import { Resource } from "@/types/resources";
import DownloadModal from "./DownloadModal";

interface ResourceCardProps {
  resource: Resource;
}

// Memoize the component to prevent unnecessary re-renders
function ResourceCard({ resource }: ResourceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Use useCallback to stabilize the handler function
  const handleDownload = useCallback((e: React.MouseEvent) => {
    if (resource.isPremium) {
      e.preventDefault();
      setShowModal(true);
    }
  }, [resource.isPremium]);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  // Memoize the gradient calculation
  const categoryGradient = useMemo(() => {
    const gradients: Record<string, string> = {
      "mindful-leadership": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      "ai-automation": "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      "personal-growth": "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      "remote-work": "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      "overcoming-adversity":
        "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    };
    return (
      gradients[resource.category] ||
      "linear-gradient(135deg, var(--accent) 0%, var(--highlight) 100%)"
    );
  }, [resource.category]);

  // Memoize formatted values
  const formattedDownloads = useMemo(
    () => (resource.downloads / 1000).toFixed(0),
    [resource.downloads]
  );

  const displayKeywords = useMemo(
    () => resource.keywords?.slice(0, 3) || [],
    [resource.keywords]
  );

  const remainingKeywordsCount = useMemo(
    () => (resource.keywords?.length || 0) > 3 ? (resource.keywords?.length || 0) - 3 : 0,
    [resource.keywords]
  );

  return (
    <>
      <div
        className="flex flex-col relative group rounded-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 shadow-sm hover:shadow-xl focus-within:ring-2 focus-within:ring-amber-500"
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid",
          borderImage: isExpanded
            ? "linear-gradient(135deg, var(--accent), var(--highlight)) 1"
            : "linear-gradient(135deg, rgba(192, 86, 33, 0.3), rgba(104, 211, 145, 0.3)) 1",
        }}
        role="article"
        aria-label={`Resource: ${resource.title}`}
      >
        {/* Thumbnail/Header Area with Gradient */}
        <div
          className="h-32 w-full relative overflow-hidden"
          style={{ background: categoryGradient }}
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-linear-to-br from-black/10 to-black/20" />

          {/* Category/Premium Badge */}
          <div className="absolute top-4 right-4 flex gap-2">
            {resource.isPremium && (
              <span className="text-xs font-semibold px-2 py-1 rounded-full text-white bg-amber-500/90 backdrop-blur-sm shadow-sm flex items-center gap-1">
                <Lock className="w-3 h-3" aria-hidden="true" /> Premium
              </span>
            )}
            <span className="text-xs font-semibold px-2 py-1 rounded-full text-white bg-white/20 backdrop-blur-sm border border-white/30">
              {resource.type}
            </span>
          </div>

          {/* Icon overlay */}
          {resource.icon && (
            <div className="absolute bottom-4 left-4 w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <resource.icon className="w-8 h-8 text-white" aria-hidden="true" />
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-6 flex-1 flex flex-col">
          <h3
            className="font-poppins font-bold text-lg mb-2"
            style={{ color: "var(--heading)" }}
            id={`resource-title-${resource.id}`}
          >
            {resource.title}
          </h3>

          <p
            className="text-sm mb-4 line-clamp-2"
            style={{ color: "var(--foreground)" }}
            id={`resource-desc-${resource.id}`}
          >
            {resource.description}
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-3 mb-4 text-xs" role="list" aria-label="Resource stats">
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-lg"
              style={{
                backgroundColor: "var(--surface-alt)",
                color: "var(--foreground)",
              }}
              role="listitem"
            >
              <Clock className="w-3 h-3" aria-hidden="true" />
              <span>{resource.timeToRead}</span>
            </div>
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-lg"
              style={{
                backgroundColor: "var(--surface-alt)",
                color: "var(--foreground)",
              }}
              role="listitem"
            >
              <Target className="w-3 h-3" aria-hidden="true" />
              <span>{resource.difficulty}</span>
            </div>
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-lg"
              style={{
                backgroundColor: "var(--surface-alt)",
                color: "var(--foreground)",
              }}
              role="listitem"
            >
              <Download className="w-3 h-3" aria-hidden="true" />
              <span>{formattedDownloads}K</span>
            </div>
          </div>

          {/* Tags Section */}
          {displayKeywords.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2" role="list" aria-label="Keywords">
              {displayKeywords.map((keyword, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium transition-all hover:scale-105"
                  style={{
                    backgroundColor: "var(--surface-alt)",
                    color: "var(--accent)",
                    border: "1px solid rgba(192, 86, 33, 0.2)",
                  }}
                  role="listitem"
                >
                  <Tag className="w-3 h-3" aria-hidden="true" />
                  {keyword}
                </span>
              ))}
              {remainingKeywordsCount > 0 && (
                <span
                  className="text-xs px-2 py-1 rounded-full font-medium"
                  style={{
                    backgroundColor: "var(--surface-alt)",
                    color: "var(--foreground)",
                  }}
                  aria-label={`+${remainingKeywordsCount} more keywords`}
                >
                  +{remainingKeywordsCount}
                </span>
              )}
            </div>
          )}

          {/* Expandable Details */}
          {isExpanded && (
            <div
              className="mb-4 p-4 rounded-xl animate-in fade-in slide-in-from-top-2 duration-200"
              style={{ backgroundColor: "var(--surface-alt)" }}
              role="region"
              aria-labelledby={`resource-details-${resource.id}`}
            >
              <div className="mb-3">
                <h4
                  className="text-xs font-semibold mb-2"
                  style={{ color: "var(--heading)" }}
                  id={`resource-details-${resource.id}`}
                >
                  Target Audience:
                </h4>
                <p className="text-xs" style={{ color: "var(--foreground)" }}>
                  {resource.targetAudience}
                </p>
              </div>
              <div>
                <h4
                  className="text-xs font-semibold mb-2"
                  style={{ color: "var(--heading)" }}
                >
                  You&apos;ll Learn:
                </h4>
                <ul className="text-xs space-y-1" role="list">
                  {resource.whatYoullLearn?.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2"
                      style={{ color: "var(--foreground)" }}
                      role="listitem"
                    >
                      <CheckCircle2
                        className="w-3 h-3 mt-0.5 shrink-0"
                        style={{ color: "var(--accent)" }}
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div
            className="mt-auto pt-4 border-t flex items-center justify-between"
            style={{ borderColor: "rgba(226, 232, 240, 0.6)" }}
          >
            {resource.fileSize && (
              <span
                className="text-xs font-medium"
                style={{ color: "var(--foreground)" }}
                aria-label={`File size: ${resource.fileSize}`}
              >
                {resource.fileSize}
              </span>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={toggleExpanded}
                className="text-xs font-semibold transition-colors hover:text-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded px-2 py-1"
                style={{ color: "var(--heading)" }}
                aria-expanded={isExpanded}
                aria-controls={`resource-details-${resource.id}`}
              >
                {isExpanded ? "Less" : "More"}
              </button>

              {resource.isPremium ? (
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center text-sm font-semibold transition-colors hover:text-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded p-2"
                  style={{ color: "var(--heading)" }}
                  aria-label={`Unlock premium resource: ${resource.title}`}
                >
                  <Download className="w-4 h-4" />
                </button>
              ) : (
                <Link
                  href={`/resources/${resource.category}/${resource.slug}`}
                  className="inline-flex items-center text-sm font-semibold transition-colors hover:text-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded p-2"
                  style={{ color: "var(--heading)" }}
                  aria-label={`Download ${resource.title}`}
                >
                  <Download className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <DownloadModal
          resource={resource}
          onClose={closeModal}
        />
      )}
    </>
  );
}

// Export memoized component with custom comparison
export default memo(ResourceCard, (prevProps, nextProps) => {
  // Custom comparison function for better performance
  return (
    prevProps.resource.id === nextProps.resource.id &&
    prevProps.resource.title === nextProps.resource.title &&
    prevProps.resource.isPremium === nextProps.resource.isPremium &&
    prevProps.resource.downloads === nextProps.resource.downloads
  );
});
