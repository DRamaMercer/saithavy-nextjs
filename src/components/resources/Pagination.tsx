/**
 * Pagination - Accessible pagination controls with page numbers
 *
 * Features:
 * - Previous/Next navigation
 * - Page number buttons with ellipsis for large page counts
 * - Responsive design (compact on mobile)
 * - Keyboard navigation support
 * - ARIA labels for accessibility
 */

"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalCount,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  // Calculate range of items being displayed
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage <= 3) {
        // Near start: 1 2 3 4 5 ... 10
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near end: 1 ... 6 7 8 9 10
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Middle: 1 ... 4 5 6 ... 10
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  return (
    <nav
      className="flex flex-col items-center gap-4"
      aria-label="Resource pagination"
    >
      {/* Page Info */}
      <div
        className="text-sm"
        style={{ color: "var(--foreground)" }}
        aria-live="polite"
        aria-atomic="true"
      >
        Showing {startItem}-{endItem} of {totalCount} resources
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
          style={{
            backgroundColor:
              currentPage === 1 ? "var(--surface-alt)" : "var(--surface)",
            color: currentPage === 1 ? "var(--muted)" : "var(--foreground)",
            border: "1px solid var(--border)",
          }}
          aria-label="Go to previous page"
          aria-disabled={currentPage === 1}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-3 py-2"
                  style={{ color: "var(--muted)" }}
                  aria-hidden="true"
                >
                  ...
                </span>
              );
            }

            const isActive = page === currentPage;
            return (
              <button
                key={page}
                onClick={() => handlePageClick(page as number)}
                className="w-10 h-10 rounded-lg font-medium transition-all duration-200 hover:shadow-md"
                style={{
                  backgroundColor: isActive
                    ? "var(--accent)"
                    : "var(--surface)",
                  color: isActive ? "#ffffff" : "var(--foreground)",
                  border: isActive ? "none" : "1px solid var(--border)",
                }}
                aria-label={`Go to page ${page}`}
                aria-current={isActive ? "page" : undefined}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
          style={{
            backgroundColor:
              currentPage === totalPages
                ? "var(--surface-alt)"
                : "var(--surface)",
            color:
              currentPage === totalPages ? "var(--muted)" : "var(--foreground)",
            border: "1px solid var(--border)",
          }}
          aria-label="Go to next page"
          aria-disabled={currentPage === totalPages}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Mobile-specific compact info */}
      <div className="text-xs sm:hidden" style={{ color: "var(--muted)" }}>
        Page {currentPage} of {totalPages}
      </div>
    </nav>
  );
}
