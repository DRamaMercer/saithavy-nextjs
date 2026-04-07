/**
 * LeadMagnetHero Component
 * Reusable hero section for lead magnet landing pages
 */

"use client";

import {
  Star,
  ArrowRight,
  Sparkles,
  Heart,
  Shield,
  Sunrise,
  Users,
  Target,
  Zap,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Home,
  Globe,
  Calendar,
  TrendingUp,
  Bot,
  Brain,
} from "lucide-react";
import Link from "next/link";

// Icon map for dynamic icon resolution (only imports used icons)
const iconMap: Record<string, React.ElementType> = {
  Star,
  Sparkles,
  Heart,
  Shield,
  Sunrise,
  Users,
  Target,
  Zap,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Home,
  Globe,
  Calendar,
  TrendingUp,
  Bot,
  Brain,
  ArrowRight,
};

interface LeadMagnetHeroProps {
  badge: {
    iconName: string;
    text: string;
  };
  title: string;
  subtitle: string;
  description: string;
  primaryButtonText: string;
  primaryButtonAction?: () => void;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  stats?: {
    leaders: number;
    rating: number;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export default function LeadMagnetHero({
  badge,
  title,
  subtitle,
  description,
  primaryButtonText,
  primaryButtonAction,
  primaryButtonHref,
  secondaryButtonText,
  stats = { leaders: 15000, rating: 4.9 },
  colors,
}: LeadMagnetHeroProps) {
  // Get the icon component from map, or fallback to Star
  const BadgeIcon = iconMap[badge.iconName] || Star;

  return (
    <header className="relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
            style={{
              backgroundColor: `${colors.accent}20`,
              color: colors.secondary,
            }}
          >
            <BadgeIcon className="w-4 h-4" />
            <span>{badge.text}</span>
          </div>

          {/* Title */}
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            style={{ color: colors.secondary }}
          >
            {title}
            <span className="block mt-2" style={{ color: colors.primary }}>
              {subtitle}
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            {description}
          </p>

          {/* Social Proof */}
          {stats && (
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-slate-600 dark:text-slate-400 mb-10">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800"
                      style={{
                        background: `linear-gradient(to bottom right, ${colors.primary}, ${colors.secondary})`,
                      }}
                    ></div>
                  ))}
                </div>
                <span>
                  {stats.leaders.toLocaleString()}+ Leaders Transformed
                </span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
                <span className="ml-1">{stats.rating}/5 Rating</span>
              </div>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {primaryButtonHref ? (
              <a
                href={primaryButtonHref}
                className="inline-flex items-center gap-2 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
                style={{ backgroundColor: colors.primary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.9";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                }}
              >
                {primaryButtonText}
                <ArrowRight className="w-5 h-5" />
              </a>
            ) : (
              <button
                onClick={primaryButtonAction}
                className="inline-flex items-center gap-2 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
                style={{ backgroundColor: colors.primary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.9";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                }}
              >
                {primaryButtonText}
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
            {secondaryButtonText && (
              <a
                href="#download-form"
                className="inline-flex items-center gap-2 bg-transparent border-2 hover:opacity-80 px-8 py-4 rounded-lg font-semibold text-lg transition-all"
                style={{
                  color: colors.primary,
                  borderColor: colors.primary,
                }}
              >
                {secondaryButtonText}
              </a>
            )}
          </div>

          {/* Back Link */}
          <div className="mt-6">
            <Link
              href="/resources"
              className="font-medium transition-colors hover:opacity-80"
              style={{ color: colors.secondary }}
            >
              Or browse the Resource Library →
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
