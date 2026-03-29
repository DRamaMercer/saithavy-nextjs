"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/**
 * ScrollToTop Component
 *
 * Features:
 * - Shows when scrolled past 500px
 * - Smooth scroll animation
 * - Brand accent color styling
 * - Accessibility compliant
 * - Responsive design
 */
export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when scrolled past 500px
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    setIsAnimating(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    // Reset animation state after scroll completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`
        fixed bottom-8 right-8 z-40
        flex items-center justify-center
        w-12 h-12 rounded-full
        shadow-lg
        transition-all duration-300 ease-in-out
        ${isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"}
        ${isAnimating ? "scale-90" : "scale-100 hover:scale-110"}
        focus:outline-none focus:ring-2 focus:ring-offset-2
      `}
      style={{
        backgroundColor: "var(--accent)",
        boxShadow: "0 4px 20px rgba(192, 86, 33, 0.3)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "var(--accent-hover)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "var(--accent)";
      }}
    >
      <ArrowUp
        className="w-5 h-5 transition-transform duration-300"
        style={{
          color: "white",
          transform: isAnimating ? "translateY(-4px)" : "translateY(0)",
        }}
      />

      {/* Focus ring for accessibility */}
      <style jsx>{`
        button:focus-visible {
          --tw-ring-color: var(--accent);
          --tw-ring-offset-color: var(--background);
        }
      `}</style>
    </button>
  );
}
