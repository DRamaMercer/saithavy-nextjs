"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let mounted = true;
    const handleScroll = () => {
      if (mounted) {
        setScrolled(window.scrollY > 50);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      mounted = false;
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close mobile menu on route change
  // This is a valid pattern for syncing UI state with route changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
    { href: "/resources", label: "Resources" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 border-b transition-all duration-300 ${
        scrolled
          ? "bg-[var(--surface)]/95 backdrop-blur-md border-[var(--border)] shadow-sm"
          : "bg-[var(--surface)]/80 backdrop-blur-sm border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="font-[family-name:var(--font-poppins)] font-bold text-xl"
            style={{ color: "var(--heading)" }}
          >
            Saithavy
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors duration-200 text-sm font-medium ${
                  pathname === link.href ? "font-semibold" : "hover:opacity-80"
                }`}
                style={{
                  color:
                    pathname === link.href
                      ? "var(--heading)"
                      : "var(--foreground)",
                }}
              >
                {link.label}
              </Link>
            ))}

            <ThemeToggle />
          </div>

          {/* Mobile Menu Button + Theme Toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: "var(--foreground)" }}
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className="md:hidden pb-4 border-t"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="pt-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-2 rounded-lg transition-colors duration-200"
                  style={{
                    color:
                      pathname === link.href
                        ? "var(--heading)"
                        : "var(--foreground)",
                    fontWeight: pathname === link.href ? 600 : 400,
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
