/**
 * ResourcePreviewModal - Modal for previewing featured resources
 *
 * Shows resource details, download options, and full info
 * Reuses/enhances DownloadModal functionality
 */

"use client";

import { useEffect } from "react";
import { X, Download, BookOpen, Clock, Target, Award } from "lucide-react";
import Link from "next/link";
import { Resource } from "@/types/resources";

interface ResourcePreviewModalProps {
  resource: Resource;
  isOpen: boolean;
  onClose: () => void;
}

export default function ResourcePreviewModal({
  resource,
  isOpen,
  onClose,
}: ResourcePreviewModalProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal Content */}
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
        style={{ backgroundColor: "var(--surface)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg transition-colors duration-200 hover:bg-[var(--surface-alt)]"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" style={{ color: "var(--foreground)" }} />
        </button>

        {/* Content */}
        <div className="p-8">
          {/* Type Badge */}
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
          <h2
            className="font-[family-name:var(--font-poppins)] font-bold text-2xl md:text-3xl mb-4"
            style={{ color: "var(--heading)" }}
          >
            {resource.title}
          </h2>

          {/* Description */}
          <p
            className="text-lg leading-relaxed mb-6"
            style={{ color: "var(--foreground)" }}
          >
            {resource.description}
          </p>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" style={{ color: "var(--accent)" }} />
              <div>
                <p className="text-xs" style={{ color: "var(--foreground)" }}>
                  Time
                </p>
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--heading)" }}
                >
                  {resource.timeToRead}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Target className="w-5 h-5" style={{ color: "var(--accent)" }} />
              <div>
                <p className="text-xs" style={{ color: "var(--foreground)" }}>
                  Level
                </p>
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--heading)" }}
                >
                  {resource.difficulty}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Download
                className="w-5 h-5"
                style={{ color: "var(--accent)" }}
              />
              <div>
                <p className="text-xs" style={{ color: "var(--foreground)" }}>
                  Downloads
                </p>
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--heading)" }}
                >
                  {resource.downloads.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Award className="w-5 h-5" style={{ color: "var(--accent)" }} />
              <div>
                <p className="text-xs" style={{ color: "var(--foreground)" }}>
                  Audience
                </p>
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--heading)" }}
                >
                  {resource.targetAudience}
                </p>
              </div>
            </div>
          </div>

          {/* What You'll Learn */}
          {resource.whatYoullLearn && resource.whatYoullLearn.length > 0 && (
            <div className="mb-6">
              <h3
                className="font-[family-name:var(--font-poppins)] font-semibold text-lg mb-3"
                style={{ color: "var(--heading)" }}
              >
                What You&apos;ll Learn
              </h3>
              <ul className="space-y-2">
                {resource.whatYoullLearn?.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span style={{ color: "var(--accent)" }}>✓</span>
                    <span
                      className="text-sm"
                      style={{ color: "var(--foreground)" }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Keywords */}
          {resource.keywords && resource.keywords.length > 0 && (
            <div className="mb-6">
              <h3
                className="font-[family-name:var(--font-poppins)] font-semibold text-lg mb-3"
                style={{ color: "var(--heading)" }}
              >
                Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {resource.keywords?.map((keyword: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: "var(--surface-alt)",
                      color: "var(--foreground)",
                    }}
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-3 pt-6 border-t"
            style={{ borderColor: "var(--border)" }}
          >
            <Link
              href={`/resources/${resource.category}/${resource.slug}`}
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-[family-name:var(--font-poppins)] font-semibold text-white transition-all duration-200 hover:opacity-90 hover:scale-105 transform"
              style={{ backgroundColor: "var(--accent)" }}
            >
              <BookOpen className="w-5 h-5 mr-2" />
              View Full Resource
            </Link>

            <button
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-[family-name:var(--font-poppins)] font-semibold border-2 transition-all duration-200 hover:scale-105 transform"
              style={{
                borderColor: "var(--accent)",
                color: "var(--accent)",
              }}
            >
              <Download className="w-5 h-5 mr-2" />
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
